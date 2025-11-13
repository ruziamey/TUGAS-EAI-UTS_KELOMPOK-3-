# ❌ Solusi Error: 'npm' is not recognized

## 🔍 Arti Error

**Error:**
```
'npm' is not recognized as an internal or external command,
operable program or batch file.
```

**Arti:**
- Windows tidak mengenal perintah `npm`
- Node.js belum terinstall di komputer Anda
- Atau Node.js sudah terinstall tapi tidak ada di PATH environment

---

## ✅ Solusi: Install Node.js

### Langkah 1: Download Node.js

1. **Buka browser** (Chrome, Firefox, Edge, dll)
2. **Kunjungi website:**
   ```
   https://nodejs.org/
   ```
3. **Download versi LTS** (Long Term Support)
   - Klik tombol hijau "LTS" (biasanya di sebelah kiri)
   - File akan terdownload (contoh: `node-v20.x.x-x64.msi`)

---

### Langkah 2: Install Node.js

1. **Buka file installer** yang sudah didownload
2. **Klik "Next"** pada wizard instalasi
3. **PENTING:** Pastikan checkbox **"Add to PATH"** atau **"Automatically install the necessary tools"** **DICENTANG** ✅
4. **Klik "Install"**
5. **Tunggu sampai selesai** (biasanya 1-2 menit)
6. **Klik "Finish"**

---

### Langkah 3: Restart Command Prompt

**PENTING:** Setelah install Node.js, **WAJIB restart Command Prompt**!

1. **Tutup semua Command Prompt/PowerShell yang terbuka**
2. **Buka Command Prompt baru:**
   - Tekan `Win + R`
   - Ketik: `cmd`
   - Tekan Enter

---

### Langkah 4: Verifikasi Instalasi

Di Command Prompt baru, ketik:

```bash
node --version
```

**Jika berhasil:**
- Akan muncul versi, contoh: `v20.11.0` ✅
- Berarti Node.js sudah terinstall!

Kemudian ketik:

```bash
npm --version
```

**Jika berhasil:**
- Akan muncul versi, contoh: `10.2.4` ✅
- Berarti npm sudah siap digunakan!

---

## 🔄 Jika Masih Error Setelah Install

### Solusi 1: Restart Komputer

1. **Restart komputer** Anda
2. **Buka Command Prompt baru**
3. **Coba lagi:**
   ```bash
   node --version
   npm --version
   ```

### Solusi 2: Install Ulang dengan PATH

1. **Uninstall Node.js** (jika sudah terinstall)
   - Control Panel → Programs → Uninstall Node.js

2. **Download ulang** dari https://nodejs.org/

3. **Saat install, pastikan:**
   - ✅ "Add to PATH" dicentang
   - ✅ "Automatically install the necessary tools" dicentang

4. **Restart komputer**

5. **Buka Command Prompt baru** dan coba lagi

---

### Solusi 3: Manual Add ke PATH (Advanced)

Jika masih tidak bekerja:

1. **Cari lokasi instalasi Node.js:**
   - Biasanya di: `C:\Program Files\nodejs\`
   - Atau: `C:\Program Files (x86)\nodejs\`

2. **Copy path tersebut**

3. **Buka System Properties:**
   - Tekan `Win + Pause/Break`
   - Klik "Advanced system settings"
   - Klik "Environment Variables"

4. **Edit PATH:**
   - Di "System variables", cari "Path"
   - Klik "Edit"
   - Klik "New"
   - Paste path Node.js (contoh: `C:\Program Files\nodejs`)
   - Klik "OK" di semua window

5. **Restart Command Prompt**

---

## 📋 Checklist

Setelah install Node.js, pastikan:

- [ ] `node --version` berhasil (muncul versi)
- [ ] `npm --version` berhasil (muncul versi)
- [ ] Command Prompt sudah di-restart setelah install
- [ ] Komputer sudah di-restart (jika perlu)

---

## 🎯 Setelah Node.js Terinstall

Setelah Node.js terinstall dengan benar, Anda bisa lanjut menjalankan:

```bash
cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\database"
npm run seed
```

Dan semua perintah npm lainnya akan bekerja!

---

## 💡 Tips

1. **Selalu restart Command Prompt** setelah install software baru
2. **Gunakan versi LTS** Node.js untuk stabilitas
3. **Jangan skip** opsi "Add to PATH" saat install
4. **Jika masih error**, coba restart komputer

---

## ❓ Masih Error?

Jika setelah semua langkah di atas masih error:

1. **Screenshot error message** yang muncul
2. **Cek versi Node.js** yang terinstall:
   ```bash
   where node
   ```
3. **Cek apakah Node.js benar-benar terinstall:**
   - Buka File Explorer
   - Masuk ke: `C:\Program Files\nodejs\`
   - Lihat apakah ada file `node.exe` dan `npm.cmd`

---

**Setelah Node.js terinstall, semua perintah npm akan bekerja!** 🚀


