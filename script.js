const STORAGE_KEY = 'mbg-progress-v1';
const PLAYER_KEY = 'mbgPlayer';
const MODE_KEY = 'mbgMode';
const PASS_SCORE = 70;
const MAX_LIVES = 5;
const RECOVERY_QUESTIONS = 3;
const RECOVERY_REWARD = 3;
const SHOP_ITEMS = [
  { id: 'spark-trail', category: 'EFEK', name: 'JEJAK SPARK', price: 10, icon: '✦', description: 'Jejak cahaya mengikuti langkahmu.', color: '#ffd66b' },
  { id: 'aura-flare', category: 'EFEK', name: 'AURA FLARE', price: 25, icon: '✹', description: 'Aura berdenyut mengelilingi karaktermu.', color: '#ff8b42' },
  { id: 'coin-magnet', category: 'EFEK', name: 'MAGNET KOIN', price: 45, icon: '◉', description: 'Koin tertarik dari jarak lebih jauh.', color: '#72d9ff' },
  { id: 'royal-comet', category: 'EFEK', name: 'ROYAL COMET', price: 80, icon: '✦', description: 'Efek komet langka + bonus 2 koin setiap pickup.', color: '#b78cff' },
  { id: 'ember-jacket', category: 'BAJU', name: 'JAKET EMBER', price: 18, icon: '🧥', description: 'Baju api yang membuat jejakmu menyala.', color: '#ff704d' },
  { id: 'nebula-pants', category: 'CELANA', name: 'CELANA NEBULA', price: 32, icon: '▥', description: 'Celana kosmik dengan lompatan lebih tinggi.', color: '#9b8cff' },
  { id: 'school-uniform', category: 'BAJU', name: 'SERAGAM SEKOLAH', price: 24, icon: '▦', description: 'Seragam rapi dengan emblem matematika.', color: '#4f8ed8' },
  { id: 'explorer-jacket', category: 'BAJU', name: 'JAKET PENJELAJAH', price: 42, icon: '✚', description: 'Jaket lapangan untuk petualangan dunia.', color: '#b8784a' },
  { id: 'knight-armor', category: 'BAJU', name: 'ARMOR KNIGHT', price: 95, icon: '♜', description: 'Pelindung dada dengan aksen baja.', color: '#8e9eae' },
  { id: 'hoodie-night', category: 'BAJU', name: 'HOODIE NIGHT', price: 65, icon: '▰', description: 'Hoodie gelap dengan tudung pixel.', color: '#353b68' },
  { id: 'samurai-outfit', category: 'BAJU', name: 'SAMURAI OUTFIT', price: 110, icon: '⚔', description: 'Pakaian samurai dengan sabuk merah.', color: '#b44652' },
  { id: 'sport-outfit', category: 'BAJU', name: 'SPORT OUTFIT', price: 38, icon: '➤', description: 'Pakaian ringan untuk gerak cepat.', color: '#36b9a4' },
  { id: 'casual-jacket', category: 'BAJU', name: 'CASUAL JACKET', price: 30, icon: '◫', description: 'Jaket kasual untuk perjalanan harian.', color: '#c06f50' },
  { id: 'fantasy-outfit', category: 'BAJU', name: 'FANTASY OUTFIT', price: 90, icon: '✧', description: 'Pakaian beraksen cahaya magic.', color: '#725bc1' },
  { id: 'dark-outfit', category: 'BAJU', name: 'DARK OUTFIT', price: 75, icon: '◼', description: 'Pakaian gelap untuk dungeon.', color: '#25283c' },
  { id: 'explorer-vest', category: 'BAJU', name: 'EXPLORER VEST', price: 58, icon: '▤', description: 'Rompi dengan kantong perlengkapan.', color: '#6f8b56' },
  { id: 'short-hair', category: 'RAMBUT', name: 'SHORT HAIR', price: 20, icon: '✦', description: 'Rambut pendek rapi.', color: '#3b2947' },
  { id: 'spiky-hair', category: 'RAMBUT', name: 'SPIKY HAIR', price: 45, icon: '✹', description: 'Rambut berdiri penuh energi.', color: '#542f4f' },
  { id: 'long-hair', category: 'RAMBUT', name: 'LONG HAIR', price: 55, icon: '〽', description: 'Rambut panjang bergaya fantasy.', color: '#5c315b' },
  { id: 'samurai-hair', category: 'RAMBUT', name: 'SAMURAI HAIR', price: 70, icon: '⌁', description: 'Ikat rambut pendek seorang ronin.', color: '#211b2d' },
  { id: 'fantasy-hair', category: 'RAMBUT', name: 'FANTASY HAIR', price: 80, icon: '✧', description: 'Rambut bercahaya dari dunia lain.', color: '#b78cff' },
  { id: 'curly-hair', category: 'RAMBUT', name: 'CURLY HAIR', price: 35, icon: '◎', description: 'Rambut ikal dengan volume pixel.', color: '#6a3f2d' },
  { id: 'messy-hair', category: 'RAMBUT', name: 'MESSY HAIR', price: 32, icon: '≋', description: 'Rambut acak yang penuh karakter.', color: '#493041' },
  { id: 'ponytail', category: 'RAMBUT', name: 'PONYTAIL', price: 50, icon: '⌁', description: 'Rambut ekor kuda yang dinamis.', color: '#63354d' },
  { id: 'undercut', category: 'RAMBUT', name: 'UNDERCUT', price: 44, icon: '▥', description: 'Potongan undercut tajam.', color: '#292235' },
  { id: 'anime-hair', category: 'RAMBUT', name: 'ANIME HAIR', price: 68, icon: '✦', description: 'Rambut runcing bergaya anime pixel.', color: '#3d5ea8' },
  { id: 'crown-cap', category: 'TOPI', name: 'TOPI MAHKOTA', price: 55, icon: '♛', description: 'Mahkota mini yang membuat aura emas.', color: '#ffd66b' },
  { id: 'shadow-mask', category: 'TOPENG', name: 'TOPENG SHADOW', price: 75, icon: '◈', description: 'Topeng misterius memberi dash lebih cepat.', color: '#72d9ff' },
  { id: 'half-mask', category: 'TOPENG', name: 'HALF MASK', price: 48, icon: '◐', description: 'Topeng setengah wajah dengan outline tajam.', color: '#c9d4e8' },
  { id: 'oni-mask', category: 'TOPENG', name: 'ONI MASK', price: 105, icon: '鬼', description: 'Topeng oni dengan taring kecil.', color: '#e05262' },
  { id: 'skull-mask', category: 'TOPENG', name: 'SKULL MASK', price: 125, icon: '☠', description: 'Topeng tulang bergaya dungeon.', color: '#d9d4c0' },
  { id: 'cyber-mask', category: 'TOPENG', name: 'CYBER MASK', price: 90, icon: '▣', description: 'Topeng neon dengan visor digital.', color: '#55e4ff' },
  { id: 'tactical-mask', category: 'TOPENG', name: 'TACTICAL MASK', price: 60, icon: '◆', description: 'Masker taktis untuk petualang.', color: '#4d6570' },
  { id: 'fantasy-mask', category: 'TOPENG', name: 'FANTASY MASK', price: 82, icon: '◇', description: 'Topeng rune dari dunia magic.', color: '#a477df' },
  { id: 'ninja-mask', category: 'TOPENG', name: 'NINJA MASK', price: 72, icon: '▰', description: 'Penutup wajah ninja klasik.', color: '#242b3f' },
  { id: 'visor-mask', category: 'TOPENG', name: 'VISOR MASK', price: 88, icon: '▱', description: 'Visor tipis dengan cahaya neon.', color: '#6ce5d1' },
  { id: 'glasses', category: 'AKSESORI', name: 'GLASSES', price: 28, icon: '◌', description: 'Kacamata pixel untuk ahli strategi.', color: '#d9e9ff' },
  { id: 'scarf', category: 'AKSESORI', name: 'SCARF', price: 40, icon: '≈', description: 'Syal bergerak mengikuti angin.', color: '#ff6c62' },
  { id: 'backpack', category: 'AKSESORI', name: 'BACKPACK', price: 52, icon: '▣', description: 'Ransel kecil untuk perjalanan panjang.', color: '#9d664b' },
  { id: 'cape', category: 'AKSESORI', name: 'CAPE', price: 85, icon: '⌁', description: 'Jubah pendek dengan ujung bercahaya.', color: '#7956c8' },
  { id: 'necklace', category: 'AKSESORI', name: 'NECKLACE', price: 36, icon: '◇', description: 'Kalung kristal matematika.', color: '#6ce5d1' },
  { id: 'earrings', category: 'AKSESORI', name: 'EARRINGS', price: 26, icon: '••', description: 'Aksesori telinga kecil berkilau.', color: '#ffd66b' },
  { id: 'shoulder-guard', category: 'AKSESORI', name: 'SHOULDER GUARD', price: 64, icon: '◖', description: 'Pelindung bahu dengan outline baja.', color: '#9eafc2' },
  { id: 'math-charm', category: 'AKSESORI', name: 'MATH CHARM', price: 42, icon: 'π', description: 'Jimat simbol matematika.', color: '#f4d55d' },
  { id: 'pixel-dragon', category: 'PELIHARAAN', name: 'NAGA PIXEL', price: 120, icon: '🐉', description: 'Naga kecil menjaga pickup dan memberi +1 koin.', color: '#4ce0a4' },
  { id: 'moon-horse', category: 'KENDARAAN', name: 'KUDA BULAN', price: 170, icon: '♞', description: 'Tunggangan langka dengan kecepatan dan lompatan besar.', color: '#d9d4ff' },
  { id: 'neon-bike', category: 'KENDARAAN', name: 'SEPEDA NEON', price: 260, icon: '🚲', description: 'Sepeda turbo dengan jejak neon dan magnet koin.', color: '#ff5fc8' }
  ,{ id: 'sky-glider', category: 'KENDARAAN', name: 'SKY GLIDER', price: 320, icon: '✈', description: 'Kendaraan ringan dengan sayap pixel.', color: '#72d9ff' }
];
const INSTAGRAM_ACCOUNTS = [
  { handle: '@rfzannn_', url: 'https://www.instagram.com/rfzannn_/' },
  { handle: '@qonitaayn', url: 'https://www.instagram.com/qonitaayn/' },
  { handle: '@raenii_987', url: 'https://www.instagram.com/raenii_987/' }
];
const CHARACTERS = [
  { id: 'hero', name: 'MATH HERO', icon: '🧑', desc: 'Petualang seimbang untuk semua dunia.', cls: 'char-hero' },
  { id: 'wizard', name: 'MATH WIZARD', icon: '🧙', desc: 'Penyihir yang siap menaklukkan soal.', cls: 'char-wizard' },
  { id: 'ninja', name: 'NUMBER NINJA', icon: '🥷', desc: 'Cepat, lincah, dan penuh gaya.', cls: 'char-ninja' }
];
function defaultPlayer() {
  return {
    life: 5,
    maxLife: 5,
    xp: 0,
    score: 0,
    coins: 0,
    selectedCharacter: 'hero',
    shopOwned: [],
    equippedEffect: null,
    equippedItems: { BAJU: null, CELANA: null, RAMBUT: null, TOPENG: null, AKSESORI: null, KENDARAAN: null, PELIHARAAN: null, TOPI: null },
    currentLevel: 1,
    currentQuest: 1,
    progress: {},
    mode: 'desktop',
    instagramRewardClaimed: false,
    instagramFollowedAccounts: {},
    instagramTasks: {
      rfzannn_: false,
      qonitaayn: false,
      raenii_987: false
    },
    instagramPending: {
      rfzannn_: false,
      qonitaayn: false,
      raenii_987: false
    }
  };
}
function loadPlayer() {
  try {
    const raw = localStorage.getItem(PLAYER_KEY);
    if (!raw) return defaultPlayer();
    const parsed = JSON.parse(raw);
    return {
      ...defaultPlayer(),
      ...parsed,
      life: clampLives(parsed.life),
      maxLife: MAX_LIVES,
      xp: Number(parsed.xp) || 0,
      score: Number(parsed.score) || 0,
      coins: Number(parsed.coins) || 0,
      currentLevel: Number(parsed.currentLevel) || 1,
      shopOwned: Array.isArray(parsed.shopOwned) ? parsed.shopOwned : [],
      equippedItems: { ...defaultPlayer().equippedItems, ...(parsed.equippedItems || {}) },
      progress: { ...(parsed.progress || {}) },
      instagramFollowedAccounts: { ...(parsed.instagramFollowedAccounts || {}) },
      instagramTasks: {
        ...(defaultPlayer().instagramTasks),
        ...(parsed.instagramTasks || {})
      },
      instagramPending: {
        ...(defaultPlayer().instagramPending),
        ...(parsed.instagramPending || {})
      }
    };
  } catch {
    return defaultPlayer();
  }
}
function getInstagramTaskProgress() {
  const tasks = state.player.instagramTasks || defaultPlayer().instagramTasks;
  return Object.values(tasks).filter(Boolean).length;
}
function isInstagramRewardUnlocked() {
  return getInstagramTaskProgress() >= 3 && !state.player.instagramRewardClaimed;
}
function clampLives(value) {
  return Math.max(0, Math.min(MAX_LIVES, Number(value) || 0));
}
function savePlayer() {
  try {
    state.player.life = clampLives(state.player.life);
    state.player.maxLife = MAX_LIVES;
    state.player.mode = state.currentMode || state.player.mode || 'desktop';
    localStorage.setItem(PLAYER_KEY, JSON.stringify(state.player));
  } catch {}
}
function getActiveShopItem() {
  return SHOP_ITEMS.find((item) => item.id === state.player.equippedEffect) || null;
}
function getEquippedShopItem(category) {
  const itemId = state.player.equippedItems?.[category];
  return SHOP_ITEMS.find((item) => item.id === itemId) || null;
}
function getEquipmentItem(category) {
  return getEquippedShopItem(category);
}
function hasShopItem(itemId) {
  return state.player.shopOwned.includes(itemId) || state.player.equippedEffect === itemId || Object.values(state.player.equippedItems || {}).includes(itemId);
}
function buyShopItem(itemId) {
  const item = SHOP_ITEMS.find((shopItem) => shopItem.id === itemId);
  if (!item) return;
  const owned = hasShopItem(item.id);
  if (!owned) {
    if (state.player.coins < item.price) {
      toast(`Koin belum cukup. Butuh ${item.price} koin.`);
      return;
    }
    state.player.coins -= item.price;
    state.player.shopOwned.push(item.id);
    toast(`${item.name} berhasil dibeli!`);
  }
  if (item.category === 'EFEK') state.player.equippedEffect = item.id;
  else state.player.equippedItems[item.category] = item.id;
  savePlayer();
  const modal = document.getElementById('modal');
  if (modal && !modal.classList.contains('hidden')) {
    renderShopModal();
    return;
  }
  const activeScreen = document.querySelector('.screen.active')?.id.replace('screen-', '');
  if (activeScreen === 'map') renderMapList('map');
  else if (activeScreen === 'progress') renderProgress();
  else renderHome();
}
function resetProgress() {
  state.save = defaultSave();
  state.player = defaultPlayer();
  state.currentLevel = 1;
  state.currentMaterialPage = 0;
  state.currentPracticeIndex = 0;
  state.currentPracticeCorrect = 0;
  state.currentMode = 'desktop';
  state.selectedDevice = 'desktop';
  localStorage.setItem(MODE_KEY, 'desktop');
  savePlayer();
  saveState();
  renderApp();
  renderHome();
  renderMapList('map');
}
const LEVELS = [
  {
    id: 1,
    name: 'Hutan Aljabar',
    emoji: '🌳',
    intro: 'Hutan ini terkunci oleh Algebra Monster. Pelajari persamaan linear untuk membuka jalannya.',
    theme: {
      sky: '#8fd5ff',
      skyGlow: '#dff8ff',
      ground: '#7a502d',
      platformTop: '#8cb560',
      gate: '#4e6c7b',
      boss: '#d65b2b',
      enemy: '#7a305a',
      accent: '#f4d55d'
    },
    materials: [
      {
        title: 'MENGENAL VARIABEL',
        content: `Variabel adalah huruf atau simbol untuk menyimpan nilai yang belum diketahui.<br><br><strong>Contoh:</strong> x + 5 = 12<br>Artinya, ada sebuah angka yang jika ditambah 5 hasilnya 12.<br>Kurangi kedua sisi dengan 5:<br>x = 12 - 5<br><strong>x = 7</strong>` 
      },
      {
        title: 'KONSTANTA & KOEFISIEN',
        content: `Dalam 5x + 3 = 18:<br>• <strong>x</strong> adalah variabel karena nilainya dicari.<br>• <strong>5</strong> adalah koefisien, yaitu angka yang mengalikan x.<br>• <strong>3</strong> adalah konstanta, yaitu angka tetap.<br><br>Jadi, setiap angka memiliki peran yang berbeda.` 
      },
      {
        title: 'PERSAMAAN LINEAR',
        content: `Persamaan linear memiliki variabel dengan pangkat satu.<br><br><strong>Contoh:</strong> 2x + 4 = 12<br>1. Kurangi 4 dari kedua sisi: 2x = 8<br>2. Bagi kedua sisi dengan 2: x = 4<br>3. Cek: 2 × 4 + 4 = 12. Jadi jawabannya benar.` 
      }
    ],
    review: `2x + 4 = 12\n↓\nkurangi 4\n↓\n2x = 8\n↓\nbagi 2\n↓\nx = 4`,
    quiz: [
      { q: '3x + 6 = 15. Nilai x adalah?', choices: ['2', '3', '4', '5'], answer: 1, hint: 'Kurangi 6, lalu bagi 3.' },
      { q: 'x - 4 = 9. Nilai x adalah?', choices: ['5', '13', '36', '4'], answer: 1, hint: 'Tambahkan 4 ke kedua sisi.' },
      { q: '4x + 8 = 24. Nilai x adalah?', choices: ['2', '4', '8', '6'], answer: 1, hint: 'Kurangi 8 dulu.' },
      { q: '2x = 14. Nilai x adalah?', choices: ['7', '12', '16', '28'], answer: 0, hint: 'Bagi 2.' },
      { q: 'Pada 5x + 2, koefisien x adalah?', choices: ['2', '5', 'x', '7'], answer: 1, hint: 'Koefisien adalah angka didepan variabel.' }
    ],
    gate: { q: '2x + 4 = 12. Nilai x adalah?', choices: ['2', '4', '6', '8'], answer: 1, hint: 'Kurangi 4 dari kedua sisi.' },
    boss: [
      { q: 'x + 7 = 15. Nilai x?', choices: ['7', '8', '9', '22'], answer: 1, hint: 'Kurangi 7.' },
      { q: '5x = 20. Nilai x?', choices: ['4', '5', '15', '25'], answer: 0, hint: 'Bagi 20 dengan 5.' },
      { q: '3x - 3 = 12. Nilai x?', choices: ['3', '4', '5', '6'], answer: 2, hint: 'Tambah 3 dulu.' }
    ],
    bossName: 'ALGEBRA MONSTER'
  },
  {
    id: 2,
    name: 'Desa Pecahan',
    emoji: '🏘️',
    intro: 'Desa ini dilanda misteri pecahan. Pelajari penjumlahan, pengurangan, perkalian, dan pembagian pecahan.',
    theme: {
      sky: '#ffd9a8',
      skyGlow: '#fff2d5',
      ground: '#9a6a4d',
      platformTop: '#d0b26d',
      gate: '#6f5f7a',
      boss: '#be6b42',
      enemy: '#9d4d4d',
      accent: '#ffd166'
    },
    materials: [
      { title: 'PENGERTIAN PECAHAN', content: 'Pecahan menunjukkan sebagian dari satu keseluruhan.<br><br>Pembilang adalah angka di atas. Penyebut adalah angka di bawah.<br><br>Contoh: 1/2 berarti satu dari dua bagian yang sama besar, yaitu setengah.<br>3/4 berarti tiga dari empat bagian.' },
      { title: 'PENJUMLAHAN PECAHAN', content: 'Jika penyebutnya sama, penyebut tetap dan pembilang dijumlahkan.<br><br>Contoh: 1/5 + 2/5 = 3/5<br>Karena kedua penyebut sama-sama 5, kita cukup menjumlahkan 1 + 2.' },
      { title: 'PENGURANGAN PECAHAN', content: 'Jika penyebutnya sama, penyebut tetap dan pembilang dikurangi.<br><br>Contoh: 3/5 - 1/5 = 2/5<br>Kurangi angka atas: 3 - 1 = 2. Angka bawah tetap 5.' },
      { title: 'PERKALIAN & PEMBAGIAN', content: 'Untuk perkalian, kalikan pembilang dengan pembilang dan penyebut dengan penyebut.<br><br>Contoh: 1/2 × 2/3 = 2/6 = 1/3<br><br>Untuk pembagian, balik pecahan kedua lalu kalikan:<br>1/3 ÷ 1/6 = 1/3 × 6/1 = 2.' }
    ],
    review: `1/2 + 1/2 = 1\n↓\npenyebut sama\n↓\n1+1 = 2\n↓\n2/2 = 1`,
    quiz: [
      { q: '1/4 + 2/4 = ?', choices: ['2/4', '3/4', '3/8', '1/2'], answer: 1, hint: 'Jumlahkan pembilang.' },
      { q: '3/5 - 1/5 = ?', choices: ['2/5', '4/5', '2/10', '1/5'], answer: 0, hint: 'Kurangi pembilang.' },
      { q: '1/2 × 2/3 = ?', choices: ['2/5', '1/3', '2/6', '3/2'], answer: 1, hint: 'Kalikan pembilang dan penyebut.' },
      { q: '1/3 ÷ 1/6 = ?', choices: ['1/18', '2', '1/2', '6'], answer: 1, hint: 'Kalikan dengan kebalikan.' },
      { q: 'Pecahan senilai dengan 1/2 adalah?', choices: ['1/3', '2/4', '2/3', '3/5'], answer: 1, hint: 'Kali pembilang dan penyebut dengan 2.' }
    ],
    gate: { q: '2/5 + 1/5 = ?', choices: ['3/10', '3/5', '2/5', '1/5'], answer: 1, hint: 'Penyebut tetap, pembilang dijumlahkan.' },
    boss: [
      { q: '3/8 + 2/8 = ?', choices: ['5/8', '5/16', '6/8', '1'], answer: 0, hint: 'Penyebut sama.' },
      { q: '2/3 × 3/5 = ?', choices: ['6/15', '2/5', '5/6', '1/5'], answer: 1, hint: 'Sederhanakan 6/15.' },
      { q: '3/4 ÷ 1/2 = ?', choices: ['3/8', '3/2', '2/3', '1/2'], answer: 1, hint: 'Kali dengan kebalikan 2/1.' }
    ],
    bossName: 'FRACTION GOBLIN'
  },
  {
    id: 3,
    name: 'Kastil Geometri',
    emoji: '🏰',
    intro: 'Kastil ini hanya terbuka bila kamu menguasai luas dan keliling bangun datar.',
    theme: {
      sky: '#b7d0ff',
      skyGlow: '#edf4ff',
      ground: '#5a4a73',
      platformTop: '#7bc6ba',
      gate: '#3f5d7a',
      boss: '#d88d47',
      enemy: '#5d4978',
      accent: '#f6d365'
    },
    materials: [
      { title: 'PERSEGI', content: 'Persegi memiliki empat sisi yang sama panjang.<br><br>Luas = sisi × sisi<br>Keliling = 4 × sisi<br><br>Jika sisi = 6 cm:<br>Luas = 6 × 6 = 36 cm²<br>Keliling = 4 × 6 = 24 cm.' },
      { title: 'PERSEGI PANJANG', content: 'Persegi panjang memiliki panjang dan lebar.<br><br>Luas = panjang × lebar<br>Keliling = 2 × (panjang + lebar)<br><br>Untuk panjang 8 cm dan lebar 3 cm:<br>Luas = 8 × 3 = 24 cm².' },
      { title: 'SEGITIGA', content: 'Segitiga memiliki alas dan tinggi.<br><br>Luas = (alas × tinggi) / 2<br><br>Jika alas 10 cm dan tinggi 6 cm:<br>Luas = (10 × 6) / 2 = 30 cm².<br>Jangan lupa membagi 2.' },
      { title: 'KELILING', content: 'Keliling adalah jarak mengelilingi seluruh sisi bangun.<br><br>Caranya, jumlahkan semua sisi yang terlihat.<br>Persegi sisi 5 cm: 5 + 5 + 5 + 5 = 20 cm.' }
    ],
    review: `Luas persegi 7 × 7 = 49\n↓\nKeliling = 4 × 7 = 28`,
    quiz: [
      { q: 'Sisi persegi 6 cm. Luasnya?', choices: ['12', '24', '36', '48'], answer: 2, hint: 'Luas persegi = s × s.' },
      { q: 'Sisi persegi 5 cm. Kelilingnya?', choices: ['10', '20', '25', '15'], answer: 1, hint: 'Keliling = 4 × s.' },
      { q: 'Persegi panjang 8 × 3. Luasnya?', choices: ['11', '22', '24', '48'], answer: 2, hint: 'p × l.' },
      { q: 'Persegi panjang p=10, l=4. Kelilingnya?', choices: ['14', '28', '40', '20'], answer: 1, hint: '2 × (p + l).' },
      { q: 'Segitiga alas 10 dan tinggi 6. Luasnya?', choices: ['16', '30', '60', '8'], answer: 1, hint: 'Jangan lupa dibagi 2.' }
    ],
    gate: { q: 'Persegi panjang 7 × 5. Luasnya?', choices: ['12', '24', '35', '70'], answer: 2, hint: 'Luas = p × l.' },
    boss: [
      { q: 'Keliling persegi sisi 9 adalah?', choices: ['18', '36', '81', '27'], answer: 1, hint: '4 × 9.' },
      { q: 'Luas segitiga alas 8 tinggi 5 adalah?', choices: ['20', '40', '13', '80'], answer: 0, hint: '(8 × 5) / 2.' },
      { q: 'Keliling segitiga 6, 6, 4 adalah?', choices: ['16', '12', '24', '10'], answer: 0, hint: 'Jumlah semua sisi.' }
    ],
    bossName: 'GEOMETRY KNIGHT'
  },
  {
    id: 4,
    name: 'Gunung Perbandingan',
    emoji: '⛰️',
    intro: 'Gunung ini menantang rasio dan perbandingan senilai serta berbalik nilai.',
    theme: {
      sky: '#d9d4ff',
      skyGlow: '#f1ebff',
      ground: '#806b53',
      platformTop: '#c7b28c',
      gate: '#5d4f8a',
      boss: '#b95539',
      enemy: '#4d3d6b',
      accent: '#ffd75a'
    },
    materials: [
      { title: 'RASIO', content: 'Rasio membandingkan dua jumlah dengan urutan yang jelas.<br><br>3 : 5 dibaca tiga berbanding lima. Artinya, setiap 3 bagian pertama dibandingkan dengan 5 bagian kedua.' },
      { title: 'PERBANDINGAN SENILAI', content: 'Pada perbandingan senilai, jika satu jumlah bertambah, jumlah lainnya ikut bertambah.<br><br>2 kue membutuhkan 4 telur.<br>6 kue berarti tiga kali lebih banyak, jadi membutuhkan 12 telur.' },
      { title: 'PERBANDINGAN BERBALIK NILAI', content: 'Pada perbandingan berbalik nilai, jika satu jumlah bertambah, jumlah lainnya berkurang.<br><br>2 pekerja menyelesaikan pekerjaan dalam 12 hari.<br>Jika pekerjanya menjadi 4, waktunya menjadi 6 hari.' },
      { title: 'MENYEDERHANAKAN RASIO', content: 'Bagi kedua angka dengan faktor yang sama sampai tidak bisa dibagi lagi.<br><br>8 : 12 dibagi 4 menjadi 2 : 3.<br>Rasio tetap sama, hanya bentuknya lebih sederhana.' }
    ],
    review: `4 : 10 = 2 : 5\n↓\nBagi kedua angka dengan 2`,
    quiz: [
      { q: 'Rasio 6 : 9 yang disederhanakan?', choices: ['2 : 3', '3 : 2', '6 : 3', '1 : 3'], answer: 0, hint: 'Bagi 6 dan 9 dengan 3.' },
      { q: '2 pensil Rp4.000. Harga 5 pensil?', choices: ['6.000', '8.000', '10.000', '12.000'], answer: 2, hint: 'Harga per pensil Rp2.000.' },
      { q: '3 orang menyelesaikan 12 hari. 6 orang menyelesaikan?', choices: ['6', '24', '9', '3'], answer: 0, hint: 'Semakin banyak orang, waktu semakin pendek.' },
      { q: '4 : 10 = ?', choices: ['2 : 4', '2 : 5', '4 : 5', '8 : 10'], answer: 1, hint: 'Sederhanakan dengan 2.' },
      { q: '1 peta = 2 km. 3 peta = ... km?', choices: ['3', '5', '6', '8'], answer: 2, hint: 'Kalikan 3.' }
    ],
    gate: { q: '5 : 15 disederhanakan?', choices: ['1 : 2', '1 : 3', '5 : 3', '3 : 1'], answer: 1, hint: 'Bagi kedua angka dengan 5.' },
    boss: [
      { q: '4 kue butuh 8 menit. 2 kue butuh?', choices: ['2', '4', '16', '6'], answer: 1, hint: 'Waktu ikut berkurang.' },
      { q: '3 mesin 18 jam. 9 mesin memerlukan?', choices: ['6', '54', '9', '12'], answer: 0, hint: 'Perbandingan berbalik nilai.' },
      { q: '12 : 18 = ?', choices: ['2 : 3', '3 : 2', '4 : 5', '6 : 12'], answer: 0, hint: 'Bagi 6.' }
    ],
    bossName: 'RATIO DRAGON'
  },
  {
    id: 5,
    name: 'Menara Statistika',
    emoji: '📊',
    intro: 'Menara statistik menguji data sederhana: mean, median, dan modus.',
    theme: {
      sky: '#a3e6d8',
      skyGlow: '#ecfff9',
      ground: '#4f5f61',
      platformTop: '#7cc9b0',
      gate: '#355b71',
      boss: '#db7d45',
      enemy: '#4a5868',
      accent: '#ffe77a'
    },
    materials: [
      { title: 'MEAN ATAU RATA-RATA', content: 'Mean diperoleh dengan menjumlahkan semua data, lalu membaginya dengan banyak data.<br><br>Data 4, 6, 8:<br>Jumlah = 4 + 6 + 8 = 18<br>Mean = 18 / 3 = 6.' },
      { title: 'MEDIAN ATAU NILAI TENGAH', content: 'Urutkan data dari kecil ke besar, lalu ambil nilai yang berada di tengah.<br><br>Data 2, 5, 9, 11, 20 memiliki 9 sebagai median karena 9 berada di posisi tengah.' },
      { title: 'MODUS ATAU DATA TERBANYAK', content: 'Modus adalah angka yang paling sering muncul.<br><br>Pada data 1, 2, 2, 2, 5, angka 2 muncul tiga kali. Jadi modusnya adalah 2.' },
      { title: 'MEMBACA DATA', content: 'Gunakan mean, median, dan modus untuk memahami kumpulan data.<br><br>Data 70, 80, 80, 90 memiliki mean 80 dan modus 80 karena 80 muncul paling sering.' }
    ],
    review: `Mean 5, 7, 9 = (5+7+9)/3 = 7`,
    quiz: [
      { q: 'Mean 4, 6, 8 adalah?', choices: ['6', '8', '18', '5'], answer: 0, hint: 'Jumlah dibagi 3.' },
      { q: 'Median 2, 5, 9, 11, 20 adalah?', choices: ['9', '11', '5', '10'], answer: 0, hint: 'Ambil angka tengah.' },
      { q: 'Modus 1, 2, 2, 2, 5 adalah?', choices: ['1', '2', '5', '12'], answer: 1, hint: 'Angka paling sering muncul.' },
      { q: 'Mean 10 dan 20 adalah?', choices: ['10', '15', '30', '20'], answer: 1, hint: '(10 + 20) / 2.' },
      { q: 'Data 3, 7, 7, 8. Modusnya?', choices: ['3', '7', '8', '6'], answer: 1, hint: '7 muncul 2 kali.' }
    ],
    gate: { q: 'Mean 5, 7, 9 adalah?', choices: ['6', '7', '9', '21'], answer: 1, hint: 'Jumlah dibagi 3.' },
    boss: [
      { q: 'Median 4, 6, 10, 12 adalah?', choices: ['6', '8', '10', '9'], answer: 1, hint: 'Rata-rata dua angka tengah.' },
      { q: 'Modus 4, 4, 5, 6, 6, 6 adalah?', choices: ['4', '5', '6', 'tidak ada'], answer: 2, hint: 'Paling sering muncul.' },
      { q: 'Mean 0, 10, 20 adalah?', choices: ['10', '15', '30', '20'], answer: 0, hint: 'Jumlah dibagi 3.' }
    ],
    bossName: 'STATISTICS GUARDIAN'
  }
];
const DIFFICULT_PRACTICE = {
  1: { q: '5(x - 2) + 3 = 28. Nilai x adalah?', choices: ['5', '6', '7', '8'], answer: 2, hint: 'Kurangi 3, bagi 5, lalu tambahkan 2.' },
  2: { q: '3/4 - 1/6 = ?', choices: ['5/12', '7/12', '2/8', '1/2'], answer: 1, hint: 'Samakan penyebut menjadi 12.' },
  3: { q: 'Persegi panjang berkeliling 34 cm dan panjang 10 cm. Luasnya?', choices: ['60 cm²', '70 cm²', '80 cm²', '90 cm²'], answer: 1, hint: 'Cari lebar dari 2(p + l) = 34.' },
  4: { q: 'Rasio siswa laki-laki dan perempuan 5 : 8. Jika total 52 siswa, jumlah laki-laki?', choices: ['15', '20', '25', '32'], answer: 1, hint: 'Jumlah bagian 13, lalu cari nilai satu bagian.' },
  5: { q: 'Mean 6, 8, 10, dan x adalah 9. Nilai x?', choices: ['10', '11', '12', '13'], answer: 2, hint: 'Jumlah seluruh data harus 36.' }
};
function formatMathText(text = '') {
  return String(text).replace(/(\d+)\s*\/\s*(\d+)/g, '<span class="fraction"><span>$1</span><span>$2</span></span>');
}
function getPracticeQuestions(level) {
  return [...level.quiz, DIFFICULT_PRACTICE[level.id]];
}
function getLevelTheme(levelId) {
  const level = LEVELS.find((item) => item.id === levelId) || LEVELS[0];
  return level.theme || {
    sky: '#8fd5ff',
    skyGlow: '#dff8ff',
    ground: '#7a502d',
    platformTop: '#8cb560',
    gate: '#4e6c7b',
    boss: '#d65b2b',
    enemy: '#7a305a',
    accent: '#f4d55d'
  };
}
function buildLevelWorld(level) {
  const themes = getLevelTheme(level.id);
  const worldPresets = {
    1: {
      width: 1200,
      height: 270,
      groundY: 220,
      platforms: [
        { x: 0, y: 220, w: 260, h: 50 },
        { x: 320, y: 220, w: 180, h: 50 },
        { x: 560, y: 220, w: 200, h: 50 },
        { x: 820, y: 220, w: 180, h: 50 },
        { x: 1030, y: 220, w: 170, h: 50 }
      ],
      coins: [
        { x: 90, y: 185, r: 7 }, { x: 170, y: 160, r: 7 }, { x: 400, y: 170, r: 7 },
        { x: 660, y: 160, r: 7 }, { x: 890, y: 170, r: 7 }, { x: 1090, y: 150, r: 7 }
      ],
      enemies: [
        { x: 240, y: 200, w: 18, h: 20, min: 220, max: 360, dir: 1 },
        { x: 610, y: 200, w: 18, h: 20, min: 580, max: 740, dir: -1 },
        { x: 905, y: 200, w: 18, h: 20, min: 845, max: 1000, dir: 1 }
      ],
      gate: { x: 1100, y: 140, w: 46, h: 80 },
      bossZone: { x: 1125, y: 140, w: 70, h: 80 }
    },
    2: {
      width: 1200,
      height: 270,
      groundY: 220,
      platforms: [
        { x: 0, y: 220, w: 200, h: 50 },
        { x: 270, y: 180, w: 130, h: 40 },
        { x: 470, y: 210, w: 180, h: 60 },
        { x: 720, y: 180, w: 150, h: 40 },
        { x: 950, y: 220, w: 250, h: 50 }
      ],
      coins: [
        { x: 110, y: 180, r: 7 }, { x: 330, y: 140, r: 7 }, { x: 520, y: 170, r: 7 },
        { x: 790, y: 140, r: 7 }, { x: 1070, y: 180, r: 7 }
      ],
      enemies: [
        { x: 260, y: 200, w: 18, h: 20, min: 210, max: 390, dir: 1 },
        { x: 580, y: 200, w: 18, h: 20, min: 500, max: 670, dir: -1 },
        { x: 920, y: 200, w: 18, h: 20, min: 850, max: 1050, dir: 1 }
      ],
      gate: { x: 1105, y: 140, w: 46, h: 80 },
      bossZone: { x: 1128, y: 140, w: 70, h: 80 }
    },
    3: {
      width: 1200,
      height: 270,
      groundY: 220,
      platforms: [
        { x: 0, y: 220, w: 190, h: 50 },
        { x: 260, y: 210, w: 140, h: 60 },
        { x: 490, y: 170, w: 120, h: 50 },
        { x: 700, y: 210, w: 160, h: 60 },
        { x: 960, y: 220, w: 240, h: 50 }
      ],
      coins: [
        { x: 110, y: 175, r: 7 }, { x: 320, y: 170, r: 7 }, { x: 535, y: 130, r: 7 },
        { x: 750, y: 170, r: 7 }, { x: 1040, y: 180, r: 7 }
      ],
      enemies: [
        { x: 230, y: 200, w: 18, h: 20, min: 200, max: 400, dir: -1 },
        { x: 590, y: 200, w: 18, h: 20, min: 520, max: 680, dir: 1 },
        { x: 920, y: 200, w: 18, h: 20, min: 850, max: 1060, dir: -1 }
      ],
      gate: { x: 1100, y: 140, w: 46, h: 80 },
      bossZone: { x: 1128, y: 140, w: 70, h: 80 }
    },
    4: {
      width: 1200,
      height: 270,
      groundY: 220,
      platforms: [
        { x: 0, y: 220, w: 220, h: 50 },
        { x: 290, y: 170, w: 150, h: 40 },
        { x: 530, y: 210, w: 160, h: 60 },
        { x: 760, y: 160, w: 150, h: 40 },
        { x: 980, y: 220, w: 220, h: 50 }
      ],
      coins: [
        { x: 100, y: 180, r: 7 }, { x: 350, y: 130, r: 7 }, { x: 600, y: 170, r: 7 },
        { x: 820, y: 120, r: 7 }, { x: 1060, y: 180, r: 7 }
      ],
      enemies: [
        { x: 250, y: 200, w: 18, h: 20, min: 210, max: 420, dir: 1 },
        { x: 640, y: 200, w: 18, h: 20, min: 560, max: 760, dir: -1 },
        { x: 900, y: 200, w: 18, h: 20, min: 840, max: 1040, dir: 1 }
      ],
      gate: { x: 1100, y: 140, w: 46, h: 80 },
      bossZone: { x: 1125, y: 140, w: 70, h: 80 }
    },
    5: {
      width: 1200,
      height: 270,
      groundY: 220,
      platforms: [
        { x: 0, y: 220, w: 230, h: 50 },
        { x: 260, y: 190, w: 160, h: 40 },
        { x: 500, y: 210, w: 180, h: 60 },
        { x: 760, y: 175, w: 150, h: 45 },
        { x: 980, y: 220, w: 220, h: 50 }
      ],
      coins: [
        { x: 110, y: 180, r: 7 }, { x: 330, y: 150, r: 7 }, { x: 575, y: 170, r: 7 },
        { x: 815, y: 135, r: 7 }, { x: 1040, y: 180, r: 7 }
      ],
      enemies: [
        { x: 230, y: 200, w: 18, h: 20, min: 200, max: 410, dir: -1 },
        { x: 620, y: 200, w: 18, h: 20, min: 540, max: 750, dir: 1 },
        { x: 930, y: 200, w: 18, h: 20, min: 850, max: 1070, dir: -1 }
      ],
      gate: { x: 1100, y: 140, w: 46, h: 80 },
      bossZone: { x: 1128, y: 140, w: 70, h: 80 }
    }
  };
  const preset = worldPresets[level.id] || worldPresets[1];
  return {
    ...preset,
    levelName: level.name,
    theme: themes
  };
}
function defaultSave() {
  const levels = {};
  LEVELS.forEach((level, index) => {
    levels[level.id] = {
      unlocked: index === 0,
      completed: false,
      materiDone: false,
      latihanPassed: false,
      preparationRewardClaimed: false,
      practiceBest: 0,
      xp: 0,
      score: 0,
      coins: 0
    };
  });
  return { xp: 0, score: 0, allMapsUnlocked: false, levels };
}
function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSave();
    const saved = JSON.parse(raw);
    return { ...defaultSave(), ...saved, levels: { ...defaultSave().levels, ...(saved.levels || {}) } };
  } catch {
    return defaultSave();
  }
}
const state = {
  save: loadSave(),
  player: loadPlayer(),
  currentLevel: 1,
  currentMaterialPage: 0,
  currentPracticeIndex: 0,
  currentPracticeCorrect: 0,
  game: null,
  bossRound: null,
  selectedDevice: localStorage.getItem(MODE_KEY) || null,
  currentMode: localStorage.getItem(MODE_KEY) || null,
  showModeSelection: !(localStorage.getItem(MODE_KEY)),
  screenHistory: ['home'],
  isGameOver: false,
  recoveryFlow: null,
  premiumAccess: { ready: false, active: false, loading: false },
  auth: null,
  currentUser: null
};
if (!state.currentMode && state.player.mode) {
  state.currentMode = state.player.mode;
  state.selectedDevice = state.player.mode;
  localStorage.setItem(MODE_KEY, state.player.mode);
}
state.player.mode = state.currentMode || state.player.mode || 'desktop';
state.selectedDevice = state.currentMode || state.selectedDevice || state.player.mode || 'desktop';
// XP and score have one canonical home: the save object. Migrate older player-only
// values conservatively so an older build cannot silently erase progress.
state.save.xp = Math.max(Number(state.save.xp) || 0, Number(state.player.xp) || 0);
state.save.score = Math.max(Number(state.save.score) || 0, Number(state.player.score) || 0);
state.player.xp = state.save.xp;
state.player.score = state.save.score;
state.player.life = clampLives(state.player.life);
function navigateScreen(name, options = {}) {
  const { recordHistory = true } = options;
  const last = state.screenHistory[state.screenHistory.length - 1];
  if (recordHistory && last !== name) {
    state.screenHistory.push(name);
    if (state.screenHistory.length > 8) state.screenHistory.shift();
  }
  showScreen(name);
}
function saveState() {
  state.save.score = Number(state.save.score) || 0;
  state.save.xp = Number(state.save.xp) || 0;
  state.player.score = state.save.score;
  state.player.xp = state.save.xp;
  state.player.mode = state.currentMode || state.player.mode || 'desktop';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.save));
  savePlayer();
  if (window.mbgAuth?.user && window.mbgAuth.user.role === 'user' && state.premiumAccess.active) {
    window.mbgAuth.saveProgress({
      ...state.save,
      ...state.player,
      currentLevel: state.currentLevel,
      currentMaterialPage: state.currentMaterialPage,
      currentPracticeIndex: state.currentPracticeIndex
    }).catch((error) => console.warn('Progress gagal disimpan:', error));
  }
}
function applyDeviceMode() {
  const device = state.currentMode || state.selectedDevice || state.player.mode || 'desktop';
  state.player.mode = device;
  state.currentMode = device;
  state.selectedDevice = device;
  localStorage.setItem(MODE_KEY, device);
  document.body.dataset.mode = device;
  document.body.dataset.device = device;
  document.body.classList.remove('device-mobile', 'device-desktop');
  document.body.classList.add(`device-${device}`);
  updateDeviceSelectionUI();
}
function isFullscreen() {
  return document.fullscreenElement === document.documentElement;
}
function updateFullscreenUI() {
  const button = document.getElementById('fullscreen-toggle');
  if (!button) return;
  const active = isFullscreen();
  button.textContent = active ? '⛶ EXIT FULL SCREEN' : '⛶ FULL SCREEN';
  button.setAttribute('aria-pressed', String(active));
}
async function requestGameFullscreen() {
  if (document.fullscreenElement) {
    updateFullscreenUI();
    return;
  }
  if (document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      if (error.name !== 'NotAllowedError') console.warn('Fullscreen tidak tersedia:', error);
    }
  }
  if (state.currentMode === 'mobile' && screen.orientation?.lock) {
    try {
      await screen.orientation.lock('landscape');
    } catch (error) {
      if (error.name !== 'NotSupportedError' && error.name !== 'SecurityError') {
        console.warn('Orientasi landscape tidak dapat dikunci:', error);
      }
    }
  }
  updateFullscreenUI();
}
async function toggleFullscreen() {
  if (isFullscreen()) {
    if (document.exitFullscreen) await document.exitFullscreen();
  } else {
    await requestGameFullscreen();
  }
  updateFullscreenUI();
}
function updateDeviceSelectionUI() {
  const deviceButtons = document.querySelectorAll('[data-device]');
  deviceButtons.forEach((button) => {
    const active = state.currentMode === button.dataset.device;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const modeButton = document.getElementById('ganti-mode');
  if (modeButton) {
    modeButton.textContent = state.currentMode ? `GANTI MODE (${state.currentMode.toUpperCase()})` : 'GANTI MODE';
  }
}
function renderApp() {
  const modeSelection = document.getElementById('mode-selection');
  const mainApp = document.getElementById('main-app');
  if (!state.premiumAccess.ready || !state.premiumAccess.active) {
    if (modeSelection) modeSelection.style.display = 'none';
    if (mainApp) mainApp.classList.add('app-hidden');
    renderAuthGate();
    return;
  }
  if (!state.currentMode) {
    state.showModeSelection = true;
    if (modeSelection) modeSelection.style.display = 'flex';
    if (mainApp) mainApp.classList.add('app-hidden');
    const premiumGate = document.getElementById('premium-gate');
    if (premiumGate) premiumGate.hidden = true;
    document.body.dataset.mode = 'selection';
    document.body.classList.remove('device-mobile', 'device-desktop');
    return;
  }
  state.showModeSelection = false;
  if (modeSelection) modeSelection.style.display = 'none';
  if (mainApp) mainApp.classList.remove('app-hidden');
  applyDeviceMode();
  const logoutButton = document.getElementById('user-logout');
  if (logoutButton) logoutButton.hidden = state.auth?.profile?.role !== 'user';
  renderHome();
  renderMapList('map');
  showScreen('home');
}
function renderAuthGate() {
  const gate = document.getElementById('premium-gate');
  const locked = document.getElementById('access-locked');
  const admin = document.getElementById('admin-panel');
  const logoutButton = document.getElementById('user-logout');
  if (logoutButton) logoutButton.hidden = true;
  if (!state.premiumAccess.ready) {
    gate.hidden = false;
    locked.hidden = true;
    admin.hidden = true;
    document.getElementById('premium-status').textContent = 'Pilih ADMIN atau USER, lalu masukkan kode akses.';
    return;
  }
  gate.hidden = true;
  if (state.auth?.profile?.role === 'admin' || state.currentUser?.role === 'admin') {
    admin.hidden = false;
    locked.hidden = true;
    renderAdminUsers();
  } else if (!state.premiumAccess.active) {
    locked.hidden = false;
    admin.hidden = true;
    document.getElementById('access-locked-copy').textContent = `Akun ${state.auth?.user?.name || ''} belum aktif. Hubungi admin untuk mendapatkan kode baru.`;
  }
}
async function handleAuthReady(event) {
  const detail = event.detail;
  state.auth = detail;
  state.currentUser = detail.user || null;
  state.premiumAccess.ready = Boolean(detail.user);
  state.premiumAccess.active = Boolean(detail.profile?.active);
  if (detail.progress) {
    state.save = { ...state.save, ...detail.progress };
    state.player = { ...state.player, ...detail.progress };
    state.player.coins = Number(detail.progress.coins ?? state.player.coins) || 0;
    state.player.xp = Number(detail.progress.xp ?? state.player.xp) || 0;
    state.player.score = Number(detail.progress.score ?? state.player.score) || 0;
    state.player.life = clampLives(detail.progress.life ?? state.player.life);
    state.player.selectedCharacter = detail.progress.selectedCharacter || state.player.selectedCharacter;
    state.player.shopOwned = Array.isArray(detail.progress.shopOwned) ? detail.progress.shopOwned : state.player.shopOwned;
    state.player.equippedEffect = detail.progress.equippedEffect ?? state.player.equippedEffect;
    state.player.equippedItems = {
      ...defaultPlayer().equippedItems,
      ...(detail.progress.equippedItems || {})
    };
    state.save.xp = state.player.xp;
    state.save.score = state.player.score;
    state.save.allMapsUnlocked = Boolean(detail.progress.allMapsUnlocked);
    if (Array.isArray(detail.progress.unlockedLevels)) {
      detail.progress.unlockedLevels.forEach((levelId) => {
        if (state.save.levels[levelId]) state.save.levels[levelId].unlocked = true;
      });
    }
    const cloudLevel = Number(detail.progress.level);
    if (cloudLevel > 0) {
      state.currentLevel = Math.min(LEVELS.length, cloudLevel);
      state.player.currentLevel = state.currentLevel;
    }
    if (state.save.allMapsUnlocked) {
      LEVELS.forEach((level) => {
        if (state.save.levels[level.id]) state.save.levels[level.id].unlocked = true;
      });
    }
    state.currentLevel = Number(detail.progress.currentLevel || state.currentLevel);
    state.currentMaterialPage = Number(detail.progress.currentMaterialPage || 0);
    state.currentPracticeIndex = Number(detail.progress.currentPracticeIndex || 0);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.save));
    } catch {}
    savePlayer();
  }
  if (!detail.user) {
    const modeSelection = document.getElementById('mode-selection');
    const mainApp = document.getElementById('main-app');
    if (modeSelection) modeSelection.style.display = 'none';
    if (mainApp) mainApp.classList.add('app-hidden');
    renderAuthGate();
    return;
  }
  if (detail.profile?.role === 'admin') {
    renderAuthGate();
    return;
  }
  function showAccountDisabled(message) {
    stopGame();
    document.querySelectorAll('#premium-gate, #access-locked, #admin-panel, #mode-selection, #main-app').forEach((element) => {
      if (element) element.hidden = element.id !== 'account-disabled';
    });
    const copy = document.getElementById('account-disabled-message');
    if (copy) copy.textContent = message || 'Silakan hubungi admin untuk mengetahui informasi lebih lanjut.';
  }
  if (state.premiumAccess.active) {
    document.getElementById('premium-gate').hidden = true;
    document.getElementById('access-locked').hidden = true;
    renderApp();
  } else {
    renderAuthGate();
  }
}
async function loginWithCode(role) {
  if (role === 'admin') {
    loginAdmin();
    return;
  }
  try {
    const input = document.getElementById(role === 'admin' ? 'admin-code' : 'user-login-code');
    const code = input?.value.trim();
    if (!code) throw new Error('Kode wajib diisi.');
    document.getElementById('premium-status').textContent = 'MEMUAT AKUN...';
    const result = await getAuthApi().loginUser(code);
    handleAuthReady(new CustomEvent('mbg-auth-ready', { detail: { user: result.user, profile: result.user, progress: result.progress } }));
  } catch (error) {
    document.getElementById('premium-status').textContent = error.message;
  }

}

