# 📂 Panduan Lengkap: Lokasi File dan Cara Menjalankannya

## 🗂️ Struktur Folder Project

```
C:\Users\ruzia\Documents\TUGAS UTS EAI\
│
├── 📁 gateway\                    ← File untuk API Gateway
│   ├── 📄 server.js               ← FILE INI YANG DIJALANKAN (Terminal 1)
│   └── 📄 package.json
│
├── 📁 services\
│   ├── 📁 user-service\
│   │   ├── 📄 server.js           ← FILE INI YANG DIJALANKAN (Terminal 2)
│   │   └── 📄 package.json
│   │
│   ├── 📁 wallet-service\
│   │   ├── 📄 server.js           ← FILE INI YANG DIJALANKAN (Terminal 3)
│   │   └── 📄 package.json
│   │
│   └── 📁 transaction-service\
│       ├── 📄 server.js           ← FILE INI YANG DIJALANKAN (Terminal 4)
│       └── 📄 package.json
│
├── 📁 frontend\
│   ├── 📄 package.json
│   └── 📁 src\
│       └── 📄 main.jsx            ← Entry point frontend
│
├── 📁 database\
│   ├── 📄 seed.js                 ← FILE INI YANG DIJALANKAN (Setup Database)
│   ├── 📄 schema.sql
│   └── 📄 package.json
│
└── 📄 package.json                ← Root package.json
```

---

## 🎯 STEP-BY-STEP: File yang Perlu Dijalankan

### ✅ STEP 1: Setup Database (Hanya Sekali)

**Lokasi File:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\database\seed.js
```

**Cara Menjalankan:**

1. **Buka Command Prompt atau PowerShell**
   - Tekan `Win + R`
   - Ketik: `cmd` atau `powershell`
   - Tekan Enter

2. **Navigasi ke folder database:**
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\database"
   ```
   Tekan Enter

3. **Jalankan file seed.js:**
   ```bash
   npm run seed
   ```
   Tekan Enter

4. **Tunggu sampai selesai**
   - Akan muncul pesan: "✅ Database seeded successfully!"
   - File `ewallet.db` akan dibuat di folder `database`

**✅ Selesai! Database sudah siap.**

---

### ✅ STEP 2: Install Dependencies (Hanya Sekali)

Kita perlu install dependencies di **6 lokasi berbeda**. Jalankan satu per satu:

#### 2.1 Install di Root Folder

**Lokasi:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\
```

**File yang ada:**
- `package.json`

**Cara:**
```bash
cd "C:\Users\ruzia\Documents\TUGAS UTS EAI"
npm install
```
Tunggu selesai (1-2 menit)

---

#### 2.2 Install di Gateway

**Lokasi:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\gateway\
```

**File yang ada:**
- `package.json`
- `server.js`

**Cara:**
```bash
cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\gateway"
npm install
```
Tunggu selesai

---

#### 2.3 Install di User Service

**Lokasi:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\services\user-service\
```

**File yang ada:**
- `package.json`
- `server.js`

**Cara:**
```bash
cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\services\user-service"
npm install
```
Tunggu selesai

---

#### 2.4 Install di Wallet Service

**Lokasi:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\services\wallet-service\
```

**File yang ada:**
- `package.json`
- `server.js`

**Cara:**
```bash
cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\services\wallet-service"
npm install
```
Tunggu selesai

---

#### 2.5 Install di Transaction Service

**Lokasi:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\services\transaction-service\
```

**File yang ada:**
- `package.json`
- `server.js`

**Cara:**
```bash
cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\services\transaction-service"
npm install
```
Tunggu selesai

---

#### 2.6 Install di Frontend

**Lokasi:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\frontend\
```

**File yang ada:**
- `package.json`
- `vite.config.js`
- Folder `src\`

**Cara:**
```bash
cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\frontend"
npm install
```
Tunggu selesai (bisa lebih lama, 2-3 menit)

---

**✅ Semua dependencies sudah terinstall!**

---

### ✅ STEP 3: Menjalankan Services (5 Terminal Terpisah)

**PENTING:** Buka **5 terminal terpisah**. Setiap service harus running di terminal sendiri.

---

#### 🟢 TERMINAL 1: API Gateway

**File yang Dijalankan:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\gateway\server.js
```

