import { renderHook, act } from '@testing-library/react-native';
import useLocationStore from '../../store/useLocationStore';

describe('useLocationStore', () => {
  beforeEach(() => {
    useLocationStore.setState({
      userLocation: null,
      hasLocationPermission: false,
      isRequestingLocation: false,
      locationError: null,
    });
  });

  it('should set user location', () => {
    const { result } = renderHook(() => useLocationStore());
    const mockLocation = { latitude: 51.5074, longitude: -0.1278, accuracy: 10 };

    act(() => {
      result.current.setUserLocation(mockLocation);
    });

    expect(result.current.userLocation).toEqual(mockLocation);
  });

  it('should set location permission status', () => {
    const { result } = renderHook(() => useLocationStore());

    act(() => {
      result.current.setHasLocationPermission(true);
    });

    expect(result.current.hasLocationPermission).toBe(true);
  });

  it('should set requesting location status', () => {
    const { result } = renderHook(() => useLocationStore());

    act(() => {
      result.current.setIsRequestingLocation(true);
    });

    expect(result.current.isRequestingLocation).toBe(true);

    act(() => {
      result.current.setIsRequestingLocation(false);
    });

    expect(result.current.isRequestingLocation).toBe(false);
  });

  it('should set location error', () => {
    const { result } = renderHook(() => useLocationStore());
    const error = new Error('Location service unavailable');

    act(() => {
      result.current.setLocationError(error);
    });

    expect(result.current.locationError).toEqual(error);
  });

  it('should reset location error', () => {
    const { result } = renderHook(() => useLocationStore());

    act(() => {
      result.current.setLocationError(new Error('Test error'));
      result.current.resetLocationError();
    });

    expect(result.current.locationError).toBeNull();
  });
});
