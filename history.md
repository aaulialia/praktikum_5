# Riwayat Sesi

## 2026-11-16
- **Dikerjakan:** Membuat dokumen awal `agent.md`, `spec.md`, `plan.md`, dan `history.md`; belum menulis kode.
- **Keputusan:** Stack ditetapkan React + Vite, Supabase Auth dan database dengan RLS, GitHub, serta Vercel. Tugas memiliki status `todo`/`in_progress`/`done` dan prioritas `low`/`medium`/`high`.
- **Masalah:** Belum ada masalah yang diketahui; implementasi belum dimulai.
- **Langkah berikutnya:** Minta review dan persetujuan dokumen. Setelah disetujui, mulai tahap setup proyek sesuai `plan.md`.

## 2026-11-16 — Tahap 1: Setup proyek
- **Dikerjakan:** Membuat scaffold React + Vite + TypeScript, memasang dependensi, menyiapkan struktur `src/` dan `supabase/migrations/`, `.env.example`, serta aturan `.gitignore` untuk mengabaikan file environment selain contoh. Mengganti judul halaman menjadi `Task Manager`.
- **Keputusan:** Menggunakan template React + TypeScript resmi Vite dan mempertahankan konfigurasi TypeScript/Vite yang dihasilkan.
- **Masalah:** `npm run lint` tidak dapat berjalan karena kebijakan Application Control memblokir native binding Oxlint pada Windows. `npm run build` berhasil. Server lokal menjawab HTTP 200. Git tidak tersedia di PATH.
- **Langkah berikutnya:** Tahap 1 selesai; lanjut ke tahap database dan autentikasi setelah diminta.

## 2026-11-16 — Konfigurasi Git lokal
- **Dikerjakan:** Menemukan Git for Windows yang tidak terdaftar di `PATH` dan mengatur identitas Git global sesuai perintah pengguna.
- **Keputusan:** Menjalankan Git melalui `C:\Program Files\Git\cmd\git.exe`; tidak mengubah konfigurasi maupun file proyek lain.
- **Masalah:** Perintah `git` belum dapat dipanggil langsung dari PowerShell karena folder Git belum ada di `PATH`. Teks `>>` adalah prompt lanjutan PowerShell dan tidak boleh diketik sebagai bagian perintah.
- **Langkah berikutnya:** Tambahkan `C:\Program Files\Git\cmd` ke `PATH` pengguna agar perintah `git` dapat dijalankan dari terminal baru.

## 2026-11-16 — Tahap 2: Database dan autentikasi
- **Dikerjakan:** Menambahkan dependency `@supabase/supabase-js`, klien bertipe yang membaca konfigurasi dari environment, state/pemulihan sesi, registrasi, login, logout, form autentikasi dasar, dan gerbang konten terlindungi. Menambahkan migrasi `tasks` dengan constraint, trigger `updated_at`, grant, RLS, dan kebijakan akses per pemilik.
- **Keputusan:** Kredensial tetap lokal di `.env` (tidak dibuat atau di-commit); migrasi disiapkan sebagai file lokal. Auth menggunakan email/password Supabase.
- **Masalah:** `npm run build` berhasil. `npm run lint` masih terhalang kebijakan Application Control yang memblokir native binding Oxlint. Migrasi dan alur autentikasi belum diuji terhadap proyek Supabase nyata karena environment URL/key belum disediakan; migration belum dijalankan ke database remote.
- **Langkah berikutnya:** Lanjutkan Tahap 3 (CRUD tugas) setelah menyiapkan konfigurasi Supabase dan meminta tahap berikutnya.

## 2026-11-16 — Uji koneksi Supabase
- **Dikerjakan:** Memeriksa keberadaan variabel `.env` tanpa menampilkan nilainya dan menguji endpoint Auth menggunakan public key; endpoint menerima koneksi (HTTP 200). Melakukan probe REST `tasks` dengan limit nol (HTTP 404).
- **Keputusan:** Tidak melakukan login, menulis data, atau mengirim kredensial rahasia. `.env` diabaikan oleh `.gitignore`.
- **Masalah:** API Auth dapat dijangkau, tetapi resource `tasks` belum tersedia melalui REST API; migrasi lokal belum diterapkan atau schema belum terpapar.
- **Langkah berikutnya:** Terapkan migrasi `supabase/migrations/20261116100000_create_tasks.sql` lewat Supabase SQL Editor/CLI dengan akses database yang sesuai, lalu uji ulang tabel dan alur auth.

## 2026-11-16 — Verifikasi Tahap 2 oleh pengguna
- **Dikerjakan:** Pengguna mengonfirmasi migrasi `tasks` telah dijalankan di Supabase, tabel tersedia dan RLS aktif; registrasi, login, logout, serta persistensi sesi telah diuji dan berhasil. Review migrasi diterima.
- **Keputusan:** Menandai seluruh Tahap 2 selesai dan menambahkan larangan eksplisit memakai `service_role` key di frontend pada `agent.md`.
- **Masalah:** Tidak ada masalah yang dilaporkan pada migrasi maupun alur autentikasi.
- **Langkah berikutnya:** Menunggu persetujuan rencana Tahap 3 (CRUD tugas) sebelum mengubah kode.

## 2026-11-16 — Rencana Tahap 3
- **Dikerjakan:** Mengajukan rencana CRUD tugas dan uji isolasi akses antara pengguna A dan B.
- **Keputusan:** Rencana belum disetujui pengguna; tidak ada kode Tahap 3 yang ditulis.
- **Masalah:** Belum ada masukan rinci tentang bagian rencana yang perlu diubah.
- **Langkah berikutnya:** Menunggu arahan atau persetujuan pengguna sebelum implementasi Tahap 3.

## 2026-11-16 — Perbaikan PATH Git
- **Dikerjakan:** Menambahkan `C:\Program Files\Git\cmd` ke User PATH tanpa mengganti entri lain, lalu menjalankan `git --version` dengan hasil berhasil.
- **Keputusan:** Tidak mengubah file konfigurasi Git atau proyek.
- **Masalah:** Terminal yang sudah terbuka mungkin belum mewarisi User PATH terbaru.
- **Langkah berikutnya:** Buka terminal baru (atau mulai ulang VS Code jika perlu), lalu jalankan `git --version`.

## 2026-11-16 — Persiapan push GitHub
- **Dikerjakan:** Menginisialisasi repository lokal pada branch `main`, memverifikasi `.env` diabaikan dan tidak staged, memastikan production build berhasil, membuat commit awal `d6276f0`, mengonfigurasi `origin` ke `https://github.com/aaulialia/praktikum_5.git`, dan push branch `main`.
- **Keputusan:** Menggunakan branch `main`; file `.env`, `node_modules`, dan `dist` tidak disertakan. Autentikasi dilakukan melalui Git Credential Manager setelah pengguna menyetujui scope OAuth yang ditampilkan GitHub.
- **Masalah:** Push awal tertahan karena sesi autentikasi belum tersedia; setelah otorisasi, push berhasil dan remote branch cocok dengan commit lokal.
- **Langkah berikutnya:** Repository sudah tersedia di GitHub; lanjutkan pengembangan sesuai tahap yang disetujui.
