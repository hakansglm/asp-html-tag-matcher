**ASP HTML Tag Matcher - Test Kılavuzu**

## 🧪 Extension'ı Test Etmek İçin:

### 1. VS Code'u Yeniden Başlatın
Extension'ın tam olarak yüklenmesi için VS Code'u kapatıp açın.

### 2. Test Dosyasını Açın
`test.asp` dosyasını açın ve language mode'unu `asp` olarak ayarlayın.

### 3. Tag Matching Testi
Aşağıdaki tag'lere tıklayarak test edin:

**Test Edilecek Tag'ler:**
- Satır 10: `<div class="container">` → Satır 51'deki `</div>` ile eşleşmeli
- Satır 14: `<table class="test-table">` → Satır 35'teki `</table>` ile eşleşmeli
- Satır 20: `<tr>` → Satır 23'teki `</tr>` ile eşleşmeli
- Satır 30: `<td>Satır <%=i%> - Hücre 1</td>` → Opening ve closing tag'ler eşleşmeli

### 4. Beklenen Davranış:
- Tag'e tıkladığınızda hem current tag hem de eşleşen tag highlight edilmeli
- Hover yaptığınızda tag bilgisi görünmeli
- `Ctrl+Shift+]` ile eşleşen tag'e atlamalısınız

### 5. Sorun Giderme:
Eğer çalışmıyorsa:
1. Developer Console'u açın (`Help > Toggle Developer Tools`)
2. Console'da "ASP HTML Tag Matcher" loglarını kontrol edin
3. Extension'ın aktif olduğunu status bar'dan kontrol edin

### 6. Debug İçin:
Command Palette'te (`Ctrl+Shift+P`) şu komutları deneyin:
- "Developer: Reload Window" - Sayfayı yeniden yükler
- "ASP Tag Matcher: Jump to Matching Tag" - Manuel olarak eşleşen tag'e atlar

## 🔧 Eğer Hala Çalışmıyorsa:

Extension kodu güncellenebilir. Aşağıdaki değişiklikler yapılabilir:
- Daha hassas regex pattern'leri
- Cursor position detection iyileştirmesi
- ASP code block handling
