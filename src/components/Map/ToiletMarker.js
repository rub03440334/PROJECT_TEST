import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import ToiletIcon from './ToiletIcon';

const ToiletMarker = ({ toilet, onPress }) => {
  return (
    <Marker
      key={toilet.id}
      coordinate={{
        latitude: toilet.latitude,
        longitude: toilet.longitude,
      }}
      onPress={onPress}
      title={toilet.name || 'Toilet'}
      description={`Rating: ${toilet.rating || 0}/5`}
    >
      <ToiletIcon
        rating={toilet.rating}
        pmrAccessible={toilet.pmrAccessible}
      />
      <Callout onPress={onPress}>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{toilet.name || 'Toilet'}</Text>
          <Text style={styles.calloutText}>Rating: {toilet.rating || 0}/5</Text>
          {toilet.hours && (
            <Text style={styles.calloutText}>Hours: {toilet.hours}</Text>
          )}
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  callout: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  calloutText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ToiletMarker;
