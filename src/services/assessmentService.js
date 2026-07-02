const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Get all countries
 * GET /api/countries
 */
export async function getCountries() {
  const response = await fetch(`${API_BASE_URL}/countries`);

  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Submit assessment answers and get scores
 * POST /assessment/submit
 * @param {string} profileId - Profile UUID
 * @param {Array} answers - Array of { question_id, selected_option }
 */
export async function submitAssessment(profileId, answers) {
  const response = await fetch(`${API_BASE_URL}/assessment/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile_id: profileId, answers }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to submit assessment: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}

/**
 * Get assessment results by ID
 * GET /api/assessment/:id/results
 * @param {string} assessmentId - UUID of the assessment
 */
export async function getAssessmentResults(assessmentId) {
  const response = await fetch(`${API_BASE_URL}/assessment/${assessmentId}/results`);

  if (!response.ok) {
    throw new Error(`Failed to fetch results: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get assessment details by ID
 * GET /api/assessment/:id/details
 * @param {string} assessmentId - UUID of the assessment
 */
export async function getAssessmentDetails(assessmentId) {
  const response = await fetch(`${API_BASE_URL}/assessment/${assessmentId}/details`);

  if (!response.ok) {
    throw new Error(`Failed to fetch assessment details: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Generate dimension analysis PDF
 * POST /api/pdf/dimension-analysis
 * @param {string} assessmentId - UUID of the assessment
 */
export async function generateDimensionAnalysisPDF(assessmentId) {
  const response = await fetch(`${API_BASE_URL}/pdf/dimension-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assessmentId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate PDF: ${response.statusText}`);
  }

  const blob = await response.blob();
  return blob;
}