**Cara Menjalankan:**

1. **Buka Terminal Baru** (Terminal 1)
   - Tekan `Win + R` → ketik `cmd` → Enter
   - Atau buka folder `gateway`, klik kanan → "Open in Terminal"

2. **Navigasi ke folder gateway:**
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\gateway"
   ```

3. **Jalankan server.js:**
   ```bash
   npm start
   ```
   Atau:
   ```bash
   node server.js
   ```

4. **Tunggu sampai muncul:**
   ```
   🚀 API Gateway running on port 3000
      User Service: http://localhost:3001
      Wallet Service: http://localhost:3002
      Transaction Service: http://localhost:3003
   ```

5. **JANGAN TUTUP TERMINAL INI!** Biarkan tetap terbuka.

**✅ Terminal 1 selesai!**

---

#### 🟢 TERMINAL 2: User Service

**File yang Dijalankan:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\services\user-service\server.js
```

**Cara Menjalankan:**

1. **Buka Terminal Baru** (Terminal 2)
   - Tekan `Win + R` → ketik `cmd` → Enter

2. **Navigasi ke folder user-service:**
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\services\user-service"
   ```

3. **Jalankan server.js:**
   ```bash
   npm start
   ```
   Atau:
   ```bash
   node server.js
   ```

4. **Tunggu sampai muncul:**
   ```
   👤 User Service running on port 3001
   ```

5. **JANGAN TUTUP TERMINAL INI!** Biarkan tetap terbuka.

**✅ Terminal 2 selesai!**

---

#### 🟢 TERMINAL 3: Wallet Service

**File yang Dijalankan:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\services\wallet-service\server.js
```

**Cara Menjalankan:**

1. **Buka Terminal Baru** (Terminal 3)
   - Tekan `Win + R` → ketik `cmd` → Enter

2. **Navigasi ke folder wallet-service:**
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\services\wallet-service"
   ```

3. **Jalankan server.js:**
   ```bash
   npm start
   ```
   Atau:
   ```bash
   node server.js
   ```

4. **Tunggu sampai muncul:**
   ```
   💰 Wallet Service running on port 3002
   ```

5. **JANGAN TUTUP TERMINAL INI!** Biarkan tetap terbuka.

**✅ Terminal 3 selesai!**

---

#### 🟢 TERMINAL 4: Transaction Service

**File yang Dijalankan:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\services\transaction-service\server.js
```

**Cara Menjalankan:**

1. **Buka Terminal Baru** (Terminal 4)
   - Tekan `Win + R` → ketik `cmd` → Enter

