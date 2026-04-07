const API_BASE_URL = process.env.REACT_APP_API_URL;
/**
 * Get dashboard statistics
 * GET /dashboard/stats
 * Bearer token in header
 */
export async function getDashboardStats(token) {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get paginated assessments with filters
 * GET /dashboard/assessments
 * Query Parameters: page, limit, search, country, development_stage, tier, score_min, score_max
 * Bearer token in header
 */
export async function getDashboardAssessments(token, filters = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.page) queryParams.append('page', filters.page);
  if (filters.limit) queryParams.append('limit', filters.limit);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.country) queryParams.append('country', filters.country);
  if (filters.developmentStage) queryParams.append('development_stage', filters.developmentStage);
  if (filters.tier) queryParams.append('tier', filters.tier);
  if (filters.scoreMin) queryParams.append('score_min', filters.scoreMin);
  if (filters.scoreMax) queryParams.append('score_max', filters.scoreMax);

  const url = `${API_BASE_URL}/dashboard/assessments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch assessments: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get filter options
 * GET /dashboard/filters
 * Bearer token in header
 */
export async function getDashboardFilters(token) {
  const response = await fetch(`${API_BASE_URL}/dashboard/filters`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard filters: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Export assessments to CSV
 * GET /dashboard/export/csv
 * Same query params as /assessments
 * Bearer token in header
 */
export async function exportDashboardCSV(token, filters = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.country) queryParams.append('country', filters.country);
  if (filters.developmentStage) queryParams.append('development_stage', filters.developmentStage);
  if (filters.tier) queryParams.append('tier', filters.tier);
  if (filters.scoreMin) queryParams.append('score_min', filters.scoreMin);
  if (filters.scoreMax) queryParams.append('score_max', filters.scoreMax);

  const url = `${API_BASE_URL}/dashboard/export/csv${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to export CSV: ${response.statusText}`);
  }

  const blob = await response.blob();
  return blob;
}

/**
 * Update assessment status/lead stage
 * PUT /dashboard/assessments/:id/status
 * Bearer token in header
 * Body: { leadStage: string, adminNotes?: string }
 */
export async function updateAssessmentStatus(token, assessmentId, statusData) {
  const response = await fetch(`${API_BASE_URL}/dashboard/assessments/${assessmentId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statusData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update assessment status: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
