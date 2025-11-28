import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOILETS_CACHE_KEY = '@toilet_app_toilets';
const FILTERS_CACHE_KEY = '@toilet_app_filters';

const useToiletStore = create((set, get) => ({
  // State
  toilets: [],
  filteredToillets: [],
  selectedToilet: null,
  filters: {
    pmrAccessible: false,
    open24Hours: false,
    minRating: 0,
    types: [],
  },
  isLoading: false,
  error: null,
  
  // Actions
  setToilets: (toilets) => set({ toilets, filteredToilets: toilets }),
  
  setSelectedToilet: (toilet) => set({ selectedToilet: toilet }),
  
  setFilters: (filters) => {
    set({ filters });
    const { applyFilters } = get();
    applyFilters();
  },
  
  applyFilters: () => {
    const { toilets, filters } = get();
    let filtered = toilets;
    
    if (filters.pmrAccessible) {
      filtered = filtered.filter((t) => t.pmrAccessible);
    }
    
    if (filters.open24Hours) {
      filtered = filtered.filter((t) => t.hours === '24/7');
    }
    
    if (filters.minRating > 0) {
      filtered = filtered.filter((t) => t.rating >= filters.minRating);
    }
    
    if (filters.types.length > 0) {
      filtered = filtered.filter((t) => filters.types.includes(t.type));
    }
    
    set({ filteredToilets: filtered });
  },
  
  resetFilters: () => {
    const defaultFilters = {
      pmrAccessible: false,
      open24Hours: false,
      minRating: 0,
      types: [],
    };
    set({ filters: defaultFilters, filteredToilets: get().toilets });
  },
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Cache operations
  cacheToilets: async (toilets) => {
    try {
      await AsyncStorage.setItem(TOILETS_CACHE_KEY, JSON.stringify(toilets));
    } catch (error) {
      console.error('Error caching toilets:', error);
    }
  },
  
  getCachedToilets: async () => {
    try {
      const cached = await AsyncStorage.getItem(TOILETS_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error retrieving cached toilets:', error);
      return null;
    }
  },
  
  cacheFilters: async (filters) => {
    try {
      await AsyncStorage.setItem(FILTERS_CACHE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error caching filters:', error);
    }
  },
  
  getCachedFilters: async () => {
    try {
      const cached = await AsyncStorage.getItem(FILTERS_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error retrieving cached filters:', error);
      return null;
    }
  },
}));

export default useToiletStore;
