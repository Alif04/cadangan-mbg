require('dotenv').config();
const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const net = require('node:net');
const admin = require('firebase-admin');

const app = express();
const port = Number(process.env.PORT || 3000);
const sessionSecret = process.env.MBG_SESSION_SECRET;
const adminCode = process.env.MBG_ADMIN_CODE;
const networkMode = String(process.env.MBG_NETWORK_MODE || 'development').trim().toLowerCase();
const allowedNetworks = String(process.env.MBG_ALLOWED_NETWORKS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
let db = null;
let firebaseError = null;

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : null;
  if (!serviceAccount && !process.env.FIREBASE_PROJECT_ID) throw new Error('Firebase Admin credentials belum dikonfigurasi.');
  admin.initializeApp(serviceAccount
    ? { credential: admin.credential.cert(serviceAccount) }
    : { credential: admin.credential.applicationDefault(), projectId: process.env.FIREBASE_PROJECT_ID });
  db = admin.firestore();
} catch (error) {
  firebaseError = error;
}
const isVercel = Boolean(process.env.VERCEL);
// Vercel's deployment filesystem is not a durable database. Never present
// its temporary fallback as persistent account storage.
const localMode = !db && !isVercel && process.env.MBG_LOCAL_MODE !== 'false';
const localStorePath = path.join(__dirname, 'mbg-local-data.json');
let localStore = { users: [], sessions: [], auditLogs: [] };
if (localMode) {
  try {
    if (fs.existsSync(localStorePath)) localStore = JSON.parse(fs.readFileSync(localStorePath, 'utf8'));
  } catch (error) {
    console.warn('[MBG] Local data could not be loaded:', error.message);
  }
}
function saveLocalStore() {
  fs.writeFileSync(localStorePath, JSON.stringify(localStore, null, 2), 'utf8');
}
function localUserView(user) {
  return { ...user, active: user.status === 'active' };
}
function deviceInfo(body = {}) {
  return {
    deviceName: String(body.deviceName || 'Unknown Device').slice(0, 80),
    browser: String(body.browser || 'Unknown Browser').slice(0, 40),
    platform: String(body.platform || 'Unknown').slice(0, 40),
    userAgent: String(body.userAgent || '').slice(0, 240)
  };
}
function createSession(uid, role, name, info) {
  const sessionId = crypto.randomUUID();
  const session = { sessionId, uid, role, name, ...deviceInfo(info), loginAt: new Date().toISOString(), lastActiveAt: new Date().toISOString(), status: 'active' };
  if (localMode) {
    localStore.sessions = Array.isArray(localStore.sessions) ? localStore.sessions : [];
    localStore.sessions.push(session);
    saveLocalStore();
  }
  return session;
}
async function persistSession(session) {
  if (!db) return;
  await db.collection('sessions').doc(session.sessionId).set({ ...session, loginAt: admin.firestore.FieldValue.serverTimestamp(), lastActiveAt: admin.firestore.FieldValue.serverTimestamp() });
}

function normalizeRemoteAddress(address) {
  return String(address || '').replace(/^::ffff:/, '');
}

function ipv4ToNumber(address) {
  return address.split('.').reduce((result, part) => (result * 256) + Number(part), 0) >>> 0;
}

function isAddressInCidr(address, cidr) {
  const [network, prefixText] = cidr.split('/');
  const prefix = Number(prefixText);
  if (net.isIPv4(address) && net.isIPv4(network) && Number.isInteger(prefix) && prefix >= 0 && prefix <= 32) {
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    return (ipv4ToNumber(address) & mask) === (ipv4ToNumber(network) & mask);
  }
  return address === network && (prefixText === undefined || prefix === 128);
}

function isNetworkAllowed(request) {
  if (networkMode === 'development' || networkMode === 'cloud') return true;
  if (networkMode !== 'lan' && networkMode !== 'production') return false;
  const remoteAddress = normalizeRemoteAddress(request.socket.remoteAddress);
  return allowedNetworks.some((network) => isAddressInCidr(remoteAddress, network));
}

