## 🚀 Extension'ı Derleme ve Lokal Kurulum Adımları

Aşağıdaki adımları takip ederek extension'ınızı temizleyebilir, derleyebilir, paketleyebilir ve lokal olarak VS Code'a kurabilirsiniz:

```bash
# 1. Derleme öncesi çıkış klasörünü temizle
rm -rf out

# 2. Gerekli bağımlılıkları yükle
npm install

# 3. TypeScript kaynaklarını derle
npm run compile

# 4. VS Code extension dosyasını (.vsix) oluştur
npx vsce package

# 5. Oluşan uzantıyı VS Code'a lokal olarak yükle
code --install-extension ExtensionPathIleDegistir
