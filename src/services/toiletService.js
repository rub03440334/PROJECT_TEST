import api from '../config/api';

export const toiletService = {
  // Get all toilets
  getAllToilets: async () => {
    return api.get('/toilets');
  },
  
  // Get toilets near a location
  getToiletsNearby: async (latitude, longitude, radiusKm = 5) => {
    return api.get('/toilets/nearby', {
      params: {
        latitude,
        longitude,
        radiusKm,
      },
    });
  },
  
  // Get toilet details
  getToiletDetails: async (toiletId) => {
    return api.get(`/toilets/${toiletId}`);
  },
  
  // Rate a toilet
  rateToilet: async (toiletId, rating) => {
    return api.post(`/toilets/${toiletId}/rate`, {
      rating,
    });
  },
  
  // Report a toilet issue
  reportIssue: async (toiletId, issue) => {
    return api.post(`/toilets/${toiletId}/report`, {
      issue,
      timestamp: new Date().toISOString(),
    });
  },
  
  // Get toilet filters/categories
  getFilters: async () => {
    return api.get('/toilets/filters');
  },
};
