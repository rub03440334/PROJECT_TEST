# Testing Guide - Toilet App Mobile MVP

Comprehensive guide to testing the Toilet App Mobile MVP application.

## Overview

The application includes:
- **Unit Tests**: Individual component and service testing
- **Integration Tests**: Full feature flow testing
- **Mocking**: Mock data and services for isolated testing

## Test Stack

- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **jest-expo**: Expo-specific test utilities

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (recommended during development)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- src/__tests__/store/useToiletStore.test.js
```

## Test Structure

```
src/__tests__/
├── mocks/
│   └── mockToiletData.js          # Mock data for testing
├── store/
│   ├── useToiletStore.test.js     # Toilet store tests
│   └── useLocationStore.test.js   # Location store tests
├── services/
│   ├── toiletService.test.js      # API service tests
│   └── locationService.test.js    # Location service tests
├── hooks/
│   ├── useLocation.test.js        # Location hook tests
│   └── useToilets.test.js         # Toilet hooks tests
├── components/
│   ├── FilterSheet.test.js        # Filter component tests
│   └── ToiletDetailSheet.test.js  # Detail sheet tests
└── integration/
    └── mapFlow.test.js             # Full feature flow tests
```

## Test Coverage

Current test coverage targets:
- Store logic: 100%
- Services: 100%
- Hooks: 80%+
- Components: 60%+

## Writing Tests

### Store Tests Example

```javascript
import { renderHook, act } from '@testing-library/react-native';
import useToiletStore from '../../store/useToiletStore';

describe('useToiletStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useToiletStore.setState({
      toilets: [],
      filteredToilets: [],
    });
  });

  it('should set toilets', () => {
    const { result } = renderHook(() => useToiletStore());
    const mockToilets = [
      { id: 1, name: 'Toilet 1', rating: 4 },
      { id: 2, name: 'Toilet 2', rating: 3 },
    ];

    act(() => {
      result.current.setToilets(mockToilets);
    });

    expect(result.current.toilets).toEqual(mockToilets);
    expect(result.current.filteredToilets).toEqual(mockToilets);
  });
});
```

### Hook Tests Example

```javascript
import { renderHook, act } from '@testing-library/react-native';
import { useLocation } from '../../hooks/useLocation';
import { locationService } from '../../services/locationService';

jest.mock('../../services/locationService');

describe('useLocation', () => {
  it('should get current location', async () => {
    const mockLocation = { latitude: 51.5, longitude: -0.1 };
    locationService.getCurrentLocation.mockResolvedValue(mockLocation);

    const { result } = renderHook(() => useLocation());

    let location;
    await act(async () => {
      location = await result.current.getCurrentLocation();
    });

    expect(location).toEqual(mockLocation);
  });
});
```

### Component Tests Example

```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterSheet from '../../components/Filters/FilterSheet';

describe('FilterSheet', () => {
  it('should render filter options', () => {
    const { getByText } = render(
      <FilterSheet visible={true} onClose={jest.fn()} />
    );

    expect(getByText('PMR Accessible')).toBeTruthy();
    expect(getByText('Open 24/7')).toBeTruthy();
  });

  it('should call onClose when close button pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <FilterSheet visible={true} onClose={onClose} />
    );

    fireEvent.press(getByText('✕'));
    expect(onClose).toHaveBeenCalled();
  });
});
```

## Mock Data

Mock data is provided in `src/__tests__/mocks/mockToiletData.js`:

```javascript
export const mockToilets = [
  {
    id: '1',
    name: 'Main Street Public Toilet',
    latitude: 51.5074,
    longitude: -0.1278,
    address: '123 Main Street, London',
    hours: '6am-10pm',
    cost: 0.5,
    rating: 4.2,
    cleanlinessScore: 8,
    pmrAccessible: true,
    type: 'Public',
  },
  // More mocks...
];
```

## Mocking Services

### Mock API Responses

```javascript
import api from '../../config/api';

jest.mock('../../config/api');

describe('toiletService', () => {
  it('should get all toilets', async () => {
    const mockToilets = [{ id: 1, name: 'Toilet 1' }];
    api.get.mockResolvedValue(mockToilets);

    const result = await toiletService.getAllToilets();
    expect(result).toEqual(mockToilets);
  });
});
```

### Mock Location Service

```javascript
import { locationService } from '../../services/locationService';

