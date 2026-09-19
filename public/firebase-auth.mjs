const tokenKey = 'mbgSessionToken';

async function checkNetworkAccess() {
  try {
    const response = await fetch('/api/network-check', { cache: 'no-store' });
    const result = await response.json().catch(() => ({ allowed: false, error: 'NETWORK_NOT_ALLOWED' }));
    if (!response.ok || result.allowed !== true) {
      window.dispatchEvent(new CustomEvent('mbg-network-denied', { detail: result }));
      return { allowed: false, error: result.error || 'NETWORK_NOT_ALLOWED' };
    }
    return { allowed: true };
  } catch (error) {
    window.dispatchEvent(new CustomEvent('mbg-network-denied', { detail: { error: error.message } }));
    return { allowed: false, error: error.message };
  }
}

window.mbgNetworkReady = checkNetworkAccess();

function getToken() {
  return sessionStorage.getItem(tokenKey);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (body.error === 'NETWORK_NOT_ALLOWED') {
    window.dispatchEvent(new CustomEvent('mbg-network-denied', { detail: body }));
  }
  if (response.status === 401 && !path.startsWith('/api/auth/')) {
    sessionStorage.removeItem(tokenKey);
    mbgAuth.user = null;
    window.dispatchEvent(new CustomEvent('mbg-auth-ready', { detail: { user: null } }));
  }
  if (!response.ok) throw new Error(body.error || `Permintaan gagal (${response.status}).`);
  return body;
}

const mbgAuth = {
  configured: false,
  user: null,

  async loginAdmin(code) {
    const result = await request('/api/auth/admin', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
    sessionStorage.setItem(tokenKey, result.token);
    mbgAuth.user = result.user;
    return result;
  },

  async loginUser(code) {
    const result = await request('/api/auth/user', {
      method: 'POST',
      body: JSON.stringify({
        code,
        deviceName: navigator.userAgent.slice(0, 80),
        browser: navigator.appName,
        platform: navigator.platform,
        userAgent: navigator.userAgent
      })
    });
    sessionStorage.setItem(tokenKey, result.token);
    mbgAuth.user = result.user;
    return result;
  },

  async createUser(name) {
    return request('/api/admin/users', { method: 'POST', body: JSON.stringify({ name }) });
  },

  async listUsers() {
    const result = await request('/api/admin/users');
    return result.users || [];
  },

  async leaderboard() {
    const result = await request('/api/leaderboard');
    return result.users || [];
  },

  async checkInactiveUsers() {
    return request('/api/admin/users/check-inactive', { method: 'POST' });
  },

  async activateUser(uid, active, message = '') {
    return request(`/api/admin/users/${encodeURIComponent(uid)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active, message })
    });
  },

  async updateUser(uid, data) {
    return request(`/api/admin/users/${encodeURIComponent(uid)}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async topUpUser(uid, data) {
    return request(`/api/admin/users/${encodeURIComponent(uid)}/top-up`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async resetProgress(uid) {
    return request(`/api/admin/users/${encodeURIComponent(uid)}/reset-progress`, { method: 'POST' });
  },

  async heartbeat() {
    return request('/api/session/heartbeat', { method: 'POST' });
  },

  async saveProgress(progress) {
    return request('/api/progress', { method: 'PUT', body: JSON.stringify(progress) });
  },

  async logout() {
    sessionStorage.removeItem(tokenKey);
    mbgAuth.user = null;
    window.dispatchEvent(new CustomEvent('mbg-auth-ready', { detail: { user: null } }));
  }
};

window.mbgAuth = mbgAuth;

async function initializeAuth() {
  const network = await window.mbgNetworkReady;
  if (!network.allowed) return;
  try {
    const health = await request('/health');
    mbgAuth.configured = Boolean(health.ready);
  } catch (error) {
    mbgAuth.configured = false;
    console.warn('[MBG] Backend auth belum tersedia:', error.message);
  }
  window.dispatchEvent(new CustomEvent('mbg-auth-configured'));

  if (!getToken()) {
    window.dispatchEvent(new CustomEvent('mbg-auth-ready', { detail: { user: null } }));
    return;
  }
  try {
    const result = await request('/api/session');
    if (getToken() && !result.user) {
      sessionStorage.removeItem(tokenKey);
    }
    mbgAuth.user = result.user;
    window.dispatchEvent(new CustomEvent('mbg-auth-ready', {
      detail: { user: result.user, profile: result.user, progress: null }
    }));
  } catch (error) {
    sessionStorage.removeItem(tokenKey);
    mbgAuth.user = null;
    console.warn('[MBG] Sesi tidak dapat dipulihkan:', error.message);
    window.dispatchEvent(new CustomEvent('mbg-auth-ready', { detail: { user: null } }));
  }
}

window.mbgInitializeAuth = initializeAuth;