import * as vscode from 'vscode';

let currentHighlightDecorations: vscode.TextEditorDecorationType[] = [];

export function activate(context: vscode.ExtensionContext) {
    console.log('ASP HTML Tag Matcher is now active! 🚀');
    
    // Decoration types for highlighting
    const openTagDecoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
        border: '2px solid yellow'
    });
    
    const closeTagDecoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        border: '2px solid green'
    });
    
    currentHighlightDecorations = [openTagDecoration, closeTagDecoration];

    // Document highlight provider - Ana özellik
    const highlightProvider = new ASPTagHighlightProvider();
    
    // Tüm text dosyaları için çalışacak şekilde genişletelim
    const aspSelector = [
        { scheme: 'file', language: 'asp' },
        { scheme: 'file', language: 'html' },
        { scheme: 'file', language: 'plaintext' },
        { scheme: 'file', pattern: '**/*.asp' },
        { scheme: 'file', pattern: '**/*.aspx' },
        { scheme: 'file', pattern: '**/*.ascx' }
    ];
    
    const highlightDisposable = vscode.languages.registerDocumentHighlightProvider(
        aspSelector,
        highlightProvider
    );
    
    // Manual selection change listener - bu daha güvenilir
    const selectionChangeListener = vscode.window.onDidChangeTextEditorSelection((event) => {
        const editor = event.textEditor;
        if (!editor || (!editor.document.fileName.endsWith('.asp') && 
                       !editor.document.fileName.endsWith('.aspx') && 
                       !editor.document.fileName.endsWith('.ascx'))) {
            return;
        }
        
        // Clear previous decorations
        editor.setDecorations(openTagDecoration, []);
        editor.setDecorations(closeTagDecoration, []);
        
        const position = editor.selection.active;
        console.log(`Selection changed to position: ${position.line}:${position.character}`);
        
        // Get tag info at cursor
        const line = editor.document.lineAt(position);
        const tagInfo = getTagAtPosition(line.text, position.character, line.lineNumber);
        
        if (tagInfo) {
            console.log(`Found tag at selection: ${tagInfo.tagName}`);
            const matchingRange = findMatchingTag(editor.document, tagInfo);
            
            if (matchingRange) {
                const currentRange = new vscode.Range(
                    new vscode.Position(tagInfo.lineNumber, tagInfo.start),
                    new vscode.Position(tagInfo.lineNumber, tagInfo.end)
                );
                
                if (tagInfo.isClosing) {
                    editor.setDecorations(closeTagDecoration, [currentRange]);
                    editor.setDecorations(openTagDecoration, [matchingRange]);
                } else {
                    editor.setDecorations(openTagDecoration, [currentRange]);
                    editor.setDecorations(closeTagDecoration, [matchingRange]);
                }
                
                console.log('Applied decorations successfully');
            }
        }
    });
    
    // Hover provider - Tag bilgisi gösterme
    const hoverProvider = new ASPTagHoverProvider();
    const hoverDisposable = vscode.languages.registerHoverProvider(
        aspSelector,
        hoverProvider
    );
    
    // Text document listener ekleyelim - dosya açıldığında bilgi verelim
    const documentListener = vscode.workspace.onDidOpenTextDocument((document) => {
        if (document.fileName.endsWith('.asp') || document.fileName.endsWith('.aspx') || document.fileName.endsWith('.ascx')) {
            console.log(`ASP file opened: ${document.fileName}, language: ${document.languageId}`);
            vscode.window.showInformationMessage(`ASP HTML Tag Matcher aktif! Dosya dili: ${document.languageId}`);
        }
    });
    
    // Active editor değiştiğinde de kontrol et
    const editorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && (editor.document.fileName.endsWith('.asp') || editor.document.fileName.endsWith('.aspx') || editor.document.fileName.endsWith('.ascx'))) {
            console.log(`ASP file active: ${editor.document.fileName}, language: ${editor.document.languageId}`);
        }
    });
      // Jump to matching tag command
    const jumpCommand = vscode.commands.registerCommand('aspTagMatcher.jumpToMatchingTag', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        
        // ASP dosyası olup olmadığını kontrol et
        const fileName = editor.document.fileName;
        if (!fileName.endsWith('.asp') && !fileName.endsWith('.aspx') && !fileName.endsWith('.ascx')) {
            vscode.window.showInformationMessage('Bu özellik sadece ASP dosyalarında çalışır.');
            return;
        }
        
        const position = editor.selection.active;
        const highlights = highlightProvider.provideDocumentHighlights(editor.document, position, new vscode.CancellationTokenSource().token);
        
        if (highlights && highlights.length > 1) {
            // İlk highlight current tag, ikinci highlight matching tag
            const targetPosition = highlights[1].range.start;
            editor.selection = new vscode.Selection(targetPosition, targetPosition);
            editor.revealRange(highlights[1].range, vscode.TextEditorRevealType.InCenter);
        } else {
            vscode.window.showInformationMessage('Eşleşen tag bulunamadı.');
        }
    });

    // Test komutu ekleyelim
    const testCommand = vscode.commands.registerCommand('aspTagMatcher.testExtension', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const fileName = editor.document.fileName;
            const languageId = editor.document.languageId;
            const position = editor.selection.active;
            
            vscode.window.showInformationMessage(
                `ASP Tag Matcher Test:\n` +
                `Dosya: ${fileName}\n` +
                `Dil: ${languageId}\n` +
                `Position: ${position.line}:${position.character}\n` +
                `Extension aktif!`
            );
            
            console.log('Test command executed:', {
                fileName,
                languageId,
                position: `${position.line}:${position.character}`
            });
        } else {
            vscode.window.showInformationMessage('Hiçbir dosya açık değil!');
        }
    });

    context.subscriptions.push(
        highlightDisposable, 
        hoverDisposable, 
        jumpCommand, 
        documentListener, 
        editorListener, 
        testCommand,
        selectionChangeListener,
        ...currentHighlightDecorations
    );
    
    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(symbol-tag) ASP Tag Matcher";
    statusBarItem.tooltip = "ASP HTML Tag Matcher is active";
    statusBarItem.show();
    
    context.subscriptions.push(statusBarItem);
}

