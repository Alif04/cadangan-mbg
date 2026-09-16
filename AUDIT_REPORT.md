# MBG — Total UI/Layout Audit

## Perombakan
- Homepage CSS ditulis ulang sebagai satu sistem layout baru; override CSS lama dibuang.
- Desktop menggunakan full viewport `100dvh` dengan header + content yang dihitung dari tinggi viewport.
- Homepage desktop disusun sebagai: header → hero → stage 3 kolom → menu 5 kolom → HUD 5 kartu → footer.
- Shell desktop memakai CSS Grid eksplisit dan dikunci tepat ke viewport agar header, hero, menu, HUD, dan footer tidak terdorong oleh implicit grid rows.
- Desktop tidak lagi memakai `overflow: hidden` pada body atau container utama untuk menyamarkan overflow; scrolling hanya digunakan pada layar non-home yang memang membutuhkan konten panjang.
- Transisi screen kini diisolasi secara tegas: setiap perpindahan menghapus `active` dan menetapkan `aria-hidden` pada seluruh screen sebelum mengaktifkan satu target yang tervalidasi. Screen nonaktif selalu `display: none`, sehingga homepage tidak tersisa di belakang peta atau screen lain.
- Gameplay mendukung Fullscreen API, perubahan label melalui `fullscreenchange`, penguncian orientasi landscape bila tersedia, serta kontrol touch kiri/kanan/lompat pada mode mobile tanpa mengubah physics game.
- Screen gameplay sekarang menjadi immersive viewport `100vw × 100dvh`: panel, canvas, dan world render mengisi seluruh layar tanpa header homepage, tagline, atau ruang kosong dashboard. HUD tetap compact di atas dan kontrol mobile tetap berada di dalam viewport.
- Tombol `← MAP` pada gameplay menghentikan loop aktif, merender ulang daftar map, dan kembali langsung ke screen map tanpa bergantung pada history screen sebelumnya.
- Hero dibuat sebagai scene pixel-fantasy CSS berlapis tanpa aset/CDN eksternal.
- Mobile memakai layout satu kolom dan scrolling natural.
- Karakter dan Shop tetap menjadi menu modal, bukan konten permanen homepage.
- Statistik homepage sekarang mengikuti target: XP, Score, Koin, Level, Karakter.

## Audit JavaScript
- `node --check script.js` lulus.
- Event delegation utama tetap satu listener pada `document`.
- Proteksi tambahan untuk mencegah `requestAnimationFrame` game loop ganda.
- `stopGame()` sekarang membersihkan `loopId`.
- Navigasi keluar dari game menghentikan loop aktif.
- XP dan Score disatukan secara konsisten ke `state.save`, dengan migrasi konservatif dari data player lama.
- Nilai XP, Score, Coin, Life dan Current Level dari localStorage dinormalisasi.
- Seleksi karakter tetap disimpan di localStorage dan tetap digunakan oleh renderer game.
- Sistem recovery dan Bonus Petualang tidak dihapus.

## Audit HTML
- Tidak ditemukan duplicate ID pada HTML statis.
- Struktur tag HTML statis seimbang pada parser pemeriksaan.
- Tidak ada `button` yang dinest di dalam `button` pada HTML statis.
- Font Google eksternal dihapus agar project dapat dijalankan lokal tanpa CDN.

## Audit CSS
- `style.css` lama yang berisi banyak blok override diganti menjadi satu stylesheet terstruktur.
- Layout utama tidak menggunakan absolute positioning.
- Absolute positioning hanya dipakai untuk artwork/dekorasi hero, ambient layer, HUD game, dan modal overlay.
- Tidak menggunakan `overflow:hidden` sebagai solusi utama untuk memotong layout homepage; desktop memang dikunci pada tinggi viewport setelah layout dihitung.

