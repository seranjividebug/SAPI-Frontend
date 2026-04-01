const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Check server health status
 * GET /health
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}
