# Taskflow

Taskflow adalah aplikasi pencatatan tugas pribadi dengan React, Vite, TypeScript, dan Supabase. Pengguna dapat mendaftar, masuk, lalu mengelola tugasnya sendiri.

## Fitur

- Registrasi, login, dan logout menggunakan Supabase Auth.
- Tambah, lihat, edit, hapus, dan ubah status tugas.
- Simpan deskripsi, prioritas, dan deadline.
- Cari berdasarkan judul/deskripsi serta filter menurut status/prioritas.
- Tampilan responsif untuk ponsel, tablet, dan desktop.
- Isolasi data per pengguna melalui filter `user_id` dan Row Level Security (RLS).

## Menjalankan secara lokal

1. Pasang dependensi:

   ```sh
   npm install
   ```

2. Salin `.env.example` menjadi `.env`, lalu isi URL proyek Supabase dan anon/publishable key:

   ```text
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```

   File `.env` tidak boleh di-commit. Jangan gunakan `service_role` key di frontend.

3. Jika menyiapkan proyek Supabase baru, jalankan SQL pada `supabase/migrations/20261116100000_create_tasks.sql` di Supabase SQL Editor.

4. Jalankan aplikasi:

   ```sh
   npm run dev
   ```

Buka URL lokal yang ditampilkan Vite. Registrasi dan login dapat memerlukan konfirmasi email sesuai pengaturan Supabase Auth.

## Pemeriksaan

```sh
npm run build
npm run lint
```

`npm run build` menjalankan pemeriksaan TypeScript dan membuat production build.

## Deploy ke Vercel

Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` pada Environment Variables proyek Vercel, lalu redeploy. Variabel lokal di `.env` tidak otomatis tersedia di Vercel.
