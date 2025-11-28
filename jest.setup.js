import '@testing-library/jest-native/extend-expect';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
}));

jest.mock('react-native-maps', () => ({
  __esModule: true,
  default: jest.fn(() => null),
  Marker: jest.fn(() => null),
  Callout: jest.fn(() => null),
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: 'default',
}));
