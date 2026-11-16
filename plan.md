# Rencana Pengerjaan

## 1. Setup proyek
- [x] Inisialisasi React + Vite dengan TypeScript.
- [x] Tambahkan struktur folder dan konfigurasi dasar.
- [x] Siapkan `.env.example` untuk URL Supabase dan anon key (tanpa nilai rahasia).
- [x] Pastikan proyek dapat dijalankan dan dibangun secara lokal.

## 2. Database dan autentikasi
- [x] Buat migrasi tabel `tasks`, constraint, dan mekanisme pembaruan `updated_at`.
- [x] Aktifkan RLS dan tambahkan kebijakan akses per pemilik.
- [x] Konfigurasikan klien Supabase dengan variabel lingkungan.
- [x] Implementasikan registrasi, login, logout, dan pemulihan sesi.
- [x] Lindungi halaman aplikasi dari akses tanpa autentikasi.
- [x] Terapkan migrasi di Supabase dan verifikasi RLS, autentikasi, serta persistensi sesi.

## 3. CRUD tugas
- [ ] Definisikan tipe dan validasi data tugas.
- [ ] Implementasikan daftar, tambah, detail, edit, dan hapus tugas.
- [ ] Implementasikan perubahan status dan penanganan deadline/prioritas.
- [ ] Tampilkan state loading, kosong, sukses, dan error.
- [ ] Verifikasi bahwa pengguna hanya dapat membaca dan mengubah tugas miliknya.

## 4. UI dan pengalaman pengguna
- [ ] Buat halaman autentikasi dan halaman daftar tugas.
- [ ] Tambahkan form tugas dengan seluruh field sesuai spesifikasi.
- [ ] Tambahkan filter status/prioritas dan pencarian judul/deskripsi.
- [ ] Buat layout responsif untuk ponsel, tablet, dan desktop.
- [ ] Periksa aksesibilitas dasar dan alur utama secara manual.

## 5. Validasi dan deploy
- [ ] Jalankan pemeriksaan tipe, lint, test, dan production build yang tersedia.
- [ ] Siapkan proyek Supabase untuk lingkungan deployment.
- [ ] Hubungkan repository GitHub ke Vercel.
- [ ] Atur environment variables di Vercel tanpa mengekspos rahasia.
- [ ] Deploy dan verifikasi registrasi/login serta CRUD pada URL produksi.
- [ ] Catat hasil, keputusan, masalah, dan langkah berikutnya di `history.md`.
