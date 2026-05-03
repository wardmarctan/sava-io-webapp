# SAVA.IO - Banking Portal Web Application

SAVA.IO adalah aplikasi perbankan modern yang dirancang untuk mengelola nasabah, rekening, dan transaksi perbankan dengan desain premium dan sistem keamanan yang andal.

## Teknologi Utama

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7.
- **Backend**: Go (Golang), Echo Framework, GORM (ORM), SQLite.
- **State Management**: React Hooks & Context API.
- **UI/UX**: Custom Design System dengan tema *Deep Indigo*, Glassmorphism, dan Micro-animations.

## Struktur Proyek

Proyek ini menggunakan struktur monorepo sederhana:

```text
sava-io-webapp/
├── frontend/             # Aplikasi Frontend (React)
│   ├── src/
│   │   ├── app/routes/   # Modul fitur (Dashboard, Accounts, etc)
│   │   ├── components/   # Komponen UI Reusable
│   │   ├── lib/api/      # Service API (Axios)
│   │   └── index.css     # Pusat Design System
├── backend/              # Aplikasi Backend (Go)
│   ├── cmd/server/       # Entry point aplikasi
│   ├── internal/
│   │   ├── controller/   # Handler API
│   │   ├── service/      # Logika Bisnis
│   │   ├── repository/   # Akses Database
│   │   └── entity/       # Model Database
└── README.md
```

## Cara Menjalankan Proyek

### 1. Persiapan
Pastikan Anda sudah menginstal **Node.js** dan **Go** di komputer Anda.

### 2. Instalasi Dependensi
Jalankan perintah ini di root direktori proyek:
```bash
npm install
```

### 3. Menjalankan Aplikasi
Anda dapat menjalankan frontend dan backend secara bersamaan menggunakan perintah:
```bash
npm run dev
```

Atau secara terpisah:
- **Frontend**: `npm run dev:frontend` (Berjalan di `http://localhost:5173/sava-io/`)
- **Backend**: `npm run dev:backend` (Berjalan di `http://localhost:3456`)

## Fitur Utama

- **Dashboard**: Ringkasan data bank dan grafik statistik.
- **Manajemen Nasabah**: CRUD data nasabah perbankan.
- **Manajemen Akun**: Pembukaan rekening baru dengan berbagai tipe deposito.
- **Sistem Transaksi**: Dukungan untuk Setoran (Deposit) dan Penarikan (Withdraw) dengan perhitungan bunga otomatis.
- **Riwayat Transaksi**: Laporan transaksi lengkap dengan filter per akun.

## Dokumentasi API (Postman)

Hampir semua endpoint menggunakan metode **POST** untuk keamanan dan konsistensi data.
- **Base URL**: `http://localhost:3456/api`
- **Auth**: `/api/auth/login` (admin/123456)
- **API List**: Lihat dokumentasi lengkap di koleksi Postman yang telah dibuat.

