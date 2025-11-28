import { useEffect, useCallback } from 'react';
import useLocationStore from '../store/useLocationStore';
import { locationService } from '../services/locationService';

export const useLocation = () => {
  const userLocation = useLocationStore((state) => state.userLocation);
  const setUserLocation = useLocationStore((state) => state.setUserLocation);
  const setHasLocationPermission = useLocationStore((state) => state.setHasLocationPermission);
  const setLocationError = useLocationStore((state) => state.setLocationError);
  const hasLocationPermission = useLocationStore((state) => state.hasLocationPermission);

  const requestPermission = useCallback(async () => {
    const hasPermission = await locationService.requestLocationPermission();
    setHasLocationPermission(hasPermission);
    return hasPermission;
  }, [setHasLocationPermission]);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLocationError(null);
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      return location;
    } catch (error) {
      setLocationError(error);
      throw error;
    }
  }, [setUserLocation, setLocationError]);

  const startWatchingLocation = useCallback(async () => {
    try {
      const subscription = await locationService.watchLocation((location) => {
        setUserLocation(location);
      });
      return subscription;
    } catch (error) {
      setLocationError(error);
      throw error;
    }
  }, [setUserLocation, setLocationError]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return {
    userLocation,
    hasLocationPermission,
    requestPermission,
    getCurrentLocation,
    startWatchingLocation,
  };
};
