const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Generate improvement roadmap based on dimension scores
 * POST /api/roadmap/generate
 * @param {Object} dimensionScores - Object with dimension IDs as keys and scores as values
 * Example: { 1: 70, 2: 55, 3: 60, 4: 45, 5: 50 }
 */
export async function generateRoadmap(dimensionScores) {
  const response = await fetch(`${API_BASE_URL}/api/roadmap/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dimensionScores }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate roadmap: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}
