# 📚 Panduan Lengkap Menjalankan E-Wallet

## 🎯 Persiapan Awal

### Step 1: Cek Apakah Node.js Sudah Terinstall

1. Buka **Command Prompt** atau **PowerShell**
   - Tekan `Win + R`
   - Ketik `cmd` atau `powershell`
   - Tekan Enter

2. Ketik perintah ini:
```bash
node --version
```

3. Jika muncul versi (contoh: `v18.17.0`), berarti sudah terinstall ✅
4. Jika muncul error "node is not recognized", berarti belum terinstall ❌

**Jika belum terinstall:**
- Download dari: https://nodejs.org/
- Install versi LTS (Long Term Support)
- Restart komputer setelah install
- Cek lagi dengan `node --version`

---

## 📁 Step 2: Buka Folder Project

1. Buka **File Explorer** (Windows Explorer)
2. Navigasi ke folder:
   ```
   C:\Users\ruzia\Documents\TUGAS UTS EAI
   ```
3. Klik kanan di dalam folder tersebut
4. Pilih **"Open in Terminal"** atau **"Open PowerShell window here"**

Atau:
- Tekan `Win + R`
- Ketik: `cmd`
- Tekan Enter
- Ketik: `cd "C:\Users\ruzia\Documents\TUGAS UTS EAI"`
- Tekan Enter

---

## 📦 Step 3: Install Dependencies (Satu Per Satu)

Kita akan install dependencies untuk setiap bagian. **Jalankan satu per satu**, tunggu selesai baru lanjut ke berikutnya.

### 3.1 Install Root Dependencies
```bash
npm install
```
Tunggu sampai selesai (biasanya 1-2 menit)

### 3.2 Install Gateway Dependencies
```bash
cd gateway
npm install
cd ..
```
Tunggu sampai selesai

### 3.3 Install User Service Dependencies
```bash
cd services/user-service
npm install
cd ../..
```
Tunggu sampai selesai

### 3.4 Install Wallet Service Dependencies
```bash
cd services/wallet-service
npm install
cd ../..
```
Tunggu sampai selesai

### 3.5 Install Transaction Service Dependencies
```bash
cd services/transaction-service
npm install
cd ../..
```
Tunggu sampai selesai

### 3.6 Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```
Tunggu sampai selesai (bisa lebih lama, biasanya 2-3 menit)

### 3.7 Install Database Dependencies
```bash
cd database
npm install
cd ..
```
Tunggu sampai selesai

**✅ Jika semua sudah selesai, lanjut ke step berikutnya!**

---

## 🗄️ Step 4: Setup Database

Jalankan perintah ini untuk membuat database dan data sample:

```bash
cd database
npm run seed
cd ..
```

**Yang terjadi:**
- Akan membuat file `ewallet.db`
- Membuat 3 user sample: alice, bob, charlie
- Membuat wallet untuk setiap user
- Membuat beberapa transaksi sample

**✅ Jika muncul pesan "Database seeded successfully!", berarti berhasil!**

---

## 🚀 Step 5: Jalankan Services

Kita perlu menjalankan **5 service** secara bersamaan. Buka **5 terminal/command prompt terpisah**.

### Cara Buka Multiple Terminal:

**Metode 1: Buka Terminal Baru**
- Setiap kali mau buka terminal baru, tekan `Win + R`, ketik `cmd`, Enter
- Atau buka folder project, klik kanan → "Open in Terminal"

**Metode 2: Duplicate Tab (jika pakai VS Code atau terminal modern)**
- Klik kanan tab terminal → "Duplicate"

---

### Terminal 1: API Gateway

1. Buka terminal baru
2. Navigasi ke folder project:
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI"
   ```
3. Jalankan:
   ```bash
   cd gateway
   npm start
   ```
4. **Tunggu sampai muncul pesan:**
   ```
   🚀 API Gateway running on port 3000
   ```
5. **JANGAN TUTUP terminal ini!** Biarkan tetap terbuka.

---

### Terminal 2: User Service

1. Buka terminal baru (lagi)
2. Navigasi ke folder project:
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI"
   ```
3. Jalankan:
   ```bash
   cd services/user-service
   npm start
   ```
