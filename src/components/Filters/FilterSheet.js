import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Switch,
  Modal,
} from 'react-native';
import useToiletStore from '../../store/useToiletStore';

const FilterSheet = ({ visible, onClose }) => {
  const filters = useToiletStore((state) => state.filters);
  const setFilters = useToiletStore((state) => state.setFilters);
  const resetFilters = useToiletStore((state) => state.resetFilters);

  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    setLocalFilters({
      ...localFilters,
      [key]: value,
    });
  };

  const handleToggleType = (type) => {
    const types = localFilters.types.includes(type)
      ? localFilters.types.filter((t) => t !== type)
      : [...localFilters.types, type];
    handleFilterChange('types', types);
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({
      pmrAccessible: false,
      open24Hours: false,
      minRating: 0,
      types: [],
    });
  };

  const toiletTypes = ['Public', 'Private', 'Restaurant', 'Shopping Mall'];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* PMR Accessibility Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>PMR Accessible</Text>
            <Switch
              value={localFilters.pmrAccessible}
              onValueChange={(value) => handleFilterChange('pmrAccessible', value)}
              trackColor={{ false: '#767577', true: '#81C784' }}
              thumbColor={localFilters.pmrAccessible ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          {/* 24/7 Hours Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Open 24/7</Text>
            <Switch
              value={localFilters.open24Hours}
              onValueChange={(value) => handleFilterChange('open24Hours', value)}
              trackColor={{ false: '#767577', true: '#81C784' }}
              thumbColor={localFilters.open24Hours ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          {/* Minimum Rating Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Minimum Rating</Text>
            <View style={styles.ratingButtons}>
              {[0, 2.5, 4].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    localFilters.minRating === rating && styles.ratingButtonActive,
                  ]}
                  onPress={() => handleFilterChange('minRating', rating)}
                >
                  <Text
                    style={[
                      styles.ratingButtonText,
                      localFilters.minRating === rating && styles.ratingButtonTextActive,
                    ]}
                  >
                    {rating === 0 ? 'Any' : `${rating}+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Toilet Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.typeButtons}>
              {toiletTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    localFilters.types.includes(type) && styles.typeButtonActive,
                  ]}
                  onPress={() => handleToggleType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      localFilters.types.includes(type) && styles.typeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  resetButton: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  ratingButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  ratingButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  ratingButtonTextActive: {
    color: '#fff',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilterSheet;
