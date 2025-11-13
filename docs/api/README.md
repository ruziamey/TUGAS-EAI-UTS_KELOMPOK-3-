# API Documentation

Dokumentasi API lengkap untuk E-Wallet Digital Payment Service.

## Akses Dokumentasi

### Swagger UI (Recommended)
1. Jalankan API Gateway: `npm run start:gateway`
2. Buka browser: http://localhost:3000/api-docs
3. Gunakan "Try it out" untuk test endpoint secara interaktif

### OpenAPI Specification
File: `docs/api/openapi.yaml`

Format: OpenAPI 3.0.0

## Endpoint Overview

### User Service
- `POST /api/users/register` - Registrasi user baru
- `POST /api/users/login` - Login dan dapatkan token
- `GET /api/users/profile` - Get profil user (requires auth)
- `GET /api/users` - Get semua users (testing)

### Wallet Service
- `GET /api/wallets/balance` - Get saldo wallet (requires auth)
- `POST /api/wallets/topup` - Top up saldo (requires auth)
- `POST /api/wallets/deduct` - Deduct saldo (internal use)
- `GET /api/wallets/:userId` - Get wallet by user ID

### Transaction Service
- `POST /api/transactions/payment` - Kirim pembayaran (requires auth)
- `GET /api/transactions/history` - Riwayat transaksi (requires auth)
- `GET /api/transactions/:transactionId` - Get transaksi by ID (requires auth)
- `GET /api/transactions` - Get semua transaksi (testing)

## Authentication

Kebanyakan endpoint memerlukan authentication menggunakan JWT token.

**Cara menggunakan:**
1. Login via `POST /api/users/login` untuk mendapatkan token
2. Include token di header: `Authorization: Bearer <token>`
3. Include user ID di header: `x-user-id: <user_id>`

## Contoh Request/Response

Lihat file `openapi.yaml` untuk contoh lengkap setiap endpoint, atau gunakan Swagger UI untuk melihat dan test secara interaktif.



