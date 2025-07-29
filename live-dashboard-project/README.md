# Live Dashboard Monitoring 📊

Sebuah aplikasi web full-stack yang menampilkan metrik sistem (CPU & Logs) secara real-time menggunakan arsitektur modern. Proyek ini dibangun untuk mendemonstrasikan implementasi WebSockets, autentikasi JWT, dan interaksi database dalam satu aplikasi yang utuh.

---

![Live Dashboard Screenshot](https://ibb.co/rGmjVSSB)
_(Tips: Ganti URL gambar di atas dengan screenshot proyek Anda sendiri)_

---

## ## Fitur Utama

- **🔐 Autentikasi Pengguna Aman:** Sistem login yang dilindungi dengan password hashing (Bcrypt) dan otorisasi berbasis **JSON Web Tokens (JWT)**.
- **📊 Visualisasi Data Real-Time:** Grafik dan log diperbarui secara langsung tanpa perlu me-refresh halaman, diimplementasikan menggunakan **WebSockets**.
- **🗃️ Database Persisten:** Data pengguna disimpan dan divalidasi menggunakan database **SQLite** yang dikelola oleh query builder **Knex.js**.
- **🚀 Arsitektur Full-Stack Modern:** Backend (Node.js/Fastify) dan Frontend (Next.js) yang terpisah (decoupled), memungkinkan skalabilitas dan maintenance yang lebih mudah.
- **📱 Desain Responsif:** Tampilan yang dapat beradaptasi dengan baik di berbagai ukuran layar.
- **☁️ Siap Produksi:** Dideploy sepenuhnya ke platform cloud Vercel & Render dengan konfigurasi environment variables.

---

## ## Arsitektur Proyek

Aplikasi ini menggunakan arsitektur client-server yang terpisah untuk memaksimalkan performa dan fleksibilitas.

```
+----------------+      (HTTPS)       +---------------------+      (SQL)      +-------------+
|                |------------------->|                     |---------------->|             |
|   Frontend     |      (REST API)    |   Backend Server    |                 |   SQLite    |
| (Next.js on    |                    |   (Node.js/Fastify  |                 |  Database   |
|    Vercel)     |<-------------------|      on Render)     |<----------------| (Persistent |
|                |      (WebSocket)   |                     |                 |    Disk)    |
+----------------+      (WSS)        +---------------------+                 +-------------+
```

---

## ## Teknologi yang Digunakan

**Frontend:**

- **Framework**: Next.js (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Visualisasi Data**: Recharts
- **State Management**: React Hooks (`useState`, `useEffect`)

**Backend:**

- **Framework**: Fastify
- **Bahasa**: Node.js
- **Real-time**: WebSockets (via `ws`)
- **Autentikasi**: JWT & Bcrypt.js

**Database & ORM:**

- **Database**: SQLite 3
- **Query Builder**: Knex.js

**Deployment:**

- **Frontend**: Vercel
- **Backend & Database**: Render

---

## ## Instalasi dan Setup Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

#### **Prasyarat**

- Node.js (v18 atau lebih baru)
- NPM / Yarn / PNPM

#### **1. Clone Repository**

```bash
git clone [https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git](https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git)
cd NAMA_REPO_ANDA
```

#### **2. Setup Backend**

```bash
# Masuk ke direktori backend
cd backend

# Instal dependensi
npm install

# Buat file database dan jalankan migrasi
npm run migrate:latest

# Jalankan server development
npm run dev
```

Backend akan berjalan di `http://localhost:8081`.

#### **3. Setup Frontend**

Buka terminal baru untuk menjalankan frontend.

```bash
# Masuk ke direktori frontend
cd frontend

# Instal dependensi
npm install

# Buat file environment variable
# Salin .env.local.example ke .env.local jika ada, atau buat manual
# Isi .env.local dengan: NEXT_PUBLIC_API_URL=http://localhost:8081

# Jalankan server development
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`.

---

## ## Environment Variables

Untuk menjalankan proyek ini, Anda perlu membuat file `.env` di backend dan `.env.local` di frontend.

#### **Backend (`backend/.env`)**

```
JWT_SECRET=secret_key_anda_yang_sangat_rahasia_dan_panjang
```

#### **Frontend (`frontend/.env.local`)**

```
NEXT_PUBLIC_API_URL=http://localhost:8081
```

---

## ## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.