function networkDeniedPage() {
  return `<!doctype html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akses Jaringan Ditolak</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#06131f;color:#ecfbf8;font:16px Segoe UI,Arial,sans-serif;text-align:center}.card{max-width:480px;margin:24px;padding:32px;border:1px solid #ff6475;border-radius:12px;background:#0a2433;box-shadow:0 20px 60px #0008}h1{color:#ff6475;font-size:1.5rem}p{color:#b9d6d3;line-height:1.5}</style></head><body><main class="card"><h1>AKSES JARINGAN DITOLAK</h1><p>Hubungkan perangkat ke jaringan MBG untuk melanjutkan.</p></main></body></html>`;
}

app.use(express.json({ limit: '32kb' }));
app.use((request, response, next) => {
  const origin = request.get('origin');
  if (origin === 'null' || origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') {
    response.setHeader('Access-Control-Allow-Origin', origin || '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
  }
  if (request.method === 'OPTIONS') return response.sendStatus(204);
  next();
});
app.get('/api/network-check', (request, response) => {
  if (isNetworkAllowed(request)) return response.json({ allowed: true });
  response.status(403).json({ allowed: false, error: 'NETWORK_NOT_ALLOWED' });
});
app.use((request, response, next) => {
  if (isNetworkAllowed(request)) return next();
  if (request.path.startsWith('/api/')) return response.status(403).json({ allowed: false, error: 'NETWORK_NOT_ALLOWED' });
  response.status(403).type('html').send(networkDeniedPage());
});
app.use(express.static(__dirname));
app.get('/', (_request, response) => response.sendFile(path.join(__dirname, 'index.html')));

function hashCode(value) {
  return crypto.createHash('sha256').update(String(value).trim().toUpperCase()).digest('hex');
}
function normalizeName(value) {
  return String(value || '').trim().normalize('NFKC').toLocaleLowerCase('id-ID');
}
function signSession(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 86400000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', sessionSecret || 'missing-session-secret').update(body).digest('base64url');
  return `${body}.${signature}`;
}
function readSession(request) {
  const value = request.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!value || !sessionSecret) return null;
  const [body, signature] = value.split('.');
  if (!body || !signature) return null;
  const expected = crypto.createHmac('sha256', sessionSecret).update(body).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(body, 'base64url').toString());
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}
function requireConfigured(request, response, next) {
  if ((!db && !localMode) || !sessionSecret) return response.status(503).json({ error: 'Backend Firebase/session belum dikonfigurasi.' });
  next();
}
function requireSession(role) {
  return async (request, response, next) => {
    const session = readSession(request);
    if (!session || (role && session.role !== role)) return response.status(401).json({ error: 'Sesi tidak valid.' });
    if (session.role === 'user') {
      if (localMode) {
        const stored = (localStore.sessions || []).find((item) => item.sessionId === session.sessionId);
        const user = localStore.users.find((item) => item.uid === session.uid);
        if (!stored || stored.status !== 'active') return response.status(401).json({ error: 'Perangkat ini telah dikeluarkan oleh admin.' });
        if (!user || user.status !== 'active') return response.status(403).json({ error: user?.disabledMessage || 'Akun Dinonaktifkan.' });
        stored.lastActiveAt = new Date().toISOString();
        saveLocalStore();
      } else if (db) {
        const [sessionDoc, userDoc] = await Promise.all([db.collection('sessions').doc(session.sessionId).get(), db.collection('users').doc(session.uid).get()]);
        if (!sessionDoc.exists || sessionDoc.data().status !== 'active') return response.status(401).json({ error: 'Perangkat ini telah dikeluarkan oleh admin.' });
        if (!userDoc.exists || userDoc.data().status === 'disabled' || userDoc.data().accountStatus === 'disabled') return response.status(403).json({ error: userDoc.data()?.disabledMessage || 'Akun Dinonaktifkan.' });
        await db.collection('sessions').doc(session.sessionId).update({ lastActiveAt: admin.firestore.FieldValue.serverTimestamp() });
      }
    }
    request.session = session;
    next();
  };
}
function createLoginCode() {
  return `MBG-${crypto.randomBytes(4).toString('base64url').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 5).padEnd(5, 'X')}`;
}