async function loginAdmin() {
  const input = document.getElementById('admin-code');
  const code = input ? input.value.trim() : '';
  const status = document.getElementById('premium-status');
  if (!code) {
    toast('❌ Masukkan kode admin.');
    if (status) status.textContent = '❌ Masukkan kode admin.';
    return;
  }

  if (status) status.textContent = 'Memverifikasi kode admin...';

  try {
    const authApi = getAuthApi();
    if (typeof authApi.loginAdmin === 'function') {
      await authApi.loginAdmin(code);
    }
  } catch (error) {
    console.error('[MBG] Login admin error:', error);
    toast(`❌ ${error.message || 'KODE ADMIN SALAH'}`);
    if (status) status.textContent = `❌ ${error.message || 'KODE ADMIN SALAH'}`;
    return;
  }

  state.currentUser = { role: 'admin', name: 'Administrator' };
  state.auth = { user: state.currentUser, profile: state.currentUser };
  state.premiumAccess.ready = true;
  state.premiumAccess.active = true;

  const gate = document.getElementById('premium-gate');
  const locked = document.getElementById('access-locked');
  const admin = document.getElementById('admin-panel');
  if (gate) gate.hidden = true;
  if (locked) locked.hidden = true;
  if (admin) admin.hidden = false;
  toast('Login admin berhasil');
  await renderAdminUsers();
}

