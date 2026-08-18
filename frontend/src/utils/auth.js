export const AUTH_KEY = "hotel_management_auth_v1";

export function normalizeRoles(raw) {
  if (!raw) return [];
  let rolesArray = [];
  if (Array.isArray(raw)) {
    rolesArray = raw.map(r => (typeof r === 'object' ? r.authority || r.role || r.name : r));
  } else if (typeof raw === 'string') {
    rolesArray = raw.replace(/[{}]/g, '').split(',').map(s => s.trim());
  }
  return rolesArray.map(r => r.toString().toUpperCase()).filter(Boolean);
}

// Try to safely decode JWT payload to read `exp` if present
function parseJwtPayload(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Handle URL-safe base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function expiryFromToken(token) {
  const payload = parseJwtPayload(token);
  if (payload && payload.exp) return payload.exp * 1000; // exp is in seconds
  return null;
}

export function setAuth(obj) {
  if (!obj) return null;
  const token = obj.token || obj.accessToken || obj.access_token;
  if (!token) return null;

  // Determine expiry (ms since epoch) from JWT exp or from expiresIn/expires_at fields
  let expiresAt = expiryFromToken(token);
  if (!expiresAt) {
    if (obj.expiresIn) expiresAt = Date.now() + Number(obj.expiresIn) * 1000;
    else if (obj.expires_at) {
      // Support seconds or milliseconds
      const val = Number(obj.expires_at);
      expiresAt = val < 1e12 ? val * 1000 : val;
    }
  }

  const authData = {
    ...obj,
    token,
    roles: normalizeRoles(obj.roles || obj.authorities || obj.role),
    ...(expiresAt ? { expiresAt } : {}),
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  return authData;
}

export function getAuth() {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    if (!parsed || !parsed.token) return null;

    // If expiry is present and token is expired, clear stored auth
    if (parsed.expiresAt && Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }

    parsed.roles = normalizeRoles(parsed.roles);
    return parsed;
  } catch { return null; }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function checkIsAdmin(authObj) {
  if (!authObj || !authObj.roles) return false;
  return authObj.roles.some(r => ["ADMIN", "ROLE_ADMIN"].includes(r));
}