app.get('/health', (_request, response) => response.json({
  ok: true,
  firebaseConfigured: Boolean(db),
  localMode,
  persistentStorage: Boolean(db),
  ready: Boolean((db || localMode) && sessionSecret && adminCode),
  configurationRequired: !db && isVercel,
  firebaseError: firebaseError?.message || null
}));
app.get('/api/session', (request, response) => {
  const session = readSession(request);
  response.json({ user: session ? { uid: session.uid, role: session.role, name: session.name, active: session.active } : null });
});
app.post('/api/auth/admin', async (request, response) => {
  if (!sessionSecret || !adminCode) return response.status(503).json({ error: 'Kode admin/session belum dikonfigurasi di server.' });
  const supplied = Buffer.from(String(request.body.code || ''));
  const expected = Buffer.from(String(adminCode || ''));
  if (!adminCode || supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    return response.status(401).json({ error: 'Kode admin salah.' });
  }
  response.json({ token: signSession({ uid: 'admin', role: 'admin', name: 'ADMIN', active: true }), user: { uid: 'admin', role: 'admin', name: 'ADMIN', active: true } });
});
app.post('/api/auth/user', requireConfigured, async (request, response) => {
  const codeHash = hashCode(request.body.code);
  if (localMode) {
    const data = localStore.users.find((item) => item.loginCodeHash === codeHash);
    if (!data) return response.status(401).json({ error: 'Kode user tidak ditemukan.' });
    if (data.status !== 'active') return response.status(403).json({ error: 'Akun user sedang nonaktif.' });
    data.lastLogin = new Date().toISOString();
    saveLocalStore();
    const user = localUserView(data);
    const progress = data.progress || {};
    const session = createSession(data.uid, 'user', data.name, request.body);
    return response.json({ token: signSession({ ...session, exp: Date.now() + 7 * 86400000 }), user: { ...user, ...progress }, progress, session });
  }
  const snapshot = await db.collection('users').where('loginCodeHash', '==', codeHash).limit(1).get();
  if (snapshot.empty) return response.status(401).json({ error: 'Kode user tidak ditemukan.' });
  const doc = snapshot.docs[0];
  const data = doc.data();
  const progress = (await doc.ref.collection('progress').doc('game').get()).data() || {};
  const user = { uid: doc.id, name: data.name, role: data.role, active: data.active, xp: progress.xp ?? data.xp ?? 0, score: progress.score ?? data.score ?? 0, coins: progress.coins ?? data.coins ?? 0, life: progress.life ?? data.life ?? 3, level: progress.level ?? data.level ?? 1, selectedCharacter: progress.selectedCharacter ?? data.selectedCharacter ?? 'hero', allMapsUnlocked: progress.allMapsUnlocked ?? data.allMapsUnlocked ?? false, unlockedLevels: progress.unlockedLevels ?? data.unlockedLevels ?? [] };
  if (!user.active) return response.status(403).json({ error: 'Akun user sedang nonaktif.' });
  await doc.ref.update({ lastLogin: admin.firestore.FieldValue.serverTimestamp(), lastLoginAt: admin.firestore.FieldValue.serverTimestamp() });
  const session = createSession(doc.id, 'user', user.name, request.body);
  await persistSession(session);
  response.json({ token: signSession({ ...session, exp: Date.now() + 7 * 86400000 }), user, progress, session });
});
app.post('/api/session/heartbeat', requireConfigured, requireSession('user'), async (request, response) => {
  const now = new Date().toISOString();
  if (localMode) {
    const session = localStore.sessions?.find((item) => item.sessionId === request.session.sessionId);
    const user = localStore.users.find((item) => item.uid === request.session.uid);
    if (!session || session.status !== 'active') return response.status(401).json({ error: 'Sesi perangkat sudah dicabut.' });
    if (!user || user.status !== 'active') return response.status(403).json({ error: user?.disabledMessage || 'Akun Dinonaktifkan.' });
    session.lastActiveAt = now; saveLocalStore(); return response.json({ ok: true, accountStatus: user.status });
  }
  const sessionRef = db.collection('sessions').doc(request.session.sessionId);
  const sessionDoc = await sessionRef.get();
  const userDoc = await db.collection('users').doc(request.session.uid).get();
  if (!sessionDoc.exists || sessionDoc.data().status !== 'active') return response.status(401).json({ error: 'Sesi perangkat sudah dicabut.' });
  if (!userDoc.exists || userDoc.data().status === 'disabled' || userDoc.data().accountStatus === 'disabled') return response.status(403).json({ error: userDoc.data()?.disabledMessage || 'Akun Dinonaktifkan.' });
  await sessionRef.update({ lastActiveAt: admin.firestore.FieldValue.serverTimestamp() });
  response.json({ ok: true, accountStatus: 'active' });
});
app.post('/api/admin/users', requireConfigured, requireSession('admin'), async (request, response) => {
  const name = String(request.body.name || '').trim();
  const nameNormalized = normalizeName(name);
  if (!nameNormalized || name.length > 60) return response.status(400).json({ error: 'Nama user tidak valid.' });
  if (localMode) {
    if (localStore.users.some((user) => user.nameNormalized === nameNormalized)) {
      return response.status(409).json({ error: 'Nama sudah digunakan. Silakan pilih nama lain.' });
    }
    let loginCode;
    do { loginCode = createLoginCode(); } while (localStore.users.some((user) => user.loginCodeHash === hashCode(loginCode)));
    const user = {
      uid: crypto.randomUUID(), name, nameNormalized, loginCode, loginCodeHash: hashCode(loginCode),
      role: 'user', status: 'active', xp: 0, score: 0, coins: 0, life: 3, level: 1,
      unlockedLevel: 1, selectedCharacter: 'hero', unlockedLevels: [], completedMaterials: [],
      completedPractice: [], gameProgress: {}, progress: {}, lastLogin: null
    };
    localStore.users.push(user);
    saveLocalStore();
    return response.json({ uid: user.uid, name, loginCode });
  }
  const userRef = db.collection('users').doc();
  const nameRef = db.collection('userNames').doc(nameNormalized);
  let loginCode = '';
  try {
    await db.runTransaction(async (transaction) => {
      if ((await transaction.get(nameRef)).exists) throw new Error('Nama sudah digunakan. Silakan pilih nama lain.');
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const candidate = createLoginCode();
        const codeRef = db.collection('loginCodes').doc(hashCode(candidate));
        if (!(await transaction.get(codeRef)).exists) {
          loginCode = candidate;
          transaction.create(codeRef, { uid: userRef.id, createdAt: admin.firestore.FieldValue.serverTimestamp() });
          break;
        }
      }
      if (!loginCode) throw new Error('Gagal membuat kode unik, silakan ulangi.');
      transaction.create(nameRef, { uid: userRef.id });
      transaction.create(userRef, {
        name, nameNormalized, loginCode, loginCodeHash: hashCode(loginCode), role: 'user', active: true, status: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(), createdBy: request.session.uid,
        xp: 0, score: 0, coins: 0, life: 3, level: 1, unlockedLevel: 1, selectedCharacter: 'hero',
        unlockedLevels: [], completedMaterials: [], completedPractice: [], gameProgress: {}, lastLogin: null
      });
    });
  } catch (error) {
    return response.status(error.message.includes('Nama sudah digunakan') ? 409 : 500).json({ error: error.message });
  }
  response.json({ uid: userRef.id, name, loginCode });
});
app.post('/api/admin/users/check-inactive', requireConfigured, requireSession('admin'), async (_request, response) => {
  const cutoff = Date.now() - 30 * 86400000;
  if (localMode) {
    let disabled = 0;
    localStore.users.forEach((user) => {
      if (user.lastLogin && Date.parse(user.lastLogin) < cutoff && user.status === 'active') {
        user.status = 'disabled';
        disabled += 1;
      }
    });
    if (disabled) saveLocalStore();
    return response.json({ disabled });
  }
  const snapshot = await db.collection('users').where('role', '==', 'user').get();
  let disabled = 0;
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    const lastLogin = doc.data().lastLogin;
    const timestamp = lastLogin?.toMillis ? lastLogin.toMillis() : Date.parse(lastLogin || '');
    if (timestamp && timestamp < cutoff && doc.data().active) {
      batch.update(doc.ref, { active: false, status: 'disabled', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      disabled += 1;
    }
  });
  if (disabled) await batch.commit();
  response.json({ disabled });
});
app.get('/api/admin/users', requireConfigured, requireSession('admin'), async (request, response) => {
  if (localMode) {
    const query = normalizeName(request.query.q);
    const users = localStore.users.filter((user) => !query || user.nameNormalized.includes(query)).map((user) => ({
      ...localUserView(user), loginCode: user.loginCode, xp: user.xp, score: user.score, coins: user.coins,
      life: user.life, level: user.level, unlockedLevel: user.unlockedLevel, selectedCharacter: user.selectedCharacter,
      allMapsUnlocked: Boolean(user.allMapsUnlocked), lastLogin: user.lastLogin || null,
      sessions: (localStore.sessions || []).filter((session) => session.uid === user.uid && session.status === 'active')
    }));
    return response.json({ users });
  }
  const snapshot = await db.collection('users').where('role', '==', 'user').get();
  const query = normalizeName(request.query.q);
  const users = snapshot.docs.map((doc) => {
    const data = doc.data();
    return { uid: doc.id, name: data.name, role: data.role, active: data.active, status: data.status || (data.active ? 'active' : 'disabled'), loginCode: data.loginCode || '', xp: data.xp, score: data.score, coins: data.coins, life: data.life, level: data.level, unlockedLevel: data.unlockedLevel, selectedCharacter: data.selectedCharacter, allMapsUnlocked: Boolean(data.allMapsUnlocked), lastLogin: data.lastLogin || null, createdAt: data.createdAt };
  }).map((user) => ({ ...user, sessions: [] })).filter((user) => !query || normalizeName(user.name).includes(query));
  response.json({ users });
});
app.get('/api/admin/users/:uid/sessions', requireConfigured, requireSession('admin'), async (request, response) => {
  if (localMode) return response.json({ sessions: (localStore.sessions || []).filter((session) => session.uid === request.params.uid) });
  const snapshot = await db.collection('sessions').where('uid', '==', request.params.uid).get();
  response.json({ sessions: snapshot.docs.map((doc) => ({ sessionId: doc.id, ...doc.data() })) });
});
app.post('/api/admin/sessions/:sessionId/revoke', requireConfigured, requireSession('admin'), async (request, response) => {
  if (localMode) {
    const session = (localStore.sessions || []).find((item) => item.sessionId === request.params.sessionId);
    if (!session) return response.status(404).json({ error: 'Session tidak ditemukan.' });
    session.status = 'revoked'; saveLocalStore(); return response.json({ ok: true });
  }
  await db.collection('sessions').doc(request.params.sessionId).update({ status: 'revoked', revokedAt: admin.firestore.FieldValue.serverTimestamp(), revokedBy: request.session.uid });
  response.json({ ok: true });
});
app.patch('/api/admin/users/:uid', requireConfigured, requireSession('admin'), async (request, response) => {
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.params.uid);
    if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });
    const body = request.body || {};
    if (body.name !== undefined) {
      const name = String(body.name).trim();
      const nameNormalized = normalizeName(name);
      if (!nameNormalized || localStore.users.some((item) => item.uid !== user.uid && item.nameNormalized === nameNormalized)) return response.status(409).json({ error: 'Nama sudah digunakan. Silakan pilih nama lain.' });
      user.name = name; user.nameNormalized = nameNormalized;
    }
    if (body.loginCode !== undefined) {
      const loginCode = String(body.loginCode).trim().toUpperCase();
      if (!/^MBG-[A-Z0-9]{5}$/.test(loginCode) || localStore.users.some((item) => item.uid !== user.uid && item.loginCodeHash === hashCode(loginCode))) return response.status(409).json({ error: 'Kode login tidak valid atau sudah digunakan.' });
      user.loginCode = loginCode; user.loginCodeHash = hashCode(loginCode);
    }
    for (const field of ['xp', 'score', 'coins', 'life', 'level', 'unlockedLevel']) if (body[field] !== undefined) user[field] = Math.max(0, Number(body[field]) || 0);
    if (body.selectedCharacter !== undefined) user.selectedCharacter = String(body.selectedCharacter);
    if (body.allMapsUnlocked !== undefined) user.allMapsUnlocked = Boolean(body.allMapsUnlocked);
    if (Array.isArray(body.shopOwned)) user.shopOwned = body.shopOwned.filter((item) => typeof item === 'string');
    if (body.equippedItems && typeof body.equippedItems === 'object') user.equippedItems = body.equippedItems;
    user.progress = { ...(user.progress || {}), ...Object.fromEntries(['xp', 'score', 'coins', 'life', 'level', 'unlockedLevel', 'selectedCharacter', 'allMapsUnlocked', 'shopOwned', 'equippedItems'].filter((key) => body[key] !== undefined).map((key) => [key, user[key] ?? body[key]])) };
    if (body.active !== undefined) user.status = body.active ? 'active' : 'disabled';
    saveLocalStore();
    return response.json({ ok: true });
  }
  const userRef = db.collection('users').doc(request.params.uid);
  const current = await userRef.get();
  if (!current.exists || current.data().role !== 'user') return response.status(404).json({ error: 'User tidak ditemukan.' });
  const body = request.body || {};
  const updates = {};
  let nameChange = null;
  for (const field of ['xp', 'score', 'coins', 'life', 'level', 'unlockedLevel']) {
    if (body[field] !== undefined) {
      const value = Number(body[field]);
      if (!Number.isInteger(value) || value < 0) return response.status(400).json({ error: `${field} harus berupa angka 0 atau lebih.` });
      updates[field] = value;
    }
  }
  if (body.selectedCharacter !== undefined) {
    if (typeof body.selectedCharacter !== 'string' || !body.selectedCharacter.trim()) return response.status(400).json({ error: 'Karakter tidak valid.' });
    updates.selectedCharacter = body.selectedCharacter.trim();
  }
  if (body.allMapsUnlocked !== undefined) updates.allMapsUnlocked = Boolean(body.allMapsUnlocked);
  if (Array.isArray(body.shopOwned)) updates.shopOwned = body.shopOwned.filter((item) => typeof item === 'string');
  if (body.equippedItems && typeof body.equippedItems === 'object') updates.equippedItems = body.equippedItems;
  if (body.active !== undefined) {
    updates.active = Boolean(body.active);
    updates.status = updates.active ? 'active' : 'disabled';
  }
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    const nameNormalized = normalizeName(name);
    if (!nameNormalized || name.length > 60) return response.status(400).json({ error: 'Nama user tidak valid.' });
    nameChange = { name, nameNormalized };
  }
  let loginCodeChange = null;
  if (body.loginCode !== undefined) {
    const nextCode = String(body.loginCode).trim().toUpperCase();
    if (!/^MBG-[A-Z0-9]{5}$/.test(nextCode)) return response.status(400).json({ error: 'Kode login harus berformat MBG-XXXXX.' });
    loginCodeChange = { code: nextCode, hash: hashCode(nextCode) };
  }
  if (!Object.keys(updates).length && !nameChange && !loginCodeChange) return response.status(400).json({ error: 'Tidak ada perubahan.' });
  if (loginCodeChange && loginCodeChange.hash !== current.data().loginCodeHash) {
    const oldCodeRef = db.collection('loginCodes').doc(current.data().loginCodeHash);
    const newCodeRef = db.collection('loginCodes').doc(loginCodeChange.hash);
    const oldName = current.data().nameNormalized;
    const nameChanged = nameChange && nameChange.nameNormalized !== oldName;
    const newNameRef = nameChanged ? db.collection('userNames').doc(nameChange.nameNormalized) : null;
    const oldNameRef = db.collection('userNames').doc(oldName);
    await db.runTransaction(async (transaction) => {
      if ((await transaction.get(newCodeRef)).exists) throw new Error('Kode login sudah digunakan.');
      if (newNameRef && (await transaction.get(newNameRef)).exists) throw new Error('Nama sudah digunakan. Silakan pilih nama lain.');
      transaction.delete(oldCodeRef);
      transaction.create(newCodeRef, { uid: userRef.id, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      if (newNameRef) {
        transaction.delete(oldNameRef);
        transaction.create(newNameRef, { uid: userRef.id });
      }
      transaction.update(userRef, {
        loginCode: loginCodeChange.code,
        loginCodeHash: loginCodeChange.hash,
        ...(nameChanged ? { name: nameChange.name, nameNormalized: nameChange.nameNormalized } : {}),
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: request.session.uid
      });
      const progressUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => !['active', 'status'].includes(key)));
      if (Object.keys(progressUpdates).length) transaction.set(userRef.collection('progress').doc('game'), progressUpdates, { merge: true });
    });
  } else if (nameChange && nameChange.nameNormalized !== current.data().nameNormalized) {
    const oldNameRef = db.collection('userNames').doc(current.data().nameNormalized);
    const newNameRef = db.collection('userNames').doc(nameChange.nameNormalized);
    await db.runTransaction(async (transaction) => {
      if ((await transaction.get(newNameRef)).exists) throw new Error('Nama sudah digunakan. Silakan pilih nama lain.');
      const progressUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => !['active', 'status'].includes(key)));
      transaction.delete(oldNameRef);
      transaction.create(newNameRef, { uid: userRef.id });
      transaction.update(userRef, { name: nameChange.name, nameNormalized: nameChange.nameNormalized, ...updates, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: request.session.uid });
      if (Object.keys(progressUpdates).length) transaction.set(userRef.collection('progress').doc('game'), progressUpdates, { merge: true });
    });
  } else {
    if (nameChange) Object.assign(updates, { name: nameChange.name, nameNormalized: nameChange.nameNormalized });
    if (loginCodeChange) Object.assign(updates, { loginCode: loginCodeChange.code, loginCodeHash: loginCodeChange.hash });
    await userRef.update({ ...updates, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: request.session.uid });
    const progressUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => !['name', 'nameNormalized', 'active', 'status'].includes(key)));
    if (Object.keys(progressUpdates).length) await userRef.collection('progress').doc('game').set(progressUpdates, { merge: true });
  }
  response.json({ ok: true });
});
app.post('/api/admin/users/:uid/reset-progress', requireConfigured, requireSession('admin'), async (request, response) => {
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.params.uid);
    if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });
    Object.assign(user, { xp: 0, score: 0, coins: 0, life: 3, level: 1, unlockedLevel: 1, selectedCharacter: 'hero' });
    user.progress = { ...(user.progress || {}), xp: 0, score: 0, coins: 0, life: 3, level: 1, unlockedLevel: 1, selectedCharacter: 'hero' };
    saveLocalStore();
    return response.json({ ok: true });
  }
  const userRef = db.collection('users').doc(request.params.uid);
  const user = await userRef.get();
  if (!user.exists || user.data().role !== 'user') return response.status(404).json({ error: 'User tidak ditemukan.' });
  const reset = { xp: 0, score: 0, coins: 0, life: 3, level: 1, unlockedLevel: 1, selectedCharacter: 'hero' };
  await userRef.update({ ...reset, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: request.session.uid });
  await userRef.collection('progress').doc('game').set(reset, { merge: true });
  await userRef.collection('adminLogs').add({ action: 'RESET_PROGRESS', admin: request.session.uid, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  response.json({ ok: true });
});
app.post('/api/admin/users/:uid/top-up', requireConfigured, requireSession('admin'), async (request, response) => {
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.params.uid);
    if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });
    for (const field of ['xp', 'score', 'coins', 'life', 'level']) {
      const value = Number(request.body?.[field] ?? 0);
      if (!Number.isInteger(value) || value < 0) return response.status(400).json({ error: `${field} top up harus berupa angka 0 atau lebih.` });
      user[field] += value;
    }
    user.progress = { ...(user.progress || {}) };
    for (const field of ['xp', 'score', 'coins', 'life', 'level']) user.progress[field] = user[field];
    saveLocalStore();
    return response.json({ ok: true });
  }
  const fields = ['xp', 'score', 'coins', 'life', 'level'];
  const increments = {};
  for (const field of fields) {
    const value = Number(request.body?.[field] ?? 0);
    if (!Number.isInteger(value) || value < 0) return response.status(400).json({ error: `${field} top up harus berupa angka 0 atau lebih.` });
    if (value) increments[field] = admin.firestore.FieldValue.increment(value);
  }
  if (!Object.keys(increments).length) return response.status(400).json({ error: 'Isi minimal satu nilai top up.' });
  const userRef = db.collection('users').doc(request.params.uid);
  await userRef.update({ ...increments, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: request.session.uid });
  await userRef.collection('progress').doc('game').set(increments, { merge: true });
  await userRef.collection('adminLogs').add({ action: 'TOP_UP', values: request.body, admin: request.session.uid, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  response.json({ ok: true });
});
app.patch('/api/admin/users/:uid/status', requireConfigured, requireSession('admin'), async (request, response) => {
  const active = Boolean(request.body.active);
  const message = String(request.body.message || '').trim().slice(0, 500);
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.params.uid);
    if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });
    user.status = active ? 'active' : 'disabled';
    user.accountStatus = user.status;
    user.disabledMessage = active ? '' : (message || 'Silakan hubungi admin untuk mengetahui informasi lebih lanjut.');
    if (!active) (localStore.sessions || []).filter((session) => session.uid === user.uid && session.status === 'active').forEach((session) => { session.status = 'revoked'; });
    localStore.auditLogs = Array.isArray(localStore.auditLogs) ? localStore.auditLogs : [];
    localStore.auditLogs.push({ adminUid: request.session.uid, action: active ? 'enable_user' : 'disable_user', targetUid: user.uid, message, createdAt: new Date().toISOString() });
    saveLocalStore();
    return response.json({ ok: true });
  }
  const userRef = db.collection('users').doc(request.params.uid);
  await userRef.update({ active, status: active ? 'active' : 'disabled', accountStatus: active ? 'active' : 'disabled', disabledMessage: active ? '' : (message || 'Silakan hubungi admin untuk mengetahui informasi lebih lanjut.'), updatedAt: admin.firestore.FieldValue.serverTimestamp(), ...(active ? {} : { disabledAt: admin.firestore.FieldValue.serverTimestamp(), disabledBy: request.session.uid }) });
  if (!active) {
    const sessions = await db.collection('sessions').where('uid', '==', request.params.uid).where('status', '==', 'active').get();
    const batch = db.batch();
    sessions.docs.forEach((doc) => batch.update(doc.ref, { status: 'revoked', revokedAt: admin.firestore.FieldValue.serverTimestamp(), revokedBy: request.session.uid }));
    if (!sessions.empty) await batch.commit();
  }
  await db.collection('adminLogs').add({ adminUid: request.session.uid, action: active ? 'enable_user' : 'disable_user', targetUid: request.params.uid, message, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  response.json({ ok: true });
});
app.get('/api/progress', requireConfigured, requireSession('user'), async (request, response) => {
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.session.uid);
    return response.json({ progress: user?.progress || null });
  }
  const snapshot = await db.collection('users').doc(request.session.uid).collection('progress').doc('game').get();
  response.json({ progress: snapshot.data() || null });
});
app.put('/api/progress', requireConfigured, requireSession('user'), async (request, response) => {
  const allowed = ['xp', 'score', 'coins', 'life', 'level', 'unlockedLevel', 'selectedCharacter', 'allMapsUnlocked', 'unlockedLevels', 'shopOwned', 'equippedEffect', 'equippedItems', 'materialProgress', 'practiceProgress', 'gameProgress', 'achievement', 'levels', 'currentLevel', 'currentMaterialPage', 'currentPracticeIndex'];
  const progress = Object.fromEntries(allowed.filter((key) => Object.prototype.hasOwnProperty.call(request.body, key)).map((key) => [key, request.body[key]]));
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.session.uid);
    if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });
    Object.assign(user.progress, progress);
    for (const field of ['xp', 'score', 'coins', 'life', 'level', 'unlockedLevel', 'selectedCharacter']) if (progress[field] !== undefined) user[field] = progress[field];
    saveLocalStore();
    return response.json({ ok: true });
  }
  await db.collection('users').doc(request.session.uid).collection('progress').doc('game').set(progress, { merge: true });
  const accountFields = ['xp', 'score', 'coins', 'life', 'level', 'unlockedLevel', 'selectedCharacter', 'allMapsUnlocked', 'unlockedLevels', 'shopOwned', 'equippedEffect', 'equippedItems'];
  const accountProgress = Object.fromEntries(accountFields
    .filter((key) => Object.prototype.hasOwnProperty.call(progress, key))
    .map((key) => [key, progress[key]]));
  if (Object.keys(accountProgress).length) {
    await db.collection('users').doc(request.session.uid).set({
      ...accountProgress,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }
  response.json({ ok: true });
});
app.get('/api/leaderboard', requireConfigured, requireSession(), async (_request, response) => {
  if (localMode) {
    const users = localStore.users.map((user) => ({ name: user.name, xp: user.xp, score: user.score, level: user.level }))
      .sort((a, b) => b.score - a.score || b.xp - a.xp || b.level - a.level);
    return response.json({ users });
  }
  const snapshot = await db.collection('users').where('role', '==', 'user').get();
  const users = snapshot.docs.map((doc) => ({ uid: doc.id, name: doc.data().name, xp: Number(doc.data().xp) || 0, score: Number(doc.data().score) || 0, level: Number(doc.data().level) || 1 }))
    .sort((a, b) => b.score - a.score || b.xp - a.xp || b.level - a.level);
  response.json({ users });
});

if (require.main === module) {
  app.listen(port, () => console.log(`MBG server listening on http://localhost:${port}`));
}

module.exports = app;
