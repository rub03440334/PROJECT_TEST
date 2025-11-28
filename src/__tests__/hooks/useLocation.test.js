import { renderHook, act } from '@testing-library/react-native';
import { useLocation } from '../../hooks/useLocation';
import { locationService } from '../../services/locationService';

jest.mock('../../services/locationService');

describe('useLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should request location permission on mount', async () => {
    locationService.requestLocationPermission.mockResolvedValue(true);

    const { result } = renderHook(() => useLocation());

    // Wait for effect to run
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(locationService.requestLocationPermission).toHaveBeenCalled();
  });

  it('should get current location', async () => {
    const mockLocation = { latitude: 51.5074, longitude: -0.1278, accuracy: 10 };
    locationService.getCurrentLocation.mockResolvedValue(mockLocation);

    const { result } = renderHook(() => useLocation());

    let location;
    await act(async () => {
      location = await result.current.getCurrentLocation();
    });

    expect(location).toEqual(mockLocation);
    expect(result.current.userLocation).toEqual(mockLocation);
  });

  it('should handle location permission request', async () => {
    locationService.requestLocationPermission.mockResolvedValue(true);

    const { result } = renderHook(() => useLocation());

    let hasPermission;
    await act(async () => {
      hasPermission = await result.current.requestPermission();
    });

    expect(hasPermission).toBe(true);
  });

  it('should handle location error', async () => {
    const error = new Error('Location service unavailable');
    locationService.getCurrentLocation.mockRejectedValue(error);

    const { result } = renderHook(() => useLocation());

    await act(async () => {
      try {
        await result.current.getCurrentLocation();
      } catch (e) {
        // Expected error
      }
    });

    expect(result.current.userLocation).toBeNull();
  });
});
