const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Submit contact form
 * POST /api/contact/submit
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.email - Contact email
 * @param {string} contactData.organization - Organization name
 * @param {string} contactData.role - Role/title
 * @param {string} contactData.area_of_interest - Area of interest
 * @param {string} contactData.message - Contact message
 */
export async function submitContactForm(contactData) {
  const response = await fetch(`${API_BASE_URL}/contact/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit contact form: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Submit credential request
 * POST /api/contact/credential
 * @param {Object} credentialData - Credential request data
 * @param {string} credentialData.fullName - Full name
 * @param {string} credentialData.officialTitle - Official title
 * @param {string} credentialData.entity - Government entity or ministry
 * @param {string} credentialData.country - Country
 * @param {string} credentialData.email - Official email
 * @param {string} credentialData.intendedUse - Intended use
 * @param {string} credentialData.briefContext - Brief context (optional)
 */
export async function submitCredentialRequest(credentialData) {
  const response = await fetch(`${API_BASE_URL}/contact/credential`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentialData),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit credential request: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Submit briefed index request
 * POST /api/contact/briefed-index
 * @param {Object} briefedData - Briefed index request data
 * @param {string} briefedData.name - Name
 * @param {string} briefedData.email - Email
 * @param {string} briefedData.institution - Institution
 * @param {string} briefedData.behalfOf - Behalf of (e.g., "Institution")
 * @param {string} briefedData.additionalContext - Additional context (optional)
 */
export async function submitBriefedIndexRequest(briefedData) {
  const response = await fetch(`${API_BASE_URL}/contact/briefed-index`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(briefedData),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit briefed index request: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
