# Kandara Hills — Dua Landing Page Iklan (v2)

Tanggal: 10 Agustus 2026
Basis: brief `LP Kandara Hills.txt` (9 Agt) + coretan WhatsApp (7 Agt) + folder ASET + LP rev-1

---

## 1. Tujuan

Dua landing page terpisah untuk dua jenis campaign, dengan brand & desain identik:

| | LP-WA | LP-FORM |
|---|---|---|
| Campaign | Click to WhatsApp | Lead Form |
| Konversi | Buka chat WA dengan pesan otomatis | Form 3–4 field → halaman terima kasih |
| Panjang | 10 blok, padat, CTA rapat | 16 blok, membangun keyakinan bertahap |
| Alasan | Traffic WA impulsif, mau tanya bukan baca | Menyerahkan nomor HP butuh keyakinan lebih |

Keduanya dipakai untuk pitch ke klien, jadi harus terlihat matang dan semua interaksinya benar-benar jalan.

## 2. Stack & struktur

Static HTML + CSS + JS vanilla. Tanpa build step, tanpa dependency, bisa dibuka langsung lewat `file://`
maupun di-deploy ke hosting statis mana pun.

```
LP-Kandara-Hills-v2/
  index.html               ← pemilih demo (dua tombol) untuk presentasi ke klien
  wa/index.html            ← LP-WA
  form/index.html          ← LP-FORM
  form/terima-kasih.html   ← thank-you page
  assets/
    css/style.css          ← satu design system dipakai kedua LP
    js/common.js           ← reveal, header, countdown, kalkulator KPR, WA prefill
    js/form.js             ← validasi + submit + redirect
    img/                   ← gambar hasil optimasi (lihat §6)
    logo/
  docs/SPEC.md
```

Satu file CSS untuk dua LP: blok yang tidak dipakai LP-WA tinggal tidak dipanggil HTML-nya.
Kalau nanti mau deploy terpisah, folder `wa/` atau `form/` cukup dibawa bersama `assets/`.

## 3. Design system

- **Warna:** forest deep `#183425` (brand), forest `#3f472b`, cream `#fbf8ee` (latar),
  ink `#123c43` (teks), aqua `#4b979d` (aksen sekunder), **oranye `#f26a21` khusus tombol**.
  Oranye dipertahankan dari rev-1 karena kontras tinggi terhadap hijau — penting untuk CTA iklan.
- **Font:** Cormorant Garamond (headline) + Montserrat (body) — sama seperti rev-1.
- **Logo:** varian Juni 2026. Putih di header transparan & footer gelap, hijau di latar cream.
- **Motion:** reveal on scroll, angka statistik menghitung naik. Semua dimatikan otomatis kalau
  `prefers-reduced-motion` aktif.

## 4. Copy deck

Sumber: `LP Kandara Hills.txt`. Ditulis ulang seperlunya agar mengalir sebagai halaman jualan,
tanpa mengubah klaim atau angka.

### Hero (dua LP)
- Eyebrow: **THE ONE AND ONLY**
- H1: **5-Star Resort Living with Botanical Park in Malang**
- Sub: Dapatkan *Passive Income* hingga **Rp300 Juta/Tahun**, didukung **Guaranteed Rental Income
  hingga 6%** di tahun pertama.
- Harga: Pre-Launching mulai **Rp900 Jutaan**
- Trust strip: SHM On Hand · Ring 1 UMM · Kawasan 29 Hektar
- CTA LP-WA: "Chat Sales Sekarang" + "Lihat Tipe & Harga"
- CTA LP-FORM: form 3 field langsung di hero (Nama, WhatsApp, Tipe diminati)

### More Than Expected — 3 kolom
1. **5-Star Facilities** — *Resort Experiences, Every Day.* Fasilitas berkelas resort untuk wellness,
   rekreasi, dan kualitas hidup yang lebih baik setiap hari.
2. **Exclusive Location & Design** — *Where Prestige Meets Timeless Design.* Lokasi bernilai dengan
   arsitektur modern yang menyatu dengan lanskap alami.
3. **1 Ha of Tropical Forest** — *Where Nature and Serenity Come Together.* Lanskap alami yang
   menghadirkan udara lebih bersih dan tenang.

### Growing With Vision
29 Hektar area · 80 unit commercial outlet · 30 unit villa · 390 unit residential resort ·
10 meter botanical park · 18 meter grand boulevard

### Tipe unit
- **SAVAYA — The Maison**, *"The Quiet Luxury"*. 6 × 12 · LT 72 / LB 85 · 2 lantai.
  Untuk mereka yang memilih kualitas hidup sebagai kemewahan sejati.
- **ALILA — The Verde**, *"The Green Signature"*. 12 × 12 · LT 144 / LB 174 · 2 lantai ·
  3 kamar tidur · 3+1 kamar mandi · sunken living · private pool.
  Fase tertinggi dalam perjalanan hidup: kenyamanan, prestise, dan nilai jangka panjang.

