# Interactive Quiz App — Quiz Web Dasar

Aplikasi kuis pilihan ganda interaktif berbasis **HTML, CSS, dan JavaScript murni** (tanpa framework atau library). Menguji pemahaman dasar JavaScript dan DOM/browser, lengkap dengan timer, skor tertinggi, dan mode gelap. Dibuat sebagai Tugas Rutin 6.

## Fitur

- **3 kategori**: JavaScript, DOM & Browser, dan Acak (campuran keduanya)
- **5 soal per ronde**, diambil acak dari bank soal; urutan pilihan jawaban juga diacak
- **Timer 15 detik per soal** dengan bar waktu; jika habis, jawaban benar otomatis ditampilkan
- **Umpan balik instan**: jawaban benar ditandai hijau, jawaban salah ditandai merah
- **Skor akhir 0-100** dengan pesan sesuai capaian dan lencana **"Rekor baru!"**
- **Skor tertinggi tersimpan** di browser (`localStorage`)
- **Mode terang/gelap**, pilihan tersimpan di browser
- Navigasi antar tampilan ala **Single Page Application** (mulai, quiz, hasil) dengan animasi halus
- Tombol **Ulangi quiz** dan **Ganti kategori** di halaman hasil
- Aksesibel: `aria-live` untuk umpan balik, fokus keyboard yang jelas, dan dukungan `prefers-reduced-motion`

## Struktur Proyek

```
.
├── index.html   # Kerangka tiga tampilan: mulai, quiz, hasil
├── style.css    # Tema terang/gelap, layout, animasi
├── script.js    # Bank soal, state, timer, skor, tema
└── README.md
```

## Cara Menjalankan

1. Pastikan `index.html`, `style.css`, dan `script.js` berada dalam satu folder.
2. Buka `index.html` di browser, atau gunakan *Live Server* di VS Code.
3. Pilih kategori, lalu jawab 5 soal sebelum waktu habis.

Tidak perlu instalasi, build, maupun koneksi internet.

## Menambah Soal

Tambahkan objek baru ke array `QUESTIONS` di `script.js`:

```js
{ cat: 'js', q: 'Pertanyaan kamu?', options: ['A', 'B', 'C', 'D'], answer: 2 }
```

- `cat`: `'js'` atau `'dom'` (atau tambah kategori baru di objek `CATEGORIES`)
- `answer`: indeks jawaban benar pada `options`, dimulai dari 0
- Jumlah soal per ronde dan durasi timer diatur lewat `TOTAL_QUESTIONS` dan `TIME_PER_QUESTION`

## Konsep JavaScript yang Dipakai

- **Event delegation**: satu listener di `#app` menangani semua tombol lewat atribut `data-action`
- **Array methods**: `map`, `filter`, `slice`, `forEach`, `indexOf`, dan algoritma Fisher-Yates untuk mengacak
- **Timer** dengan `setInterval` dan `clearInterval`
- **`localStorage`** dengan fallback ke memori jika penyimpanan diblokir
- **DOM manipulation aman**: memakai `textContent` dan `createElement`, bukan `innerHTML`, sehingga terhindar dari XSS
- **Strict mode**, `switch`, destructuring, dan `Object.entries`

## Teknologi

- HTML5, CSS3 (custom properties, grid, flexbox, animasi keyframes)
- JavaScript ES6+

## Catatan

- Bank soal saat ini berisi 12 soal (6 per kategori), jadi kategori JavaScript dan DOM & Browser masing-masing menampilkan 5 dari 6 soal secara acak.
- Skor tertinggi disimpan satu saja untuk semua kategori, bukan per kategori.

---

&copy; 2026 Interactive Quiz App
