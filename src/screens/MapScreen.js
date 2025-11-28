import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView from '../components/Map/MapView';
import FilterSheet from '../components/Filters/FilterSheet';
import ToiletDetailSheet from '../components/ToiletDetail/ToiletDetailSheet';
import useToiletStore from '../store/useToiletStore';
import { useLocation } from '../hooks/useLocation';
import { useToilets } from '../hooks/useToilets';

const MapScreen = () => {
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [detailSheetVisible, setDetailSheetVisible] = useState(false);

  const setSelectedToilet = useToiletStore((state) => state.setSelectedToilet);
  const selectedToilet = useToiletStore((state) => state.selectedToilet);
  const { userLocation, hasLocationPermission, getCurrentLocation } = useLocation();
  const { toilets, isLoading, refetch } = useToilets();

  useEffect(() => {
    if (hasLocationPermission && !userLocation) {
      getCurrentLocation().catch((error) => {
        console.warn('Error getting current location:', error);
      });
    }
  }, [hasLocationPermission]);

  const handleToiletSelected = (toilet) => {
    setSelectedToilet(toilet);
    setDetailSheetVisible(true);
  };

  const handleOpenFilters = () => {
    setFilterSheetVisible(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      {isLoading && toilets.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading toilets...</Text>
        </View>
      ) : (
        <MapView onToiletSelected={handleToiletSelected} />
      )}

      {/* Status Bar */}
      {!hasLocationPermission && (
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>📍 Location permission required</Text>
        </View>
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fab}>
        {/* Filter Button */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleOpenFilters}
        >
          <Text style={styles.fabIcon}>🔽</Text>
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleRefresh}
        >
          <Text style={styles.fabIcon}>🔄</Text>
        </TouchableOpacity>

        {/* Center Location Button */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => {
            if (userLocation) {
              getCurrentLocation();
            } else {
              Alert.alert('Location', 'Could not get your location');
            }
          }}
        >
          <Text style={styles.fabIcon}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Sheet */}
      <FilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
      />

      {/* Toilet Detail Sheet */}
      <ToiletDetailSheet
        visible={detailSheetVisible}
        onClose={() => setDetailSheetVisible(false)}
      />

      {/* Toilet Count Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {toilets.length} toilets nearby
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  statusBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    zIndex: 100,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    gap: 12,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MapScreen;