### Fasilitas (12)
Jogging Track · Pedestrian · Commercial Outlet · Mosque · Kids Playground · Camp Ground ·
Urban Farm · Wellness Center · Exclusive Lounge & Lobby · Botanical Park · CCTV 24 Jam ·
Private & Secure Access 24 Jam

### Lokasi
4 mnt Pasar Karangploso · 8 mnt Kota Batu · 9 mnt RSU UMM · 12 mnt UMM ·
15 mnt Jatim Park 3 · 16 mnt Exit Tol Singosari

### Closing
"Terbiasa dengan Udara Segar? Saatnya Pindah ke Kandara Hills."
Harga Pre-Launching mulai Rp900 Jutaan — Desain 2 lantai modern luxury · Lokasi strategis Ring 1 UMM ·
Legalitas aman SHM on hand · Lingkungan resort living eksklusif.
Tombol: **Cek Bonus Pre-Launching**. Footer: Developed by Kandara Hills.

## 5. Data dummy — WAJIB diganti sebelum publikasi

Semua di bawah ini **tidak ada di bahan** dan saya isi contoh yang masuk akal supaya halaman terlihat
utuh saat dipresentasikan. Di kode ditandai `<!-- DUMMY -->` / `// DUMMY` dan dikumpulkan di satu objek
`SITE_DATA` pada `assets/js/common.js` agar gampang diganti.

| Item | Nilai contoh | Risiko kalau tidak diganti |
|---|---|---|
| Deadline countdown pre-launching | 30 hari dari hari ini | Klaim urgensi palsu |
| Sisa unit per tipe | Savaya 7, Alila 3 | Klaim scarcity palsu |
| Simulasi passive income | Rp1,5 jt/malam × okupansi 55% ≈ Rp301 jt/thn | **Klaim ROI — konsekuensi hukum** |
| Bunga & tenor KPR | 5% fixed 3 thn, tenor 15 thn | Menyesatkan calon pembeli |
| Testimoni (3 orang) | Nama & foto fiktif | Testimoni palsu melanggar etika iklan |
| Jumlah unit terjual | 127 unit | Klaim palsu |
| Isi bonus pre-launching | 5 item | Janji promo yang tidak ditepati |
| Nomor WhatsApp | 628133154170 (dari rev-1) | Lead nyasar |

Kalkulator KPR memakai rumus anuitas standar dan diberi label "estimasi, bukan penawaran resmi".
Blok simulasi investasi diberi disclaimer bahwa angka bersifat ilustrasi.

## 6. Peta aset gambar

Semua gambar dioptimasi (maks 1920 px, JPEG q82) karena aset asli sangat berat — `hero.png` rev-1
saja 32 MB, mustahil untuk halaman iklan.

### Dari folder ASET
| File asal | Nama baru | Dipakai di |
|---|---|---|
| ChatGPT Image 22 Jun 17.22.29 | `hero-gate.jpg` | Hero kedua LP (sama seperti rev-1 & coretan klien) |
| ChatGPT Image 19 Jun 16.26.26 | `gate-badges.jpg` | Blok closing / bonus |
| 683490285…n.jpg | `brand-mountain.jpg` | Loader & pembuka brand |
| ChatGPT Image 25 Mei 15.44.31 | `masterplan-aerial.jpg` | Kolom "Exclusive Location & Design" |
| ChatGPT Image 26 Jun 14.16.16 | `masterplan-city.jpg` | Latar "Growing With Vision" |
| aokigahara-forest… | `tropical-forest.jpg` | Kolom "1 Ha of Tropical Forest" |
| ChatGPT I- botanical park | `botanical-park.jpg` | Fasilitas / botanical park |
| ChatGPT wellness center 2.44 | `wellness-center.jpg` | Kolom "5-Star Facilities" + blok fasilitas |
| ChatGPT Image 8 Agu 14.11.17 | `fac-gym.jpg` | Grid fasilitas |
| ChatGPT Image 8 Agu 14.13.31 | `fac-kids.jpg` | Grid fasilitas |
| ChatGPT Image 8 Agu 15.02.19 | `fac-campground.jpg` | Grid fasilitas |
| woman-working-…greenhouse | `fac-urban-farm.jpg` | Grid fasilitas |
| ChatGPT Image 8 Agu 14.42.25 | `fac-pedestrian.jpg` | Grid fasilitas |
| ChatGPT Image 8 Agu 14.35.45 | `breathe.jpg` | Blok "Breathe Freely" (LP-FORM) |
| ChatGPT Image 8 Agu 13.55.18 | `invest-lifestyle.jpg` | Blok simulasi investasi |
| ChatGPT Image 19 Jun 13.46.10 | `family-mountain.jpg` | Blok social proof |
| Salinan 6x12 .2 | `savaya-persp.jpg` | Kartu tipe Savaya (utama) |
| Salinan 6x12 .1 | `savaya-front.jpg` | Galeri Savaya |
| Salinan nggak rimbun 6 x 12 | `savaya-street.jpg` | Banner lebar Savaya |
| Salinan DENAH 6 X 12 | `savaya-denah.jpg` | Denah Savaya |
| Salinan 6x12d2 | `savaya-denah-lt2.jpg` | Detail denah lantai 2 |
| Type 12x12 alila (3) | `alila-front.jpg` | Kartu tipe Alila (utama) |
| Type 12x12 alila (2) | `alila-persp.jpg` | Galeri Alila |
| Type 12x12 alila (4) | `alila-denah.jpg` | Denah Alila |
| Salinan Tipe 8 x 15 | `villa-street.jpg` | Banner lebar kawasan villa |
| ChatGPT Image 29 Jul 10.58.19 | `loc-batu-hero.jpg` | Pembuka blok lokasi |
| logo …putih / …hijau | `logo/` | Header, footer |

