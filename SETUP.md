# Setup Guide - Toilet App Mobile MVP

Complete step-by-step guide to set up and run the Toilet App Mobile MVP.

## Prerequisites

Before starting, ensure you have:
- Node.js v16 or higher
- npm v8 or higher
- Git
- Either iOS Xcode (Mac) or Android Studio/SDK

### Installation on macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version

# Install Expo CLI globally
npm install -g expo-cli

# Install Xcode (for iOS)
xcode-select --install
```

### Installation on Windows

1. Download and install Node.js from https://nodejs.org/
2. Open PowerShell as Administrator and run:
   ```powershell
   npm install -g expo-cli
   ```
3. Download and install Android Studio from https://developer.android.com/studio

### Installation on Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nodejs npm
npm install -g expo-cli

# For Android development, follow Google's official guide
# https://developer.android.com/studio
```

## Project Setup

### 1. Clone or Initialize Project

If cloning from repository:
```bash
git clone <repository-url>
cd toilet-app-mobile
```

Or if starting fresh:
```bash
mkdir toilet-app-mobile
cd toilet-app-mobile
git init
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React and React Native
- Expo framework
- React Navigation
- React Query
- Zustand
- Maps libraries
- Testing libraries

### 3. Configure Environment Variables

#### Create `.env` file:
```bash
cp .env.example .env
```

#### Edit `.env` with your credentials:
```env
# Get from https://www.mapbox.com/account/tokens
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsxxxxx...

# Get from Google Cloud Console (optional)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxx

# Your backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Feature flags
EXPO_PUBLIC_USE_MAPBOX=true
EXPO_PUBLIC_USE_GOOGLE_MAPS=false
```

See [API_CONFIG.md](./API_CONFIG.md) for detailed API key setup instructions.

## Running the App

### Option 1: Development Server (Recommended)

Start the Expo development server:
```bash
npm start
```

You'll see a terminal with options:
```
Press s │ open source code in the editor
Press a │ open Android
Press i │ open iOS simulator
Press w │ open in web browser
Press r │ reload the app
Press m │ toggle menu
Press o │ open project code in current IDE
```

### Option 2: Direct Simulator Launch

#### iOS Simulator (macOS only):
```bash
npm run ios
```

This will:
1. Build the iOS project
2. Start the simulator
3. Load the app

#### Android Emulator:
```bash
npm run android
```

Ensure Android Emulator is running first:
```bash
# Open Android Studio and launch an emulator
# OR use command line:
$ANDROID_HOME/emulator/emulator -avd <avd_name>
```

### Option 3: Expo Go App (Easiest for Testing)

1. Download "Expo Go" from App Store or Google Play
2. Run `npm start`
3. Scan the QR code with your phone
4. App loads on your device

## Verifying Setup

After launching the app:

- [ ] Map appears in center of screen
- [ ] Current location shows (if permission granted)
- [ ] Toilet markers visible on map
- [ ] Filter button (🔽) works at bottom right
- [ ] Refresh button (🔄) works
- [ ] Location button (📍) centers on you
- [ ] Tap a marker to see toilet details

## Development Commands

```bash
# Start development server
npm start

# Run iOS simulator
npm run ios

# Run Android emulator
npm run android

# Run web version
npm run web

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Troubleshooting

### Issue: Dependencies Won't Install

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Make sure you're in the project root directory
pwd

# Check node_modules exists
ls -la node_modules

# If not, run npm install again
npm install
```

### Issue: Simulator Won't Start

**For iOS:**
```bash
# Kill existing simulators
killall "Simulator"

# Start fresh
npm run ios
```

**For Android:**
```bash
# Verify emulator is running
android list avd

# Start emulator if needed
$ANDROID_HOME/emulator/emulator -avd <avd_name>

# Then run
npm run android
```

### Issue: Map Not Loading

1. Verify Mapbox token is valid in `.env`
2. Check network connectivity
3. Restart the app with `r` in Expo terminal
4. Try using web version: `npm run web`

### Issue: Location Not Working

1. Grant location permission when prompted
2. In simulator settings, enable location services
3. For iOS Simulator:
   - Simulator menu → Features → Location → Custom Location
   - Enter coordinates: 51.5074, -0.1278
4. For Android Emulator:
   - Extended Controls (≡) → Location
   - Set latitude/longitude

### Issue: Jest Tests Fail

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests again
npm test
```

## Project Structure

```
toilet-app-mobile/
├── src/
│   ├── App.js                      # Main app component
│   ├── config/                     # Configuration files
│   ├── store/                      # Zustand stores
│   ├── services/                   # API services
│   ├── hooks/                      # Custom hooks
│   ├── components/                 # Reusable components
│   ├── screens/                    # Screen components
│   └── __tests__/                  # Test files
├── .env.example                    # Example environment variables
├── .env                            # Your local environment variables
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel configuration
├── jest.config.js                  # Jest configuration
├── package.json                    # Project dependencies
├── README.md                       # Project documentation
├── API_CONFIG.md                   # API configuration guide
└── SETUP.md                        # This file
```

## Git Workflow

All changes should be on the feature branch:
```bash
# Check current branch
git branch

# You should be on: feature/mobile-mvp-toilet-app-rn-map-clustering-filters-offline-tests

# Make changes and commit
git add .
git commit -m "Your commit message"

# Push to the feature branch
git push origin feature/mobile-mvp-toilet-app-rn-map-clustering-filters-offline-tests
```

## Connecting to Backend

The app expects a backend API. To test locally:

### Option 1: Mock Server

For testing without a backend, mock data is provided. The app will show sample toilets.

### Option 2: Run Backend Locally

If you have a backend:
```bash
# In your backend directory
npm start  # or your startup command

# In .env, set:
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Restart the app with 'r' in Expo
```

### Option 3: Connect to Deployed Backend

```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
```

## Next Steps

1. **Review the code**: Explore `src/` directory to understand structure
2. **Read API docs**: See [API_CONFIG.md](./API_CONFIG.md) for API details
3. **Run tests**: `npm test` to verify everything works
4. **Start developing**: Modify components in `src/` and hot reload with Expo
5. **Test on device**: Use Expo Go app on your phone for real testing

## Additional Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Mapbox Documentation](https://docs.mapbox.com/)
- [Google Maps API Documentation](https://developers.google.com/maps)

## Support

If you encounter issues:
1. Check this troubleshooting section
2. Review [API_CONFIG.md](./API_CONFIG.md) for API-related issues
3. Check the [README.md](./README.md) for feature documentation
4. Search Expo issues: https://github.com/expo/expo/issues
5. Ask on React Native forums or Stack Overflow

## Quick Checklist

After completing setup, verify:

- [ ] Dependencies installed (`npm install` succeeded)
- [ ] `.env` file created with valid API keys
- [ ] `npm start` runs without errors
- [ ] Simulator/Emulator starts successfully
- [ ] App loads and displays map
- [ ] Location permission works
- [ ] Toilet markers visible
- [ ] Filters work
- [ ] Tests pass (`npm test`)

Once all items are checked, you're ready to develop! 🎉
