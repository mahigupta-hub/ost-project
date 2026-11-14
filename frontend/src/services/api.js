import axios from 'axios';
import { mockSchemes } from '../data/mockSchemes';

/**
 * Axios instance configured for SchemeBridge API.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch schemes matching the citizen profile.
 * @param {Object} profile - Citizen demographic criteria (age, state, income, etc.)
 * @returns {Promise<Array>} Matched scheme list
 */
export const getMatchedSchemes = async (profile) => {
  return (await api.post('/api/match', profile)).data;
};

/**
 * Fetch single scheme by ID.
 * @param {string} id Scheme ID
 */
export const getSchemeById = async (id) => {
  try {
    const response = await api.get(`/api/schemes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching scheme details:", error);
    return null;
  }
};
/**
 * Fetch ALL available schemes without checking eligibility.
 * @returns {Promise<Array>} Complete scheme list
 */
export const getAllSchemes = async () => {
  try {
    const response = await api.get('/api/schemes');
    return response.data;
  } catch (error) {
    console.error("Error fetching all schemes:", error);
    return [];
  }
};

export { api };
export default api;