4. **Tunggu sampai muncul pesan:**
   ```
   👤 User Service running on port 3001
   ```
5. **JANGAN TUTUP terminal ini!** Biarkan tetap terbuka.

---

### Terminal 3: Wallet Service

1. Buka terminal baru (lagi)
2. Navigasi ke folder project:
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI"
   ```
3. Jalankan:
   ```bash
   cd services/wallet-service
   npm start
   ```
4. **Tunggu sampai muncul pesan:**
   ```
   💰 Wallet Service running on port 3002
   ```
5. **JANGAN TUTUP terminal ini!** Biarkan tetap terbuka.

---

### Terminal 4: Transaction Service

1. Buka terminal baru (lagi)
2. Navigasi ke folder project:
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI"
   ```
3. Jalankan:
   ```bash
   cd services/transaction-service
   npm start
   ```
4. **Tunggu sampai muncul pesan:**
   ```
   💳 Transaction Service running on port 3003
   ```
5. **JANGAN TUTUP terminal ini!** Biarkan tetap terbuka.

---

### Terminal 5: Frontend

1. Buka terminal baru (lagi - yang terakhir!)
2. Navigasi ke folder project:
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI"
   ```
3. Jalankan:
   ```bash
   cd frontend
   npm start
   ```
4. **Tunggu sampai muncul pesan:**
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```
5. **JANGAN TUTUP terminal ini!** Biarkan tetap terbuka.

---

## ✅ Step 6: Akses Aplikasi

Setelah **SEMUA 5 terminal** menunjukkan pesan "running" atau "ready", maka:

1. Buka **browser** (Chrome, Firefox, Edge, dll)
2. Ketik di address bar:
   ```
   http://localhost:5173
   ```
3. Tekan Enter

**Aplikasi E-Wallet akan muncul!** 🎉

---

## 🔐 Step 7: Login

Gunakan salah satu akun sample:

**Akun 1:**
- Username: `alice`
- Password: `password123`

**Akun 2:**
- Username: `bob`
- Password: `password123`

**Akun 3:**
- Username: `charlie`
- Password: `password123`

---

## 🛑 Cara Stop Aplikasi

Untuk menghentikan aplikasi:
1. Kembali ke semua terminal yang terbuka
2. Tekan `Ctrl + C` di setiap terminal
3. Atau tutup semua terminal

---

## ❓ Troubleshooting

### Error: "Port already in use"
**Solusi:** Port sudah digunakan aplikasi lain. Tutup aplikasi yang menggunakan port tersebut, atau restart komputer.

### Error: "Cannot find module"
**Solusi:** Pastikan sudah install dependencies di folder tersebut. Jalankan `npm install` lagi di folder yang error.

### Error: "Database not found"
**Solusi:** Jalankan lagi `cd database && npm run seed`

### Frontend tidak muncul
**Solusi:** 
- Pastikan semua 4 service lainnya sudah running
- Tunggu beberapa detik, refresh browser
- Cek terminal frontend apakah ada error

### Aplikasi lambat
**Solusi:** Normal untuk pertama kali. Setelah semua dependencies ter-cache, akan lebih cepat.

---

## 📝 Checklist

Sebelum mulai, pastikan:
- [ ] Node.js sudah terinstall (`node --version` berhasil)
- [ ] Sudah di folder project yang benar
- [ ] Sudah install semua dependencies
- [ ] Sudah setup database (seed)

Saat running:
- [ ] Terminal 1: Gateway running (port 3000)
- [ ] Terminal 2: User Service running (port 3001)
- [ ] Terminal 3: Wallet Service running (port 3002)
- [ ] Terminal 4: Transaction Service running (port 3003)
- [ ] Terminal 5: Frontend running (port 5173)
- [ ] Browser terbuka di http://localhost:5173

---

## 🎓 Tips

1. **Jangan tutup terminal** saat aplikasi running
2. **Urutan tidak terlalu penting**, tapi lebih baik mulai dari Gateway
3. **Jika error**, baca pesan error di terminal untuk tahu masalahnya
4. **Untuk development**, biarkan semua terminal terbuka
5. **Untuk production**, gunakan process manager seperti PM2

---

**Selamat mencoba! Jika ada masalah, cek bagian Troubleshooting atau tanyakan!** 🚀



