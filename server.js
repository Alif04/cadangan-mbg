require('dotenv').config();
const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const net = require('node:net');
const { createClient } = require('@supabase/supabase-js');

const isVercel = Boolean(process.env.VERCEL);
const app = express();
const port = Number(process.env.PORT || 3000);
function cleanEnv(val) {
  if (!val) return '';
  let str = String(val).trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

const sessionSecret = cleanEnv(process.env.MBG_SESSION_SECRET || 'UYAVSDBUB82B8237BD8UENWIUBSIO3NU298HUSAIN');
const adminCode = cleanEnv(process.env.MBG_ADMIN_CODE || '231005');
const networkMode = String(process.env.MBG_NETWORK_MODE || (isVercel ? 'cloud' : 'development')).trim().toLowerCase();
const allowedNetworks = String(process.env.MBG_ALLOWED_NETWORKS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

// --- Supabase Database Initialization ---
const supabaseUrl = cleanEnv(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL);
const supabaseKey = cleanEnv(
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

let db = null;
let dbError = null;

if (supabaseUrl && supabaseKey) {
  try {
    db = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch (error) {
    dbError = error;
    console.warn('[MBG] Supabase client error:', error.message);
  }
} else {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseKey) missing.push('SUPABASE_SECRET_KEY (atau SUPABASE_SERVICE_ROLE_KEY)');
  dbError = new Error(`Variabel berikut belum terbaca di server Vercel: ${missing.join(', ')}. Pastikan sudah ditambahkan di Project Settings -> Environment Variables (centang Production) dan lakukan REDEPLOY.`);
}

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
function supabaseUserView(row) {
  if (!row) return null;
  const progress = row.progress || {};
  return {
    uid: row.uid,
    name: row.name,
    role: row.role || 'user',
    active: Boolean(row.active),
    status: row.status || (row.active ? 'active' : 'disabled'),
    accountStatus: row.account_status || row.status || 'active',
    disabledMessage: row.disabled_message || '',
    loginCode: row.login_code || '',
    xp: progress.xp ?? row.xp ?? 0,
    score: progress.score ?? row.score ?? 0,
    coins: progress.coins ?? row.coins ?? 0,
    life: progress.life ?? row.life ?? 3,
    level: progress.level ?? row.level ?? 1,
    unlockedLevel: progress.unlocked_level ?? row.unlocked_level ?? 1,
    selectedCharacter: progress.selectedCharacter ?? row.selected_character ?? 'hero',
    allMapsUnlocked: Boolean(progress.allMapsUnlocked ?? row.all_maps_unlocked),
    unlockedLevels: progress.unlockedLevels ?? row.unlocked_levels ?? [],
    completedMaterials: row.completed_materials ?? [],
    completedPractice: row.completed_practice ?? [],
    gameProgress: row.game_progress ?? {},
    progress: row.progress || {},
    lastLogin: row.last_login || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
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
  await db.from('sessions').upsert({
    session_id: session.sessionId,
    uid: session.uid,
    role: session.role,
    name: session.name,
    device_name: session.deviceName,
    browser: session.browser,
    platform: session.platform,
    user_agent: session.userAgent,
    login_at: session.loginAt || new Date().toISOString(),
    last_active_at: session.lastActiveAt || new Date().toISOString(),
    status: session.status || 'active'
  });
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

const publicDir = fs.existsSync(path.join(__dirname, 'public')) ? path.join(__dirname, 'public') : __dirname;
app.use(express.static(publicDir));
app.use(express.static(__dirname));
app.get('/', (_request, response) => {
  const indexPath = fs.existsSync(path.join(publicDir, 'index.html'))
    ? path.join(publicDir, 'index.html')
    : path.join(__dirname, 'index.html');
  response.sendFile(indexPath);
});

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
  if (!sessionSecret) {
    return response.status(503).json({ error: 'Backend session belum dikonfigurasi: MBG_SESSION_SECRET belum diset di server.' });
  }
  if (!db && !localMode) {
    const reason = dbError ? ` (${dbError.message})` : '';
    return response.status(503).json({ error: `Backend Supabase/session belum dikonfigurasi.${reason}` });
  }
  next();
}
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function requireSession(role) {
  return async (request, response, next) => {
    try {
      const session = readSession(request);
      if (!session) return response.status(401).json({ error: 'Sesi tidak valid.' });
      if (role && session.role !== role) return response.status(403).json({ error: 'Akses ditolak untuk peran ini.' });
      if (session.role === 'user') {
        if (localMode) {
          const stored = (localStore.sessions || []).find((item) => item.sessionId === session.sessionId);
          const user = localStore.users.find((item) => item.uid === session.uid);
          if (!stored || stored.status !== 'active') return response.status(401).json({ error: 'Perangkat ini telah dikeluarkan oleh admin.' });
          if (!user || user.status !== 'active') return response.status(403).json({ error: user?.disabledMessage || 'Akun Dinonaktifkan.' });
          stored.lastActiveAt = new Date().toISOString();
          saveLocalStore();
        } else if (db) {
          const [{ data: sessionData, error: sessionErr }, { data: userData, error: userErr }] = await Promise.all([
            db.from('sessions').select('*').eq('session_id', session.sessionId).maybeSingle(),
            db.from('users').select('*').eq('uid', session.uid).maybeSingle()
          ]);
          if (sessionErr) throw sessionErr;
          if (userErr) throw userErr;
          if (!sessionData || sessionData.status !== 'active') return response.status(401).json({ error: 'Perangkat ini telah dikeluarkan oleh admin.' });
          if (!userData || userData.status === 'disabled' || userData.account_status === 'disabled') {
            return response.status(403).json({ error: userData?.disabled_message || 'Akun Dinonaktifkan.' });
          }
          await db.from('sessions').update({ last_active_at: new Date().toISOString() }).eq('session_id', session.sessionId);
        }
      }
      request.session = session;
      next();
    } catch (err) {
      next(err);
    }
  };
}
function createLoginCode() {
  return `MBG-${crypto.randomBytes(4).toString('base64url').replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 5).padEnd(5, 'X')}`;
}

app.get('/health', (_request, response) => response.json({
  ok: true,
  databaseType: 'supabase',
  databaseConfigured: Boolean(db),
  firebaseConfigured: Boolean(db),
  localMode,
  persistentStorage: Boolean(db),
  ready: Boolean((db || localMode) && sessionSecret && adminCode),
  configurationRequired: !db && isVercel,
  envCheck: {
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseKey: Boolean(supabaseKey),
    hasSessionSecret: Boolean(sessionSecret),
    hasAdminCode: Boolean(adminCode),
    isVercel
  },
  databaseError: dbError?.message || null,
  firebaseError: dbError?.message || null
}));
app.get('/api/session', (request, response) => {
  const session = readSession(request);
  response.json({ user: session ? { uid: session.uid, role: session.role, name: session.name, active: session.active } : null });
});
app.post('/api/auth/admin', asyncHandler(async (request, response) => {
  if (!sessionSecret || !adminCode) return response.status(503).json({ error: 'Kode admin/session belum dikonfigurasi di server.' });
  const supplied = Buffer.from(String(request.body.code || ''));
  const expected = Buffer.from(String(adminCode || ''));
  if (!adminCode || supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    return response.status(401).json({ error: 'Kode admin salah.' });
  }
  response.json({ token: signSession({ uid: 'admin', role: 'admin', name: 'ADMIN', active: true }), user: { uid: 'admin', role: 'admin', name: 'ADMIN', active: true } });
}));
app.post('/api/auth/user', requireConfigured, asyncHandler(async (request, response) => {
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
  const { data: userData, error: userErr } = await db.from('users').select('*').eq('login_code_hash', codeHash).maybeSingle();
  if (userErr) throw userErr;
  if (!userData) return response.status(401).json({ error: 'Kode user tidak ditemukan.' });
  const user = supabaseUserView(userData);
  if (!user.active || user.status === 'disabled') return response.status(403).json({ error: user.disabledMessage || 'Akun user sedang nonaktif.' });
  const now = new Date().toISOString();
  await db.from('users').update({ last_login: now, last_login_at: now }).eq('uid', userData.uid);
  const session = createSession(userData.uid, 'user', user.name, request.body);
  await persistSession(session);
  response.json({ token: signSession({ ...session, exp: Date.now() + 7 * 86400000 }), user: { ...user, ...user.progress }, progress: user.progress, session });
}));
app.post('/api/session/heartbeat', requireConfigured, requireSession('user'), asyncHandler(async (request, response) => {
  const now = new Date().toISOString();
  if (localMode) {
    const session = localStore.sessions?.find((item) => item.sessionId === request.session.sessionId);
    const user = localStore.users.find((item) => item.uid === request.session.uid);
    if (!session || session.status !== 'active') return response.status(401).json({ error: 'Sesi perangkat sudah dicabut.' });
    if (!user || user.status !== 'active') return response.status(403).json({ error: user?.disabledMessage || 'Akun Dinonaktifkan.' });
    session.lastActiveAt = now; saveLocalStore(); return response.json({ ok: true, accountStatus: user.status });
  }
  const [{ data: sessionData, error: sessionErr }, { data: userData, error: userErr }] = await Promise.all([
    db.from('sessions').select('*').eq('session_id', request.session.sessionId).maybeSingle(),
    db.from('users').select('*').eq('uid', request.session.uid).maybeSingle()
  ]);
  if (sessionErr) throw sessionErr;
  if (userErr) throw userErr;
  if (!sessionData || sessionData.status !== 'active') return response.status(401).json({ error: 'Sesi perangkat sudah dicabut.' });
  if (!userData || userData.status === 'disabled' || userData.account_status === 'disabled') {
    return response.status(403).json({ error: userData?.disabled_message || 'Akun Dinonaktifkan.' });
  }
  await db.from('sessions').update({ last_active_at: now }).eq('session_id', request.session.sessionId);
  response.json({ ok: true, accountStatus: 'active' });
}));
app.post('/api/admin/users', requireConfigured, requireSession('admin'), asyncHandler(async (request, response) => {
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

  // Check if name already exists
  const { data: existingName, error: checkErr } = await db.from('users').select('uid').eq('name_normalized', nameNormalized).maybeSingle();
  if (checkErr) throw checkErr;
  if (existingName) {
    return response.status(409).json({ error: 'Nama sudah digunakan. Silakan pilih nama lain.' });
  }

  const uid = crypto.randomUUID();
  let loginCode = '';
  let created = false;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = createLoginCode();
    const candidateHash = hashCode(candidate);
    const now = new Date().toISOString();
    const { error: insertErr } = await db.from('users').insert({
      uid,
      name,
      name_normalized: nameNormalized,
      login_code: candidate,
      login_code_hash: candidateHash,
      role: 'user',
      active: true,
      status: 'active',
      account_status: 'active',
      created_at: now,
      created_by: request.session.uid,
      xp: 0,
      score: 0,
      coins: 0,
      life: 3,
      level: 1,
      unlocked_level: 1,
      selected_character: 'hero',
      all_maps_unlocked: false,
      unlocked_levels: [],
      completed_materials: [],
      completed_practice: [],
      game_progress: {},
      progress: {}
    });

    if (insertErr) {
      if (insertErr.code === '23505' && (insertErr.message?.includes('name_normalized') || insertErr.details?.includes('name_normalized'))) {
        return response.status(409).json({ error: 'Nama sudah digunakan. Silakan pilih nama lain.' });
      }
      if (insertErr.code === '23505') {
        continue;
      }
      throw insertErr;
    }
    loginCode = candidate;
    created = true;
    break;
  }
  if (!created) throw new Error('Gagal membuat kode unik, silakan ulangi.');
  response.json({ uid, name, loginCode });
}));
app.post('/api/admin/users/check-inactive', requireConfigured, requireSession('admin'), asyncHandler(async (_request, response) => {
  const cutoff = Date.now() - 30 * 86400000;
  if (localMode) {
    let disabled = 0;
    localStore.users.forEach((user) => {
      if (user.lastLogin && Date.parse(user.lastLogin) < cutoff && user.status === 'active') {
        user.active = false;
        user.status = 'disabled';
        disabled += 1;
      }
    });
    if (disabled) saveLocalStore();
    return response.json({ disabled });
  }
  const cutoffIso = new Date(cutoff).toISOString();
  const { data: usersToDisable, error } = await db
    .from('users')
    .update({ active: false, status: 'disabled', account_status: 'disabled', updated_at: new Date().toISOString() })
    .eq('role', 'user')
    .eq('active', true)
    .lt('last_login', cutoffIso)
    .select('uid');
  if (error) throw error;
  response.json({ disabled: usersToDisable?.length || 0 });
}));
app.get('/api/admin/users', requireConfigured, requireSession('admin'), asyncHandler(async (request, response) => {
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
  const query = normalizeName(request.query.q);
  const { data: docs, error } = await db.from('users').select('*').eq('role', 'user').order('created_at', { ascending: false });
  if (error) throw error;
  const users = (docs || []).map((doc) => {
    const u = supabaseUserView(doc);
    return {
      uid: u.uid,
      name: u.name,
      role: u.role,
      active: u.active,
      status: u.status,
      loginCode: u.loginCode,
      xp: u.xp,
      score: u.score,
      coins: u.coins,
      life: u.life,
      level: u.level,
      unlockedLevel: u.unlockedLevel,
      selectedCharacter: u.selectedCharacter,
      allMapsUnlocked: u.allMapsUnlocked,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
      sessions: []
    };
  }).filter((user) => !query || normalizeName(user.name).includes(query));
  response.json({ users });
}));
app.get('/api/admin/users/:uid/sessions', requireConfigured, requireSession('admin'), asyncHandler(async (request, response) => {
  if (localMode) {
    const sessions = (localStore.sessions || []).filter((session) => session.uid === request.params.uid);
    return response.json({ sessions });
  }
  const { data, error } = await db.from('sessions').select('*').eq('uid', request.params.uid).order('login_at', { ascending: false });
  if (error) throw error;
  const sessions = (data || []).map((s) => ({
    sessionId: s.session_id,
    uid: s.uid,
    role: s.role,
    name: s.name,
    deviceName: s.device_name,
    browser: s.browser,
    platform: s.platform,
    userAgent: s.user_agent,
    loginAt: s.login_at,
    lastActiveAt: s.last_active_at,
    status: s.status
  }));
  response.json({ sessions });
}));
app.post('/api/admin/sessions/:sessionId/revoke', requireConfigured, requireSession('admin'), asyncHandler(async (request, response) => {
  if (localMode) {
    const session = (localStore.sessions || []).find((item) => item.sessionId === request.params.sessionId);
    if (!session) return response.status(404).json({ error: 'Sesi tidak ditemukan.' });
    session.status = 'revoked';
    saveLocalStore();
    return response.json({ ok: true });
  }
  const { error } = await db.from('sessions').update({
    status: 'revoked',
    revoked_at: new Date().toISOString(),
    revoked_by: request.session.uid
  }).eq('session_id', request.params.sessionId);
  if (error) throw error;
  response.json({ ok: true });
}));
app.patch('/api/admin/users/:uid', requireConfigured, requireSession('admin'), asyncHandler(async (request, response) => {
  const body = request.body || {};
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.params.uid);
    if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });
    for (const field of ['xp', 'score', 'coins', 'life', 'level', 'unlockedLevel']) {
      if (body[field] !== undefined) {
        const value = Number(body[field]);
        if (!Number.isInteger(value) || value < 0) return response.status(400).json({ error: `${field} harus berupa angka 0 atau lebih.` });
        user[field] = value;
      }
    }
    if (body.selectedCharacter !== undefined) user.selectedCharacter = String(body.selectedCharacter).trim();
    if (body.allMapsUnlocked !== undefined) user.allMapsUnlocked = Boolean(body.allMapsUnlocked);
    if (body.active !== undefined) {
      user.active = Boolean(body.active);
      user.status = user.active ? 'active' : 'disabled';
      user.accountStatus = user.status;
    }
    if (body.name !== undefined) {
      const name = String(body.name).trim();
      const nameNormalized = normalizeName(name);
      if (!nameNormalized || name.length > 60) return response.status(400).json({ error: 'Nama user tidak valid.' });
      if (localStore.users.some((item) => item.uid !== user.uid && item.nameNormalized === nameNormalized)) {
        return response.status(409).json({ error: 'Nama sudah digunakan. Silakan pilih nama lain.' });
      }
      user.name = name;
      user.nameNormalized = nameNormalized;
    }
    if (body.loginCode !== undefined) {
      const nextCode = String(body.loginCode).trim().toUpperCase();
      if (!/^MBG-[A-Z0-9]{5}$/.test(nextCode)) return response.status(400).json({ error: 'Kode login harus berformat MBG-XXXXX.' });
      const nextHash = hashCode(nextCode);
      if (localStore.users.some((item) => item.uid !== user.uid && item.loginCodeHash === nextHash)) {
        return response.status(409).json({ error: 'Kode login sudah digunakan user lain.' });
      }
      user.loginCode = nextCode;
      user.loginCodeHash = nextHash;
    }
    user.progress = user.progress || {};
    for (const field of ['xp', 'score', 'coins', 'life', 'level', 'unlockedLevel', 'selectedCharacter']) {
      if (body[field] !== undefined) user.progress[field] = user[field];
    }
    saveLocalStore();
    return response.json({ ok: true });
  }

  const { data: current, error: getErr } = await db.from('users').select('*').eq('uid', request.params.uid).maybeSingle();
  if (getErr) throw getErr;
  if (!current || current.role !== 'user') return response.status(404).json({ error: 'User tidak ditemukan.' });

  const dbUpdates = {
    updated_at: new Date().toISOString(),
    updated_by: request.session.uid
  };
  const statsUpdates = {};

  for (const field of ['xp', 'score', 'coins', 'life', 'level']) {
    if (body[field] !== undefined) {
      const value = Number(body[field]);
      if (!Number.isInteger(value) || value < 0) return response.status(400).json({ error: `${field} harus berupa angka 0 atau lebih.` });
      dbUpdates[field] = value;
      statsUpdates[field] = value;
    }
  }
  if (body.unlockedLevel !== undefined) {
    const value = Number(body.unlockedLevel);
    if (!Number.isInteger(value) || value < 0) return response.status(400).json({ error: 'unlockedLevel harus berupa angka 0 atau lebih.`' });
    dbUpdates.unlocked_level = value;
    statsUpdates.unlockedLevel = value;
  }
  if (body.selectedCharacter !== undefined) {
    if (typeof body.selectedCharacter !== 'string' || !body.selectedCharacter.trim()) return response.status(400).json({ error: 'Karakter tidak valid.' });
    dbUpdates.selected_character = body.selectedCharacter.trim();
    statsUpdates.selectedCharacter = dbUpdates.selected_character;
  }
  if (body.allMapsUnlocked !== undefined) {
    dbUpdates.all_maps_unlocked = Boolean(body.allMapsUnlocked);
    statsUpdates.allMapsUnlocked = dbUpdates.all_maps_unlocked;
  }
  if (body.active !== undefined) {
    dbUpdates.active = Boolean(body.active);
    dbUpdates.status = dbUpdates.active ? 'active' : 'disabled';
    dbUpdates.account_status = dbUpdates.status;
  }
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    const nameNormalized = normalizeName(name);
    if (!nameNormalized || name.length > 60) return response.status(400).json({ error: 'Nama user tidak valid.' });
    dbUpdates.name = name;
    dbUpdates.name_normalized = nameNormalized;
  }
  if (body.loginCode !== undefined) {
    const nextCode = String(body.loginCode).trim().toUpperCase();
    if (!/^MBG-[A-Z0-9]{5}$/.test(nextCode)) return response.status(400).json({ error: 'Kode login harus berformat MBG-XXXXX.' });
    dbUpdates.login_code = nextCode;
    dbUpdates.login_code_hash = hashCode(nextCode);
  }

  if (Object.keys(statsUpdates).length) {
    dbUpdates.progress = { ...(current.progress || {}), ...statsUpdates };
  }

  const { error: updateErr } = await db.from('users').update(dbUpdates).eq('uid', request.params.uid);
  if (updateErr) {
    if (updateErr.code === '23505') {
      if (updateErr.message?.includes('name_normalized') || updateErr.details?.includes('name_normalized')) {
        return response.status(409).json({ error: 'Nama sudah digunakan. Silakan pilih nama lain.' });
      }
      if (updateErr.message?.includes('login_code') || updateErr.details?.includes('login_code')) {
        return response.status(409).json({ error: 'Kode login sudah digunakan user lain.' });
      }
    }
    throw updateErr;
  }
  response.json({ ok: true });
}));
app.post('/api/admin/users/:uid/reset-progress', requireConfigured, requireSession('admin'), asyncHandler(async (request, response) => {
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.params.uid);
    if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });
    user.xp = 0; user.score = 0; user.coins = 0; user.life = 3; user.level = 1;
    user.unlockedLevel = 1; user.selectedCharacter = 'hero'; user.allMapsUnlocked = false;
    user.unlockedLevels = []; user.completedMaterials = []; user.completedPractice = [];
    user.gameProgress = {}; user.progress = {};
    localStore.auditLogs = Array.isArray(localStore.auditLogs) ? localStore.auditLogs : [];
    localStore.auditLogs.push({ adminUid: request.session.uid, action: 'RESET_PROGRESS', targetUid: user.uid, createdAt: new Date().toISOString() });
    saveLocalStore();
    return response.json({ ok: true });
  }
  const resetData = {
    xp: 0, score: 0, coins: 0, life: 3, level: 1, unlocked_level: 1, selected_character: 'hero',
    all_maps_unlocked: false, unlocked_levels: [], completed_materials: [], completed_practice: [],
    game_progress: {}, progress: {}, updated_at: new Date().toISOString(), updated_by: request.session.uid
  };
  const { error } = await db.from('users').update(resetData).eq('uid', request.params.uid);
  if (error) throw error;
  await db.from('admin_logs').insert({
    admin_uid: request.session.uid,
    action: 'RESET_PROGRESS',
    target_uid: request.params.uid,
    created_at: new Date().toISOString()
  });
  response.json({ ok: true });
}));
app.post('/api/admin/users/:uid/top-up', requireConfigured, requireSession('admin'), asyncHandler(async (request, response) => {
  const fields = ['coins', 'life', 'xp', 'score'];
  const values = {};
  for (const field of fields) {
    const value = Number(request.body?.[field] ?? 0);
    if (!Number.isInteger(value) || value < 0) return response.status(400).json({ error: `${field} top up harus berupa angka 0 atau lebih.` });
    if (value) values[field] = value;
  }
  if (!Object.keys(values).length) return response.status(400).json({ error: 'Isi minimal satu nilai top up.' });
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.params.uid);
    if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });
    user.progress = user.progress || {};
    for (const [key, val] of Object.entries(values)) {
      user[key] = (Number(user[key]) || 0) + val;
      user.progress[key] = (Number(user.progress[key]) || 0) + val;
    }
    localStore.auditLogs = Array.isArray(localStore.auditLogs) ? localStore.auditLogs : [];
    localStore.auditLogs.push({ adminUid: request.session.uid, action: 'TOP_UP', targetUid: user.uid, values, createdAt: new Date().toISOString() });
    saveLocalStore();
    return response.json({ ok: true });
  }

  const { data: user, error: userErr } = await db.from('users').select('*').eq('uid', request.params.uid).maybeSingle();
  if (userErr) throw userErr;
  if (!user) return response.status(404).json({ error: 'User tidak ditemukan.' });

  const progress = user.progress || {};
  const updates = {
    updated_at: new Date().toISOString(),
    updated_by: request.session.uid
  };
  for (const [key, val] of Object.entries(values)) {
    updates[key] = (Number(user[key]) || 0) + val;
    progress[key] = (Number(progress[key]) || 0) + val;
  }
  updates.progress = progress;

  const { error: updateErr } = await db.from('users').update(updates).eq('uid', request.params.uid);
  if (updateErr) throw updateErr;

  await db.from('admin_logs').insert({
    admin_uid: request.session.uid,
    action: 'TOP_UP',
    target_uid: request.params.uid,
    values,
    created_at: new Date().toISOString()
  });
  response.json({ ok: true });
}));
app.patch('/api/admin/users/:uid/status', requireConfigured, requireSession('admin'), asyncHandler(async (request, response) => {
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

  const now = new Date().toISOString();
  const updates = {
    active,
    status: active ? 'active' : 'disabled',
    account_status: active ? 'active' : 'disabled',
    disabled_message: active ? '' : (message || 'Silakan hubungi admin untuk mengetahui informasi lebih lanjut.'),
    updated_at: now,
    disabled_at: active ? null : now,
    disabled_by: active ? null : request.session.uid
  };

  const { error: userErr } = await db.from('users').update(updates).eq('uid', request.params.uid);
  if (userErr) throw userErr;

  if (!active) {
    await db.from('sessions').update({
      status: 'revoked',
      revoked_at: now,
      revoked_by: request.session.uid
    }).eq('uid', request.params.uid).eq('status', 'active');
  }

  await db.from('admin_logs').insert({
    admin_uid: request.session.uid,
    action: active ? 'enable_user' : 'disable_user',
    target_uid: request.params.uid,
    message,
    created_at: now
  });
  response.json({ ok: true });
}));
app.get('/api/progress', requireConfigured, requireSession(), asyncHandler(async (request, response) => {
  if (request.session.role !== 'user') {
    return response.json({ progress: null });
  }
  if (localMode) {
    const user = localStore.users.find((item) => item.uid === request.session.uid);
    return response.json({ progress: user?.progress || null });
  }
  const { data: user, error } = await db.from('users').select('progress').eq('uid', request.session.uid).maybeSingle();
  if (error) throw error;
  response.json({ progress: user?.progress || null });
}));
app.put('/api/progress', requireConfigured, requireSession(), asyncHandler(async (request, response) => {
  if (request.session.role !== 'user') {
    return response.json({ ok: true, ignored: true });
  }
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

  const { data: currentUser, error: getErr } = await db.from('users').select('*').eq('uid', request.session.uid).maybeSingle();
  if (getErr) throw getErr;
  if (!currentUser) return response.status(404).json({ error: 'User tidak ditemukan.' });

  const mergedProgress = { ...(currentUser.progress || {}), ...progress };
  const updates = {
    progress: mergedProgress,
    updated_at: new Date().toISOString()
  };

  const fieldMap = {
    xp: 'xp',
    score: 'score',
    coins: 'coins',
    life: 'life',
    level: 'level',
    unlockedLevel: 'unlocked_level',
    selectedCharacter: 'selected_character',
    allMapsUnlocked: 'all_maps_unlocked',
    unlockedLevels: 'unlocked_levels'
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (progress[key] !== undefined) {
      updates[col] = progress[key];
    }
  }

  const { error: updateErr } = await db.from('users').update(updates).eq('uid', request.session.uid);
  if (updateErr) throw updateErr;
  response.json({ ok: true });
}));
app.get('/api/leaderboard', requireConfigured, requireSession(), asyncHandler(async (_request, response) => {
  if (localMode) {
    const users = localStore.users.map((user) => ({ name: user.name, xp: user.xp, score: user.score, level: user.level }))
      .sort((a, b) => b.score - a.score || b.xp - a.xp || b.level - a.level);
    return response.json({ users });
  }
  const { data, error } = await db.from('users').select('uid, name, xp, score, level').eq('role', 'user');
  if (error) throw error;
  const users = (data || []).map((u) => ({
    uid: u.uid,
    name: u.name,
    xp: Number(u.xp) || 0,
    score: Number(u.score) || 0,
    level: Number(u.level) || 1
  })).sort((a, b) => b.score - a.score || b.xp - a.xp || b.level - a.level);
  response.json({ users });
}));

app.use((err, _request, response, _next) => {
  console.error('[MBG] Error:', err.message);
  let message = err.message || 'Terjadi kesalahan pada server.';
  if (err.code === 'PGRST205' || message.includes('schema cache') || message.includes('Could not find the table')) {
    message = 'Tabel database Supabase belum dibuat. Silakan buka Supabase Dashboard -> SQL Editor lalu jalankan skrip file supabase-schema.sql.';
  }
  response.status(err.status || 500).json({ error: message });
});

if (require.main === module) {
  app.listen(port, () => console.log(`MBG server listening on http://localhost:${port}`));
}

module.exports = app;