## Akses Admin/User Berbasis Kode
- Google Authentication, QRIS, payment gateway, dan login password user tidak dipakai.
- Backend Express memvalidasi `MBG_ADMIN_CODE` dari environment dan menerbitkan sesi bertanda tangan.
- Admin membuat user melalui transaksi Firestore; nama dinormalisasi dan dijaga unik pada `userNames`.
- Kode user dibuat acak, hash kode disimpan server-side, dan kode plaintext hanya dikembalikan saat akun dibuat.
- User, progress, status aktif, serta leaderboard diambil berdasarkan sesi dan UID server, bukan nilai dari frontend/localStorage.
- Jika kredensial Firebase belum tersedia, server mengembalikan status konfigurasi yang jelas dan tidak membuka akses palsu.
- Jalur login Admin lokal memakai `loginAdmin()` global dengan validasi `trim() === "231005"`; tidak lagi bergantung pada `undefined.loginAdmin`.
- Akses API Admin/User melalui `getAuthApi()` menghasilkan pesan konfigurasi yang jelas jika module belum siap, bukan TypeError pada `createUser`.
- Admin Panel sekarang memiliki edit akun, set nilai, top up reward, status aktif/nonaktif, dan log top up server-side.
- Perubahan admin pada XP, score, coins, life, level, unlockedLevel, dan karakter disalin ke dokumen progress user agar gameplay membaca nilai yang sama saat login berikutnya.
- Kode login user dapat diedit dengan validasi format dan collision check transaksional; rename user juga menjaga indeks `userNames` tetap unik.
- Admin dapat mereset progress user ke nilai awal dan setiap reset/top-up dicatat dalam `adminLogs`.
- Create user kini melalui `createUserAccount()` yang hanya memvalidasi nama dan memanggil API akun; tidak membaca data level, materi, soal, karakter, shop, atau game. Error lama `Modul data MBG belum dimuat` dihapus agar kegagalan Firestore menampilkan penyebab backend sebenarnya.
- HTML sekarang memiliki satu entry point module, [js/app.js](./js/app.js), yang memuat API akses lebih dulu lalu controller gameplay lama secara deterministik; duplicate script tags dihapus tanpa memindahkan controller berisiko.
- Pemulihan startup membatalkan entry point module sementara tersebut dan mengembalikan urutan script stabil yang dipakai build berjalan sebelumnya: `firebase-auth.mjs` lalu `script.js`. Gameplay controller tidak dipindahkan atau dipecah.

## Catatan pengujian
- Pemeriksaan statis dan syntax berhasil.
- Browser runtime memverifikasi screen gameplay pada viewport 1366×768 dan 390×844: screen, panel, dan canvas tepat memenuhi viewport; desktop menyembunyikan kontrol virtual, mobile menampilkannya; hanya `screen-game` yang aktif.
- Browser runtime juga memverifikasi setup game menampilkan HUD, tombol keluar mengembalikan ke PETA QUEST, dan tidak ada error pada Problems panel untuk HTML/CSS/JS.
- Sistem nyawa dan recovery kini menyimpan snapshot gameplay (level, posisi, world, kamera, score, coins, XP, karakter, dan checkpoint) sebelum game over. Quick Review, belajar ulang, dan bonus petualang menetapkan nyawa tepat `3`, lalu melanjutkan gameplay tanpa kembali ke home atau mengulang level dari awal.
- Gerbang akses manual menggantikan seluruh sistem pembayaran online. Website hanya menampilkan informasi harga Rp10.000 dan meminta login Google; pembayaran dilakukan di luar website lalu admin mengubah `accessActive` di Firestore.
- Firebase Authentication + Google Provider menjadi identitas utama. Profil akun berada di `users/{uid}` dan role/admin tidak dipercaya dari localStorage atau frontend.
- Admin panel membaca daftar user dan dapat mengaktifkan/menonaktifkan akses setelah konfirmasi pembayaran. Firestore Rules membatasi perubahan akses dan role kepada admin.
- Progress game disimpan ke `users/{uid}/progress/game` sebagai sumber lintas perangkat; localStorage tetap dipakai sebagai cache gameplay lokal.
- Field pembayaran memakai `type="email"`, `name="email"`, `autocomplete="email"`, dan `inputmode="email"`. Keyboard game mengabaikan input/textarea/select/contenteditable pada keydown dan keyup, sehingga huruf `a`, `A`, simbol email, paste, cursor, backspace, dan delete tidak diblokir.
