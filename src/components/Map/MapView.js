import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapViewLib from 'react-native-maps';
import Supercluster from 'react-native-supercluster';
import { useToilets } from '../../hooks/useToilets';
import { useLocation } from '../../hooks/useLocation';
import useToiletStore from '../../store/useToiletStore';
import ToiletMarker from './ToiletMarker';
import ClusterMarker from './ClusterMarker';

const MapView = ({ onToiletSelected }) => {
  const mapRef = useRef(null);
  const { toilets } = useToilets();
  const { userLocation } = useLocation();
  const filteredToilets = useToiletStore((state) => state.filteredToilets);
  
  const supercluster = useMemo(
    () => new Supercluster({
      radius: 40,
      maxZoom: 20,
      minZoom: 0,
    }),
    []
  );

  const points = useMemo(
    () => filteredToilets.map((toilet) => ({
      longitude: toilet.longitude,
      latitude: toilet.latitude,
      id: toilet.id,
      ...toilet,
    })),
    [filteredToilets]
  );

  const handleRegionChange = useCallback((region) => {
    if (mapRef.current && points.length > 0) {
      const clusters = supercluster.getClusters(
        [region.longitude - region.longitudeDelta / 2,
         region.latitude - region.latitudeDelta / 2,
         region.longitude + region.longitudeDelta / 2,
         region.latitude + region.latitudeDelta / 2],
        Math.round(Math.log2(360 / region.longitudeDelta))
      );
      setMarkers(clusters);
    }
  }, [points, supercluster]);

  const [markers, setMarkers] = React.useState([]);

  useEffect(() => {
    if (points.length > 0) {
      supercluster.load(points);
      const initialClusters = supercluster.getClusters(
        [-180, -85, 180, 85],
        0
      );
      setMarkers(initialClusters);
    }
  }, [points, supercluster]);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <MapViewLib
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 51.5074,
          longitude: userLocation?.longitude || -0.1278,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation
        followsUserLocation
      >
        {userLocation && (
          <MapViewLib.Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here"
          />
        )}
        
        {markers.map((marker) => {
          if (marker.properties?.cluster) {
            return (
              <ClusterMarker
                key={`cluster-${marker.id}`}
                cluster={marker}
                onPress={() => {
                  const zoomLevel = Math.min(
                    supercluster.getClusterExpansionZoom(marker.id),
                    20
                  );
                  const newRegion = {
                    latitude: marker.geometry.coordinates[1],
                    longitude: marker.geometry.coordinates[0],
                    latitudeDelta: 360 / (Math.pow(2, zoomLevel + 1) * 2),
                    longitudeDelta: 360 / (Math.pow(2, zoomLevel + 1) * 2),
                  };
                  mapRef.current?.animateToRegion(newRegion, 500);
                }}
              />
            );
          }

          const toilet = marker.properties;
          return (
            <ToiletMarker
              key={`toilet-${toilet.id}`}
              toilet={toilet}
              onPress={() => onToiletSelected(toilet)}
            />
          );
        })}
      </MapViewLib>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapView;
