# 📮 Panduan Menggunakan Postman untuk Test API E-Wallet

## 🎯 Persiapan

### 1. Install Postman
- Download dari: https://www.postman.com/downloads/
- Install aplikasinya
- Buka Postman

### 2. Pastikan Aplikasi E-Wallet Sudah Running
Sebelum test API, pastikan semua service sudah running:
- ✅ API Gateway (port 3000)
- ✅ User Service (port 3001)
- ✅ Wallet Service (port 3002)
- ✅ Transaction Service (port 3003)

---

## 📥 Step 1: Import Collection & Environment

### Cara Import Collection:

1. Buka Postman
2. Klik **"Import"** di pojok kiri atas
3. Klik tab **"File"**
4. Pilih file: `docs/postman/postman_collection.json`
5. Klik **"Import"**

**Atau drag & drop file** `postman_collection.json` ke Postman

### Cara Import Environment:

1. Di Postman, klik ikon **"Environments"** di sidebar kiri (atau tekan `Ctrl + E`)
2. Klik **"Import"**
3. Pilih file: `docs/postman/postman_environment.json`
4. Klik **"Import"**
5. **PENTING:** Klik environment **"E-Wallet Local"** untuk mengaktifkannya (harus ter-highlight)

---

## 🔧 Step 2: Setup Environment

1. Klik dropdown environment di pojok kanan atas (sekarang seharusnya "E-Wallet Local")
2. Pastikan **"E-Wallet Local"** terpilih
3. Klik ikon **"eye"** untuk melihat variables

**Variables yang ada:**
- `base_url`: `http://localhost:3000/api` (sudah di-set)
- `token`: (akan diisi otomatis setelah login)
- `user_id`: `1` (default, bisa diubah)

---

## 🧪 Step 3: Test API (Urutan yang Disarankan)

### Test 1: Register User (Opsional)

1. Buka collection **"E-Wallet API Collection"**
2. Buka folder **"User Service"**
3. Klik **"Register User"**
4. Klik **"Send"**
5. **Hasil yang diharapkan:**
   - Status: `201 Created`
   - Response berisi `token` dan `user`
   - Token otomatis tersimpan di environment

**Catatan:** Jika user sudah ada, akan error. Skip ke Login.

---

### Test 2: Login (WAJIB - untuk dapat token)

1. Buka **"User Service"** → **"Login"**
2. Body sudah terisi dengan:
   ```json
   {
       "username": "alice",
       "password": "password123"
   }
   ```
3. Klik **"Send"**
4. **Hasil yang diharapkan:**
   - Status: `200 OK`
   - Response:
     ```json
     {
         "message": "Login successful",
         "user": {
             "id": 1,
             "username": "alice",
             "email": "alice@example.com"
         },
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```
5. **Token dan user_id otomatis tersimpan!** ✅

**Cek Environment:**
- Klik ikon "eye" di environment
- Pastikan `token` dan `user_id` sudah terisi

---

### Test 3: Get Profile

1. Buka **"User Service"** → **"Get Profile"**
2. Klik **"Send"**
3. **Hasil yang diharapkan:**
   - Status: `200 OK`
   - Response berisi data profil user

**Catatan:** Endpoint ini menggunakan token dari environment (otomatis).

---

### Test 4: Get Balance

1. Buka **"Wallet Service"** → **"Get Balance"**
2. Klik **"Send"**
3. **Hasil yang diharapkan:**
   - Status: `200 OK`
   - Response:
     ```json
     {
         "user_id": 1,
         "balance": 100000.00,
         "currency": "IDR"
     }
     ```

**Catatan:** Menggunakan `user_id` dari environment.

---

### Test 5: Top Up Wallet

1. Buka **"Wallet Service"** → **"Top Up"**
2. Body sudah terisi dengan:
   ```json
   {
       "amount": 50000
   }
   ```
3. Klik **"Send"**
4. **Hasil yang diharapkan:**
   - Status: `200 OK`
   - Response:
     ```json
     {
         "message": "Top up successful",
         "user_id": 1,
         "new_balance": 150000.00
     }
     ```

---

### Test 6: Send Payment

1. Buka **"Transaction Service"** → **"Send Payment"**
2. Body sudah terisi dengan:
   ```json
   {
       "recipientId": 2,
       "amount": 25000,
       "description": "Payment for services"
   }
   ```
3. **PENTING:** Pastikan `recipientId` adalah user ID yang berbeda (bukan user sendiri)
   - User ID 1 = alice
   - User ID 2 = bob
   - User ID 3 = charlie
4. Klik **"Send"**
5. **Hasil yang diharapkan:**
   - Status: `201 Created`
   - Response berisi detail transaksi

**Catatan:** Pastikan balance cukup untuk transfer!

---

### Test 7: Get Transaction History

1. Buka **"Transaction Service"** → **"Get Transaction History"**
2. Klik **"Send"**
3. **Hasil yang diharapkan:**
   - Status: `200 OK`
   - Response berisi array transaksi

---