window.loginAdmin = loginAdmin;

function getAuthApi() {
  if (!window.mbgAuth) {
    throw new Error('Account API is undefined');
  }
  return window.mbgAuth;
}

async function createUserAccount(name) {
  const normalizedName = String(name || '').trim();
  if (!normalizedName) throw new Error('Nama user wajib diisi.');
  if (normalizedName.length > 60) throw new Error('Nama user terlalu panjang.');
  try {
    const result = await getAuthApi().createUser(normalizedName);
    console.info('[MBG][CREATE USER] Akun berhasil dibuat:', result.uid);
    return result;
  } catch (error) {
    console.error('[MBG][CREATE USER]', error);
    throw error;
  }
}

function openAdminEditModal(user) {
  openModal({
    html: `<div class="admin-edit-form">
      <div class="character-modal-title">EDIT AKUN USER</div>
      <label>Nama<input id="edit-user-name" value="${user.name || ''}" maxlength="60"></label>
      <label>Kode Login<input id="edit-user-loginCode" value="${user.loginCode || ''}" maxlength="9" placeholder="MBG-XXXXX"></label>
      ${['level', 'xp', 'score', 'coins', 'life', 'unlockedLevel'].map((field) => `<label>${field.toUpperCase()}<input id="edit-user-${field}" type="number" min="0" step="1" value="${Number(user[field]) || 0}"></label>`).join('')}
      <label>Karakter<input id="edit-user-character" value="${user.selectedCharacter || 'hero'}"></label>
      <label><input id="edit-user-allMapsUnlocked" type="checkbox" ${user.allMapsUnlocked ? 'checked' : ''}> BUKA SEMUA MAP</label>
      <label><input id="edit-user-allItemsUnlocked" type="checkbox" ${user.allItemsUnlocked ? 'checked' : ''}> BUKA SEMUA ITEM SHOP</label>
      <label>Status<select id="edit-user-active"><option value="true" ${user.active ? 'selected' : ''}>AKTIF</option><option value="false" ${!user.active ? 'selected' : ''}>NONAKTIF</option></select></label>
      <hr>
      <div class="character-modal-title">TOP UP / TAMBAH REWARD</div>
      ${['level', 'xp', 'score', 'coins', 'life'].map((field) => `<label>+ ${field.toUpperCase()}<input id="topup-user-${field}" type="number" min="0" step="1" value="0"></label>`).join('')}
      <button type="button" class="pixel-btn" data-action="admin-topup-user" data-admin-edit-uid="${user.uid}">TERAPKAN TOP UP</button>
      <button type="button" class="pixel-btn danger" data-action="admin-reset-user" data-admin-edit-uid="${user.uid}">RESET PROGRESS</button>
    </div>`,
    primaryLabel: 'SIMPAN PERUBAHAN',
    primaryAction: 'admin-save-user',
    secondaryLabel: 'BATAL',
    secondaryAction: 'close-modal',
    tertiaryLabel: '',
    tertiaryAction: ''
  });
  const primary = document.getElementById('modal-primary');
  if (primary) primary.dataset.adminEditUid = user.uid;
}

async function renderAdminUsers() {
  const target = document.getElementById('admin-users');
  const status = document.getElementById('admin-status');
  if (!target || !window.mbgAuth) return;
  if (!sessionStorage.getItem('mbgSessionToken')) {
    status.textContent = 'Sesi admin belum aktif. Silakan login kembali.';
    return;
  }
  try {
    status.textContent = 'Memuat daftar user...';
    const users = await getAuthApi().listUsers();
    if (!users || !users.length) {
      target.innerHTML = '<div style="padding:20px;text-align:center;color:#8ba3bc;font-size:0.9rem;">Belum ada akun user terdaftar.<br>Buat akun user baru melalui form di atas.</div>';
      status.textContent = '0 akun terdaftar.';
      return;
    }
    target.innerHTML = users.map((user) => `
      <div class="admin-user-row">
        <span><strong>${user.name || 'Tanpa nama'}</strong><small>KODE ${user.loginCode || '—'} · LV ${user.level || 1} · XP ${user.xp || 0} · SCORE ${user.score || 0} · KOIN ${user.coins || 0} · ${user.sessions?.length || 0} DEVICE/SESSION AKTIF · LOGIN ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('id-ID') : 'BELUM PERNAH'}</small></span>
        <b>${user.active ? 'AKTIF' : 'NONAKTIF'}</b>
        <button type="button" class="pixel-btn mini" data-admin-edit="${encodeURIComponent(JSON.stringify(user))}">EDIT</button>
        <button type="button" class="pixel-btn mini" data-admin-user="${user.uid}" data-admin-active="${user.active}">${user.active ? 'NONAKTIFKAN' : 'AKTIFKAN'}</button>
      </div>
    `).join('');
    status.textContent = `${users.length} akun terdaftar.`;
  } catch (error) {
    status.textContent = error.message;
  }
}
function selectDevice(mode) {
  state.selectedDevice = mode;
  state.currentMode = mode;
  state.player.mode = mode;
  state.showModeSelection = false;
  localStorage.setItem(MODE_KEY, mode);
  savePlayer();
  renderApp();
  toast(`Mode aktif: ${mode.toUpperCase()}`);
}
function changeMode() {
  state.selectedDevice = null;
  state.currentMode = null;
  state.player.mode = 'desktop';
  state.showModeSelection = true;
  localStorage.removeItem(MODE_KEY);
  savePlayer();
  renderApp();
}
function renderHome() {
  const totalUnlocked = LEVELS.filter((l) => state.save.levels[l.id].unlocked).length;
  const selectedCharacter = CHARACTERS.find((character) => character.id === state.player.selectedCharacter) || CHARACTERS[0];
  const stats = document.getElementById('home-stats');
  const userName = state.auth?.user?.name || state.auth?.profile?.name || state.currentUser?.name;
  const worldPlayer = document.getElementById('world-player-name');
  if (worldPlayer) worldPlayer.textContent = `PLAYER: ${userName ? userName : 'MEMUAT...'}`;
  if (stats) {
    stats.innerHTML = `
      <div class="stat-pill"><span class="stat-icon icon-xp">XP</span><strong>${state.save.xp}</strong><small>EXPERIENCE</small></div>
      <div class="stat-pill"><span class="stat-icon icon-score">SC</span><strong>${state.save.score}</strong><small>SCORE</small></div>
      <div class="stat-pill"><span class="stat-icon icon-coins">◎</span><strong>${state.player.coins}</strong><small>KOIN</small></div>
      <div class="stat-pill"><span class="stat-icon icon-progress">LV</span><strong>${totalUnlocked}/5</strong><small>LEVEL</small></div>
      <div class="stat-pill"><span class="stat-icon icon-mode">♙</span><strong>${selectedCharacter.name}</strong><small>KARAKTER</small></div>
    `;
  }
  renderCharacterPreview();
}

