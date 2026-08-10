# Kandara Hills — Dua Landing Page Iklan

**Live:** https://ardhianawing.github.io/kandara-hills-lp/

- LP-WA: https://ardhianawing.github.io/kandara-hills-lp/wa/
- LP-FORM: https://ardhianawing.github.io/kandara-hills-lp/form/

Dua landing page dengan brand dan desain sama, tapi mekanisme konversi berbeda,
supaya bisa diadu langsung mana yang menghasilkan lead lebih murah.

| Halaman | Untuk campaign | Konversi |
|---|---|---|
| `wa/index.html` | Click to WhatsApp | Setiap tombol membuka chat dengan pesan otomatis berbeda |
| `form/index.html` | Lead Form | Form 3 kolom → `form/terima-kasih.html` |
| `index.html` | — | Halaman pemilih, untuk presentasi ke klien |

HTML + CSS + JavaScript biasa. Tanpa build, tanpa dependency. Bisa dibuka
langsung dengan klik dua kali, atau ditaruh di hosting statis mana pun.

---

## ⚠️ Baca dulu sebelum dipakai beriklan

Sebagian angka dan teks di halaman ini **masih contoh**, karena datanya belum ada
di bahan dari klien. Semuanya terkumpul di satu tempat: objek `SITE_DATA`
di bagian paling atas [`assets/js/common.js`](assets/js/common.js), dan ditandai
komentar `DUMMY` di dalam kode.

Yang wajib diganti:

| Item | Di mana | Kenapa penting |
|---|---|---|
| Nomor WhatsApp sales | `SITE_DATA.waNumber` | Lead nyasar ke nomor yang salah |
| Batas waktu pre-launching | `SITE_DATA.preLaunchingEnd` | Klaim urgensi yang tidak benar |
| Sisa unit per tipe | `SITE_DATA.types` | Klaim kelangkaan yang tidak benar |
| Harga tipe Alila | `SITE_DATA.types.alila.price` | Harga belum ada di bahan |
| Simulasi passive income | `SITE_DATA.invest` | **Klaim imbal hasil — ada konsekuensi hukum** |
| Asumsi bunga & tenor KPR | `SITE_DATA.kpr` | Menyesatkan calon pembeli |
| Testimoni (3 orang) | HTML, cari `DUMMY` | Testimoni palsu melanggar etika iklan |
| Jumlah unit terjual | HTML, cari `127 unit` | Klaim palsu |
| Daftar bonus pre-launching | HTML, cari `bonus__list` | Janji promo yang tidak ditepati |

Selama masih memakai data contoh, kedua halaman disetel `noindex` supaya tidak
terindeks Google.

---

## Menyambungkan form ke Google Sheet

Isi `SITE_DATA.leadEndpoint` dengan URL Web App dari Google Apps Script:

```js
leadEndpoint: 'https://script.google.com/macros/s/XXXX/exec'
```

Script-nya menerima JSON berisi `nama`, `whatsapp` (sudah dinormalkan ke format
`62…`), `tipe`, `catatan`, `sumber`, `halaman`, dan `waktu`.

Selama kolom itu kosong, form tetap berjalan normal — lead disimpan sementara di
`localStorage` browser pengunjung dan pengunjung tetap diarahkan ke halaman
terima kasih. Jadi aman untuk demo.

---

## Struktur

```
index.html               pemilih demo
wa/index.html            LP-WA — 10 blok
form/index.html          LP-FORM — 16 blok
form/terima-kasih.html   halaman setelah form terkirim
assets/css/style.css     satu design system untuk semua halaman
assets/js/common.js      SITE_DATA, hitung mundur, kalkulator KPR, tautan WhatsApp
assets/js/form.js        validasi & pengiriman form
assets/img/              gambar (WebP)
assets/logo/             logo Kandara Hills
docs/SPEC.md             spesifikasi lengkap, copy deck, peta aset, temuan
```

Warna, ukuran huruf, dan jarak diatur lewat variabel di bagian `:root`
`assets/css/style.css`. Mengubah `--ember` mengubah semua tombol sekaligus.

### Gambar cadangan

Sebelas gambar di `assets/img/` sengaja disimpan meski belum dipakai, sebagai
stok kalau ada visual yang ingin ditukar: `air-quality`, `alila-persp`,
`brand-mountain`, `fac-jogging`, `fac-lounge`, `fac-mosque`, `fac-outlet`,
`fac-pedestrian`, `family-mountain`, `savaya-denah-lt2`, `savaya-front`.

---

## Yang sudah diperiksa

- Tidak ada tautan gambar atau anchor yang rusak.
- Tidak ada elemen yang meluar horizontal pada lebar 390, 768, dan 1440 px.
- Tidak ada teks gelap di atas permukaan gelap pada keempat halaman.
- Kalkulator KPR dicocokkan dengan rumus anuitas: Rp900 jt, DP 20%, tenor 15
  tahun, bunga 5% → Rp5.693.714 per bulan.
- Normalisasi nomor WhatsApp: `0812…`, `62812…`, `812…`, `0812-3456-7890`, dan
  `+62 812 3456 7890` semuanya jadi `6281234567890`; nomor terlalu pendek ditolak.
- Form menolak isian kosong dan nomor yang tidak masuk akal, lalu membersihkan
  tanda error begitu diperbaiki.
- Halaman terima kasih menerima nama dan tipe dari URL, dan tombol WhatsApp-nya
  ikut membawa konteks itu.
- Delapan tautan WhatsApp di LP-WA semuanya terpasang dengan pesan berbeda.
- Berat halaman: LP-WA 2,4 MB dan LP-FORM 2,7 MB termasuk seluruh gambar; yang
  dimuat di awal hanya sekitar 450 KB karena sisanya lazy-load.

## Catatan teknis

- Gambar memakai **WebP**. Didukung semua browser sejak 2020; kalau nanti perlu
  menjangkau browser yang jauh lebih lama, siapkan `<picture>` dengan cadangan JPEG.
- Loading screen dari versi sebelumnya sengaja dihapus. Untuk traffic iklan,
  menahan pengunjung satu setengah detik menaikkan bounce rate.
- Animasi otomatis mati kalau pengunjung mengaktifkan "kurangi gerakan" di
  perangkatnya.
