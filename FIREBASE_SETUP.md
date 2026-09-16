# Firebase setup MBG

MBG memakai backend Node + Firebase Admin SDK. Tidak ada Google Authentication,
password user, QRIS, payment gateway, atau pembayaran otomatis.

1. Buat project dan Firestore Database.
2. Buat service account di Firebase Console. Simpan kredensial hanya di server,
   bukan di `index.html`, `firebase-config.js`, atau localStorage.
3. Salin [.env.example](./.env.example) menjadi `.env` dan isi
   `MBG_ADMIN_CODE`, `MBG_SESSION_SECRET`, serta `FIREBASE_SERVICE_ACCOUNT_JSON`
   (atau application-default credentials).
4. Jalankan `npm install`, lalu `npm start`.
5. Buka `/health`. Server harus melaporkan `firebaseConfigured: true`.

Admin masuk memakai `MBG_ADMIN_CODE`, lalu membuat user. Server menyimpan
`loginCodeHash` dan hanya menampilkan kode plaintext sekali saat akun dibuat.
Nama unik dijaga oleh transaksi Firestore pada `userNames/{nameNormalized}`.
Progress disimpan di `users/{uid}/progress/game`; localStorage hanya cache.

Firestore Admin SDK melewati Firestore Rules karena seluruh akses data dilakukan
server-side. Jangan mengekspos service account ke browser. Untuk deployment
produksi, batasi akses jaringan server dan gunakan secret manager.

## Pembatasan jaringan

Backend menyediakan `GET /api/network-check` dan memeriksa alamat peer TCP yang
diterima server (`request.socket.remoteAddress`). Alamat dari header atau parameter
browser tidak dipercaya.

 - `MBG_NETWORK_MODE=development`: semua request diizinkan untuk pengujian lokal.
- `MBG_NETWORK_MODE=production` (alias `lan`): hanya CIDR pada `MBG_ALLOWED_NETWORKS` yang diizinkan,
    misalnya `192.168.1.0/24,10.0.0.0/8`. Mode ini cocok saat Node berjalan langsung
    pada server di jaringan Wi-Fi/LAN MBG.
 - `MBG_NETWORK_MODE=cloud`: semua request diizinkan dan hanya untuk deployment
    cloud yang memang tidak memerlukan pembatasan satu Wi-Fi.

Render dan platform cloud serupa biasanya hanya memberikan IP publik/NAT atau IP
proxy kepada aplikasi. Backend cloud tidak dapat membuktikan bahwa perangkat
berada pada Wi-Fi lokal yang sama, sehingga `cloud` tidak boleh dianggap sebagai
pengamanan jaringan lokal. Untuk pembatasan satu Wi-Fi yang nyata, jalankan mode
`lan` pada server lokal di jaringan tersebut, atau tempatkan VPN/private network
di depan backend dan batasi CIDR jaringan privatnya.
