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
