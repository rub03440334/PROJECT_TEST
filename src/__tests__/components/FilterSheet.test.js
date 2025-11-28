import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterSheet from '../../components/Filters/FilterSheet';
import useToiletStore from '../../store/useToiletStore';

// Mock the store
jest.mock('../../store/useToiletStore');

describe('FilterSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useToiletStore.mockImplementation((selector) => {
      const state = {
        filters: {
          pmrAccessible: false,
          open24Hours: false,
          minRating: 0,
          types: [],
        },
        setFilters: jest.fn(),
        resetFilters: jest.fn(),
      };
      return selector(state);
    });
  });

  it('should render filter sheet when visible', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <FilterSheet visible={true} onClose={onClose} />
    );

    expect(getByText('Filters')).toBeTruthy();
    expect(getByText('PMR Accessible')).toBeTruthy();
    expect(getByText('Open 24/7')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const onClose = jest.fn();
    const { queryByText } = render(
      <FilterSheet visible={false} onClose={onClose} />
    );

    // The modal won't render any content when not visible
    expect(queryByText('Apply Filters')).toBeFalsy();
  });

  it('should call onClose when close button is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <FilterSheet visible={true} onClose={onClose} />
    );

    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
