# Spesifikasi Produk

## Ringkasan
Website pencatatan tugas pribadi yang memungkinkan pengguna mengelola tugas setelah registrasi atau login. Frontend dibuat dengan React (Vite), Supabase digunakan untuk autentikasi dan penyimpanan data, kode dikelola di GitHub, dan aplikasi di-deploy ke Vercel.

## Fitur
- Registrasi akun dan login menggunakan email dan kata sandi melalui Supabase Auth.
- Logout dan akses halaman aplikasi hanya untuk pengguna yang sudah login.
- CRUD tugas milik pengguna:
  - Judul (wajib).
  - Deskripsi (opsional).
  - Status: `todo`, `in_progress`, atau `done`.
  - Prioritas: `low`, `medium`, atau `high`.
  - Deadline (opsional).
- Filter tugas berdasarkan status dan prioritas.
- Pencarian tugas berdasarkan judul dan deskripsi.
- Tampilan responsif untuk ponsel, tablet, dan desktop.
- Berikan umpan balik yang jelas untuk loading, data kosong, dan kegagalan operasi.

## Skema Supabase

Supabase Auth mengelola identitas pengguna pada `auth.users`. Tabel aplikasi:

### `public.tasks`

| Kolom | Tipe | Aturan |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `user_id` | `uuid` | Wajib, foreign key ke `auth.users(id)` dengan `on delete cascade` |
| `title` | `text` | Wajib, tidak boleh kosong |
| `description` | `text` | Opsional |
| `status` | `text` | Wajib, default `todo`, nilai yang diizinkan: `todo`, `in_progress`, `done` |
| `priority` | `text` | Wajib, default `medium`, nilai yang diizinkan: `low`, `medium`, `high` |
| `deadline` | `timestamptz` | Opsional |
| `created_at` | `timestamptz` | Wajib, default waktu saat ini |
| `updated_at` | `timestamptz` | Wajib, default waktu saat ini dan diperbarui saat record berubah |

Aktifkan Row Level Security (RLS). Kebijakan `SELECT`, `INSERT`, `UPDATE`, dan `DELETE` harus membatasi akses pada baris dengan `user_id = auth.uid()`; operasi insert juga harus memastikan `user_id` milik pengguna yang sedang login. Jangan menaruh service-role key di frontend.

## Alur pengguna
1. Pengguna membuka aplikasi dan memilih registrasi atau login.
2. Setelah autentikasi berhasil, pengguna masuk ke daftar tugas miliknya.
3. Pengguna membuat tugas dengan judul dan, bila diperlukan, deskripsi, status, prioritas, dan deadline.
4. Pengguna mencari atau memfilter daftar, lalu melihat, mengubah, menandai selesai, atau menghapus tugas.
5. Perubahan tersimpan di Supabase dan hanya dapat diakses oleh pemilik tugas.
6. Pengguna dapat logout; sesi terlindungi tidak lagi dapat diakses tanpa login kembali.

## Di luar cakupan awal
- Kolaborasi atau berbagi tugas antar pengguna.
- Notifikasi deadline, lampiran, dan sinkronisasi kalender.
