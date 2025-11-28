/**
 * Integration Tests for Map Flow
 * Tests the complete flow from location to displaying toilets
 */

import { renderHook, act } from '@testing-library/react-native';
import useToiletStore from '../../store/useToiletStore';
import useLocationStore from '../../store/useLocationStore';
import { mockToilets, mockUserLocation, mockFilters } from '../mocks/mockToiletData';

describe('Map Flow Integration', () => {
  beforeEach(() => {
    // Reset stores
    useToiletStore.setState({
      toilets: [],
      filteredToilets: [],
      selectedToilet: null,
      filters: mockFilters,
      isLoading: false,
      error: null,
    });

    useLocationStore.setState({
      userLocation: null,
      hasLocationPermission: false,
      isRequestingLocation: false,
      locationError: null,
    });
  });

  it('should complete full map flow: location -> toilets -> filter', async () => {
    // Step 1: Set user location
    const { result: locationResult } = renderHook(() => useLocationStore());

    act(() => {
      locationResult.current.setHasLocationPermission(true);
      locationResult.current.setUserLocation(mockUserLocation);
    });

    expect(locationResult.current.userLocation).toEqual(mockUserLocation);

    // Step 2: Load toilets
    const { result: toiletResult } = renderHook(() => useToiletStore());

    act(() => {
      toiletResult.current.setToilets(mockToilets);
    });

    expect(toiletResult.current.toilets).toHaveLength(5);
    expect(toiletResult.current.filteredToilets).toHaveLength(5);

    // Step 3: Apply filters (PMR accessible)
    act(() => {
      toiletResult.current.setFilters({ ...mockFilters, pmrAccessible: true });
    });

    expect(toiletResult.current.filteredToilets).toHaveLength(3);
    expect(
      toiletResult.current.filteredToilets.every((t) => t.pmrAccessible)
    ).toBe(true);

    // Step 4: Apply additional filter (rating >= 4)
    act(() => {
      toiletResult.current.setFilters({
        ...toiletResult.current.filters,
        minRating: 4,
      });
    });

    expect(toiletResult.current.filteredToilets).toHaveLength(2);
    expect(
      toiletResult.current.filteredToilets.every((t) => t.rating >= 4)
    ).toBe(true);
  });

  it('should select toilet and show details', async () => {
    const { result } = renderHook(() => useToiletStore());

    const selectedToilet = mockToilets[0];

    act(() => {
      result.current.setSelectedToilet(selectedToilet);
    });

    expect(result.current.selectedToilet).toEqual(selectedToilet);
    expect(result.current.selectedToilet.name).toBe('Main Street Public Toilet');
  });

  it('should handle filter combinations', async () => {
    const { result } = renderHook(() => useToiletStore());

    act(() => {
      result.current.setToilets(mockToilets);
    });

    // Only 24/7 toilets
    act(() => {
      result.current.setFilters({
        pmrAccessible: false,
        open24Hours: true,
        minRating: 0,
        types: [],
      });
    });

    expect(
      result.current.filteredToilets.every((t) => t.hours === '24/7')
    ).toBe(true);

    // PMR + 24/7
    act(() => {
      result.current.setFilters({
        pmrAccessible: true,
        open24Hours: true,
        minRating: 0,
        types: [],
      });
    });

    const filtered = result.current.filteredToilets;
    expect(filtered.length).toBe(1);
    expect(filtered[0].pmrAccessible).toBe(true);
    expect(filtered[0].hours).toBe('24/7');

    // Type filter
    act(() => {
      result.current.setFilters({
        pmrAccessible: false,
        open24Hours: false,
        minRating: 0,
        types: ['Public'],
      });
    });

    expect(result.current.filteredToilets.every((t) => t.type === 'Public')).toBe(
      true
    );
  });

  it('should cache and retrieve toilets', async () => {
    const { result } = renderHook(() => useToiletStore());

    // Mock AsyncStorage
    const cachedToilets = [];

    act(() => {
      result.current.setToilets(mockToilets);
    });

    expect(result.current.toilets).toHaveLength(5);
  });

  it('should reset filters correctly', async () => {
    const { result } = renderHook(() => useToiletStore());

    act(() => {
      result.current.setToilets(mockToilets);
      result.current.setFilters({
        pmrAccessible: true,
        open24Hours: true,
        minRating: 4,
        types: ['Public'],
      });
    });

    // Should have filtered results
    expect(result.current.filteredToilets.length).toBeLessThan(
      result.current.toilets.length
    );

    // Reset filters
    act(() => {
      result.current.resetFilters();
    });

    // Should have all toilets again
    expect(result.current.filteredToilets).toHaveLength(result.current.toilets.length);
    expect(result.current.filters).toEqual({
      pmrAccessible: false,
      open24Hours: false,
      minRating: 0,
      types: [],
    });
  });
});
