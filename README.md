# Toilet App Mobile MVP

A React Native mobile application for locating and rating public toilets with real-time location tracking, map clustering, and detailed facility information.

## Features

### P0/P1 Features
- ✅ Location permissions request & user location tracking
- ✅ Map centered on user location
- ✅ Toilet markers with interactive clustering (via Mapbox/Google Maps)
- ✅ Quick-launch navigation buttons
- ✅ Essential filters:
  - PMR accessibility
  - Operating hours (24/7)
  - Cleanliness rating
  - Facility type (Public, Private, Restaurant, Shopping Mall)

### Toilet Details
- ✅ Cleanliness score (0-10)
- ✅ Operating hours
- ✅ Address information
- ✅ Cost/Price
- ✅ User rating system (1-5 stars)
- ✅ Quick report actions (not clean, out of order, damaged, closed)

### Data Management
- ✅ React Query for data fetching & caching
- ✅ Zustand for state management
- ✅ Offline caching with AsyncStorage
- ✅ Efficient API integration

### Testing
- ✅ Jest configuration
- ✅ React Testing Library setup
- ✅ Unit tests for stores, services, and components
- ✅ Coverage reporting

## Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State Management**: Zustand + React Query
- **Maps**: react-native-maps with Supercluster
- **Location**: expo-location
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Testing**: Jest + React Testing Library

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd toilet-app-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Add your API keys:
     ```bash
     EXPO_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
     EXPO_PUBLIC_API_URL=http://localhost:3000/api
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

## Running on Simulators

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Mapbox Configuration
EXPO_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token_here

# Google Maps Configuration (alternative to Mapbox)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy_your_google_maps_key

# Backend API
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
EXPO_PUBLIC_USE_MAPBOX=true
EXPO_PUBLIC_USE_GOOGLE_MAPS=false
```

### Obtaining API Keys

#### Mapbox Token
1. Sign up at [https://www.mapbox.com/](https://www.mapbox.com/)
2. Navigate to Account > Tokens
3. Create a new public token
4. Copy the token to `.env`

#### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Maps SDK for Android and iOS
4. Create an API key credential
5. Add to `.env`

## Project Structure

```
src/
├── App.js                           # Main app component
├── config/
│   ├── env.js                      # Environment configuration
│   └── api.js                      # Axios API client
├── store/
│   ├── useToiletStore.js          # Toilet state management
│   └── useLocationStore.js         # Location state management
├── services/
│   ├── toiletService.js           # Toilet API calls
│   └── locationService.js         # Location API calls
├── hooks/
│   ├── useToilets.js              # Toilet data hooks
│   └── useLocation.js             # Location hooks
├── components/
│   ├── Map/
│   │   ├── MapView.js            # Main map component
│   │   ├── ToiletMarker.js       # Individual markers
│   │   ├── ClusterMarker.js      # Cluster markers
│   │   └── ToiletIcon.js         # Marker icon component
│   ├── Filters/
│   │   └── FilterSheet.js        # Filter modal
│   └── ToiletDetail/
│       └── ToiletDetailSheet.js  # Detail modal
├── screens/
│   └── MapScreen.js              # Main screen
└── __tests__/                     # Test files
    ├── store/
    ├── services/
    └── components/
```

## API Endpoints

The app communicates with the following backend endpoints:

### Toilets
- `GET /toilets` - Get all toilets
- `GET /toilets/nearby?latitude=X&longitude=Y&radiusKm=5` - Get nearby toilets
- `GET /toilets/:id` - Get toilet details
- `POST /toilets/:id/rate` - Rate a toilet
- `POST /toilets/:id/report` - Report an issue
- `GET /toilets/filters` - Get available filters

## Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Features in Detail

### Map with Clustering
- Uses Mapbox GL JS or Google Maps
- Implements Supercluster for efficient marker clustering
- Shows user location with auto-center capability
- Real-time position updates

### Location Permissions
- Automatically requests location permission on app start
- Handles permission denied scenarios gracefully
- Provides user feedback for permission status

### Filtering System
- **PMR Accessibility**: Filter for wheelchair-accessible facilities
- **24/7 Hours**: Filter for always-open facilities
- **Minimum Rating**: Filter by cleanliness rating (0+, 2.5+, 4+)
- **Facility Type**: Filter by facility type (Public, Private, Restaurant, Shopping Mall)

### Offline Support
- Caches toilet data locally using AsyncStorage
- Uses cached data when network is unavailable
- Automatic cache refresh when data is stale

### User Rating System
- Rate toilets 1-5 stars
- Contributes to facility's overall cleanliness rating
- Instant feedback on submission

### Issue Reporting
- Quick-access issue reporting menu
- Pre-defined issue categories:
  - Not clean
  - Out of order
  - Unusable/Damaged
  - Closed
- Timestamp included with reports

## Development Workflow

### Code Style
- Follow existing patterns in the codebase
- Use const for declarations
- Component names use PascalCase
- Utilities and hooks use camelCase
- File names match component/export names

### Adding New Components
1. Create component file in appropriate directory
2. Add corresponding test file
3. Update relevant exports/imports
4. Test on both iOS and Android simulators

### Performance Optimization
- Uses React Query for efficient data fetching
- Implements clustering to reduce marker rendering
- AsyncStorage for offline caching
- Memoization for expensive computations

## Troubleshooting

### Location Permission Issues
- Ensure `expo-location` permissions are properly configured
- Check device settings for app permissions
- Try restarting the app and simulator

### Map Not Loading
- Verify Mapbox/Google Maps API keys are valid
- Check network connectivity
- Ensure coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)

### Build Issues
- Clear cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules && npm install`
- Clear Expo cache: `expo prebuild --clean`

## Git Workflow

All changes are made on the feature branch:
```
feature/mobile-mvp-toilet-app-rn-map-clustering-filters-offline-tests
```

## Future Enhancements

- Photo upload for facility reviews
- Social features (comments, recommendations)
- Favorites/saved locations
- Advanced filtering (amenities, baby changing facilities)
- Offline map support
- Push notifications for nearby facilities
- Multiple facility type icons
- Voice-based search

## License

Proprietary - All rights reserved

## Support

For issues or questions, please open a GitHub issue or contact the development team.
