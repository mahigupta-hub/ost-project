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
 *
 * TO SWITCH TO REAL BACKEND:
 * Replace `return mockSchemes;` below with:
 * return (await api.post('/api/match', profile)).data;
 *
 * @param {Object} profile - Citizen demographic criteria (age, state, income, etc.)
 * @returns {Promise<Array>} Matched scheme list
 */
export const getMatchedSchemes = async (profile) => {
  // --- CHANGE THIS SINGLE LINE TO SWITCH TO REAL BACKEND ---
  return mockSchemes;
  // return (await api.post('/api/match', profile)).data;
};

/**
 * Fetch single scheme by ID.
 * @param {string} id - Scheme ID
 */
export const getSchemeById = async (id) => {
  return mockSchemes.find((s) => s.id === id) || null;
};

export { api };
export default api;
