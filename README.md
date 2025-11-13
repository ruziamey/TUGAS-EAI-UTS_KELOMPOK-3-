*** End Patch
```bash
cd frontend
npm install
npm run build
npm run preview
```

### Halaman/Komponen

1. **Login Page** (`/login`)
   - Form login dan registrasi
   - Autentikasi dengan User Service via API Gateway

2. **Dashboard** (`/dashboard`)
   - Menampilkan saldo wallet (dari Wallet Service)
   - Menampilkan transaksi terbaru (dari Transaction Service)
   - Quick actions

3. **Wallet Page** (`/wallet`)
   - Menampilkan saldo saat ini (dari Wallet Service)
   - Form top up saldo
   - Informasi wallet

4. **Transactions Page** (`/transactions`)
   - Form kirim pembayaran (ke Transaction Service)
   - Riwayat transaksi lengkap (dari Transaction Service)

### Teknologi Frontend

- **React 18** - UI Framework
- **React Router** - Routing
- **Axios** - HTTP Client
- **Vite** - Build Tool
- **CSS** - Styling

### API Integration

Frontend **hanya** berkomunikasi dengan **API Gateway** (http://localhost:3000/api), tidak langsung ke services.

## Testing

### Manual Testing

1. **Test User Registration:**
   - Buka http://localhost:5173
   - Klik "Register"
   - Isi form dan submit

2. **Test Login:**
   - Login dengan: `alice` / `password123`
   - Atau user lain dari seed data

3. **Test Wallet:**
   - Navigate ke Wallet page
   - Lihat saldo
   - Lakukan top up

4. **Test Transactions:**
   - Navigate ke Transactions page
   - Kirim payment ke user lain (gunakan user ID: 2 atau 3)
   - Lihat riwayat transaksi

### API Testing dengan Swagger UI

1. Buka http://localhost:3000/api-docs
2. Gunakan "Try it out" untuk test setiap endpoint
3. Untuk endpoint yang memerlukan auth, gunakan token dari login response

## Struktur Project

```
.
├── gateway/                 # API Gateway
│   ├── server.js
│   └── package.json
├── services/
│   ├── user-service/        # User Service
│   │   ├── server.js
│   │   └── package.json
│   ├── wallet-service/      # Wallet Service
│   │   ├── server.js
│   │   └── package.json
│   └── transaction-service/ # Transaction Service
│       ├── server.js
│       └── package.json
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Wallet.jsx
│   │   │   └── Transactions.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/                # Database
│   ├── schema.sql
│   ├── seed.js
│   ├── package.json
│   └── ewallet.db          # Generated after seed
├── docs/
│   └── api/
│       └── openapi.yaml    # API Documentation
├── package.json            # Root package.json
└── README.md               # This file
```

## Troubleshooting

### Port Already in Use
Jika port sudah digunakan, ubah di:
- Gateway: `gateway/.env` atau `gateway/server.js`
- Services: Environment variable `PORT` atau langsung di `server.js`

### Database Error
- Pastikan sudah run `npm run seed` di folder `database`
- Pastikan file `database/ewallet.db` ada
- Jika error, hapus `ewallet.db` dan run seed lagi

### CORS Error
- Pastikan semua services sudah running
- Pastikan API Gateway running di port 3000
- Frontend sudah dikonfigurasi untuk proxy ke gateway

### Service Tidak Terhubung
- Pastikan semua services running sebelum start frontend
- Check log di setiap terminal untuk error
- Pastikan URL service di gateway benar

## License

ISC

## Kontributor

Tim Development E-Wallet Digital Payment Service

---

**Selamat menggunakan E-Wallet! 🎉**



>>>>>>> 46800f8 (Initial commit)