### Dari LP rev-1 (`img/`)
`Air Quality Index.jpeg` → `air-quality.jpg`; enam gambar lokasi (Pasar Karangploso, Kota Batu,
RSU UMM, UMM, Jatim Park 3, Exit Tol Singosari) → `loc-*.jpg`; `logo/logo-1.svg` dibawa apa adanya.

### Tidak dipakai
Render resort lembah + air terjun (22 Jun 17.11) — visualnya bagus tapi jelas bukan Kandara Hills,
berisiko dianggap iklan menyesatkan. Duplikat `(1)` dan file `.tif` dilewati.

## 7. Temuan yang perlu dikonfirmasi ke klien

1. **Luas Alila.** Brief menulis "12 x 15 | LT 144". 12 × 15 = 180 m², tidak cocok dengan LT 144.
   Nama file aset dan denahnya menyebut **12 × 12** (= 144 m²), jadi spec ini memakai 12 × 12.
2. **Lebar grand boulevard.** Brief menulis 18 meter, tapi render gerbang resmi mencantumkan
   "16-METER GRAND BOULEVARD". Spec memakai 18 meter sesuai brief terbaru — perlu dipastikan.
   (Di rev-1 ini juga bug: angka tampil 18 tapi animasinya menghitung ke 16.)
3. **Tipe 7×15 dan 8×15.** Masih ada asetnya dan dipakai di rev-1, tapi tidak disebut di brief baru.
   Spec ini hanya menampilkan Savaya dan Alila; render 8×15 dipakai sebagai foto suasana kawasan saja.
4. **Nama brand.** Logo baru berbunyi "Kandara Hills", tapi render gerbang masih "Kandara Residence".
   Halaman memakai Kandara Hills.
5. **Nomor WhatsApp** masih ambil dari rev-1. Perlu dipastikan masih nomor sales yang aktif.

## 8. Perilaku

- **WA prefill.** Setiap tombol WA mengirim pesan berbeda sesuai konteks, misal
  `Halo, saya tertarik dengan tipe SAVAYA (6x12) di Kandara Hills. Boleh minta info harga dan bonus
  pre-launching?` Berguna untuk sales karena langsung tahu asal klik.
- **Form.** Validasi di sisi klien (nama minimal 2 kata tidak diwajibkan; nomor WA wajib angka 9–15
  digit, awalan 0/62 dinormalkan). Submit → simpan ke `localStorage` sebagai cadangan demo →
  kirim ke endpoint kalau `SITE_DATA.leadEndpoint` diisi → redirect ke `terima-kasih.html` dengan
  parameter nama & tipe. Default endpoint kosong, jadi saat demo tidak akan error.
- **Terima kasih.** Menyapa dengan nama, menyebut tipe yang diminati, menjanjikan dihubungi
  maksimal 1×24 jam, dan tetap menyediakan tombol WA untuk yang tidak sabar.
- **Kalkulator KPR.** Pilih tipe → harga terisi; slider DP dan tenor; hasil cicilan per bulan
  memakai rumus anuitas. Tombol hasil membuka WA (LP-WA) atau mengisi form (LP-FORM) dengan
  skema yang barusan dihitung.
- **Mobile.** Sticky bar di bawah layar: LP-WA satu tombol WA besar; LP-FORM tombol "Dapatkan
  Penawaran" yang scroll ke form.

## 9. Verifikasi sebelum dianggap selesai

1. Semua `src` dan `href` gambar mengarah ke file yang benar-benar ada (dicek otomatis lewat script).
2. Kedua LP dibuka di browser: hero tampil, tidak ada gambar rusak, tidak ada error console.
3. Form disubmit → sampai di `terima-kasih.html` dengan nama & tipe yang benar.
4. Semua tombol WA membuka `wa.me` dengan pesan yang sesuai konteksnya.
5. Kalkulator KPR: cek satu perhitungan manual dengan rumus anuitas.
6. Layout diperiksa pada lebar 390 px, 768 px, dan 1440 px.
7. Total berat halaman di bawah 3 MB (penting untuk halaman iklan).
