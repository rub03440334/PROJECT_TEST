import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ToiletIcon = ({ rating = 0, pmrAccessible = false }) => {
  const getColorByRating = (rating) => {
    if (rating >= 4) return '#4CAF50';
    if (rating >= 2.5) return '#FFC107';
    return '#f44336';
  };

  const color = getColorByRating(rating);

  return (
    <View style={[styles.marker, { backgroundColor: color }]}>
      <Text style={styles.text}>🚽</Text>
      {pmrAccessible && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>♿</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  marker: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#1976D2',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 12,
  },
});

export default ToiletIcon;