jest.mock('../../services/locationService');

describe('useLocation', () => {
  it('should request permission', async () => {
    locationService.requestLocationPermission.mockResolvedValue(true);
    
    // Your test here
  });
});
```

## Integration Tests

Integration tests verify complete feature flows:

```javascript
describe('Map Flow Integration', () => {
  it('should complete full flow', async () => {
    // 1. Set location
    // 2. Load toilets
    // 3. Apply filters
    // 4. Verify results
  });
});
```

## Test Commands Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm test -- <file>` | Run specific test file |
| `npm test -- --testNamePattern="<pattern>"` | Run tests matching pattern |
| `npm test -- --clearCache` | Clear Jest cache |

## Debugging Tests

### Run single test file
```bash
npm test -- src/__tests__/store/useToiletStore.test.js
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="should set toilets"
```

### Run with verbose output
```bash
npm test -- --verbose
```

### Update snapshots
```bash
npm test -- -u
```

## Coverage Report

After running `npm run test:coverage`, check:
1. **Statements**: Percentage of code statements executed
2. **Branches**: Percentage of conditional branches tested
3. **Functions**: Percentage of functions called
4. **Lines**: Percentage of code lines executed

Target coverage:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## Pre-commit Testing

Before committing, always run:
```bash
npm test
```

Ensure all tests pass locally before pushing to repository.

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Scheduled runs

## Common Issues & Solutions

### Issue: Tests timeout
**Solution:**
```javascript
// Increase timeout for slow tests
it('should fetch data', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Issue: Cannot find module
**Solution:**
```javascript
// Verify moduleNameMapper in jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Issue: Async tests failing
**Solution:**
```javascript
// Use act() wrapper
await act(async () => {
  // async code
});
```

### Issue: Mock not working
**Solution:**
```javascript
// Clear mock before each test
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Writing Better Tests

### Do's ✅
- Test behavior, not implementation
- Use meaningful test names
- Keep tests focused and small
- Use mocks for external dependencies
- Reset state between tests
- Test error scenarios

### Don'ts ❌
- Test private implementation details
- Create test dependencies between tests
- Ignore warning messages
- Skip test cleanup
- Mock everything (only external dependencies)

## Test Examples by Feature

### Location Permission Test
```javascript
it('should request location permission', async () => {
  locationService.requestLocationPermission.mockResolvedValue(true);
  
  const { result } = renderHook(() => useLocation());
  let permission;
  
  await act(async () => {
    permission = await result.current.requestPermission();
  });
  
  expect(permission).toBe(true);
});
```

### Filter Test
```javascript
it('should filter PMR accessible toilets', () => {
  const { result } = renderHook(() => useToiletStore());
  const mockToilets = [
    { id: 1, pmrAccessible: true },
    { id: 2, pmrAccessible: false },
  ];
  
  act(() => {
    result.current.setToilets(mockToilets);
    result.current.setFilters({ pmrAccessible: true });
  });
  
  expect(result.current.filteredToilets).toHaveLength(1);
});
```

### Rating Test
```javascript
it('should rate toilet', async () => {
  api.post.mockResolvedValue({ success: true });
  
  const result = await toiletService.rateToilet(1, 5);
  
  expect(api.post).toHaveBeenCalledWith('/toilets/1/rate', { rating: 5 });
  expect(result.success).toBe(true);
});
```

## Performance Testing

Monitor test performance:
```bash
npm test -- --testTimeout=10000 --bail
```

## Next Steps

1. **Add more component tests** - Increase component test coverage
2. **Visual regression testing** - Add visual snapshot tests
3. **E2E testing** - Add end-to-end tests with Detox
4. **Performance testing** - Add performance benchmarks
5. **Load testing** - Test API under load

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react-native)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [Expo Testing](https://docs.expo.dev/build-reference/infrastructure/)

## Support

For testing-related questions:
1. Check this guide's troubleshooting section
2. Review test examples in `src/__tests__/`
3. Check Jest/React Testing Library documentation
4. Ask on testing forums or Stack Overflow
