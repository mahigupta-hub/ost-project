import { getMatchedSchemes, getSchemeById, api } from './api';
import { mockSchemes } from '../data/mockSchemes';

export const getAllSchemes = async () => {
  return mockSchemes;
};

export { getMatchedSchemes, getSchemeById, api };
export default api;
