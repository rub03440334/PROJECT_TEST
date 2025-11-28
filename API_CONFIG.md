# API Configuration Guide

This document explains how to configure API keys and endpoints for the Toilet App Mobile MVP.

## Overview

The application uses three main external services:
1. **Mapbox** - For interactive maps and geocoding (recommended)
2. **Google Maps** - Alternative map provider
3. **Backend API** - Custom API for toilet data and user interactions

## Mapbox Setup

### Step 1: Create a Mapbox Account
1. Visit [https://www.mapbox.com/](https://www.mapbox.com/)
2. Click "Sign up" and create a free account
3. Free tier includes:
   - Up to 25,000 map views per month
   - Web services (geocoding, routing, etc.)

### Step 2: Get Your Public Token
1. After signing up, go to your [Account page](https://account.mapbox.com/)
2. Click on "Tokens" in the left sidebar
3. You'll see your default "pk.eyJ..." token
4. If needed, create a new token:
   - Click "Create a token"
   - Name it "Toilet App Mobile"
   - Select scopes: `maps:read`, `geocoding:read`
   - Click "Create token"

### Step 3: Configure in `.env`
```env
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsxxxxx...
EXPO_PUBLIC_USE_MAPBOX=true
EXPO_PUBLIC_USE_GOOGLE_MAPS=false
```

### Example Token Format
```
pk.eyJ1IjoiYXZlcmFnZXVzZXIiLCJhIjoiY2w4YzVod...rest_of_token
   ↑
   Public token prefix
```

## Google Maps Setup (Alternative)

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it "Toilet App"
4. Click "Create"

### Step 2: Enable Required APIs
1. In the search bar, search for "Maps SDK"
2. Select "Maps SDK for Android"
3. Click "Enable"
4. Repeat for "Maps SDK for iOS"
5. Also enable "Places API" for optional location search

### Step 3: Create API Credentials
1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Restrict the key:
   - Click on the key to edit it
   - Under "API restrictions", select "Maps SDKs"
   - Under "Application restrictions", select "iOS apps" or "Android apps"

### Step 4: Configure in `.env`
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxx
EXPO_PUBLIC_USE_MAPBOX=false
EXPO_PUBLIC_USE_GOOGLE_MAPS=true
```

## Backend API Configuration

### Environment Variable
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Local Development
```bash
# Start your backend server
npm start  # or your backend start command

# The API URL should point to your local server
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Production Deployment
```env
EXPO_PUBLIC_API_URL=https://api.toiletapp.com/api
```

## Expected Backend API Endpoints

The app expects the following REST API endpoints:

### GET `/api/toilets`
Returns all toilets in the database.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Main Street Toilet",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "address": "123 Main Street, London",
    "hours": "6am-10pm",
    "cost": 0.50,
    "rating": 4.2,
    "ratingCount": 25,
    "cleanlinessScore": 8,
    "pmrAccessible": true,
    "type": "Public"
  }
]
```

### GET `/api/toilets/nearby`
Returns toilets near a specific location.

**Query Parameters:**
- `latitude` (number): User latitude
- `longitude` (number): User longitude
- `radiusKm` (number): Search radius in kilometers

**Example:**
```
GET /api/toilets/nearby?latitude=51.5074&longitude=-0.1278&radiusKm=5
```

### GET `/api/toilets/:id`
Returns detailed information for a specific toilet.

**Response:**
```json
{
  "id": "1",
  "name": "Main Street Toilet",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "address": "123 Main Street, London",
  "hours": "6am-10pm",
  "cost": 0.50,
  "rating": 4.2,
  "ratingCount": 25,
  "cleanlinessScore": 8,
  "pmrAccessible": true,
  "type": "Public",
  "amenities": ["Wheelchair access", "Baby change"],
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### POST `/api/toilets/:id/rate`
Submit a rating for a toilet.

**Request Body:**
```json
{
  "rating": 4
}
```

**Response:**
```json
{
  "success": true,
  "newRating": 4.15,
  "ratingCount": 26
}
```

### POST `/api/toilets/:id/report`
Report an issue with a toilet.

**Request Body:**
```json
{
  "issue": "not_clean",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Supported Issues:**
- `not_clean` - Facility is not clean
- `out_of_order` - Facility is not functional
- `damaged` - Facility is damaged
- `closed` - Facility is closed

**Response:**
```json
{
  "success": true,
  "reportId": "report_123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET `/api/toilets/filters`
Returns available filter options.

**Response:**
```json
{
  "types": ["Public", "Private", "Restaurant", "Shopping Mall"],
  "ratings": [0, 2.5, 4],
  "features": ["PMR Accessible", "24/7", "Baby Change"]
}
```

## Switching Between Map Providers

### To use Mapbox (recommended):
```env
EXPO_PUBLIC_USE_MAPBOX=true
EXPO_PUBLIC_USE_GOOGLE_MAPS=false
EXPO_PUBLIC_MAPBOX_TOKEN=pk.your_token...
```

### To use Google Maps:
```env
EXPO_PUBLIC_USE_MAPBOX=false
EXPO_PUBLIC_USE_GOOGLE_MAPS=true
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

## Testing the Configuration

### Test Location Service
The app automatically tests location permission on startup. You should see:
- iOS: Permission dialog appears
- Android: Permission dialog appears

### Test Map Loading
1. Grant location permission
2. Allow app to access your location
3. Map should center on your location
4. Toilet markers should appear

### Test Backend Connectivity
1. Check browser console for API errors
2. Verify backend server is running
3. Check network tab to see API requests

## Security Best Practices

1. **Never commit real API keys** - Use `.env` file which is in `.gitignore`
2. **Restrict API key scope** - In provider dashboards, limit which services can use the key
3. **Implement rate limiting** - On your backend
4. **Use HTTPS** - For production endpoints
5. **Rotate keys regularly** - Change API keys periodically
6. **Monitor usage** - Set up alerts in provider dashboards

## Environment Variables Summary

| Variable | Purpose | Example |
|----------|---------|---------|
| `EXPO_PUBLIC_MAPBOX_TOKEN` | Mapbox public token | `pk.eyJ1...` |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaSy...` |
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `EXPO_PUBLIC_USE_MAPBOX` | Enable Mapbox | `true` or `false` |
| `EXPO_PUBLIC_USE_GOOGLE_MAPS` | Enable Google Maps | `true` or `false` |

## Troubleshooting

### Map Not Displaying
- Check that API token is valid and has correct scopes
- Verify token format (should start with `pk.` for Mapbox or `AIzaSy` for Google)
- Ensure API is enabled in service provider dashboard
- Check network requests in browser developer tools

### API Calls Failing
- Verify `EXPO_PUBLIC_API_URL` is correct
- Check backend server is running
- Look for CORS errors (configure backend to allow your app's origin)
- Review backend logs for errors

### Location Not Working
- Check location permission is granted in device settings
- Verify `expo-location` is properly installed
- Test in actual device or emulator with proper location simulation
- Check that location services are enabled on device

## Support

For detailed API documentation, see the backend repository documentation.
For issues with map providers, contact their support:
- Mapbox: https://support.mapbox.com/
- Google Maps: https://developers.google.com/maps/contact-sales
