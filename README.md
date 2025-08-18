# MetaSafe Browser Extension 🚀
*A privacy-focused browser extension that automatically removes unnecessary metadata from files before they are uploaded to any website.*

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)   ![Status](https://img.shields.io/badge/status-in_progress-orange)

---

## 🔒 Why?
Most files (images, videos, documents, PDFs, audio) contain hidden metadata (EXIF, GPS location, device info, author, software version, etc.) that can leak personal details when uploading to websites.

MetaSafe automatically strips this metadata on-the-fly before the website receives the original file containing the metadata, protecting your privacy.

---

## ✨ Features
- Automatic metadata removal when uploading files via `<input type="file">` or using **drag-and-drop**.
- Support for [common filetypes](#-supported-filetypes).
- Works across all Chromium-based browsers (Chrome, Edge, Brave, Vivaldi, Opera).

---

## 📂 Supported Filetypes
- 📷 **Images**: JPG/JPEG (EXIF data removal)

The following are planned for progressive rollout:
- 📷 Images: PNG
- 📄 Documents: PDF, DOCX
- 🎵 Audio: MP3
- 🎥 Video: MP4

More formats will be added in upcoming releases — check the [Roadmap](#-roadmap).

---

## 🛠️ Roadmap
- **v0.1.0**: **(Current)** Core interception logic for file inputs and drag-and-drop. EXIF metadata removal for JPEG images.
- **v0.2.0**: Extend to documents (PDF, DOCX).
- **v0.3.0**: Extend to media files (MP3, MP4).
- **v0.4.0**: Add a user-friendly options page with a whitelist system (choose websites where the extension is disabled).
- **v1.0.0**: Polished, stable → submit to Chrome Web Store.

---

## 📦 Installation
### From GitHub Releases (manual)
1. Download the latest `.zip` from [Releases](https://github.com/InjectorExe/MetaSafe-Extension/releases).
2. Extract it somewhere safe.
3. Go to `chrome://extensions/` in your browser.
4. Enable **Developer Mode**.
5. Click **Load unpacked** and select the extracted folder.

### From Chrome Web Store (recommended, once published)
👉 Coming soon…

---

## 🧑‍💻 Development Setup
Clone the repo locally:

```bash
git clone https://github.com/InjectorExe/MetaSafe-Extension.git
cd MetaSafe-Extension
```
To load the extension for testing:

1. Open **chrome://extensions/** in your browser.
2. Enable **Developer Mode**.
3. Click **Load unpacked** and select your project folder.

---

## 🤝 Credits
- [ByeByeEXIF](https://github.com/FoxRefire/ByeByeEXIF) — reviewed as a reference for metadata cleaning approaches.
- Built independently for privacy-conscious users.