// Global helper functions
function getTagAtPosition(lineText: string, character: number, lineNumber: number): TagInfo | null {
    const allTagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
    
    let match;
    
    while ((match = allTagPattern.exec(lineText)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;
        const tagName = match[1].toLowerCase();
        const isClosing = match[0].startsWith('</');
        const isSelfClosing = match[0].endsWith('/>') || isSelfClosingTag(tagName);
        
        console.log(`Found tag in line: "${match[0]}" at positions ${start}-${end}, cursor at ${character}`);
        
        if (character >= start && character <= end) {
            console.log(`Cursor is inside tag: ${tagName}`);
            return {
                tagName: tagName,
                isClosing: isClosing,
                isSelfClosing: isSelfClosing,
                start: start,
                end: end,
                lineNumber: lineNumber,
                fullMatch: match[0]
            };
        }
    }
    
    console.log('No tag found at cursor position');
    return null;
}

function isSelfClosingTag(tagName: string): boolean {
    const selfClosingTags = [
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
        'link', 'meta', 'param', 'source', 'track', 'wbr'
    ];
    return selfClosingTags.includes(tagName.toLowerCase());
}

function findMatchingTag(document: vscode.TextDocument, tagInfo: TagInfo): vscode.Range | null {
    if (tagInfo.isSelfClosing) return null;
    
    const text = document.getText();
    const tagName = tagInfo.tagName;
    const currentOffset = document.offsetAt(new vscode.Position(tagInfo.lineNumber, tagInfo.start));
    
    const allTags = findAllTagsInDocument(text, tagName);
    
    const currentTagIndex = allTags.findIndex(tag => 
        Math.abs(tag.offset - currentOffset) < 10 && 
        tag.isClosing === tagInfo.isClosing
    );
    
    if (currentTagIndex === -1) return null;
    
    if (tagInfo.isClosing) {
        return findMatchingOpenTag(allTags, currentTagIndex, document);
    } else {
        return findMatchingCloseTag(allTags, currentTagIndex, document);
    }
}

function findAllTagsInDocument(text: string, tagName: string): TagMatch[] {
    const allTags: TagMatch[] = [];
    
    const openPattern = new RegExp(`<${tagName}\\b[^>]*(?<!/)>`, 'gi');
    let match;
    
    while ((match = openPattern.exec(text)) !== null) {
        allTags.push({
            offset: match.index,
            isClosing: false,
            length: match[0].length
        });
    }
    
    const closePattern = new RegExp(`<\\/${tagName}\\s*>`, 'gi');
    while ((match = closePattern.exec(text)) !== null) {
        allTags.push({
            offset: match.index,
            isClosing: true,
            length: match[0].length
        });
    }
    
    allTags.sort((a, b) => a.offset - b.offset);
    return allTags;
}

function findMatchingOpenTag(allTags: TagMatch[], currentIndex: number, document: vscode.TextDocument): vscode.Range | null {
    let depth = 1;
    
    for (let i = currentIndex - 1; i >= 0; i--) {
        if (allTags[i].isClosing) {
            depth++;
        } else {
            depth--;
            if (depth === 0) {
                const startPos = document.positionAt(allTags[i].offset);
                const endPos = document.positionAt(allTags[i].offset + (allTags[i].length || 10));
                return new vscode.Range(startPos, endPos);
            }
        }
    }
    
    return null;
}

function findMatchingCloseTag(allTags: TagMatch[], currentIndex: number, document: vscode.TextDocument): vscode.Range | null {
    let depth = 1;
    
    for (let i = currentIndex + 1; i < allTags.length; i++) {
        if (allTags[i].isClosing) {
            depth--;
            if (depth === 0) {
                const startPos = document.positionAt(allTags[i].offset);
                const endPos = document.positionAt(allTags[i].offset + (allTags[i].length || 10));
                return new vscode.Range(startPos, endPos);
            }
        } else {
            depth++;
        }
    }
    
    return null;
}

class ASPTagHighlightProvider implements vscode.DocumentHighlightProvider {
    provideDocumentHighlights(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.DocumentHighlight[] | undefined {
        
        try {
            const line = document.lineAt(position);
            const lineText = line.text;
            
            console.log(`Checking position: Line ${position.line}, Character ${position.character}`);
            console.log(`Line text: "${lineText}"`);
            
            // Check if cursor is on an HTML tag
            const tagInfo = this.getTagAtPosition(lineText, position.character, line.lineNumber);
            if (!tagInfo) {
                console.log('No tag found at position');
                return undefined;
            }
            
            console.log(`Found tag: ${tagInfo.tagName}, isClosing: ${tagInfo.isClosing}, isSelfClosing: ${tagInfo.isSelfClosing}`);
            
            // Find all matching tags in the document
            const highlights = this.findMatchingTags(document, tagInfo);
            console.log(`Found ${highlights.length} highlights`);
            
            return highlights;
            
        } catch (error) {
            console.error('Error in provideDocumentHighlights:', error);
            return undefined;
        }
    }
    
    private getTagAtPosition(lineText: string, character: number, lineNumber: number): TagInfo | null {
        // Gelişmiş HTML tag regex pattern'i
        const allTagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
        
        let match;
        
        // Tüm tag'leri bul
        while ((match = allTagPattern.exec(lineText)) !== null) {
            const start = match.index;
            const end = match.index + match[0].length;
            const tagName = match[1].toLowerCase();
            const isClosing = match[0].startsWith('</');
            const isSelfClosing = match[0].endsWith('/>') || this.isSelfClosingTag(tagName);
            
            console.log(`Found tag in line: "${match[0]}" at positions ${start}-${end}, cursor at ${character}`);
            
            // Cursor tag içinde mi kontrol et (daha geniş alan)
            if (character >= start && character <= end) {
                console.log(`Cursor is inside tag: ${tagName}`);
                return {
                    tagName: tagName,
                    isClosing: isClosing,
                    isSelfClosing: isSelfClosing,
                    start: start,
                    end: end,
                    lineNumber: lineNumber,
                    fullMatch: match[0]
                };
            }
        }
        
        console.log('No tag found at cursor position');
        return null;
    }
    
    private isSelfClosingTag(tagName: string): boolean {
        const selfClosingTags = [
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];
        return selfClosingTags.includes(tagName.toLowerCase());
    }
    
    private findMatchingTags(document: vscode.TextDocument, tagInfo: TagInfo): vscode.DocumentHighlight[] {
        const highlights: vscode.DocumentHighlight[] = [];
        const tagName = tagInfo.tagName;
        
        console.log(`Finding matches for tag: ${tagName}, isSelfClosing: ${tagInfo.isSelfClosing}`);
        
        // Self-closing tags sadece kendilerini highlight et
        if (tagInfo.isSelfClosing) {
            const currentRange = new vscode.Range(
                new vscode.Position(tagInfo.lineNumber, tagInfo.start),
                new vscode.Position(tagInfo.lineNumber, tagInfo.end)
            );
            highlights.push(new vscode.DocumentHighlight(currentRange, vscode.DocumentHighlightKind.Text));
            console.log('Self-closing tag, only highlighting itself');
            return highlights;
        }
        
        // Current tag'i de highlight et
        const currentRange = new vscode.Range(
            new vscode.Position(tagInfo.lineNumber, tagInfo.start),
            new vscode.Position(tagInfo.lineNumber, tagInfo.end)
        );
        highlights.push(new vscode.DocumentHighlight(currentRange, vscode.DocumentHighlightKind.Text));
        
        // Find matching tag
        const matchingTag = this.findMatchingTag(document, tagInfo);
        if (matchingTag) {
            highlights.push(new vscode.DocumentHighlight(matchingTag, vscode.DocumentHighlightKind.Read));
            console.log('Found matching tag');
        } else {
            console.log('No matching tag found');
        }
        
        return highlights;
    }
    
    private findMatchingTag(document: vscode.TextDocument, tagInfo: TagInfo): vscode.Range | null {
        const text = document.getText();
        const tagName = tagInfo.tagName;
        const currentOffset = document.offsetAt(new vscode.Position(tagInfo.lineNumber, tagInfo.start));
        
        // Tüm aynı isimli tag'leri bul
        const allTags = this.findAllTagsInDocument(text, tagName);
        
        // Current tag'i listede bul
        const currentTagIndex = allTags.findIndex(tag => 
            Math.abs(tag.offset - currentOffset) < 10 && 
            tag.isClosing === tagInfo.isClosing
        );
        
        if (currentTagIndex === -1) return null;
        
        // Eşleşen tag'i bul
        if (tagInfo.isClosing) {
            return this.findMatchingOpenTagNew(allTags, currentTagIndex, document);
        } else {
            return this.findMatchingCloseTagNew(allTags, currentTagIndex, document);
        }
    }
    
    private findAllTagsInDocument(text: string, tagName: string): TagMatch[] {
        const allTags: TagMatch[] = [];
        
        // Opening tags
        const openPattern = new RegExp(`<${tagName}\\b[^>]*(?<!/)>`, 'gi');
        let match;
        
        while ((match = openPattern.exec(text)) !== null) {
            allTags.push({
                offset: match.index,
                isClosing: false,
                length: match[0].length
            });
        }
        
        // Closing tags
        const closePattern = new RegExp(`<\\/${tagName}\\s*>`, 'gi');
        while ((match = closePattern.exec(text)) !== null) {
            allTags.push({
                offset: match.index,
                isClosing: true,
                length: match[0].length
            });
        }
        
        // Offset'e göre sırala
        allTags.sort((a, b) => a.offset - b.offset);
        return allTags;
    }
    
    private findMatchingOpenTagNew(allTags: TagMatch[], currentIndex: number, document: vscode.TextDocument): vscode.Range | null {
        let depth = 1;
        
        // Geriye doğru git
        for (let i = currentIndex - 1; i >= 0; i--) {
            if (allTags[i].isClosing) {
                depth++;
            } else {
                depth--;
                if (depth === 0) {
                    const startPos = document.positionAt(allTags[i].offset);
                    const endPos = document.positionAt(allTags[i].offset + (allTags[i].length || 10));
                    return new vscode.Range(startPos, endPos);
                }
            }
        }
        
        return null;
    }
    
    private findMatchingCloseTagNew(allTags: TagMatch[], currentIndex: number, document: vscode.TextDocument): vscode.Range | null {
        let depth = 1;
        
        // İleriye doğru git
        for (let i = currentIndex + 1; i < allTags.length; i++) {
            if (allTags[i].isClosing) {
                depth--;
                if (depth === 0) {
                    const startPos = document.positionAt(allTags[i].offset);
                    const endPos = document.positionAt(allTags[i].offset + (allTags[i].length || 10));
                    return new vscode.Range(startPos, endPos);
                }
            } else {
                depth++;
            }
        }
        
        return null;
    }
}

class ASPTagHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Hover | undefined {
        
        const line = document.lineAt(position);
        const lineText = line.text;
        
        // HTML tag detection for hover
        const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
        let match;
        
        while ((match = tagPattern.exec(lineText)) !== null) {
            const start = match.index;
            const end = match.index + match[0].length;
            
            if (position.character >= start && position.character <= end) {
                const tagName = match[1];
                const isClosing = match[0].startsWith('</');
                const isSelfClosing = match[0].endsWith('/>');
                
                let tagType = 'Opening Tag';
                if (isClosing) tagType = 'Closing Tag';
                if (isSelfClosing) tagType = 'Self-Closing Tag';
                
                const hoverText = new vscode.MarkdownString();
                hoverText.appendMarkdown(`**${tagType}:** \`<${tagName}>\`\n\n`);
                hoverText.appendMarkdown(`💡 **Tip:** Ctrl+Shift+] ile eşleşen tag'e atlayabilirsiniz!`);
                
                return new vscode.Hover(hoverText);
            }
        }
        
        return undefined;
    }
}

interface TagInfo {
    tagName: string;
    isClosing: boolean;
    isSelfClosing: boolean;
    start: number;
    end: number;
    lineNumber: number;
    fullMatch: string;
}

interface TagMatch {
    range?: vscode.Range;
    offset: number;
    isClosing: boolean;
    length?: number;
}

export function deactivate() {
    console.log('ASP HTML Tag Matcher deactivated');
}
