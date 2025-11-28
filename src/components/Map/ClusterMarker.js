import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker } from 'react-native-maps';

const ClusterMarker = ({ cluster, onPress }) => {
  const clusterCount = cluster.properties.point_count;

  return (
    <Marker
      key={`cluster-${cluster.id}`}
      coordinate={{
        latitude: cluster.geometry.coordinates[1],
        longitude: cluster.geometry.coordinates[0],
      }}
      onPress={onPress}
    >
      <View style={styles.cluster}>
        <Text style={styles.clusterText}>{clusterCount}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  cluster: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ClusterMarker;
