# 📘 Panduan Admin Dashboard - De Ritz L'Atelier

## Pengenalan Sistem Manajemen

Selamat datang di dashboard admin De Ritz L'Atelier! Panduan ini akan memandu Anda melalui semua fitur yang tersedia untuk mengelola katalog produk, koleksi, dan pesanan.

---

## 🏠 1. Halaman Utama - Katalog (Catalogue)

### Akses
- Klik tab **"CATALOGUE"** di menu navigasi
- Url: `/admin/dashboard`

### Fitur Utama

#### Melihat Semua Produk
- **Bagian Kiri**: Daftar semua produk (76+ items)
- Setiap produk menampilkan:
  - **Thumbnail gambar** produk
  - **Nama produk** (contoh: "Look 01")
  - **Koleksi** (contoh: "chinese-new-year-2026")
  - **Harga** dalam IDR (Rupiah)
  - **Status publikasi** (Published/Hidden)

#### Tombol Aksi untuk Setiap Produk

| Tombol | Fungsi |
|--------|--------|
| **EDIT** | Ubah detail produk (nama, harga, deskripsi, gambar, dll) |
| **HIDE** | Sembunyikan produk dari website (tidak terlihat pelanggan) |
| **PUBLISH** | Publikasikan produk ke website (jika sembunyikan) |
| **MARK SOLD OUT** | Tandai produk sebagai terjual habis (tombol tidak aktif untuk checkout) |
| **DELETE** | Hapus produk dari katalog (hati-hati: tidak bisa dikembalikan) |

#### Menambahkan Produk Baru

Gulir ke bawah ke bagian **"Add a Piece"** untuk menambahkan produk baru:

##### Field yang Wajib Diisi:

1. **NAME** (Nama)
   - Contoh: "Look 01", "Cream Botanical Batik Kebaya"
   - Harus unik dan jelas

2. **COLLECTION** (Koleksi)
   - Dropdown dengan pilihan: "Chinese New Year 2026" atau "Merona Kebaya Peranakan"
   - Pilih koleksi yang sesuai

3. **DESCRIPTION** (Deskripsi)
   - Textarea untuk menjelaskan detail produk
   - Contoh: "Elegant ivory kebaya peranakan with sophisticated dark navy botanical batik sarong"

4. **BASE PRICE (IDR)** (Harga Dasar)
   - Harga dalam Rupiah (tanpa titik/koma)
   - Contoh: 3500000 (untuk Rp 3.500.000)

5. **IMAGES** (Gambar)
   - Upload minimal 1 gambar
   - Bisa upload multiple gambar dengan keterangan
   - Gambar pertama akan menjadi thumbnail

6. **CHECKBOXES** (Pilihan Tambahan)
   - ☐ "Highlight as New Collection" - Tampilkan di atas dengan badge "NEW"
   - ☐ "Discount Promo" - Tampilkan di atas dengan badge "PROMO"
   - ☐ "Publish immediately" - Langsung tampil di website
   - ☐ "Sold Out (disables Add to Bag on the storefront)" - Produk tidak bisa dibeli

##### Cara Menambahkan Produk:

1. Isi semua field yang diperlukan
2. Upload gambar-gambar produk
3. Centang "Publish immediately" jika ingin langsung tampil
4. Klik tombol **"SAVE PIECE"** di bawah

---

## 📁 2. Koleksi (Collections)

### Akses
- Klik tab **"COLLECTIONS"** di menu navigasi
- Url: `/admin/collections`

### Fitur Utama

#### Melihat Koleksi yang Ada

Di bagian **"Manage Collections"**, Anda bisa melihat:
- Nama koleksi: "Chinese New Year 2026" (83 produk)
- Nama koleksi: "Merona Kebaya Peranakan" (5 produk)

#### Edit Koleksi

Untuk setiap koleksi, Anda bisa:

1. **Ubah Nama** - Ganti nama koleksi
2. **Tambah Caption** - Tambahkan deskripsi koleksi (opsional)
3. **Ubah Gambar** - Upload gambar koleksi (opsional)
4. **SAVE CHANGES** - Simpan perubahan
5. **DELETE** - Hapus koleksi (hati-hati: produk bisa terpengaruh)

#### Menambahkan Koleksi Baru

Di bagian **"Add Collection"**:

1. Masukkan **COLLECTION NAME** (Nama Koleksi)
   - Contoh: "Summer 2026", "Wedding Collection"

2. Masukkan **COLLECTION CAPTION** (Opsional)
   - Deskripsi singkat koleksi
   - Contoh: "Koleksi eksklusif untuk musim panas"

3. Upload **COLLECTION IMAGE** (Opsional)
   - Gambar yang mewakili koleksi
   - Akan ditampilkan di halaman website

4. Klik **"ADD COLLECTION"**

---

## 📦 3. Pesanan (Orders)

### Akses
- Klik tab **"ORDERS"** di menu navigasi
- Url: `/admin/orders`

### Melihat Pesanan

#### Informasi Pesanan
Setiap pesanan menampilkan:
- **Status pesanan** (pending, processing, shipped, delivered, refunded)
- **Nama pelanggan**
- **Items** - Produk yang dipesan dengan:
  - 📸 Gambar thumbnail (64x80px)
  - Nama produk
  - Jumlah
  - Harga
- **Total harga**
- **Tanggal pesanan**

#### Mengubah Status Pesanan

Untuk setiap pesanan, gunakan tombol status:

| Status | Aksi | Deskripsi |
|--------|------|-----------|
| **MARK PROCESSED** | Tandai sedang diproses | Dari pending → processing |
| **MARK SHIPPED** | Tandai sudah dikirim | Dari processing → shipped (masukkan nomor resi) |
| **MARK DELIVERED** | Tandai sudah diterima | Dari shipped → delivered |
| **MARK REFUNDED** | Tandai refund | Set status menjadi refunded dengan timestamp |
| **DELETE ORDER** | Hapus pesanan | Menghapus dari database (hati-hati!) |

#### Workflow Pesanan Standar

```
Pending → Processing → Shipped → Delivered
                    ↓
                  Refunded (jika refund)
```

---

## 🏠 4. Halaman Depan (Homepage)

### Akses
- Klik tab **"HOMEPAGE"** di menu navigasi
- Url: `/admin/homepage`

### Fitur

Di sini Anda bisa mengubah:
- **Hero Eyebrow** - Text di atas headline (contoh: "MADE TO MEASURE")
- **Hero Headline** - Judul besar halaman depan
- **Hero Button Label** - Text tombol (contoh: "EXPLORE THE COLLECTION")
- **Hero Media** - Upload gambar/video untuk hero section

Klik **"SAVE CHANGES"** untuk menyimpan.

---

## 🔐 5. Logout

- Klik **"LOG OUT"** di sudut kanan atas untuk logout

---

## 📋 TIPS & TRIK

### Tips Mengelola Produk

✅ **Lakukan**
- Selalu upload gambar berkualitas tinggi
- Tulis deskripsi yang detail dan menarik
- Gunakan "MARK SOLD OUT" untuk produk terbatas, bukan DELETE
- Simpan riwayat pesanan untuk referensi
- Publish produk baru sebelum mengumumkan ke pelanggan

❌ **Jangan**
- Tidak perlu khawatir tentang "size charts" - semua produk menggunakan preset standar
- Jangan hapus koleksi jika masih ada produk di dalamnya
- Jangan gunakan DELETE untuk pesanan - gunakan MARK REFUNDED

### Manajemen Status Pesanan

1. **Ketika pesanan baru masuk**: Status otomatis "pending"
2. **Ketika mulai proses**: Klik "MARK PROCESSED"
3. **Ketika siap kirim**: Klik "MARK SHIPPED" dan masukkan nomor resi pengiriman
4. **Ketika sampai ke pelanggan**: Klik "MARK DELIVERED"
5. **Jika ada refund**: Klik "MARK REFUNDED"

### Upload Gambar Produk

- Format: JPG atau PNG
- Ukuran ideal: 600x800 pixels
- Ukuran file: maksimal 5MB per gambar
- Bisa upload multiple gambar per produk (hingga 10 gambar)
- Gambar pertama akan jadi thumbnail di katalog

---

## 📞 Dukungan

Jika ada pertanyaan atau masalah dengan dashboard:
1. Hubungi WhatsApp: +62 813-3583-8367
2. Instagram DM: @deritz
3. Email ke administrator sistem

---

**Versi Panduan**: 1.0  
**Terakhir Diperbarui**: 3 Juli 2026  
**Platform**: De Ritz L'Atelier Admin Dashboard
