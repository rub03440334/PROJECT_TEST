export const ENV = {
  MAPBOX_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_TOKEN,
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  USE_MAPBOX: process.env.EXPO_PUBLIC_USE_MAPBOX === 'true',
  USE_GOOGLE_MAPS: process.env.EXPO_PUBLIC_USE_GOOGLE_MAPS === 'true',
};

export const validateConfig = () => {
  if (ENV.USE_MAPBOX && !ENV.MAPBOX_TOKEN) {
    console.warn('Mapbox token not found. Please add EXPO_PUBLIC_MAPBOX_TOKEN to .env');
  }
  if (ENV.USE_GOOGLE_MAPS && !ENV.GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not found. Please add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to .env');
  }
};