async function logoutCurrentUser() {
  if (!window.confirm('Apakah kamu yakin ingin logout?')) return;
  try {
    await getAuthApi().logout();
  } catch (error) {
    const status = document.getElementById('premium-status');
    if (status) status.textContent = error.message;
  }
}
function renderCharacterPreview() {
  const wrap = document.getElementById('home-character-preview');
  if (!wrap) return;
  const selected = CHARACTERS.find((c) => c.id === state.player.selectedCharacter) || CHARACTERS[0];
  wrap.innerHTML = `<div class="character-avatar ${selected.cls}">${selected.icon}</div><div><strong>${selected.name}</strong><small>${selected.desc}</small></div>`;
}
function renderShopModal() {
  const categories = [...new Set(SHOP_ITEMS.map((item) => item.category))];
  openModal({
    html: `<div class="shop-modal"><div class="character-modal-title">COIN LAB · SHOP</div><div class="shop-modal-balance">◎ ${state.player.coins} KOIN</div>${categories.map((category) => `<section class="shop-category"><h4>${category}</h4><div class="shop-grid">${SHOP_ITEMS.filter((item) => item.category === category).map((item) => {
      const owned = hasShopItem(item.id);
      const equipped = item.category === 'EFEK' ? state.player.equippedEffect === item.id : state.player.equippedItems[item.category] === item.id;
      return `<article class="shop-item ${equipped ? 'equipped' : ''}"><div class="shop-icon">${item.icon}</div><div class="shop-item-copy"><h4>${item.name}</h4><p>${item.description}</p><small>${owned ? 'SUDAH DIMILIKI' : `HARGA ${item.price} KOIN`}</small></div><button type="button" class="pixel-btn mini ${equipped ? 'good' : owned ? '' : 'primary'}" data-shop-item="${item.id}" ${!owned && state.player.coins < item.price ? 'disabled' : ''}>${equipped ? 'DIPAKAI' : owned ? 'PAKAI' : 'BELI'}</button></article>`;
    }).join('')}</div></section>`).join('')}</div>`,
    primaryLabel: 'SELESAI', primaryAction: 'close-modal', secondaryLabel: '', secondaryAction: 'close-modal', tertiaryLabel: '', tertiaryAction: 'close-modal'
  });
}
function renderCharacterModal() {
  const selectedId = state.player.selectedCharacter || 'hero';
  openModal({
    html: `<div class="character-modal"><div class="character-modal-title">PILIH PETUALANGMU</div><div class="character-grid">${CHARACTERS.map((c) => `<button type="button" class="character-option ${selectedId === c.id ? 'selected' : ''}" data-character="${c.id}"><span class="character-option-avatar ${c.cls}">${c.icon}</span><strong>${c.name}</strong><small>${c.desc}</small></button>`).join('')}</div></div>`,
    primaryLabel: 'SELESAI', primaryAction: 'close-modal', secondaryLabel: 'BATAL', secondaryAction: 'close-modal', tertiaryLabel: '', tertiaryAction: ''
  });
}
function selectCharacter(id) {
  if (!CHARACTERS.some((c) => c.id === id)) return;
  state.player.selectedCharacter = id;
  savePlayer();
  renderCharacterPreview();
  renderCharacterModal();
  toast(`Karakter ${CHARACTERS.find((c) => c.id === id).name} dipilih.`);
}
function renderMapList(target = 'map') {
  const wrap = document.getElementById('map-list');
  if (!wrap) return;
  wrap.innerHTML = LEVELS.map((level) => {
    const save = state.save.levels[level.id];
    const badge = save.completed ? '✨ AREA UNLOCKED' : save.unlocked ? '🔓 TERBUKA' : '🔒 TERKUNCI';
    const cardClass = save.completed ? 'completed' : save.unlocked ? 'unlocked' : 'locked';
    return `
      <article class="map-card ${cardClass}">
        <div class="level-art level-art-${level.id}" aria-hidden="true"><span class="level-glyph">0${level.id}</span><i></i><i></i><i></i></div>
        <span class="map-badge">${badge}</span>
        <h3>LEVEL ${level.id} · ${level.name}</h3>
        <p>${level.intro}</p>
        <button class="pixel-btn ${save.unlocked ? 'primary' : ''}" data-enter="${level.id}" ${save.unlocked ? '' : 'disabled'}>${save.unlocked ? 'MASUK QUEST' : 'TERKUNCI'}</button>
      </article>
    `;
  }).join('');
  showScreen(target);
}
function showScreen(name) {
  const screens = document.querySelectorAll('.screen');
  const target = document.getElementById(`screen-${name}`);
  if (!target || !target.classList.contains('screen')) {
    console.error(`Screen tidak ditemukan: screen-${name}`);
    return;
  }
  if (name !== 'game' && state.game?.running) stopGame();
  if (name !== 'game' && isFullscreen() && document.exitFullscreen) {
    document.exitFullscreen().catch((error) => console.warn('Fullscreen tidak dapat ditutup:', error));
  }
  document.body.classList.toggle('game-active', name === 'game');
  screens.forEach((screen) => {
    screen.classList.remove('active');
    screen.setAttribute('aria-hidden', 'true');
  });
  target.classList.add('active');
  target.setAttribute('aria-hidden', 'false');
  updateFullscreenUI();
}
function openLevel(levelId) {
  state.currentLevel = levelId;
  const level = LEVELS.find((l) => l.id === levelId);
  const current = state.save.levels[levelId];
  document.getElementById('intro-card').innerHTML = `
    <div class="screen-header"><h2>🧙 MATH WIZARD</h2></div>
    <p>"Hei, petualang! Sebelum memasuki ${level.name}, kamu harus memahami variabel dan tantangan dunia ini."</p>
    <div class="example-box">${level.intro}</div>
    <div class="menu-stack spaced">
      <button class="pixel-btn primary" id="start-study">AJARI AKU</button>
      <button class="pixel-btn" data-go="map">← KEMBALI KE PETA</button>
    </div>
    <small>Checklist: ${current.materiDone ? '☑ Pelajari Materi' : '☐ Pelajari Materi'} · ${current.latihanPassed ? '☑ Selesaikan Latihan' : '☐ Selesaikan Latihan'} · ${current.completed ? '☑ Kalahkan Boss' : '☐ Kalahkan Boss'}</small>
  `;
  navigateScreen('intro');
}
function renderStudy() {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  const page = level.materials[state.currentMaterialPage];
  document.getElementById('materi-card').innerHTML = `
    <div class="screen-header"><h2>QUEST 0${level.id} · ${level.name}</h2></div>
    <h3>${page.title}</h3>
    <p>${formatMathText(page.content)}</p>
  `;
  document.getElementById('page-indicator').textContent = `${state.currentMaterialPage + 1}/${level.materials.length}`;
  document.getElementById('prev-page').disabled = state.currentMaterialPage === 0;
  document.getElementById('next-page').textContent = state.currentMaterialPage === level.materials.length - 1 ? 'SELESAI MATERI →' : 'LANJUT →';
  showScreen('materi');
}
function startStudy() {
  state.currentMaterialPage = 0;
  state.currentPracticeIndex = 0;
  state.currentPracticeCorrect = 0;
  renderStudy();
}
function startReview() {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  document.getElementById('review-card').innerHTML = `
    <div class="screen-header"><h2>⚡ QUICK REVIEW</h2></div>
    <p>"1 menit untuk mengingat kembali materi."</p>
    <div class="example-box">${formatMathText(level.review).replace(/\n/g, '<br>')}</div>
    <div class="menu-stack spaced">
      <button class="pixel-btn primary" id="start-practice">🧠 LATIHAN PERSIAPAN</button>
      <button class="pixel-btn" data-go="materi">📖 KEMBALI KE MATERI</button>
    </div>
  `;
  showScreen('review');
}
function renderPractice() {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  const questions = getPracticeQuestions(level);
  const question = questions[state.currentPracticeIndex];
  document.getElementById('practice-card').innerHTML = `
    <div class="screen-header"><h2>🧠 LATIHAN PERSIAPAN</h2></div>
    <p>Soal ${state.currentPracticeIndex + 1}/${questions.length}</p>
    <p>${formatMathText(question.q)}</p>
    <div class="choice-grid">
      ${question.choices.map((choice, index) => `<button class="pixel-btn choice-btn" data-practice-answer="${index}">${String.fromCharCode(65 + index)}. ${formatMathText(choice)}</button>`).join('')}
    </div>
    <div id="practice-feedback"></div>
  `;
  showScreen('practice');
}
function processPracticeAnswer(index) {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  const questions = getPracticeQuestions(level);
  const question = questions[state.currentPracticeIndex];
  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach((button) => button.disabled = true);
  const feedback = document.getElementById('practice-feedback');
  if (index === question.answer) {
    state.currentPracticeCorrect += 1;
    state.player.xp += 20;
    state.player.score += 20;
    state.save.xp = state.player.xp;
    state.save.score = state.player.score;
    feedback.innerHTML = `<div class="feedback-box">🎉 BENAR! Jawaban kamu tepat. +20 XP</div><button class="pixel-btn primary flow-btn" id="next-practice">LANJUT</button>`;
    SFX.ok();
  } else {
    loseLife();
    state.save.score = state.player.score;
    state.save.xp = state.player.xp;
    feedback.innerHTML = `<div class="feedback-box">❌ BELUM TEPAT<br>${question.hint}<br>❤️ Nyawa berkurang 1</div><button class="pixel-btn primary flow-btn" id="next-practice">LANJUT</button>`;
    if (state.player.life <= 0) {
      showLifeModal();
    }
    SFX.bad();
  }
  savePlayer();
  saveState();
}
function finishPractice() {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  const questions = getPracticeQuestions(level);
  const score = Math.round((state.currentPracticeCorrect / questions.length) * 100);
  const save = state.save.levels[level.id];
  save.latihanPassed = score >= PASS_SCORE;
  save.practiceBest = Math.max(save.practiceBest || 0, score);
  state.player.score = state.save.score;
  state.player.xp = state.save.xp;
  const card = document.getElementById('practice-card');
  if (score >= PASS_SCORE) {
    if (state.recoveryFlow === 'study') {
      state.player.life = 3;
      state.isGameOver = false;
      if (state.game) state.game.isGameOver = false;
      state.recoveryFlow = null;
      savePlayer();
      saveState();
      closeModal();
      toast('Belajar ulang berhasil! Nyawa kembali menjadi 3.');
      resumeGameAfterRecovery();
      return;
    }
    const beforeLife = state.player.life;
    const preparationReward = save.preparationRewardClaimed
      ? 0
      : Math.min(state.player.maxLife, beforeLife + RECOVERY_REWARD) - beforeLife;
    state.player.life = beforeLife + preparationReward;
    state.isGameOver = false;
    if (state.game) state.game.isGameOver = false;
    save.preparationRewardClaimed = true;
    savePlayer();
    saveState();
    closeModal();
    toast(`Persiapan selesai! +${preparationReward} nyawa. Quest dimulai!`);
    startQuest();
    return;
  } else {
    card.innerHTML = `
      <div class="screen-header"><h2>⚠️ PELAJARI KEMBALI MATERI</h2></div>
      <p>Benar: ${state.currentPracticeCorrect}/${questions.length}</p>
      <p>Nilai: ${score}%</p>
      <div class="menu-stack spaced">
        <button class="pixel-btn primary" id="repeat-study">📖 ULANGI MATERI</button>
        <button class="pixel-btn" id="retry-practice">🔄 COBA LAGI</button>
      </div>
    `;
  }
  saveState();
  showScreen('practice');
}
function respawnPlayer() {
  if (!state.game) return;
  const player = state.game.player;
  player.x = 20;
  player.y = 170;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  state.game.cameraX = 0;
  state.game.isDead = false;
}
function loseLife() {
  if (state.player.life <= 0 || state.isGameOver) return;
  if (state.game && state.game.isDead) return;
  if (state.game) {
    state.game.isDead = true;
    emitGameParticles(state.game.player.x + state.game.player.w / 2, state.game.player.y + state.game.player.h / 2, '#ff6d7a', 18, { spread: 2.8, gravity: 0.16 });
    state.game.shake = 7;
  }
  state.player.life = Math.max(0, state.player.life - 1);
  state.player.score = Math.max(0, state.player.score);
  savePlayer();
  saveState();
  renderHud();
  if (state.player.life <= 0) {
    triggerGameOver();
    return;
  }
  if (state.game) {
    respawnPlayer();
    setTimeout(() => {
      if (state.game) state.game.isDead = false;
    }, 750);
  }
}
function triggerGameOver() {
  saveGameplayRecoveryState();
  state.isGameOver = true;
  if (state.game) {
    state.game.running = false;
    state.game.isGameOver = true;
  }
  stopGame();
  showLifeModal();
}
function setupGame() {
  state.isGameOver = false;
  if (state.game?.loopId) cancelAnimationFrame(state.game.loopId);
  if (state.game) state.game.running = false;
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  const world = buildLevelWorld(level);
  state.game = {
    canvas,
    ctx,
    world,
    player: { x: 20, y: 170, w: 18, h: 22, vx: 0, vy: 0, onGround: false, facing: 1, inv: 0 },
    keys: {},
    pad: { left: false, right: false, jump: false },
    cameraX: 0,
    effects: [],
    trail: [],
    shake: 0,
    time: 0,
    running: true,
    isDead: false,
    isGameOver: false,
    loopId: null
  };
  renderHud();
  state.game.loopId = requestAnimationFrame(gameLoop);
}
function gameLoop() {
  if (!state.game || !state.game.running) return;
  state.game.time = performance.now();
  updateGame();
  drawGame();
  state.game.loopId = requestAnimationFrame(gameLoop);
}
function updateGame() {
  if (!state.game || state.isGameOver) return;
  const { player, world } = state.game;
  if (!player || !world) return;
  updateGameEffects();
  const left = state.game.keys.ArrowLeft || state.game.keys.a || state.game.pad.left;
  const right = state.game.keys.ArrowRight || state.game.keys.d || state.game.pad.right;
  const jump = state.game.keys.ArrowUp || state.game.keys[' '] || state.game.keys.w || state.game.pad.jump;
  const vehicle = getEquippedShopItem('KENDARAAN');
  const pants = getEquippedShopItem('CELANA');
  const mask = getEquippedShopItem('TOPENG');
  const speed = vehicle?.id === 'neon-bike' ? 3.8 : vehicle?.id === 'moon-horse' ? 3.2 : mask?.id === 'shadow-mask' ? 2.8 : 2.2;
  const jumpPower = vehicle?.id === 'neon-bike' ? 8.2 : vehicle?.id === 'moon-horse' ? 7.8 : pants?.id === 'nebula-pants' ? 7.6 : 6.8;
  player.vx = 0;
  if (left) { player.vx = -speed; player.facing = -1; }
  if (right) { player.vx = speed; player.facing = 1; }
  if (jump && player.onGround) {
    player.vy = -jumpPower;
    player.onGround = false;
    state.game.pad.jump = false;
    emitGameParticles(player.x + player.w / 2, player.y + player.h, '#f4d55d', 9, { spread: 1.7, gravity: 0.08 });
    state.game.shake = 2;
    SFX.jump();
  }
  player.vy += 0.4;
  player.x += player.vx;
  player.y += player.vy;
  if (Math.abs(player.vx) > 0) {
    const activeItem = getActiveShopItem();
    const vehicleColor = vehicle?.color || getEquippedShopItem('BAJU')?.color;
    const trailColor = activeItem?.color || vehicleColor || (player.facing > 0 ? '#ffb85c' : '#72d9ff');
    state.game.trail.push({ x: player.x + player.w / 2, y: player.y + player.h - 3, life: activeItem?.id === 'royal-comet' ? 24 : 16, color: trailColor });
    if (state.game.trail.length > 10) state.game.trail.shift();
  }
  player.onGround = false;
  for (const platform of world.platforms) {
    if (rectsOverlap(player, platform)) {
      if (player.vy >= 0 && player.y + player.h <= platform.y + 18) {
        player.y = platform.y - player.h;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }
  for (const enemy of world.enemies) {
    enemy.x += enemy.dir * 0.8;
    if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.dir *= -1;
    if (rectsOverlap(player, enemy)) {
      const stomp = player.vy > 0 && player.y + player.h - enemy.y < 14;
      if (stomp) {
        player.vy = -4;
        enemy.x = -9999;
        state.save.score += 25;
        state.player.score = state.save.score;
        emitGameParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, world.theme.accent, 16, { spread: 2.4, gravity: 0.12 });
        state.game.shake = 5;
      } else {
        SFX.bad();
        loseLife();
        return;
      }
    }
  }
  for (const coin of world.coins) {
    const dx = player.x + player.w / 2 - coin.x;
    const dy = player.y + player.h / 2 - coin.y;
    const activeItem = getActiveShopItem();
    const pet = getEquippedShopItem('PELIHARAAN');
    const pickupRange = activeItem && ['coin-magnet', 'royal-comet'].includes(activeItem.id) || pet?.id === 'pixel-dragon' || vehicle?.id === 'neon-bike' ? 34 : 14;
    if (Math.hypot(dx, dy) < pickupRange) {
      coin.x = -9999;
      state.save.score += 10;
      state.player.score = state.save.score;
      state.player.coins += activeItem?.id === 'royal-comet' ? 3 : pet?.id === 'pixel-dragon' ? 2 : 1;
      emitGameParticles(player.x, player.y, activeItem?.color || world.theme.accent, 12, { spread: 2.2, gravity: 0.02 });
      state.game.shake = 1.5;
      SFX.coin();
      savePlayer();
    }
  }
  if (player.y > 270) {
    SFX.bad();
    loseLife();
    return;
  }
  state.game.cameraX = Math.min(Math.max(0, player.x - 180), world.width - 480);
  if (player.x + player.w > world.gate.x && !state.game.gateSolved) {
    state.game.running = false;
    openGateQuestion();
    return;
  }
  if (state.game.gateSolved && player.x + player.w > world.bossZone.x) {
    state.game.running = false;
    openBossQuestion();
    return;
  }
  renderHud();
}
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function renderHud() {
  const hud = document.getElementById('hud');
  if (!hud) return;
  const lives = Array.from({ length: state.player.maxLife }, (_, index) => index < state.player.life ? '❤️' : '🖤').join('');
  hud.innerHTML = `<span>LIFE ${lives}</span><span>SCORE ${state.save.score}</span><span>COINS ${state.player.coins}</span><span>XP ${state.save.xp}</span>`;
}
function emitGameParticles(x, y, color, count = 8, options = {}) {
  if (!state.game) return;
  const spread = options.spread || 1.5;
  const gravity = options.gravity ?? 0.1;
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * spread;
    state.game.effects.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - spread * 0.45,
      gravity,
      size: 2 + Math.random() * 3,
      life: 24 + Math.random() * 20,
      maxLife: 44,
      color
    });
  }
}
function updateGameEffects() {
  if (!state.game) return;
  state.game.shake *= 0.86;
  state.game.trail = state.game.trail.filter((item) => {
    item.life -= 1;
    return item.life > 0;
  });
  state.game.effects = state.game.effects.filter((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.life -= 1;
    return particle.life > 0;
  });
}
function drawMountain(ctx, x, baseY, width, height, fill, snow = null) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, baseY);
  ctx.lineTo(x, baseY - height);
  ctx.lineTo(x + width / 2, baseY);
  ctx.closePath();
  ctx.fill();
  if (snow) {
    ctx.fillStyle = snow;
    ctx.beginPath();
    ctx.moveTo(x, baseY - height);
    ctx.lineTo(x - width * 0.16, baseY - height * 0.56);
    ctx.lineTo(x - width * 0.03, baseY - height * 0.62);
    ctx.lineTo(x + width * 0.12, baseY - height * 0.48);
    ctx.lineTo(x + width * 0.2, baseY - height * 0.58);
    ctx.closePath();
    ctx.fill();
  }
}
function drawPineTree(ctx, x, groundY, scale, trunk, leaves) {
  ctx.fillStyle = trunk;
  ctx.fillRect(x - 3 * scale, groundY - 18 * scale, 6 * scale, 18 * scale);
  ctx.fillStyle = leaves;
  for (let layer = 0; layer < 3; layer += 1) {
    const layerWidth = (12 + layer * 7) * scale;
    const layerTop = groundY - (34 - layer * 10) * scale;
    ctx.beginPath();
    ctx.moveTo(x, layerTop - 17 * scale);
    ctx.lineTo(x - layerWidth, layerTop + 10 * scale);
    ctx.lineTo(x + layerWidth, layerTop + 10 * scale);
    ctx.closePath();
    ctx.fill();
  }
}
function drawHouse(ctx, x, groundY, scale, wall, roof) {
  const width = 34 * scale;
  const height = 27 * scale;
  ctx.fillStyle = 'rgba(12, 28, 34, 0.22)';
  ctx.beginPath();
  ctx.ellipse(x + width / 2, groundY + 2 * scale, width * 0.7, 3 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = wall;
  ctx.fillRect(x, groundY - height, width, height);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(x - 5 * scale, groundY - height);
  ctx.lineTo(x + width / 2, groundY - height - 18 * scale);
  ctx.lineTo(x + width + 5 * scale, groundY - height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f8d878';
  ctx.fillRect(x + 7 * scale, groundY - height + 9 * scale, 7 * scale, 8 * scale);
  ctx.fillStyle = '#553d35';
  ctx.fillRect(x + width - 12 * scale, groundY - 15 * scale, 8 * scale, 15 * scale);
  ctx.fillStyle = 'rgba(255, 244, 181, 0.55)';
  ctx.fillRect(x + 9 * scale, groundY - height + 10 * scale, 2 * scale, 6 * scale);
  ctx.fillStyle = '#63433a';
  ctx.fillRect(x + width - 9 * scale, groundY - height - 7 * scale, 5 * scale, 9 * scale);
  ctx.fillStyle = 'rgba(244, 244, 225, 0.35)';
  ctx.fillRect(x + width - 8 * scale, groundY - height - 12 * scale, 3 * scale, 6 * scale);
}
function drawCloud(ctx, x, y, scale, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10 * scale, Math.PI, 0);
  ctx.arc(x + 12 * scale, y - 5 * scale, 14 * scale, Math.PI, 0);
  ctx.arc(x + 28 * scale, y, 10 * scale, Math.PI, 0);
  ctx.fillRect(x - 10 * scale, y, 48 * scale, 9 * scale);
  ctx.fill();
}
function drawLevelBackdrop(ctx, levelId, theme, world, time) {
  const drift = Math.sin(time / 2200) * 8;
  ctx.save();
  ctx.globalAlpha = 0.95;
  drawCloud(ctx, 90 + drift, 38, 1.1, theme.skyGlow);
  drawCloud(ctx, 330 - drift * 0.6, 62, 0.8, theme.skyGlow);
  if (levelId === 1) {
    drawMountain(ctx, 170, 218, 250, 110, '#4e7f78', '#b9dbc1');
    drawMountain(ctx, 420, 218, 300, 125, '#376965', '#9bc4ae');
    for (let treeIndex = 0; treeIndex < 14; treeIndex += 1) {
      drawPineTree(ctx, 20 + treeIndex * 86, 220, 0.55 + (treeIndex % 3) * 0.12, '#65452e', '#1d765b');
    }
    drawHouse(ctx, 740, world.groundY - 3, 1.2, '#b96d45', '#703d3c');
    drawHouse(ctx, 875, world.groundY - 3, 0.9, '#d08a52', '#6b4051');
  } else if (levelId === 2) {
    ctx.fillStyle = '#d9a36b';
    ctx.beginPath();
    ctx.moveTo(0, 190); ctx.quadraticCurveTo(180, 125, 360, 190); ctx.quadraticCurveTo(560, 120, 760, 190); ctx.quadraticCurveTo(980, 135, 1200, 190); ctx.lineTo(1200, 220); ctx.lineTo(0, 220); ctx.fill();
    drawHouse(ctx, 120, world.groundY - 3, 1.25, '#e9b96e', '#9b4e45');
    drawHouse(ctx, 370, world.groundY - 3, 0.95, '#d8875d', '#70465c');
    drawHouse(ctx, 700, world.groundY - 3, 1.1, '#f2c979', '#9d5648');
    drawHouse(ctx, 920, world.groundY - 3, 0.8, '#c9795a', '#5d476b');
    ctx.fillStyle = '#7f523f';
    ctx.fillRect(575, 130, 4, 90);
    ctx.strokeStyle = '#7f523f';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(577, 140); ctx.lineTo(615, 165); ctx.lineTo(577, 190); ctx.stroke();
  } else if (levelId === 3) {
    drawMountain(ctx, 150, 220, 250, 92, '#758db4', '#e9f1ff');
    drawMountain(ctx, 430, 220, 300, 115, '#627aa3', '#dbe8ff');
    ctx.fillStyle = '#5c668f';
    ctx.fillRect(760, 130, 104, 90);
    ctx.fillRect(775, 105, 24, 115);
    ctx.fillRect(825, 92, 24, 128);
    ctx.fillStyle = '#dce6ff';
    ctx.fillRect(785, 128, 9, 13); ctx.fillRect(835, 116, 9, 13);
    ctx.fillStyle = '#e8b95d';
    ctx.fillRect(786, 102, 2, 16); ctx.fillRect(836, 89, 2, 16);
    ctx.fillStyle = '#e47e67';
    ctx.beginPath(); ctx.moveTo(788, 103); ctx.lineTo(803, 108); ctx.lineTo(788, 112); ctx.fill();
  } else if (levelId === 4) {
    drawMountain(ctx, 150, 220, 330, 155, '#756d80', '#f2efff');
    drawMountain(ctx, 470, 220, 360, 178, '#5b5870', '#e7e5ff');
    drawMountain(ctx, 820, 220, 300, 140, '#81768a', '#f5edff');
    ctx.strokeStyle = '#e9cc83';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(40, 205); ctx.lineTo(320, 190); ctx.lineTo(610, 206); ctx.lineTo(920, 184); ctx.stroke();
    drawPineTree(ctx, 690, 220, 0.8, '#5b3d38', '#4d6555');
    drawPineTree(ctx, 1010, 220, 1.1, '#5b3d38', '#425a50');
  } else {
    ctx.fillStyle = 'rgba(45, 101, 101, 0.5)';
    ctx.fillRect(80, 90, 48, 130); ctx.fillRect(150, 120, 58, 100); ctx.fillRect(230, 75, 42, 145);
    ctx.fillStyle = 'rgba(39, 87, 92, 0.68)';
    ctx.fillRect(740, 100, 52, 120); ctx.fillRect(820, 64, 68, 156); ctx.fillRect(920, 118, 44, 102);
    ctx.strokeStyle = '#efffe8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(760, 85); ctx.lineTo(760, 220); ctx.moveTo(845, 46); ctx.lineTo(845, 220); ctx.stroke();
    ctx.fillStyle = theme.accent;
    for (let barIndex = 0; barIndex < 7; barIndex += 1) {
      const barHeight = 10 + ((barIndex * 13) % 45);
      ctx.fillRect(285 + barIndex * 34, 220 - barHeight, 18, barHeight);
    }
  }
  ctx.restore();
}
function drawWorldDepth(ctx, world, theme, levelId, time) {
  ctx.save();
  ctx.globalAlpha = 0.9;
  for (const platform of world.platforms) {
    const groundGradient = ctx.createLinearGradient(0, platform.y, 0, platform.y + platform.h);
    groundGradient.addColorStop(0, theme.platformTop);
    groundGradient.addColorStop(0.12, theme.ground);
    groundGradient.addColorStop(1, '#172d35');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
    ctx.fillStyle = levelId === 2 ? '#8f5c45' : levelId === 3 ? '#4d4d79' : theme.ground;
    ctx.fillRect(platform.x, platform.y, platform.w, 5);
  }
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = theme.skyGlow;
  ctx.fillRect(0, 215, world.width, 2);
  ctx.globalAlpha = 1;
  for (let ripple = 0; ripple < 14; ripple += 1) {
    const rippleX = 35 + ripple * 92 + Math.sin(time / 1200 + ripple) * 5;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + (ripple % 3) * 0.02})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rippleX, 226 + (ripple % 2) * 12);
    ctx.lineTo(rippleX + 24, 226 + (ripple % 2) * 12);
    ctx.stroke();
  }
  ctx.restore();
}
function drawWorldAtmosphere(ctx, world, theme, levelId, time) {
  ctx.save();
  const sunX = levelId === 5 ? 420 : 82;
  const sunY = 44 + Math.sin(time / 2600) * 3;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 54);
  sunGlow.addColorStop(0, 'rgba(255, 244, 181, 0.7)');
  sunGlow.addColorStop(1, 'rgba(255, 244, 181, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(sunX - 60, sunY - 60, 120, 120);
  ctx.fillStyle = '#fff0aa';
  ctx.globalAlpha = 0.7;
  ctx.beginPath(); ctx.arc(sunX, sunY, 11, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(238, 255, 246, 0.14)';
  for (let mote = 0; mote < 22; mote += 1) {
    const x = (mote * 73 + time / 32) % world.width;
    const y = 78 + (mote * 29) % 125;
    ctx.globalAlpha = 0.12 + ((mote % 4) * 0.025);
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(6, 22, 29, 0.18)';
  ctx.fillRect(0, 216, world.width, 4);
  ctx.restore();
}
function drawCoin(ctx, coin, pulse, accent) {
  ctx.save();
  ctx.translate(coin.x, coin.y);
  ctx.scale(pulse, pulse);
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = accent;
  ctx.fillRect(-coin.r * 2, -coin.r * 2, coin.r * 4, coin.r * 4);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#f6b83f';
  ctx.beginPath();
  ctx.arc(0, 0, coin.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff0a5';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fff7c4';
  ctx.fillRect(-2, -4, 3, 7);
  ctx.restore();
}
function drawEnemy(ctx, enemy, bob, theme, levelId) {
  const enemyX = enemy.x;
  const enemyY = enemy.y + bob;
  ctx.save();
  ctx.translate(enemyX, enemyY);
  const accent = levelId === 5 ? '#6ce5d1' : levelId === 3 ? '#b8a8ff' : '#ffb85c';
  ctx.fillStyle = 'rgba(8,20,28,0.42)';
  ctx.fillRect(-2, enemy.h + 2, enemy.w + 4, 3);
  ctx.strokeStyle = '#171525';
  ctx.lineWidth = 1.5;
  ctx.fillStyle = theme.enemy;
  ctx.beginPath();
  if (levelId === 2) {
    ctx.moveTo(2, 6); ctx.lineTo(0, 1); ctx.lineTo(5, 4); ctx.lineTo(9, 0);
    ctx.lineTo(13, 4); ctx.lineTo(18, 1); ctx.lineTo(16, 8); ctx.lineTo(15, 18);
    ctx.lineTo(11, 20); ctx.lineTo(7, 18); ctx.lineTo(3, 20); ctx.closePath();
  } else if (levelId === 3) {
    ctx.moveTo(1, 7); ctx.lineTo(4, 2); ctx.lineTo(8, 5); ctx.lineTo(13, 1);
    ctx.lineTo(17, 7); ctx.lineTo(15, 17); ctx.lineTo(11, 20); ctx.lineTo(6, 19); ctx.lineTo(2, 15); ctx.closePath();
  } else {
    ctx.moveTo(2, 7); ctx.lineTo(5, 1); ctx.lineTo(9, 4); ctx.lineTo(13, 1);
    ctx.lineTo(17, 7); ctx.lineTo(15, 18); ctx.lineTo(11, 20); ctx.lineTo(8, 17);
    ctx.lineTo(4, 20); ctx.lineTo(1, 14); ctx.closePath();
  }
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.16)';
  ctx.fillRect(4, 6, 3, 4);
  ctx.fillStyle = '#f3d7a1';
  ctx.fillRect(4, 8, 4, 4); ctx.fillRect(11, 8, 4, 4);
  ctx.fillStyle = '#ff405d';
  ctx.fillRect(5, 9, 2, 2); ctx.fillRect(12, 9, 2, 2);
  ctx.fillStyle = '#1b1427';
  ctx.fillRect(7, 14, 6, 2);
  ctx.fillStyle = accent;
  ctx.fillRect(2, 16, 5, 3); ctx.fillRect(12, 16, 5, 3);
  ctx.fillStyle = '#151827';
  ctx.fillRect(1, 19, 6, 2); ctx.fillRect(12, 19, 6, 2);
  if (levelId === 4 || levelId === 5) {
    ctx.fillStyle = '#252a43';
    ctx.fillRect(6, 3, 7, 4);
    ctx.fillStyle = accent;
    ctx.fillRect(8, 4, 3, 2);
  }
  ctx.restore();
}
function drawGate(ctx, gate, theme, time) {
  ctx.save();
  ctx.fillStyle = 'rgba(10,18,28,0.3)';
  ctx.fillRect(gate.x - 5, gate.y + gate.h, gate.w + 10, 5);
  ctx.fillStyle = theme.gate;
  ctx.fillRect(gate.x, gate.y + 14, gate.w, gate.h - 14);
  ctx.beginPath();
  ctx.arc(gate.x + gate.w / 2, gate.y + 14, gate.w / 2, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = theme.accent;
  ctx.globalAlpha = 0.18 + Math.sin(time / 220) * 0.08;
  ctx.fillRect(gate.x - 8, gate.y - 8, gate.w + 16, gate.h + 16);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#d9e6ff';
  ctx.fillRect(gate.x + 12, gate.y + 28, 8, 26);
  ctx.fillRect(gate.x + gate.w - 20, gate.y + 28, 8, 26);
  ctx.fillStyle = '#26394b';
  ctx.fillRect(gate.x + 19, gate.y + 14, 8, gate.h - 14);
  ctx.restore();
}
function drawBoss(ctx, bossZone, theme, levelId, time) {
  const centerX = bossZone.x + bossZone.w / 2;
  const centerY = bossZone.y + 42 + Math.sin(time / 240) * 3;
  ctx.save();
  const r = 26 + Math.sin(time / 180) * 1.5;
  ctx.fillStyle = 'rgba(12,18,28,0.42)';
  ctx.fillRect(bossZone.x - 5, bossZone.y + bossZone.h, bossZone.w + 10, 6);
  ctx.fillStyle = 'rgba(255,70,95,.12)';
  ctx.fillRect(centerX - r - 8, centerY - r - 8, (r + 8) * 2, (r + 8) * 2);
  ctx.fillStyle = theme.boss;
  ctx.strokeStyle = '#211529';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 25, centerY + 22); ctx.lineTo(centerX - 31, centerY + 8);
  ctx.lineTo(centerX - 24, centerY - 15); ctx.lineTo(centerX - 14, centerY - 29);
  ctx.lineTo(centerX - 5, centerY - 21); ctx.lineTo(centerX + 7, centerY - 31);
  ctx.lineTo(centerX + 17, centerY - 18); ctx.lineTo(centerX + 29, centerY - 12);
  ctx.lineTo(centerX + 31, centerY + 11); ctx.lineTo(centerX + 22, centerY + 24);
  ctx.lineTo(centerX + 8, centerY + 28); ctx.lineTo(centerX - 8, centerY + 28); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3b2748';
  ctx.fillRect(centerX - 21, centerY - 3, 42, 19);
  ctx.fillStyle = '#f7d7a0';
  ctx.fillRect(centerX - 16, centerY - 10, 11, 9); ctx.fillRect(centerX + 5, centerY - 10, 11, 9);
  ctx.fillStyle = '#ff405d';
  ctx.fillRect(centerX - 12, centerY - 7, 5, 4); ctx.fillRect(centerX + 7, centerY - 7, 5, 4);
  ctx.fillStyle = '#160f20';
  ctx.fillRect(centerX - 11, centerY + 8, 22, 4);
  ctx.fillStyle = '#fff1d0';
  for (let tooth = 0; tooth < 5; tooth += 1) ctx.fillRect(centerX - 10 + tooth * 5, centerY + 10, 3, 5);
  ctx.fillStyle = theme.accent;
  ctx.fillRect(centerX - 25, centerY - 22, 8, 3); ctx.fillRect(centerX + 17, centerY - 22, 8, 3);
  ctx.fillStyle = '#fff7d5';
  ctx.font = 'bold 8px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(levelId === 5 ? 'DATA' : 'BOSS', centerX, bossZone.y + bossZone.h + 15);
  ctx.restore();
}
function drawPlayer(ctx, player, time) {
  ctx.save();
  const activeItem = getActiveShopItem();
  const shirt = getEquippedShopItem('BAJU');
  const pants = getEquippedShopItem('CELANA');
  const hat = getEquippedShopItem('TOPI');
  const mask = getEquippedShopItem('TOPENG');
  const pet = getEquippedShopItem('PELIHARAAN');
  const vehicle = getEquippedShopItem('KENDARAAN');
  const character = CHARACTERS.find((item) => item.id === state.player.selectedCharacter) || CHARACTERS[0];
  const characterStyle = {
    hero: { skin: '#f0caa5', shirt: '#c86443', pants: '#263348', hair: '#3b2947' },
    wizard: { skin: '#f0caa5', shirt: '#6552a8', pants: '#30284d', hair: '#b78cff' },
    ninja: { skin: '#d9b08f', shirt: '#1f2937', pants: '#111827', hair: '#101522' }
  }[character.id];
  if (activeItem?.id === 'aura-flare' || activeItem?.id === 'royal-comet') {
    ctx.globalAlpha = 0.2 + Math.sin(time / 140) * 0.05;
    ctx.fillStyle = activeItem.color;
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2, player.y + player.h / 2, activeItem.id === 'royal-comet' ? 23 : 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (activeItem?.id === 'coin-magnet') {
    ctx.strokeStyle = 'rgba(114,217,255,.78)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2, player.y + player.h / 2, 17 + Math.sin(time / 120), 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#72d9ff';
    ctx.fillRect(player.x + 7, player.y + 2, 5, 3);
  }
  if (vehicle) {
    if (vehicle.id === 'neon-bike') {
      const wheelY = player.y + 25;
      ctx.fillStyle = 'rgba(4,10,18,.48)';
      ctx.fillRect(player.x - 2, wheelY + 5, 26, 3);
      ctx.strokeStyle = '#171525';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.x + 3, wheelY, 7, 0, Math.PI * 2);
      ctx.arc(player.x + 20, wheelY, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = vehicle.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(player.x + 3, wheelY); ctx.lineTo(player.x + 10, player.y + 14);
      ctx.lineTo(player.x + 20, wheelY); ctx.lineTo(player.x + 8, wheelY);
      ctx.lineTo(player.x + 3, wheelY); ctx.moveTo(player.x + 10, player.y + 14);
      ctx.lineTo(player.x + 16, player.y + 14); ctx.lineTo(player.x + 20, wheelY - 5);
      ctx.stroke();
      ctx.fillStyle = '#f3d66f';
      ctx.fillRect(player.x + 8, player.y + 16, 4, 3);
      ctx.fillStyle = '#151827';
      ctx.fillRect(player.x + 15, player.y + 11, 6, 2);
    } else if (vehicle.id === 'moon-horse') {
      ctx.fillStyle = 'rgba(4,10,18,.42)';
      ctx.fillRect(player.x - 4, player.y + 25, 31, 4);
      ctx.fillStyle = '#171525';
      ctx.fillRect(player.x - 1, player.y + 14, 24, 10);
      ctx.fillStyle = vehicle.color;
      ctx.fillRect(player.x, player.y + 12, 21, 9);
      ctx.fillRect(player.x + 17, player.y + 4, 7, 13);
      ctx.fillStyle = '#bcaeff';
      ctx.fillRect(player.x + 20, player.y + 5, 7, 5);
      ctx.fillStyle = '#181529';
      ctx.fillRect(player.x + 25, player.y + 7, 2, 2);
      ctx.fillStyle = '#d9d4ff';
      ctx.fillRect(player.x + 2, player.y + 21, 3, 9);
      ctx.fillRect(player.x + 15, player.y + 21, 3, 9);
      ctx.fillStyle = '#8d7fe0';
      ctx.fillRect(player.x + 1, player.y + 29, 6, 2);
      ctx.fillRect(player.x + 14, player.y + 29, 6, 2);
      ctx.strokeStyle = '#f4d55d';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(player.x + 18, player.y + 5); ctx.lineTo(player.x + 21, player.y - 2);
      ctx.moveTo(player.x + 22, player.y + 5); ctx.lineTo(player.x + 26, player.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(4,10,18,.42)';
      ctx.fillRect(player.x - 4, player.y + 25, 31, 4);
      ctx.fillStyle = '#171525';
      ctx.fillRect(player.x - 2, player.y + 17, 28, 9);
      ctx.fillStyle = vehicle.color;
      ctx.fillRect(player.x, player.y + 15, 24, 8);
      ctx.fillRect(player.x + 17, player.y + 7, 5, 14);
      ctx.fillStyle = '#f1d278';
      ctx.fillRect(player.x + 3, player.y + 17, 5, 3);
      ctx.fillStyle = '#151827';
      ctx.fillRect(player.x + 3, player.y + 23, 6, 3);
      ctx.fillRect(player.x + 17, player.y + 23, 6, 3);
    }
  }
  if (pet) {
    const petX = player.x - 14 + Math.sin(time / 180) * 2;
    const petY = player.y + 10 + Math.cos(time / 180) * 2;
    ctx.fillStyle = 'rgba(4,10,18,.32)';
    ctx.fillRect(petX - 7, petY + 7, 14, 2);
    ctx.fillStyle = pet.color;
    ctx.strokeStyle = '#172033';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(petX - 7, petY + 4); ctx.lineTo(petX - 6, petY - 3); ctx.lineTo(petX - 2, petY - 7);
    ctx.lineTo(petX + 1, petY - 4); ctx.lineTo(petX + 7, petY - 5); ctx.lineTo(petX + 6, petY + 4);
    ctx.lineTo(petX + 2, petY + 7); ctx.lineTo(petX - 3, petY + 6); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f4d55d';
    ctx.fillRect(petX - 4, petY - 2, 2, 2); ctx.fillRect(petX + 2, petY - 2, 2, 2);
    ctx.fillStyle = '#eaf7ef';
    ctx.fillRect(petX - 1, petY + 2, 4, 2);
    ctx.strokeStyle = pet.color;
    ctx.beginPath(); ctx.moveTo(petX - 6, petY + 1); ctx.lineTo(petX - 12, petY - 3); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(3,14,21,0.28)';
  ctx.beginPath();
  ctx.ellipse(player.x + player.w / 2, 222, 14 + Math.abs(player.vy) * 0.6, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  const spriteX = player.x - 2;
  const spriteY = player.y - 5;
  const movementAmount = Math.min(1, Math.abs(player.vx) / 2.2);
  const walkPhase = player.onGround ? Math.sin(time / 75) * movementAmount : 0;
  const armSwing = walkPhase * 0.45;
  const legSwing = walkPhase * 0.65;
  ctx.fillStyle = characterStyle.shirt;
  ctx.save();
  ctx.translate(spriteX + 5, spriteY + 14);
  ctx.rotate(-armSwing);
  ctx.fillRect(-2, 0, 4, 10);
  ctx.fillStyle = characterStyle.skin;
  ctx.fillRect(-3, 8, 6, 4);
  ctx.restore();
  ctx.fillStyle = characterStyle.shirt;
  ctx.save();
  ctx.translate(spriteX + 17, spriteY + 14);
  ctx.rotate(armSwing);
  ctx.fillRect(-2, 0, 4, 10);
  ctx.fillStyle = characterStyle.skin;
  ctx.fillRect(-3, 8, 6, 4);
  ctx.restore();
  ctx.fillStyle = pants?.color || characterStyle.pants;
  if (vehicle) {
    // A mounted player sits on the vehicle; walking legs must not appear.
    ctx.fillRect(spriteX + 7, spriteY + 20, 5, 6);
    ctx.fillRect(spriteX + 14, spriteY + 20, 5, 6);
  } else {
    ctx.save();
    ctx.translate(spriteX + 7, spriteY + 21);
    ctx.rotate(legSwing);
    ctx.fillRect(-2, 0, 5, 8);
    ctx.fillStyle = '#6ce5d1';
    ctx.fillRect(-3, 7, 7, 3);
    ctx.restore();
    ctx.fillStyle = pants?.color || characterStyle.pants;
    ctx.save();
    ctx.translate(spriteX + 15, spriteY + 21);
    ctx.rotate(-legSwing);
    ctx.fillRect(-2, 0, 5, 8);
    ctx.fillStyle = '#6ce5d1';
    ctx.fillRect(-3, 7, 7, 3);
    ctx.restore();
  }
  ctx.fillStyle = hat?.color || characterStyle.hair;
  ctx.fillRect(spriteX + 4, spriteY + 2 + Math.round(walkPhase), 14, 5);
  ctx.fillRect(spriteX + 3, spriteY + 5 + Math.round(walkPhase), 4, 7);
  ctx.fillStyle = characterStyle.skin;
  ctx.fillRect(spriteX + 6, spriteY + 4 + Math.round(walkPhase), 10, 9);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(spriteX + 8, spriteY + 8 + Math.round(walkPhase), 2, 2);
  ctx.fillRect(spriteX + 13, spriteY + 8 + Math.round(walkPhase), 2, 2);
  ctx.fillStyle = '#f3b56d';
  ctx.fillRect(spriteX + 9, spriteY + 11 + Math.round(walkPhase), 5, 2);
  ctx.fillStyle = shirt?.color || '#c86443';
  ctx.fillRect(spriteX + 4, spriteY + 10, 14, 12);
  ctx.fillStyle = '#6ce5d1';
  ctx.fillRect(spriteX + 7, spriteY + 12, 8, 3);
  ctx.fillStyle = '#f8d879';
  ctx.fillRect(spriteX + 9, spriteY + 12, 4, 2);
  if (mask) {
    ctx.fillStyle = mask.color;
    ctx.fillRect(spriteX + 5, spriteY + 7, 12, 6);
    ctx.fillStyle = '#101522';
    ctx.fillRect(spriteX + 8, spriteY + 9, 2, 2);
    ctx.fillRect(spriteX + 13, spriteY + 9, 2, 2);
  }
  const hair = getEquippedShopItem('RAMBUT');
  const accessory = getEquippedShopItem('AKSESORI');
  if (hair) {
    ctx.fillStyle = hair.color || characterStyle.hair;
    ctx.beginPath();
    if (hair.id === 'long-hair') {
      ctx.moveTo(spriteX + 3, spriteY + 4); ctx.lineTo(spriteX + 7, spriteY);
      ctx.lineTo(spriteX + 17, spriteY + 1); ctx.lineTo(spriteX + 20, spriteY + 19);
      ctx.lineTo(spriteX + 16, spriteY + 13); ctx.lineTo(spriteX + 5, spriteY + 13); ctx.closePath();
    } else if (hair.id === 'spiky-hair' || hair.id === 'fantasy-hair') {
      ctx.moveTo(spriteX + 3, spriteY + 6); ctx.lineTo(spriteX + 5, spriteY - 4);
      ctx.lineTo(spriteX + 9, spriteY + 1); ctx.lineTo(spriteX + 13, spriteY - 5);
      ctx.lineTo(spriteX + 16, spriteY + 1); ctx.lineTo(spriteX + 20, spriteY - 2);
      ctx.lineTo(spriteX + 19, spriteY + 8); ctx.closePath();
    } else {
      ctx.moveTo(spriteX + 3, spriteY + 7); ctx.lineTo(spriteX + 5, spriteY + 1);
      ctx.lineTo(spriteX + 17, spriteY + 1); ctx.lineTo(spriteX + 20, spriteY + 7);
      ctx.lineTo(spriteX + 16, spriteY + 5); ctx.lineTo(spriteX + 7, spriteY + 5); ctx.closePath();
    }
    ctx.fill();
  }
  if (accessory?.id === 'glasses') {
    ctx.strokeStyle = accessory.color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(spriteX + 6, spriteY + 7, 5, 4);
    ctx.strokeRect(spriteX + 12, spriteY + 7, 5, 4);
    ctx.beginPath(); ctx.moveTo(spriteX + 11, spriteY + 9); ctx.lineTo(spriteX + 12, spriteY + 9); ctx.stroke();
  } else if (accessory?.id === 'scarf') {
    ctx.fillStyle = accessory.color;
    ctx.fillRect(spriteX + 3, spriteY + 16, 17, 4);
    ctx.fillRect(spriteX + 16, spriteY + 18, 5, 9);
  } else if (accessory?.id === 'backpack') {
    ctx.fillStyle = accessory.color;
    ctx.fillRect(spriteX - 1, spriteY + 12, 5, 12);
    ctx.strokeStyle = '#2b2030'; ctx.strokeRect(spriteX - 1, spriteY + 12, 5, 12);
  } else if (accessory?.id === 'cape') {
    ctx.fillStyle = accessory.color;
    ctx.beginPath(); ctx.moveTo(spriteX + 3, spriteY + 11); ctx.lineTo(spriteX - 3, spriteY + 27);
    ctx.lineTo(spriteX + 5, spriteY + 24); ctx.lineTo(spriteX + 7, spriteY + 13); ctx.closePath(); ctx.fill();
  } else if (accessory?.id === 'necklace') {
    ctx.strokeStyle = accessory.color; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(spriteX + 11, spriteY + 13, 5, 0, Math.PI); ctx.stroke();
    ctx.fillStyle = accessory.color; ctx.fillRect(spriteX + 9, spriteY + 16, 4, 4);
  }
  if (hat?.id === 'crown-cap') {
    ctx.fillStyle = hat.color;
    ctx.beginPath(); ctx.moveTo(spriteX + 3, spriteY + 3); ctx.lineTo(spriteX + 6, spriteY - 5); ctx.lineTo(spriteX + 10, spriteY + 1); ctx.lineTo(spriteX + 14, spriteY - 5); ctx.lineTo(spriteX + 18, spriteY + 3); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function drawPlatform(ctx, platform, theme, levelId) {
  ctx.fillStyle = 'rgba(8,18,26,0.34)';
  ctx.fillRect(platform.x + 2, platform.y + 5, platform.w, platform.h);
  const soil = ctx.createLinearGradient(0, platform.y + 7, 0, platform.y + platform.h);
  soil.addColorStop(0, theme.ground);
  soil.addColorStop(1, '#172530');
  ctx.fillStyle = soil;
  ctx.fillRect(platform.x, platform.y + 5, platform.w, platform.h - 5);
  ctx.fillStyle = theme.platformTop;
  ctx.fillRect(platform.x, platform.y, platform.w, 6);
  ctx.fillStyle = levelId === 3 ? '#a9a8c7' : levelId === 5 ? '#6ce5d1' : '#d4a45e';
  for (let markX = platform.x + 7; markX < platform.x + platform.w - 5; markX += 27) {
    const offset = Math.floor(markX / 9) % 3;
    ctx.fillRect(markX, platform.y + 12 + offset, 7, 3);
    ctx.fillStyle = 'rgba(10,20,28,.28)';
    ctx.fillRect(markX + 9, platform.y + 24 + offset, 4, 3);
    ctx.fillStyle = levelId === 3 ? '#a9a8c7' : levelId === 5 ? '#6ce5d1' : '#d4a45e';
  }
  ctx.fillStyle = 'rgba(255,255,255,.14)';
  ctx.fillRect(platform.x + 2, platform.y + 1, Math.min(platform.w - 4, 48), 2);
}
function drawEnvironmentDetails(ctx, world, theme, time) {
  const lightPulse = 0.08 + Math.sin(time / 900) * 0.025;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = theme.skyGlow;
  ctx.fillRect(0, 184, world.width, 36);
  ctx.globalAlpha = 1;
  for (const platform of world.platforms) {
    for (let bladeX = platform.x + 8; bladeX < platform.x + platform.w - 4; bladeX += 31) {
      const bladeHeight = 3 + ((bladeX / 7) % 5);
      ctx.strokeStyle = theme.platformTop;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bladeX, platform.y + 1);
      ctx.lineTo(bladeX + 2, platform.y - bladeHeight);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255, 245, 183, ${lightPulse})`;
    ctx.fillRect(platform.x + 5, platform.y + 2, Math.min(platform.w - 10, 34), 2);
  }
  const props = [
    [74, 211, 0.7], [205, 211, 0.52], [455, 211, 0.66],
    [735, 211, 0.5], [1015, 211, 0.72]
  ];
  for (const [x, y, scale] of props) {
    ctx.fillStyle = '#263e39';
    ctx.fillRect(x - 2 * scale, y - 12 * scale, 4 * scale, 12 * scale);
    ctx.fillStyle = theme.platformTop;
    ctx.fillRect(x - 8 * scale, y - 8 * scale, 7 * scale, 5 * scale);
    ctx.fillRect(x + 1 * scale, y - 12 * scale, 7 * scale, 5 * scale);
    ctx.fillStyle = theme.accent;
    ctx.fillRect(x + 3 * scale, y - 4 * scale, 2 * scale, 2 * scale);
  }
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#eaf7ef';
  ctx.fillRect(0, 204, world.width, 2);
  ctx.restore();
}
function drawCinematicOverlay(ctx, canvas, theme, time) {
  ctx.save();
  const glow = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.35, 20, canvas.width * 0.5, canvas.height * 0.35, canvas.width * 0.72);
  glow.addColorStop(0, 'rgba(255, 255, 235, 0.08)');
  glow.addColorStop(0.62, 'rgba(101, 230, 199, 0.025)');
  glow.addColorStop(1, 'rgba(2, 10, 18, 0.34)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.11;
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 1;
  for (let lineY = 0; lineY < canvas.height; lineY += 6) {
    ctx.beginPath();
    ctx.moveTo(0, lineY + Math.sin(time / 500 + lineY) * 0.4);
    ctx.lineTo(canvas.width, lineY);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#fff3b0';
  for (let mote = 0; mote < 10; mote += 1) {
    const x = (mote * 67 + time / 45) % canvas.width;
    const y = 54 + (mote * 29) % 150;
    const size = 1 + (mote % 2);
    ctx.fillRect(x, y + Math.sin(time / 420 + mote) * 4, size, size);
  }
  ctx.restore();
}
function drawGame() {
  const { canvas, ctx, world, player } = state.game;
  if (!canvas || !ctx || !world || !player) return;
  const theme = world.theme || getLevelTheme(state.currentLevel);
  const time = state.game.time || performance.now();
  const cameraShakeX = (Math.random() - 0.5) * state.game.shake;
  const cameraShakeY = (Math.random() - 0.5) * state.game.shake;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = theme.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(cameraShakeX, cameraShakeY);
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, theme.skyGlow);
  skyGradient.addColorStop(0.55, theme.sky);
  skyGradient.addColorStop(1, '#173746');
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.translate(-state.game.cameraX * 0.18, 0);
  for (let index = 0; index < 18; index += 1) {
    const x = 24 + index * 82;
    const y = 28 + (index % 4) * 18;
    const twinkle = 1 + Math.sin(time / 260 + index) * 0.35;
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.22 + twinkle * 0.12;
    ctx.fillRect(x, y, 2 * twinkle, 2 * twinkle);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  ctx.translate(-state.game.cameraX, 0);
  drawLevelBackdrop(ctx, state.currentLevel, theme, world, time);
  drawWorldAtmosphere(ctx, world, theme, state.currentLevel, time);
  drawWorldDepth(ctx, world, theme, state.currentLevel, time);
  for (const platform of world.platforms) {
    drawPlatform(ctx, platform, theme, state.currentLevel);
  }
  drawEnvironmentDetails(ctx, world, theme, time);
  for (const coin of world.coins) {
    if (coin.x < -50) continue;
    const pulse = 1 + Math.sin(time / 180 + coin.x) * 0.18;
    drawCoin(ctx, coin, pulse, theme.accent);
  }
  for (const enemy of world.enemies) {
    if (enemy.x < -50) continue;
    const enemyBob = Math.sin(time / 180 + enemy.x) * 2;
    drawEnemy(ctx, enemy, enemyBob, theme, state.currentLevel);
  }
  drawGate(ctx, world.gate, theme, time);
  drawBoss(ctx, world.bossZone, theme, state.currentLevel, time);
  for (const trail of state.game.trail) {
    ctx.globalAlpha = trail.life / 16 * 0.35;
    ctx.fillStyle = trail.color;
    ctx.fillRect(trail.x - 4, trail.y - 4, 8, 8);
  }
  ctx.globalAlpha = 1;
  drawPlayer(ctx, player, time);
  for (const particle of state.game.effects) {
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }
  ctx.globalAlpha = 1;
  drawCinematicOverlay(ctx, canvas, theme, time);
  ctx.restore();
}
function stopGame() {
  if (!state.game) return;
  state.game.running = false;
  if (state.game.loopId) cancelAnimationFrame(state.game.loopId);
  state.game.loopId = null;
}
function saveGameplayRecoveryState() {
  if (!state.game) return;
  const game = state.game;
  state.player.recoveryState = {
    levelId: state.currentLevel,
    position: {
      x: game.player?.x ?? 20,
      y: game.player?.y ?? 170,
      vx: game.player?.vx ?? 0,
      vy: game.player?.vy ?? 0,
      facing: game.player?.facing ?? 1,
      onGround: Boolean(game.player?.onGround)
    },
    cameraX: game.cameraX || 0,
    gateSolved: Boolean(game.gateSolved),
    world: game.world ? JSON.parse(JSON.stringify(game.world)) : null,
    score: state.player.score,
    coins: state.player.coins,
    xp: state.player.xp,
    selectedCharacter: state.player.selectedCharacter,
    checkpoint: game.checkpoint || null
  };
  savePlayer();
}
function restoreGameplayRecoveryState() {
  const snapshot = state.player.recoveryState;
  if (!snapshot || Number(snapshot.levelId) !== Number(state.currentLevel)) return false;
  if (!state.game) setupGame();
  const game = state.game;
  if (!game) return false;
  if (snapshot.world) game.world = snapshot.world;
  game.player = {
    ...game.player,
    ...(snapshot.position || {})
  };
  game.cameraX = Number(snapshot.cameraX) || 0;
  game.gateSolved = Boolean(snapshot.gateSolved);
  game.checkpoint = snapshot.checkpoint || null;
  if (snapshot.selectedCharacter) {
    state.player.selectedCharacter = snapshot.selectedCharacter;
  }
  state.player.score = Number(snapshot.score) || state.player.score;
  state.player.coins = Number(snapshot.coins) || state.player.coins;
  state.player.xp = Number(snapshot.xp) || state.player.xp;
  state.save.score = state.player.score;
  state.save.xp = state.player.xp;
  return true;
}
function openGateQuestion() {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  document.getElementById('gate-card').innerHTML = `
    <div class="screen-header"><h2>🔐 MATH GATE</h2></div>
    <p>${formatMathText(level.gate.q)}</p>
    <div class="choice-grid">
      ${level.gate.choices.map((choice, index) => `<button class="pixel-btn choice-btn" data-gate-answer="${index}">${String.fromCharCode(65 + index)}. ${formatMathText(choice)}</button>`).join('')}
    </div>
    <div id="gate-feedback"></div>
  `;
  showScreen('gate');
}
function handleGateAnswer(index) {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  const feedback = document.getElementById('gate-feedback');
  document.querySelectorAll('[data-gate-answer]').forEach((button) => button.disabled = true);
  if (index === level.gate.answer) {
    state.game = { ...state.game, gateSolved: true };
    state.player.score += 100;
    state.save.score = state.player.score;
    feedback.innerHTML = `<div class="feedback-box">🎉 JAWABAN BENAR!<br>🔓 GERBANG TERBUKA! +100 SCORE</div><button class="pixel-btn primary flow-btn" id="resume-game">LANJUT QUEST</button>`;
    SFX.ok();
  } else {
    SFX.bad();
    loseLife();
    feedback.innerHTML = `<div class="feedback-box">❌ BELUM TEPAT<br>❤️ -1<br>${level.gate.hint}</div><button class="pixel-btn primary flow-btn" id="retry-gate">COBA LAGI</button>`;
  }
  savePlayer();
  saveState();
}
function openBossQuestion() {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  state.bossRound = { index: 0, hp: 3 };
  renderBossCard(level); 
  showScreen('boss');
}
function renderBossCard(level) {
  const question = level.boss[state.bossRound.index];
  const hearts = '❤️'.repeat(state.bossRound.hp) + '🖤'.repeat(3 - state.bossRound.hp);
  document.getElementById('boss-card').innerHTML = `
    <div class="screen-header"><h2>${level.bossName}</h2></div>
    <p>Boss HP: ${hearts}</p>
    <p>Soal ${state.bossRound.index + 1}/${level.boss.length}</p>
    <p>${formatMathText(question.q)}</p>
    <div class="choice-grid">
      ${question.choices.map((choice, index) => `<button class="pixel-btn choice-btn" data-boss-answer="${index}">${String.fromCharCode(65 + index)}. ${formatMathText(choice)}</button>`).join('')}
    </div>
    <div id="boss-feedback"></div>
  `;
}
function handleBossAnswer(index) {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  const q = level.boss[state.bossRound.index];
  const feedback = document.getElementById('boss-feedback');
  document.querySelectorAll('[data-boss-answer]').forEach((button) => button.disabled = true);
  if (index === q.answer) {
    state.bossRound.hp -= 1;
    state.player.score += 60;
    state.save.score = state.player.score;
    feedback.innerHTML = `<div class="feedback-box">🎉 BENAR! Boss HP -1</div>`;
    if (state.bossRound.hp <= 0) {
      feedback.innerHTML += `<button class="pixel-btn good flow-btn" id="finish-level">BOSS DEFEATED!</button>`;
      SFX.boss();
      savePlayer();
      saveState();
      return;
    }
    if (state.bossRound.index < level.boss.length - 1) {
      feedback.innerHTML += `<button class="pixel-btn primary flow-btn" id="next-boss">SOAL BERIKUTNYA</button>`;
    }
    SFX.ok();
  } else {
    SFX.bad();
    loseLife();
    feedback.innerHTML = `<div class="feedback-box">❌ BELUM TEPAT<br>${q.hint}<br>❤️ Nyawa berkurang 1</div><button class="pixel-btn primary flow-btn" id="retry-boss">COBA LAGI</button>`;
  }
  savePlayer();
  saveState();
}
function finishLevel() {
  const level = LEVELS.find((l) => l.id === state.currentLevel);
  const nextId = level.id + 1;
  const save = state.save.levels[level.id];
  save.completed = true;
  if (nextId <= LEVELS.length) state.save.levels[nextId].unlocked = true;
  state.save.xp += 100;
  state.save.score += 200;
  state.player.xp = state.save.xp;
  state.player.score = state.save.score;
  document.getElementById('result-card').innerHTML = `
    <div class="screen-header"><h2>QUEST COMPLETE!</h2></div>
    <p>"${level.name} berhasil ditaklukkan!"</p>
    <div class="example-box">SCORE: ${state.save.score}\nCOINS: ${state.player.coins}\nCORRECT ANSWERS: ${state.currentPracticeCorrect}\nRATING: A\nXP: ${state.save.xp}</div>
    <div class="menu-stack spaced">
      ${nextId <= LEVELS.length ? `<button class="pixel-btn primary" data-enter="${nextId}">LEVEL ${nextId} TERBUKA</button>` : `<button class="pixel-btn good" data-go="progress">SEMUA LEVEL SELESAI</button>`}
      <button class="pixel-btn" data-go="map">PETA DUNIA</button>
      <button class="pixel-btn" data-go="progress">PROGRESS</button>
    </div>
  `;
  saveState();
  showScreen('result');
  startConfetti();
}
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 4 + Math.random() * 6,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 3,
    color: ['#f5d55b', '#f76a4a', '#4bd17a', '#7ac9ff', '#fff'][Math.floor(Math.random() * 5)]
  }));
  let animId = 0;
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y > canvas.height) p.y = -10;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    animId = requestAnimationFrame(frame);
  }
  frame();
  setTimeout(() => cancelAnimationFrame(animId), 1800);
}
function renderCoinShop(targetId) {
  const shop = document.getElementById(targetId);
  if (!shop) return;
  shop.innerHTML = `
    <div class="shop-heading"><div><span class="shop-kicker">COIN LAB</span><h3>PAKAI KOINMU</h3></div><strong class="coin-balance">◎ ${state.player.coins}</strong></div>
    <p class="shop-intro">Beli lalu pakai satu item di tiap slot. Semakin mahal, semakin gila efeknya.</p>
    ${[...new Set(SHOP_ITEMS.map((item) => item.category))].map((category) => `
      <div class="shop-category"><h4>${category}</h4><div class="shop-grid">${SHOP_ITEMS.filter((item) => item.category === category).map((item) => {
        const owned = hasShopItem(item.id);
        const equipped = item.category === 'EFEK' ? state.player.equippedEffect === item.id : state.player.equippedItems[item.category] === item.id;
        return `<article class="shop-item ${equipped ? 'equipped' : ''}">
          <div class="shop-icon">${item.icon}</div><div class="shop-item-copy"><h4>${item.name}</h4><p>${item.description}</p><small>${owned ? 'SUDAH DIMILIKI' : `HARGA ${item.price} KOIN`}</small></div>
          <button type="button" class="pixel-btn mini ${equipped ? 'good' : owned ? '' : 'primary'}" data-shop-item="${item.id}" ${!owned && state.player.coins < item.price ? 'disabled' : ''}>${equipped ? 'DIPAKAI' : owned ? 'PAKAI' : 'BELI'}</button>
        </article>`;
      }).join('')}</div></div>`).join('')}`;
}
function renderProgress() {
  const card = document.getElementById('progress-card');
  card.innerHTML = LEVELS.map((level) => {
    const save = state.save.levels[level.id];
    const pct = save.completed ? 100 : save.latihanPassed ? 70 : save.materiDone ? 40 : save.unlocked ? 20 : 0;
    const bar = '█'.repeat(Math.floor(pct / 10)) + '░'.repeat(10 - Math.floor(pct / 10));
    return `
      <div class="map-card ${save.completed ? 'completed' : save.unlocked ? 'unlocked' : 'locked'}">
        <h3>LEVEL ${level.id} ${level.name}</h3>
        <p>${bar} ${pct}% · ${save.completed ? '✅ SELESAI' : save.unlocked ? '🔓 TERBUKA' : '🔒 TERKUNCI'}</p>
      </div>
    `;
  }).join('');
  showScreen('progress');
}
function openModal(options = {}) {
  const modal = document.getElementById('modal');
  const textEl = document.getElementById('modal-text');
  const primary = document.getElementById('modal-primary');
  const secondary = document.getElementById('modal-secondary');
  const tertiary = document.getElementById('modal-tertiary');
  if (!modal || !textEl || !primary || !secondary || !tertiary) return;
  if (options.html) {
    textEl.innerHTML = options.html;
  } else {
    textEl.textContent = options.text || 'Informasi';
    textEl.innerHTML = textEl.textContent.replace(/\n/g, '<br>');
  }
  primary.type = 'button';
  primary.textContent = options.primaryLabel || 'YA';
  primary.dataset.action = options.primaryAction || 'close-modal';
  primary.style.display = 'inline-flex';
  primary.disabled = !!options.primaryDisabled;
  secondary.type = 'button';
  secondary.textContent = options.secondaryLabel || 'BATAL';
  secondary.dataset.action = options.secondaryAction || 'close-modal';
  secondary.style.display = 'inline-flex';
  tertiary.type = 'button';
  tertiary.textContent = options.tertiaryLabel || 'KEMBALI';
  tertiary.dataset.action = options.tertiaryAction || 'close-modal';
  tertiary.style.display = options.tertiaryLabel ? 'inline-flex' : 'none';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
}
function showLifeModal() {
  saveGameplayRecoveryState();
  openModal({
    text: '❤️ NYAWA HABIS\nPetualanganmu berhenti sementara.\nPilih cara untuk melanjutkan.',
    primaryLabel: 'BELAJAR KEMBALI',
    primaryAction: 'retry-life',
    secondaryLabel: '⚡ JAWAB SOAL SULIT',
    secondaryAction: 'recovery-life',
    tertiaryLabel: '🎁 BONUS PETUALANG',
    tertiaryAction: 'bonus-instagram'
  });
}
function startRecoveryChallenge() {
  const pool = LEVELS.flatMap((level) => level.quiz.map((question, index) => ({
    ...question,
    levelId: level.id,
    levelName: level.name,
    key: `${level.id}-${index}`
  })));
  const picked = pool.sort(() => Math.random() - 0.5).slice(0, RECOVERY_QUESTIONS).map((item) => ({
    q: item.q,
    choices: item.choices,
    answer: item.answer,
    hint: item.hint
  }));
  state.recovery = {
    questions: picked,
    index: 0,
    correct: 0,
    mode: 'recovery'
  };
  renderRecoveryChallenge();
}
function renderRecoveryChallenge() {
  const recovery = state.recovery || { questions: [], index: 0, correct: 0 };
  const question = recovery.questions[recovery.index];
  if (!question) {
    state.recovery = null;
    closeModal();
    showLifeModal();
    return;
  }
  document.getElementById('review-card').innerHTML = `
    <div class="screen-header"><h2>💚 CHALLENGE RECOVERY</h2></div>
    <p>Jawab 3 soal untuk mendapatkan kembali nyawa.</p>
    <p>Progress: ${recovery.index + 1}/3</p>
    <div class="example-box">${formatMathText(question.q)}</div>
    <div class="choice-grid">
      ${question.choices.map((choice, index) => `<button class="pixel-btn choice-btn" data-recovery-answer="${index}">${String.fromCharCode(65 + index)}. ${formatMathText(choice)}</button>`).join('')}
    </div>
    <div id="recovery-feedback"></div>
  `;
  showScreen('review');
}
function handleRecoveryAnswer(index) {
  const recovery = state.recovery;
  if (!recovery) return;
  const question = recovery.questions[recovery.index];
  document.querySelectorAll('[data-recovery-answer]').forEach((button) => button.disabled = true);
  const feedback = document.getElementById('recovery-feedback');
  if (index === question.answer) {
    recovery.correct += 1;
    feedback.innerHTML = `<div class="feedback-box">✔️ BENAR! +1 progres recovery</div>`;
  } else {
    feedback.innerHTML = `<div class="feedback-box">❌ SALAH! ${question.hint}</div>`;
  }
  if (recovery.index < recovery.questions.length - 1) {
    recovery.index += 1;
    feedback.innerHTML += `<button class="pixel-btn primary flow-btn" id="next-recovery">LANJUT</button>`;
    savePlayer();
    saveState();
    return;
  }
  const success = recovery.correct >= 2;
  if (success) {
    state.player.life = 3;
    state.recovery = null;
    state.recoveryFlow = null;
    toast('Recovery berhasil! Nyawa kembali menjadi 3.');
    savePlayer();
    saveState();
    setTimeout(() => {
      closeModal();
      resumeGameAfterRecovery();
    }, 550);
    return;
  }
  toast('Recovery gagal. Kamu masih bisa mencoba lagi.');
  savePlayer();
  saveState();
  feedback.innerHTML += `<button class="pixel-btn primary flow-btn" id="finish-recovery">KEMBALI KE PILIHAN RECOVERY</button>`;
}
function resumeGameAfterRecovery() {
  state.isGameOver = false;
  const restored = restoreGameplayRecoveryState();
  if (!restored && !state.game) {
    setupGame();
  }
  if (!state.game) return;
  state.game.isGameOver = false;
  state.game.running = true;
  state.game.isDead = false;
  renderHud();
  showScreen('game');
  if (state.game.loopId) cancelAnimationFrame(state.game.loopId);
  state.game.loopId = requestAnimationFrame(gameLoop);
  delete state.player.recoveryState;
  savePlayer();
  closeModal();
}
function claimInstagramReward() {
  if (state.player.instagramRewardClaimed) {
    toast('Bonus petualang telah diklaim sebelumnya.');
    closeModal();
    return;
  }
  const completed = getInstagramTaskProgress();
  if (completed < 3) {
    toast('Selesaikan 3 tugas follow terlebih dahulu.');
    return;
  }
  state.player.instagramRewardClaimed = true;
  state.player.instagramFollowedAccounts = { ...state.player.instagramTasks };
  state.player.life = 3;
  savePlayer();
  saveState();
  renderHud();
  toast('Bonus berhasil diklaim! Nyawa kembali menjadi 3.');
  closeModal();
  resumeGameAfterRecovery();
}
function renderInstagramBonusModal() {
  const claimDisabled = getInstagramTaskProgress() < 3 || state.player.instagramRewardClaimed;
  const tasksMarkup = INSTAGRAM_ACCOUNTS.map((account) => {
    const key = account.handle.replace('@', '').replace(/[^a-z0-9_]/gi, '');
    const normalizedKey = key;
    const completed = Boolean(state.player.instagramTasks?.[normalizedKey]);
    const pending = Boolean(state.player.instagramPending?.[normalizedKey]) || completed;
    return `
      <div class="instagram-account">
        <div class="instagram-account-copy">
          <span class="instagram-icon">◎</span>
          <div>
            <strong>${account.handle}</strong>
            <small>${completed ? '✓ SELESAI' : pending ? '⏳ TUNGGU KONFIRMASI' : '○ BELUM SELESAI'}</small>
          </div>
        </div>
        <div class="instagram-buttons">
          <button class="pixel-btn mini" data-action="follow-instagram" data-instagram-url="${account.url}" data-instagram-key="${normalizedKey}">FOLLOW</button>
          <button class="pixel-btn mini ${completed ? 'good' : ''}" data-action="complete-instagram" data-instagram-key="${normalizedKey}" ${pending ? '' : 'disabled'}>${completed ? '✓ SUDAH SELESAI' : 'SUDAH SELESAI'}</button>
        </div>
      </div>
    `;
  }).join('');
  openModal({
    html: `
      <div class="reward-modal-copy">
        <strong>🎁 BONUS PETUALANG</strong>
        <span>Lengkapi 3 tugas untuk mendapatkan +5 NYAWA dan lanjutkan petualangan.</span>
      </div>
      <div class="instagram-list">${tasksMarkup}</div>
      <div class="reward-note">Progress: ${getInstagramTaskProgress()} / 3 tugas selesai</div>
      <div class="reward-note">Versi lokal tidak dapat memverifikasi follow secara otomatis.</div>
    `,
    primaryLabel: state.player.instagramRewardClaimed ? '🎁 BONUS SUDAH DIKLAIM' : '🎁 KLAIM +5 NYAWA',
    primaryAction: 'claim-instagram-bonus',
    primaryDisabled: claimDisabled,
    secondaryLabel: 'KEMBALI',
    secondaryAction: 'close-modal',
    tertiaryLabel: '',
    tertiaryAction: ''
  });
  const primaryBtn = document.getElementById('modal-primary');
  if (primaryBtn) {
    primaryBtn.disabled = claimDisabled;
    primaryBtn.title = state.player.instagramRewardClaimed ? 'Bonus sudah digunakan.' : claimDisabled ? 'Selesaikan semua tugas dulu.' : 'Klaim +5 nyawa';
  }
}
function showInstagramReward() {
  if (state.player.instagramRewardClaimed) {
    toast('Bonus petualang sudah digunakan.');
    closeModal();
    return;
  }
  renderInstagramBonusModal();
}
function bindEvents() {
  document.addEventListener('click', async (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    if (btn.id === 'user-login') {
      document.getElementById('user-login-form').hidden = false;
      document.getElementById('admin-login-form').hidden = true;
      return;
    }
    if (btn.id === 'admin-login') {
      document.getElementById('admin-login-form').hidden = false;
      document.getElementById('user-login-form').hidden = true;
      return;
    }
    if (btn.id === 'submit-user-login') {
      loginWithCode('user');
      return;
    }
    if (btn.id === 'submit-admin-login') {
      await loginAdmin();
      return;
    }
    if (btn.id === 'admin-tab-users') {
      await renderAdminUsers();
      return;
    }
    if (btn.id === 'create-user') {
      const input = document.getElementById('new-user-name');
      const name = input ? input.value.trim() : '';
      if (!name) {
        document.getElementById('admin-status').textContent = 'Nama user tidak boleh kosong!';
        toast('Nama user tidak boleh kosong!');
        return;
      }
      try {
        btn.disabled = true;
        document.getElementById('admin-status').textContent = 'Sedang membuat akun user...';
        const result = await createUserAccount(name);
        input.value = '';
        document.getElementById('admin-status').textContent = `AKUN BERHASIL DIBUAT — ${result.name} — KODE: ${result.loginCode}`;
        toast(`Akun ${result.name} berhasil dibuat! Kode: ${result.loginCode}`);
        await renderAdminUsers();
      } catch (error) {
        document.getElementById('admin-status').textContent = error.message;
        toast(`Gagal: ${error.message}`);
      } finally {
        btn.disabled = false;
      }
      return;
    }
    if (btn.id === 'admin-tab-leaderboard') {
      try {
        document.getElementById('admin-status').textContent = 'Memuat leaderboard...';
        const users = await getAuthApi().leaderboard();
        if (!users || !users.length) {
          document.getElementById('admin-users').innerHTML = '<div style="padding:20px;text-align:center;color:#8ba3bc;font-size:0.9rem;">Belum ada user di leaderboard.</div>';
          document.getElementById('admin-status').textContent = 'LEADERBOARD — Belum ada data user.';
        } else {
          document.getElementById('admin-users').innerHTML = users.map((user, index) =>
            `<div class="admin-user-row"><span><strong>#${index + 1} ${user.name}</strong><small>LEVEL ${user.level} · XP ${user.xp}</small></span><b>${user.score} SCORE</b></div>`
          ).join('');
          document.getElementById('admin-status').textContent = 'LEADERBOARD — urutan SCORE, XP, lalu LEVEL.';
        }
      } catch (error) {
        document.getElementById('admin-status').textContent = error.message;
        toast(`Gagal: ${error.message}`);
      }
      return;
    }
    if (btn.id === 'admin-check-inactive') {
      try {
        document.getElementById('admin-status').textContent = 'Memeriksa akun tidak aktif...';
        const result = await getAuthApi().checkInactiveUsers();
        await renderAdminUsers();
        const msg = `${result.disabled || 0} akun dinonaktifkan karena tidak aktif.`;
        document.getElementById('admin-status').textContent = msg;
        toast(msg);
      } catch (error) {
        document.getElementById('admin-status').textContent = error.message;
        toast(`Gagal: ${error.message}`);
      }
      return;
    }
    if (btn.dataset.adminEdit) {
      try {
        openAdminEditModal(JSON.parse(decodeURIComponent(btn.dataset.adminEdit)));
      } catch (error) {
        document.getElementById('admin-status').textContent = `Data user tidak valid: ${error.message}`;
      }
      return;
    }
    if (btn.id === 'contact-admin') {
      document.getElementById('premium-status').textContent = 'Hubungi admin MBG untuk mendapatkan kode login.';
      return;
    }
    if (btn.id === 'disabled-back-login') {
      await getAuthApi().logout();
      return;
    }
    if (btn.id === 'locked-logout' || btn.id === 'admin-logout' || btn.id === 'user-logout') {
      await logoutCurrentUser();
      return;
    }
    if (btn.dataset.adminUser) {
      const uid = btn.dataset.adminUser;
      const active = btn.dataset.adminActive === 'true';
      const message = active ? (window.prompt('Pesan untuk user saat akun dinonaktifkan:', 'Akun dinonaktifkan. Silakan hubungi admin.') || '') : '';
      if (active && !message && !window.confirm('Nonaktifkan akun tanpa pesan admin?')) return;
      if (!window.confirm(`Ubah status akses akun ini?`)) return;
      try {
        await getAuthApi().activateUser(uid, !active, message);
        await renderAdminUsers();
      } catch (error) {
        document.getElementById('admin-status').textContent = error.message;
      }
      return;
    }
    const modalAction = btn.dataset.action;
    if (btn.closest('#modal') && modalAction) {
      const action = modalAction;
      if (action === 'close-modal') {
        closeModal();
        return;
      }
      if (action === 'admin-save-user') {
        const uid = btn.dataset.adminEditUid;
        const fields = ['level', 'xp', 'score', 'coins', 'life', 'unlockedLevel'];
        const data = {
          name: document.getElementById('edit-user-name')?.value.trim(),
          selectedCharacter: document.getElementById('edit-user-character')?.value.trim(),
          loginCode: document.getElementById('edit-user-loginCode')?.value.trim(),
          allMapsUnlocked: document.getElementById('edit-user-allMapsUnlocked')?.checked === true,
          allItemsUnlocked: document.getElementById('edit-user-allItemsUnlocked')?.checked === true,
          active: document.getElementById('edit-user-active')?.value === 'true'
        };
        if (data.allItemsUnlocked) data.shopOwned = SHOP_ITEMS.map((item) => item.id);
        for (const field of fields) {
          const value = Number(document.getElementById(`edit-user-${field}`)?.value);
          if (!Number.isInteger(value) || value < 0) {
            toast(`${field} harus berupa angka 0 atau lebih.`);
            return;
          }
          data[field] = value;
        }
        try {
          await getAuthApi().updateUser(uid, data);
          closeModal();
          await renderAdminUsers();
          toast('Akun berhasil diperbarui.');
        } catch (error) {
          toast(error.message);
        }
        return;
      }
      if (action === 'admin-topup-user') {
        const uid = btn.dataset.adminEditUid;
        const data = {};
        for (const field of ['level', 'xp', 'score', 'coins', 'life']) {
          const value = Number(document.getElementById(`topup-user-${field}`)?.value);
          if (!Number.isInteger(value) || value < 0) {
            toast(`${field} top up harus berupa angka 0 atau lebih.`);
            return;
          }
          data[field] = value;
        }
        try {
          await getAuthApi().topUpUser(uid, data);
          closeModal();
          await renderAdminUsers();
          toast('Top up berhasil diterapkan.');
        } catch (error) {
          toast(error.message);
        }
        return;
      }
      if (action === 'admin-reset-user') {
        const uid = btn.dataset.adminEditUid;
        if (!window.confirm('Reset XP, score, koin, level, nyawa, dan karakter user ini?')) return;
        try {
          await getAuthApi().resetProgress(uid);
          closeModal();
          await renderAdminUsers();
          toast('Progress user berhasil direset.');
        } catch (error) {
          toast(error.message);
        }
        return;
      }
      if (action === 'reset-progress-confirm') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PLAYER_KEY);
        state.save = defaultSave();
        state.player = defaultPlayer();
        state.currentMode = state.player.mode || 'desktop';
        state.selectedDevice = state.currentMode;
        savePlayer();
        saveState();
        renderHome();
        renderMapList('map');
        closeModal();
        toast('Progress berhasil direset.');
        return;
      }
      if (action === 'claim-instagram') {
        claimInstagramReward();
        return;
      }
      if (action === 'claim-instagram-bonus') {
        claimInstagramReward();
        return;
      }
      if (action === 'retry-life') {
        closeModal();
        state.isGameOver = false;
        if (state.game) state.game.isGameOver = false;
        const level = LEVELS.find((l) => l.id === state.currentLevel);
        if (level) {
          state.recoveryFlow = 'study';
          state.currentMaterialPage = 0;
          state.currentPracticeIndex = 0;
          state.currentPracticeCorrect = 0;
          renderStudy();
          showScreen('materi');
        }
        return;
      }
      if (action === 'recovery-life') {
        closeModal();
        state.isGameOver = false;
        if (state.game) state.game.isGameOver = false;
        startRecoveryChallenge();
        return;
      }
      if (action === 'back-to-map') {
        closeModal();
        renderMapList('map');
        showScreen('map');
        return;
      }
      if (action === 'bonus-instagram') {
        showInstagramReward();
        return;
      }
      if (action === 'open-all-instagram') {
        INSTAGRAM_ACCOUNTS.forEach((account) => window.open(account.url, '_blank', 'noopener,noreferrer'));
        return;
      }
      if (action === 'follow-instagram') {
        const taskKey = btn.dataset.instagramKey;
        const url = btn.dataset.instagramUrl || INSTAGRAM_ACCOUNTS[0].url;
        if (taskKey) {
          state.player.instagramPending = {
            ...(state.player.instagramPending || defaultPlayer().instagramPending),
            [taskKey]: true
          };
          savePlayer();
          saveState();
        }
        window.open(url, '_blank', 'noopener,noreferrer');
        renderInstagramBonusModal();
        return;
      }
      if (action === 'complete-instagram') {
        const taskKey = btn.dataset.instagramKey;
        if (!taskKey) return;
        state.player.instagramPending = {
          ...(state.player.instagramPending || defaultPlayer().instagramPending),
          [taskKey]: false
        };
        state.player.instagramTasks = {
          ...(state.player.instagramTasks || defaultPlayer().instagramTasks),
          [taskKey]: true
        };
        state.player.instagramFollowedAccounts = {
          ...(state.player.instagramFollowedAccounts || {}),
          [taskKey]: true
        };
        savePlayer();
        saveState();
        renderInstagramBonusModal();
        return;
      }
      if (action === 'open-instagram') {
        const target = btn.dataset.instagramUrl || INSTAGRAM_ACCOUNTS[0].url;
        window.open(target, '_blank', 'noopener,noreferrer');
        return;
      }
    }
    const { go, enter, practiceAnswer, gateAnswer, bossAnswer, device, openInstagram, shopItem, character } = btn.dataset;
    if (openInstagram) {
      window.open(openInstagram, '_blank', 'noopener,noreferrer');
      return;
    }
    if (device) {
      selectDevice(device);
      return;
    }
    if (shopItem) {
      buyShopItem(shopItem);
      return;
    }
    if (character) {
      selectCharacter(character);
      return;
    }
    if (btn.dataset.action === 'open-character') {
      renderCharacterModal();
      return;
    }
    if (btn.dataset.action === 'open-shop') {
      renderShopModal();
      return;
    }
    if (go) {
      if (go === 'home') {
        renderHome();
        navigateScreen('home');
      }
      if (go === 'map') {
      renderMapList('map');
      navigateScreen('map');
    }
    if (go === 'materi') {
      const firstUnlocked = LEVELS.find((level) => state.save.levels[level.id].unlocked) || LEVELS[0];
      state.currentLevel = firstUnlocked.id;
      startStudy();
      navigateScreen('materi');
    }
    if (go === 'progress') {
      renderProgress();
      navigateScreen('progress');
    }
    }
    if (enter) openLevel(Number(enter));
    if (practiceAnswer !== undefined) processPracticeAnswer(Number(practiceAnswer));
    if (gateAnswer !== undefined) handleGateAnswer(Number(gateAnswer));
    if (bossAnswer !== undefined) handleBossAnswer(Number(bossAnswer));
    if (btn.id === 'btn-back') {
      if (state.screenHistory.length > 1) state.screenHistory.pop();
      const prev = state.screenHistory[state.screenHistory.length - 1] || 'home';
      if (prev === 'map') renderMapList('map');
      else if (prev === 'progress') renderProgress();
      else if (prev === 'home') { renderHome(); showScreen('home'); }
      else showScreen(prev);
      return;
    }
    if (btn.id === 'start-study') startStudy();
    if (btn.id === 'start-practice') startPractice();
    if (btn.id === 'start-quest') startQuest();
    if (btn.id === 'fullscreen-toggle') {
      toggleFullscreen();
      return;
    }
    if (btn.id === 'game-exit') {
      state.screenHistory = ['map'];
      renderMapList('map');
      return;
    }
    if (btn.id === 'ganti-mode') {
      changeMode();
      return;
    }
    if (btn.id === 'device-back') {
      if (state.currentMode) {
        renderApp();
      } else {
        toast('Pilih mode dulu sebelum masuk.');
      }
    }
    if (btn.id === 'next-page') {
      if (state.currentMaterialPage < LEVELS.find((l) => l.id === state.currentLevel).materials.length - 1) {
        state.currentMaterialPage += 1;
        renderStudy();
      } else {
      const level = LEVELS.find((l) => l.id === state.currentLevel);
      state.save.levels[level.id].materiDone = true;
      saveState();
      startReview();
      }
    }
    if (btn.id === 'prev-page') {
      state.currentMaterialPage = Math.max(0, state.currentMaterialPage - 1);
      renderStudy();
    }
    if (btn.id === 'next-practice') {
      const practiceQuestions = getPracticeQuestions(LEVELS.find((l) => l.id === state.currentLevel));
      if (state.currentPracticeIndex < practiceQuestions.length - 1) {
        state.currentPracticeIndex += 1;
        renderPractice();
      } else finishPractice();
    }
    if (btn.id === 'retry-practice') {
      state.currentPracticeIndex = 0;
      state.currentPracticeCorrect = 0;
      renderPractice();
    }
    if (btn.id === 'repeat-study') startStudy();
    if (btn.id === 'resume-game') {
      if (state.game) {
        if (state.game.loopId) cancelAnimationFrame(state.game.loopId);
        state.game.running = true;
        state.game.gateSolved = true;
        state.game.loopId = requestAnimationFrame(gameLoop);
      }
      showScreen('game');
    }
    if (btn.id === 'retry-gate') openGateQuestion();
    if (btn.id === 'next-boss') {
      const level = LEVELS.find((l) => l.id === state.currentLevel);
      if (state.bossRound && state.bossRound.index < level.boss.length - 1) {
        state.bossRound.index += 1;
      }
      renderBossCard(level);
      showScreen('boss');
    }
    if (btn.id === 'retry-boss') {
      renderBossCard(LEVELS.find((l) => l.id === state.currentLevel));
      showScreen('boss');
    }
    if (btn.id === 'finish-level') finishLevel();
    if (btn.id === 'reset-progress') {
      openModal({
        text: 'Apakah kamu yakin ingin menghapus seluruh progress?',
        primaryLabel: 'YA, RESET',
        primaryAction: 'reset-progress-confirm',
        secondaryLabel: 'BATAL',
        secondaryAction: 'close-modal'
      });
    }
    if (btn.id === 'next-recovery') {
      renderRecoveryChallenge();
    }
    if (btn.id === 'finish-recovery') {
      state.recovery = null;
      showLifeModal();
      return;
    }
    if (btn.dataset.recoveryAnswer !== undefined) {
      handleRecoveryAnswer(Number(btn.dataset.recoveryAnswer));
    }
  });
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target instanceof HTMLSelectElement
      || target.isContentEditable;
    if (isTyping) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'a', 'd', 'w'].includes(event.key)) event.preventDefault();
    if (state.game) state.game.keys[event.key] = true;
  });
  document.addEventListener('keyup', (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target instanceof HTMLSelectElement
      || target.isContentEditable;
    if (isTyping) return;
    if (state.game) state.game.keys[event.key] = false;
  });
  document.addEventListener('fullscreenchange', updateFullscreenUI);
  const padLeft = document.getElementById('pad-left');
  const padRight = document.getElementById('pad-right');
  const padJump = document.getElementById('pad-jump');
  [padLeft, padRight, padJump].forEach((btn) => {
    btn.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (!state.game) return;
      btn.classList.add('is-pressed');
      if (btn === padLeft) state.game.pad.left = true;
      if (btn === padRight) state.game.pad.right = true;
      if (btn === padJump) state.game.pad.jump = true;
    });
    const release = () => {
      if (!state.game) return;
      btn.classList.remove('is-pressed');
      if (btn === padLeft) state.game.pad.left = false;
      if (btn === padRight) state.game.pad.right = false;
      if (btn === padJump) state.game.pad.jump = false;
    };
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('pointerleave', release);
  });
}
function toast(message) {
  const toastEl = document.getElementById('toast');
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  clearTimeout(toast._id);
  toast._id = setTimeout(() => toastEl.classList.add('hidden'), 2200);
}
function bindAtmosphere() {
  const hero = document.querySelector('.hero-scene');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let frameId = 0;
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      hero.style.setProperty('--parallax-x', `${x * 10}px`);
      hero.style.setProperty('--parallax-y', `${y * 7}px`);
    });
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--parallax-x', '0px');
    hero.style.setProperty('--parallax-y', '0px');
  });
  const surface = document.getElementById('screen-container');
  surface?.addEventListener('pointermove', (event) => {
    const bounds = surface.getBoundingClientRect();
    surface.style.setProperty('--cursor-x', `${event.clientX - bounds.left}px`);
    surface.style.setProperty('--cursor-y', `${event.clientY - bounds.top}px`);
  });
  document.addEventListener('pointermove', (event) => {
    const card = event.target.closest('.map-card');
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
    card.style.setProperty('--tilt-x', `${rotateY}deg`);
    card.style.setProperty('--tilt-y', `${rotateX}deg`);
  });
  document.addEventListener('pointerout', (event) => {
    const card = event.target.closest('.map-card');
    if (card && !card.contains(event.relatedTarget)) {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    }
  });
}
function startPractice() {
  state.currentPracticeIndex = 0;
  state.currentPracticeCorrect = 0;
  renderPractice();
}
function startQuest() {
  state.isGameOver = false;
  if (state.game) state.game.isGameOver = false;
  const save = state.save.levels[state.currentLevel];
  if (state.player.life <= 0) {
    showLifeModal();
    return;
  }
  if (!save.latihanPassed) {
    toast('Selesaikan latihan dengan nilai minimal 70% terlebih dahulu.');
    return;
  }
  setupGame();
  showScreen('game');
  requestGameFullscreen();
}
const SFX = {
  ok: () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'square'; osc.frequency.value = 440; gain.gain.value = 0.03; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.08); } catch (_) {} },
  bad: () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sawtooth'; osc.frequency.value = 180; gain.gain.value = 0.03; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.12); } catch (_) {} },
  coin: () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'triangle'; osc.frequency.value = 660; gain.gain.value = 0.025; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.06); } catch (_) {} },
  jump: () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'square'; osc.frequency.value = 320; gain.gain.value = 0.02; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.04); } catch (_) {} },
  boss: () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sawtooth'; osc.frequency.value = 220; gain.gain.value = 0.04; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.2); } catch (_) {} }
};
function showNetworkDenied() {
  document.querySelectorAll('#premium-gate, #access-locked, #account-disabled, #admin-panel, #mode-selection, #main-app').forEach((element) => {
    if (element) element.hidden = true;
  });
  const denied = document.getElementById('network-denied');
  if (denied) denied.hidden = false;
}
async function startApplication() {
  const network = await window.mbgNetworkReady;
  if (!network.allowed) {
    showNetworkDenied();
    return;
  }
  const denied = document.getElementById('network-denied');
  if (denied) denied.hidden = true;
  const modeSelection = document.getElementById('mode-selection');
  if (modeSelection) modeSelection.hidden = false;
  bindEvents();
  bindAtmosphere();
  window.addEventListener('mbg-auth-ready', handleAuthReady);
  window.addEventListener('mbg-account-disabled', (event) => showAccountDisabled(event.detail?.message));
  setInterval(() => {
    if (state.auth?.profile?.role === 'user' && state.premiumAccess.active) {
      getAuthApi().heartbeat().catch((error) => {
        if (/Dinonaktifkan|dikeluarkan/i.test(error.message)) showAccountDisabled(error.message);
      });
    }
  }, 180000);
  window.addEventListener('mbg-auth-configured', () => {
    if (!window.mbgAuth?.configured) renderAuthGate();
  });
  window.mbgInitializeAuth?.();
  renderApp();
  renderHome();
  renderMapList('map');
  showScreen('home');
}
window.addEventListener('mbg-network-denied', showNetworkDenied);
document.getElementById('network-retry')?.addEventListener('click', () => window.location.reload());
startApplication();