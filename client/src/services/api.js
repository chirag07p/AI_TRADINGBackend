/**
 * Centralized API service using native fetch()
 * Connects the React frontend to the Express backend on port 5000
 */

export const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

// ─── Helper: builds headers with optional auth token ───
const getHeaders = (token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ─── Helper: handles response + error extraction ───
const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || data?.errors?.[0]?.msg || 'Something went wrong';
    throw new Error(message);
  }
  return data;
};

// ══════════════════════════════════════════════════════
//  AUTH ENDPOINTS
// ══════════════════════════════════════════════════════

export const registerUser = async ({ name, email, password, role, phone }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password, role, phone }),
  });
  return handleResponse(res);
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

// ══════════════════════════════════════════════════════
//  PORTFOLIO ENDPOINTS
// ══════════════════════════════════════════════════════

export const getPortfolio = async (token) => {
  const res = await fetch(`${API_URL}/portfolio`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const depositPortfolio = async (token, amount, paymentMode) => {
  const res = await fetch(`${API_URL}/portfolio/deposit`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ amount, paymentMode }),
  });
  return handleResponse(res);
};

export const withdrawPortfolio = async (token, amount, paymentMode) => {
  const res = await fetch(`${API_URL}/portfolio/withdraw`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ amount, paymentMode }),
  });
  return handleResponse(res);
};


// ══════════════════════════════════════════════════════
//  TRADE ENDPOINTS
// ══════════════════════════════════════════════════════

export const executeTrade = async (token, { symbol, type, quantity, price, decisionReasoning }) => {
  const res = await fetch(`${API_URL}/trades`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ symbol, type, quantity, price, decisionReasoning }),
  });
  return handleResponse(res);
};

export const getTrades = async (token) => {
  const res = await fetch(`${API_URL}/trades`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

// ══════════════════════════════════════════════════════
//  MARKET DATA ENDPOINTS
// ══════════════════════════════════════════════════════

export const getMarketQuote = async (token, symbol) => {
  const res = await fetch(`${API_URL}/market/quote/${symbol}`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const getMarketHistory = async (token, symbol, timeframe = '1D') => {
  const res = await fetch(`${API_URL}/market/history/${symbol}?timeframe=${timeframe}`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

// ══════════════════════════════════════════════════════
//  AI ADVICE ENDPOINT
// ══════════════════════════════════════════════════════

export const getAIAdvice = async (token, { symbol, marketData, query }) => {
  const res = await fetch(`${API_URL}/ai/advice`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ symbol, marketData, query }),
  });
  return handleResponse(res);
};

// ══════════════════════════════════════════════════════
//  DASHBOARD ENDPOINT
// ══════════════════════════════════════════════════════

export const getDashboardSummary = async (token) => {
  const res = await fetch(`${API_URL}/dashboard/summary`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

// ══════════════════════════════════════════════════════
//  USER PROFILE ENDPOINTS
// ══════════════════════════════════════════════════════

export const getUserProfile = async (token) => {
  const res = await fetch(`${API_URL}/user/profile`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const updateUserProfile = async (token, data) => {
  const res = await fetch(`${API_URL}/user/profile`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ══════════════════════════════════════════════════════
//  WATCHLIST ENDPOINTS
// ══════════════════════════════════════════════════════

export const getWatchlist = async (token) => {
  const res = await fetch(`${API_URL}/watchlist`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const addToWatchlist = async (token, { symbol, notes }) => {
  const res = await fetch(`${API_URL}/watchlist`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ symbol, notes }),
  });
  return handleResponse(res);
};

export const removeFromWatchlist = async (token, id) => {
  const res = await fetch(`${API_URL}/watchlist/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

// ══════════════════════════════════════════════════════
//  MESSAGE ENDPOINTS
// ══════════════════════════════════════════════════════

export const sendMessage = async (token, { receiverId, content }) => {
  const res = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ receiverId, content }),
  });
  return handleResponse(res);
};

export const getMessages = async (token, otherUserId) => {
  const res = await fetch(`${API_URL}/messages/${otherUserId}`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

// ══════════════════════════════════════════════════════
//  HEALTH CHECK
// ══════════════════════════════════════════════════════

export const checkAPIStatus = async () => {
  const res = await fetch(`${API_URL}/status`);
  return handleResponse(res);
};
// ─── AI Matching ───
export const allocateCustomer = async (token, clientId) => {
  const res = await fetch(`${API_URL}/allocate/${clientId}`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const finalizeAllocationProposal = async (token, allocationId) => {
  const res = await fetch(`${API_URL}/allocate/finalize`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ allocationId }),
  });
  return handleResponse(res);
};

export const rejectAllocationProposal = async (token, allocationId) => {
  const res = await fetch(`${API_URL}/allocate/reject`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ allocationId }),
  });
  return handleResponse(res);
};

export const unassignCustomerTrader = async (token) => {
  const res = await fetch(`${API_URL}/allocate/unassign`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};
