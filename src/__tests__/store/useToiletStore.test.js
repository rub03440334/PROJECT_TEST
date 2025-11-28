import { renderHook, act } from '@testing-library/react-native';
import useToiletStore from '../../store/useToiletStore';

describe('useToiletStore', () => {
  beforeEach(() => {
    useToiletStore.setState({
      toilets: [],
      filteredToilets: [],
      selectedToilet: null,
      filters: {
        pmrAccessible: false,
        open24Hours: false,
        minRating: 0,
        types: [],
      },
    });
  });

  it('should set toilets', () => {
    const { result } = renderHook(() => useToiletStore());
    const mockToilets = [
      { id: 1, name: 'Toilet 1', latitude: 51.5, longitude: -0.1, rating: 4 },
      { id: 2, name: 'Toilet 2', latitude: 51.6, longitude: -0.2, rating: 3 },
    ];

    act(() => {
      result.current.setToilets(mockToilets);
    });

    expect(result.current.toilets).toEqual(mockToilets);
    expect(result.current.filteredToilets).toEqual(mockToilets);
  });

  it('should set selected toilet', () => {
    const { result } = renderHook(() => useToiletStore());
    const mockToilet = {
      id: 1,
      name: 'Test Toilet',
      latitude: 51.5,
      longitude: -0.1,
    };

    act(() => {
      result.current.setSelectedToilet(mockToilet);
    });

    expect(result.current.selectedToilet).toEqual(mockToilet);
  });

  it('should apply PMR filter', () => {
    const { result } = renderHook(() => useToiletStore());
    const mockToilets = [
      {
        id: 1,
        name: 'Toilet 1',
        latitude: 51.5,
        longitude: -0.1,
        pmrAccessible: true,
      },
      {
        id: 2,
        name: 'Toilet 2',
        latitude: 51.6,
        longitude: -0.2,
        pmrAccessible: false,
      },
    ];

    act(() => {
      result.current.setToilets(mockToilets);
      result.current.setFilters({ ...result.current.filters, pmrAccessible: true });
    });

    expect(result.current.filteredToilets).toHaveLength(1);
    expect(result.current.filteredToilets[0].id).toBe(1);
  });

  it('should apply rating filter', () => {
    const { result } = renderHook(() => useToiletStore());
    const mockToilets = [
      { id: 1, name: 'Toilet 1', rating: 4.5 },
      { id: 2, name: 'Toilet 2', rating: 2 },
      { id: 3, name: 'Toilet 3', rating: 4.8 },
    ];

    act(() => {
      result.current.setToilets(mockToilets);
      result.current.setFilters({ ...result.current.filters, minRating: 4 });
    });

    expect(result.current.filteredToilets).toHaveLength(2);
    expect(result.current.filteredToilets.every((t) => t.rating >= 4)).toBe(true);
  });

  it('should apply type filter', () => {
    const { result } = renderHook(() => useToiletStore());
    const mockToilets = [
      { id: 1, name: 'Toilet 1', type: 'Public' },
      { id: 2, name: 'Toilet 2', type: 'Private' },
      { id: 3, name: 'Toilet 3', type: 'Public' },
    ];

    act(() => {
      result.current.setToilets(mockToilets);
      result.current.setFilters({ ...result.current.filters, types: ['Public'] });
    });

    expect(result.current.filteredToilets).toHaveLength(2);
    expect(result.current.filteredToilets.every((t) => t.type === 'Public')).toBe(
      true
    );
  });

  it('should reset filters', () => {
    const { result } = renderHook(() => useToiletStore());
    const mockToilets = [
      { id: 1, name: 'Toilet 1', rating: 4.5, pmrAccessible: true },
      { id: 2, name: 'Toilet 2', rating: 2, pmrAccessible: false },
    ];

    act(() => {
      result.current.setToilets(mockToilets);
      result.current.setFilters({
        pmrAccessible: true,
        open24Hours: true,
        minRating: 4,
        types: [],
      });
    });

    expect(result.current.filteredToilets).toHaveLength(1);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filteredToilets).toHaveLength(2);
    expect(result.current.filters).toEqual({
      pmrAccessible: false,
      open24Hours: false,
      minRating: 0,
      types: [],
    });
  });
});
