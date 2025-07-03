# ASP HTML Tag Matcher 🚀

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/hakansglm/asp-html-tag-matcher)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.60.0%2B-blue.svg)](https://code.visualstudio.com/)

A professional Visual Studio Code extension that provides HTML tag matching support for ASP files with real-time highlighting and navigation features.

ASP dosyalarında HTML tag eşleştirme desteği sağlayan profesyonel VS Code extension'ı. Gerçek zamanlı vurgulama ve navigasyon özellikleri ile.

---

## 🌟 Features / Özellikler

### English
- **🎯 Real-time Tag Highlighting**: Instantly highlights matching opening/closing HTML tags as you click
- **🎨 Visual Feedback**: Yellow highlighting for opening tags, green highlighting for closing tags
- **⌨️ Keyboard Navigation**: Quick jump between matching tags with `Ctrl+Shift+]`
- **🔍 Smart Tag Detection**: Advanced regex-based detection that works with complex HTML structures
- **📁 Multi-File Support**: Works with `.asp`, `.aspx`, and `.ascx` files
- **🏷️ Self-Closing Tag Support**: Proper handling of self-closing tags (img, br, input, etc.)
- **� Debug Support**: Built-in test command and comprehensive logging
- **📊 Status Bar Indicator**: Visual confirmation when the extension is active
- **🌐 Cross-Platform**: Works on Windows, macOS, and Linux

### Türkçe
- **🎯 Gerçek Zamanlı Tag Vurgulama**: Tıkladığınız anda eşleşen HTML tag'lerini anında vurgular
- **🎨 Görsel Geri Bildirim**: Açılış tag'leri için sarı, kapanış tag'leri için yeşil vurgulama
- **⌨️ Klavye Navigasyonu**: `Ctrl+Shift+]` ile eşleşen tag'ler arasında hızla atlama
- **🔍 Akıllı Tag Algılama**: Karmaşık HTML yapılarıyla çalışan gelişmiş regex tabanlı algılama
- **📁 Çoklu Dosya Desteği**: `.asp`, `.aspx` ve `.ascx` dosyalarıyla çalışır
- **🏷️ Self-Closing Tag Desteği**: Self-closing tag'lerin (img, br, input, vb.) doğru işlenmesi
- **� Debug Desteği**: Yerleşik test komutu ve kapsamlı loglama
- **📊 Durum Çubuğu Göstergesi**: Extension aktifken görsel onay
- **🌐 Çapraz Platform**: Windows, macOS ve Linux'ta çalışır

---

## 🚀 Quick Start / Hızlı Başlangıç

### Installation / Kurulum

1. Open VS Code / VS Code'u açın
2. Go to Extensions (Ctrl+Shift+X) / Extensions'a gidin (Ctrl+Shift+X)
3. Search for "ASP HTML Tag Matcher" / "ASP HTML Tag Matcher" aratın
4. Click Install / Install'a tıklayın

### Usage / Kullanım

1. **Open an ASP file** (`.asp`, `.aspx`, or `.ascx`)
   **ASP dosyası açın** (`.asp`, `.aspx` veya `.ascx`)

2. **Click on any HTML tag** (e.g., `<div>`, `<table>`, `<form>`)
   **Herhangi bir HTML tag'ine tıklayın** (örn: `<div>`, `<table>`, `<form>`)

3. **See the magic!** ✨ Matching tags are highlighted instantly
   **Büyüyü görün!** ✨ Eşleşen tag'ler anında vurgulanır

---

## 💡 Examples / Örnekler

### Basic Usage / Temel Kullanım

```asp
<%@ Language="VBScript" %>
<%
Dim userName
userName = "Hakan"
%>
<!DOCTYPE html>
<html lang="tr">
<head>
    <title>ASP Example</title>
</head>
<body>
    <div class="container">  ← Click here / Buraya tıklayın
        <h1>Welcome <%=userName%>!</h1>
        <table class="data-table">  ← Or here / Veya buraya
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>User</td>
                    <td><%=userName%></td>
                </tr>
            </tbody>
        </table>  ← Matching closing tag highlighted / Eşleşen kapanış tag'i vurgulanır
    </div>  ← Matching closing tag highlighted / Eşleşen kapanış tag'i vurgulanır
</body>
</html>
```

### Complex Nested Structure / Karmaşık İç İçe Yapı

```asp
<div class="main">
    <form method="post" action="process.asp">
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" />
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Login</button>
    </form>
</div>
```

---

## ⌨️ Keyboard Shortcuts / Klavye Kısayolları

| Shortcut / Kısayol | Action / Eylem |
|-------------------|---------------|
| `Ctrl+Shift+]` | Jump to matching tag / Eşleşen tag'e atla |
| `Ctrl+Shift+P` → `ASP Tag Matcher: Test` | Test extension / Extension'ı test et |

---

## 🎨 Visual Highlights / Görsel Vurgulamalar

- **🟡 Yellow Border**: Opening tags / Açılış tag'leri
- **🟢 Green Border**: Closing tags / Kapanış tag'leri
- **📍 Clear Visual Feedback**: Easy identification of matching pairs / Eşleşen çiftlerin kolay tanımlanması

---

## 🔧 Configuration / Yapılandırma

The extension works out of the box with default settings. Future versions will include customizable options.

Extension varsayılan ayarlarla hazır çalışır. Gelecek sürümlerde özelleştirilebilir seçenekler bulunacak.

---

## 🐛 Troubleshooting / Sorun Giderme

### Extension not working? / Extension çalışmıyor mu?

1. **Check file extension**: Make sure you're working with `.asp`, `.aspx`, or `.ascx` files
   **Dosya uzantısını kontrol edin**: `.asp`, `.aspx` veya `.ascx` dosyalarıyla çalıştığınızdan emin olun

2. **Test the extension**: Use `Ctrl+Shift+P` → `ASP Tag Matcher: Test ASP Tag Matcher`
   **Extension'ı test edin**: `Ctrl+Shift+P` → `ASP Tag Matcher: Test ASP Tag Matcher` kullanın

3. **Check console**: Open Developer Tools (`Help` → `Toggle Developer Tools`) and check the Console for logs
   **Console'u kontrol edin**: Developer Tools'u açın (`Help` → `Toggle Developer Tools`) ve Console'da logları kontrol edin

4. **Restart VS Code**: Sometimes a restart helps
   **VS Code'u yeniden başlatın**: Bazen yeniden başlatma yardımcı olur

---

## 🚦 Requirements / Gereksinimler

- **VS Code**: Version 1.60.0 or higher / Sürüm 1.60.0 veya üstü
- **Operating System**: Windows, macOS, or Linux / Windows, macOS veya Linux
- **File Types**: `.asp`, `.aspx`, `.ascx` files / `.asp`, `.aspx`, `.ascx` dosyaları

---

## 🗺️ Roadmap / Yol Haritası

### Version 1.1 (Coming Soon / Yakında)
- **Custom Colors**: User-configurable highlight colors / Kullanıcı tarafından ayarlanabilir renk temaları
- **Tag Information**: Detailed tooltips on hover / Hover'da detaylı tag bilgileri
- **Performance**: Optimizations for large files / Büyük dosyalar için optimizasyonlar

### Version 1.2 (Future / Gelecek)
- **Auto-completion**: Automatic closing tag insertion / Otomatik kapanış tag'i ekleme
- **Validation**: Real-time HTML validation / Gerçek zamanlı HTML doğrulama
- **Multi-cursor**: Support for multiple selections / Çoklu seçim desteği

---

## 👨‍💻 Author / Yazar

**Hakan Murat Sağlam**
- 🌐 GitHub: [@hakansglm](https://github.com/hakansglm)
- 📧 Contact: [GitHub Profile](https://github.com/hakansglm)
- 🎯 Purpose: Improving ASP development experience / ASP geliştirme deneyimini iyileştirme

---

## 🤝 Contributing / Katkıda Bulunma

We welcome contributions from the community! / Topluluktan katkıları memnuniyetle karşılıyoruz!

1. **Fork** the repository / Depoyu fork'layın
2. **Create** a feature branch / Özellik branch'i oluşturun
3. **Make** your changes / Değişikliklerinizi yapın
4. **Submit** a pull request / Pull request gönderin

### Development Setup / Geliştirme Kurulumu

```bash
git clone https://github.com/hakansglm/asp-html-tag-matcher.git
cd asp-html-tag-matcher
npm install
npm run compile
```

---

## 📄 License / Lisans

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 🆘 Support / Destek

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/hakansglm/asp-html-tag-matcher/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/hakansglm/asp-html-tag-matcher/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/hakansglm/asp-html-tag-matcher/wiki)

---

## ⭐ Show Your Support / Desteğinizi Gösterin

If this extension helps you, please consider:
Bu extension size yardımcı oluyorsa, lütfen:

- ⭐ **Star** the repository / Depoyu yıldızlayın
- 🐛 **Report** bugs / Bug'ları rapor edin
- 💡 **Suggest** features / Özellik önerin
- 📢 **Share** with others / Başkalarıyla paylaşın

---

<p align="center">
  <strong>Made with ❤️ for the ASP development community</strong><br>
  <em>ASP geliştirici topluluğu için ❤️ ile yapıldı</em>
</p>
