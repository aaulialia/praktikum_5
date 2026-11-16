# Panduan AI Proyek

## Aturan wajib
- Gunakan React dengan Vite untuk frontend dan Supabase untuk database serta autentikasi.
- Gunakan GitHub untuk version control dan Vercel untuk deployment.
- Sebelum memulai pekerjaan pada setiap sesi, baca `spec.md`, `plan.md`, dan `history.md`.
- Di akhir setiap sesi, perbarui `history.md` dengan pekerjaan, keputusan, masalah, dan langkah berikutnya.
- Jangan mengubah kebutuhan di `spec.md` tanpa izin pengguna.
- Jangan pernah menambahkan atau melakukan commit file `.env` maupun rahasia/credential. Sediakan `.env.example` hanya dengan nama variabel dan nilai contoh yang aman.
- Jangan pernah menggunakan atau mengekspos `service_role` key di frontend, kode klien, atau variabel `VITE_*`; frontend hanya boleh memakai public anon/publishable key.

## Struktur folder
Pertahankan struktur sederhana berikut; sesuaikan hanya jika kebutuhan yang disetujui mengharuskannya.

```text
/
├── agent.md
├── spec.md
├── plan.md
├── history.md
├── src/
│   ├── components/     # Komponen UI yang dapat digunakan ulang
│   ├── pages/          # Halaman dan route
│   ├── hooks/          # Hook React
│   ├── lib/            # Klien Supabase dan utilitas
│   ├── types/          # Tipe TypeScript
│   ├── App.tsx
│   └── main.tsx
├── public/
└── supabase/
    └── migrations/     # Migrasi skema dan kebijakan database
```

## Gaya kode
- Utamakan TypeScript, komponen fungsional React, dan nama yang deskriptif.
- Ikuti format, pola, dan konvensi yang sudah ada di proyek; pilih solusi yang kecil dan mudah dirawat.
- Pisahkan tanggung jawab UI, akses data, dan validasi. Tangani kondisi loading, kosong, dan error secara jelas.
- Jangan menambahkan dependensi atau abstraksi tanpa kebutuhan yang nyata.

## Commit
- Gunakan commit kecil dengan pesan imperatif yang menjelaskan perubahan, misalnya `Add task filters`.
- Jangan memasukkan perubahan yang tidak terkait dalam commit.
- Pastikan `.env`, token, kunci, dan credential tidak ikut ter-stage atau ter-commit.
- Jangan membuat commit kecuali diminta atau alur kerja yang disepakati memerlukannya.