### Test 8: Get Transaction by ID

1. Buka **"Transaction Service"** → **"Get Transaction by ID"**
2. URL sudah terisi: `{{base_url}}/transactions/1`
3. Klik **"Send"**
4. **Hasil yang diharapkan:**
   - Status: `200 OK`
   - Response berisi detail transaksi dengan ID 1

---

## 🔍 Cara Cek Response di Postman

### 1. Lihat Status Code
- Di bagian atas response, ada status code (200, 201, 400, dll)
- **Hijau** = Success (2xx)
- **Kuning** = Client Error (4xx)
- **Merah** = Server Error (5xx)

### 2. Lihat Response Body
- Tab **"Body"** menampilkan response
- Pilih format: **Pretty**, **Raw**, atau **Preview**
- **Pretty** = formatted JSON (paling mudah dibaca)

### 3. Lihat Headers
- Tab **"Headers"** menampilkan response headers
- Berguna untuk debug

### 4. Lihat Test Results
- Tab **"Test Results"** menampilkan hasil test script
- Collection ini sudah ada auto-save token

---

## 🛠️ Cara Edit Request

### Ubah Body Request:

1. Klik tab **"Body"**
2. Pilih **"raw"** dan **"JSON"**
3. Edit JSON sesuai kebutuhan
4. Klik **"Send"**

**Contoh - Ubah amount top up:**
```json
{
    "amount": 100000
}
```

### Ubah URL Parameter:

1. Klik tab **"Params"**
2. Edit parameter yang ada
3. Atau edit langsung di URL bar

**Contoh - Ubah user ID di Get Wallet:**
- URL: `{{base_url}}/wallets/2` (untuk user ID 2)

### Ubah Headers:

1. Klik tab **"Headers"**
2. Edit atau tambah header
3. Header penting:
   - `Authorization: Bearer {{token}}` (untuk auth)
   - `x-user-id: {{user_id}}` (untuk user ID)
   - `Content-Type: application/json` (untuk POST/PUT)

---

## 🔐 Cara Manual Set Token

Jika auto-save token tidak bekerja:

1. Login dulu (Test 2)
2. Copy token dari response
3. Klik environment **"E-Wallet Local"**
4. Klik ikon **"eye"** atau edit
5. Paste token ke variable `token`
6. Klik **"Save"**

---

## 📝 Tips & Trik

### 1. Gunakan Variables
- Semua endpoint menggunakan `{{base_url}}`
- Jika pindah server, cukup ubah di environment

### 2. Save Response sebagai Example
- Klik **"Save Response"** → **"Save as Example"**
- Berguna untuk dokumentasi

### 3. Duplicate Request
- Klik kanan request → **"Duplicate"**
- Berguna untuk test dengan data berbeda

### 4. Organize dengan Folders
- Collection sudah diorganisir per service
- Bisa tambah folder sendiri

### 5. Export Collection
- Klik kanan collection → **"Export"**
- Backup collection Anda

---

## ❓ Troubleshooting

### Error: "Could not get response"
**Solusi:** 
- Pastikan semua service sudah running
- Cek `base_url` di environment (harus `http://localhost:3000/api`)

### Error: "401 Unauthorized"
**Solusi:**
- Pastikan sudah login dan token tersimpan
- Cek header `Authorization: Bearer {{token}}`
- Login lagi jika token expired

### Error: "400 Bad Request"
**Solusi:**
- Cek body request (format JSON benar?)
- Cek required fields (username, password, amount, dll)
- Cek value (amount harus > 0, recipientId harus berbeda)

### Error: "404 Not Found"
**Solusi:**
- Cek URL endpoint
- Pastikan service yang dimaksud sudah running
- Cek routing di API Gateway

### Token tidak auto-save
**Solusi:**
- Pastikan environment "E-Wallet Local" aktif
- Cek test script di request "Login" dan "Register"
- Manual set token jika perlu

---

## 📊 Contoh Test Flow Lengkap

1. ✅ **Login** → Dapat token
2. ✅ **Get Balance** → Cek saldo awal
3. ✅ **Top Up** → Tambah saldo
4. ✅ **Get Balance** → Cek saldo baru
5. ✅ **Send Payment** → Transfer ke user lain
6. ✅ **Get Balance** → Cek saldo setelah transfer
7. ✅ **Get Transaction History** → Lihat riwayat

---

## 🎓 Latihan

Coba test scenario berikut:

**Scenario 1: Top Up & Transfer**
1. Login sebagai alice (user_id: 1)
2. Cek balance
3. Top up 100000
4. Transfer 50000 ke bob (user_id: 2)
5. Cek balance lagi
6. Cek transaction history

**Scenario 2: Multiple Users**
1. Login sebagai alice → transfer ke bob
2. Login sebagai bob → cek balance (harus bertambah)
3. Login sebagai bob → transfer ke charlie
4. Login sebagai charlie → cek balance

---

**Selamat testing! 🚀**

Jika ada masalah, cek bagian Troubleshooting atau pastikan semua service running.


