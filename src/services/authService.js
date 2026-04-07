const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.full_name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.confirm_password - Password confirmation
 * @returns {Promise<Object>} - Response with user data and token
 */
export async function register(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      full_name: userData.full_name,
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirm_password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  // Store token in localStorage for authenticated requests
  if (data.data?.token) {
    localStorage.setItem('sapi_token', data.data.token);
    localStorage.setItem('sapi_current_user', JSON.stringify(data.data.user));
  }

  return data;
}

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} - Response with user data and token
 */
export async function login(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Store token in localStorage
  if (data.data?.token) {
    localStorage.setItem('sapi_token', data.data.token);
    localStorage.setItem('sapi_current_user', JSON.stringify(data.data.user));
  }

  return data;
}

/**
 * Logout user - clear stored token
 */
export function logout() {
  localStorage.removeItem('sapi_token');
  localStorage.removeItem('sapi_current_user');
}

/**
 * Get current auth token
 * @returns {string|null} - The auth token or null
 */
export function getToken() {
  return localStorage.getItem('sapi_token');
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has a token
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Get current user data
 * @returns {Object|null} - Current user data or null
 */
export function getCurrentUser() {
  const user = localStorage.getItem('sapi_current_user');
  return user ? JSON.parse(user) : null;
}

/**
 * Get users list
 * @param {string} token - Auth token
 * @param {Object} params - Query parameters
 * @param {number} params.role - Role ID to filter users (e.g., 1 for admin)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} - Response with users data
 */
export async function getUsers(token, params = {}) {
  const queryParams = new URLSearchParams();
  if (params.role !== undefined) queryParams.append('role', params.role);
  if (params.page !== undefined) queryParams.append('page', params.page);
  if (params.limit !== undefined) queryParams.append('limit', params.limit);

  const url = `${API_BASE_URL}/auth/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }

  return data;
}

/**
 * Create a new user (Admin only)
 * @param {string} token - Admin auth token
 * @param {Object} userData - User data
 * @param {string} userData.full_name - User's full name
 * @param {string} userData.email - User's email
 * @param {number} userData.role - User's role ID
 * @returns {Promise<Object>} - Response with user data
 */
export async function createUser(token, userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      full_name: userData.full_name,
      email: userData.email,
      role: userData.role,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create user');
  }

  // Do NOT store token - admin stays logged in
  return data;
}

/**
 * Get user by ID
 * @param {string} token - Auth token
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Response with user data
 */
export async function getUserById(token, userId) {
  const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }

  return data;
}

/**
 * Update user
 * @param {string} token - Auth token
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update
 * @param {string} userData.full_name - User's full name
 * @param {string} userData.email - User's email
 * @param {number} userData.role - User's role ID
 * @returns {Promise<Object>} - Response with updated user data
 */
export async function updateUser(token, userId, userData) {
  const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      full_name: userData.full_name,
      email: userData.email,
      role: userData.role,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user');
  }

  return data;
}

/**
 * Delete user
 * @param {string} token - Auth token
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Response with success message
 */
export async function deleteUser(token, userId) {
  const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user');
  }

  return data;
}
