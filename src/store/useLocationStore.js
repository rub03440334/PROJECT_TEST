import { create } from 'zustand';

const useLocationStore = create((set) => ({
  // State
  userLocation: null,
  hasLocationPermission: false,
  isRequestingLocation: false,
  locationError: null,
  
  // Actions
  setUserLocation: (location) => set({ userLocation: location }),
  
  setHasLocationPermission: (hasPermission) => set({ hasLocationPermission: hasPermission }),
  
  setIsRequestingLocation: (isRequesting) => set({ isRequestingLocation: isRequesting }),
  
  setLocationError: (error) => set({ locationError: error }),
  
  resetLocationError: () => set({ locationError: null }),
}));

export default useLocationStore;
