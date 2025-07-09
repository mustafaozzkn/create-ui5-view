# 🔧 Create UI5 View - VS Code Extension

Bu Visual Studio Code uzantısı, SAP Fiori uygulamaları geliştirenler için otomatik **View ve Controller oluşturma** sürecini kolaylaştırır. Tek bir komutla UI5 mimarisine uygun dosyalar oluşturur ve `manifest.json` içinde gerekli routing tanımlarını yapar.

## 🚀 Özellikler

- Komut paleti üzerinden çağrılır (`Create UI5 View` komutu).
- Kullanıcıdan bir **View ismi** alır.
- `webapp/view/` klasörüne otomatik olarak `<ViewName>.view.xml` dosyasını oluşturur.
- `webapp/controller/` klasörüne eşleşen `<ViewName>.controller.js` dosyasını oluşturur.
- `manifest.json` dosyasına **routing** yapılandırmasını ekler.

## 🎯 Amaç

Fiori/UX geliştiricilerinin UI5 uygulamaları içerisinde yeni sayfalar (views) oluşturma sürecini standartlaştırmak ve hızlandırmak.

---

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
code --install-extension <ExtensionPathIleDegistir>
```

## 🖼️ Görseller

Aşağıda extension’ın nasıl çalıştığını gösteren ekran görüntüleri yer almakta.

### Komut Paleti Üzerinden Çalıştırma
<img width="632" alt="image" src="https://github.com/user-attachments/assets/3259fffc-12dd-4212-a5a5-2c91277540d5" />


### UI5 View İsim Belirleme
<img width="632" alt="image" src="https://github.com/user-attachments/assets/26fc864f-65cd-4361-9818-f3643d5feb94" />