2. **Navigasi ke folder transaction-service:**
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\services\transaction-service"
   ```

3. **Jalankan server.js:**
   ```bash
   npm start
   ```
   Atau:
   ```bash
   node server.js
   ```

4. **Tunggu sampai muncul:**
   ```
   💳 Transaction Service running on port 3003
   ```

5. **JANGAN TUTUP TERMINAL INI!** Biarkan tetap terbuka.

**✅ Terminal 4 selesai!**

---

#### 🟢 TERMINAL 5: Frontend

**File yang Dijalankan:**
```
C:\Users\ruzia\Documents\TUGAS UTS EAI\frontend\
```
(File utama: `src/main.jsx`, tapi dijalankan via `npm start`)

**Cara Menjalankan:**

1. **Buka Terminal Baru** (Terminal 5 - TERAKHIR!)
   - Tekan `Win + R` → ketik `cmd` → Enter

2. **Navigasi ke folder frontend:**
   ```bash
   cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\frontend"
   ```

3. **Jalankan frontend:**
   ```bash
   npm start
   ```
   Atau:
   ```bash
   npm run dev
   ```

4. **Tunggu sampai muncul:**
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

5. **JANGAN TUTUP TERMINAL INI!** Biarkan tetap terbuka.

**✅ Terminal 5 selesai!**

---

## 🎉 STEP 4: Akses Aplikasi

Setelah **SEMUA 5 TERMINAL** menunjukkan pesan "running" atau "ready":

1. **Buka Browser** (Chrome, Firefox, Edge, dll)
2. **Ketik di address bar:**
   ```
   http://localhost:5173
   ```
3. **Tekan Enter**

**Aplikasi E-Wallet akan muncul!** 🎊

---

## 📋 Ringkasan File yang Dijalankan

| No | Terminal | File yang Dijalankan | Lokasi Lengkap |
|---|---|---|---|
| Setup | - | `seed.js` | `C:\Users\ruzia\Documents\TUGAS UTS EAI\database\seed.js` |
| 1 | Terminal 1 | `server.js` | `C:\Users\ruzia\Documents\TUGAS UTS EAI\gateway\server.js` |
| 2 | Terminal 2 | `server.js` | `C:\Users\ruzia\Documents\TUGAS UTS EAI\services\user-service\server.js` |
| 3 | Terminal 3 | `server.js` | `C:\Users\ruzia\Documents\TUGAS UTS EAI\services\wallet-service\server.js` |
| 4 | Terminal 4 | `server.js` | `C:\Users\ruzia\Documents\TUGAS UTS EAI\services\transaction-service\server.js` |
| 5 | Terminal 5 | `npm start` | `C:\Users\ruzia\Documents\TUGAS UTS EAI\frontend\` |

---

## 🖼️ Visual Guide: Cara Buka File di File Explorer

### Cara 1: Via File Explorer

1. **Buka File Explorer** (Win + E)
2. **Navigasi ke:**
   ```
   C:\Users\ruzia\Documents\TUGAS UTS EAI
   ```
3. **Masuk ke folder yang diinginkan:**
   - Untuk Gateway: klik folder `gateway` → lihat file `server.js`
   - Untuk User Service: klik `services` → `user-service` → lihat file `server.js`
   - Untuk Wallet Service: klik `services` → `wallet-service` → lihat file `server.js`
   - Untuk Transaction Service: klik `services` → `transaction-service` → lihat file `server.js`
   - Untuk Frontend: klik folder `frontend`
   - Untuk Database: klik folder `database` → lihat file `seed.js`

### Cara 2: Via Terminal (Command Prompt)

**Contoh untuk Gateway:**
```bash
# Buka Command Prompt
cd "C:\Users\ruzia\Documents\TUGAS UTS EAI\gateway"
dir
# Akan muncul list file, termasuk server.js
```

---

## 🎯 Checklist Sebelum Menjalankan

- [ ] Node.js sudah terinstall (`node --version` berhasil)
- [ ] Sudah install dependencies di semua folder
- [ ] Sudah setup database (jalankan `seed.js`)
- [ ] Siap membuka 5 terminal terpisah

---

## 🎯 Checklist Saat Menjalankan

- [ ] Terminal 1: Gateway running (port 3000) ✅
- [ ] Terminal 2: User Service running (port 3001) ✅
- [ ] Terminal 3: Wallet Service running (port 3002) ✅
- [ ] Terminal 4: Transaction Service running (port 3003) ✅
- [ ] Terminal 5: Frontend running (port 5173) ✅
- [ ] Browser terbuka di http://localhost:5173 ✅

---

## 🛑 Cara Stop Aplikasi

Untuk menghentikan semua service:

1. **Kembali ke semua 5 terminal**
2. **Di setiap terminal, tekan:**
   ```
   Ctrl + C
   ```
3. **Atau tutup semua terminal**

---

## 💡 Tips

1. **Jangan tutup terminal** saat aplikasi running
2. **Urutan tidak terlalu penting**, tapi lebih baik mulai dari Gateway
3. **Jika error**, baca pesan error di terminal untuk tahu masalahnya
4. **Untuk development**, biarkan semua terminal terbuka
5. **Gunakan script `start-all.bat`** untuk memudahkan (akan buka semua otomatis)

---

## 📝 Catatan Penting

- **File `server.js`** di setiap service adalah file utama yang dijalankan
- **File `package.json`** berisi script `npm start` yang menjalankan `server.js`
- **File `seed.js`** hanya dijalankan sekali untuk setup database
- **Frontend** dijalankan via `npm start` (bukan langsung file)

---

**Selamat mencoba! Ikuti langkah-langkah di atas dengan teliti!** 🚀


