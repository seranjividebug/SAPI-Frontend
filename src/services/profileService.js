import { getToken } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Get user profile from API
 * @returns {Promise<Object|null>} - Profile data or null if not found
 */
export async function getProfileFromAPI() {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return null; // No profile exists
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profile');
  }

  return data.data || null;
}

/**
 * Create a new user profile
 * @param {Object} profileData - User profile data
 * @returns {Promise<Object>} - Created profile
 */
export async function createProfile(profileData) {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Use API error message or status text
    const errorMsg = data?.error || data?.message || `Failed to create profile (${response.status})`;
    throw new Error(errorMsg);
  }

  // Store profile in localStorage
  if (data.data) {
    localStorage.setItem('sapi_profile', JSON.stringify(data.data));
  }

  return data;
}

/**
 * Update existing user profile
 * @param {string} profileId - Profile ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated profile
 */
export async function updateProfile(profileId, profileData) {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(`${API_BASE_URL}/profile/${profileId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  // Update stored profile in localStorage
  if (data.data) {
    localStorage.setItem('sapi_profile', JSON.stringify(data.data));
  }

  return data;
}

/**
 * Create or update profile - checks if exists first
 * @param {Object} profileData - Profile data
 * @returns {Promise<Object>} - Created or updated profile
 */
export async function saveProfile(profileData) {
  // First check if profile already exists
  let existingProfile = null;
  try {
    existingProfile = await getProfileFromAPI();
  } catch (err) {
    // If GET fails with 404, profile doesn't exist - that's okay
    // If GET fails with other error, we need to handle it
    console.log('GET profile error:', err.message);
  }
  
  if (existingProfile && existingProfile.profile_id) {
    // Profile exists - update it
    console.log('Profile exists, updating:', existingProfile.profile_id);
    return updateProfile(existingProfile.profile_id, profileData);
  } else {
    // No profile - create new, but handle case where profile was created since last check
    try {
      console.log('No profile found, creating new');
      return await createProfile(profileData);
    } catch (err) {
      // If error says profile already exists, try to get ID and update
      const errMsg = err.message?.toLowerCase() || '';
      console.log('Create failed with error:', errMsg);
      if (errMsg.includes('already has') || errMsg.includes('already exists') || errMsg.includes('use put')) {
        console.log('Profile already exists, fetching and updating...');
        const freshProfile = await getProfileFromAPI();
        if (freshProfile && freshProfile.profile_id) {
          return updateProfile(freshProfile.profile_id, profileData);
        }
      }
      throw err;
    }
  }
}

/**
 * Get profile from localStorage
 * @returns {Object|null} - Cached profile data
 */
export function getProfile() {
  const profile = localStorage.getItem('sapi_profile');
  return profile ? JSON.parse(profile) : null;
}
