import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
} from 'react-native';
import StarRating from 'react-native-rating-bar';
import useToiletStore from '../../store/useToiletStore';
import { useRateToilet, useReportIssue } from '../../hooks/useToilets';

const ToiletDetailSheet = ({ visible, onClose }) => {
  const selectedToilet = useToiletStore((state) => state.selectedToilet);
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [reportMenu, setReportMenu] = useState(false);

  const rateToilet = useRateToilet();
  const reportIssue = useReportIssue();

  if (!selectedToilet) return null;

  const handleRateToilet = async (rating) => {
    setIsRating(true);
    try {
      await rateToilet(selectedToilet.id, rating);
      setUserRating(rating);
      Alert.alert('Success', 'Thank you for your rating!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating');
    } finally {
      setIsRating(false);
    }
  };

  const handleReportIssue = async (issue) => {
    try {
      await reportIssue(selectedToilet.id, issue);
      Alert.alert('Success', 'Thank you for reporting this issue');
      setReportMenu(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to report issue');
    }
  };

  const issues = [
    { label: 'Not clean', value: 'not_clean' },
    { label: 'Out of order', value: 'out_of_order' },
    { label: 'Unusable/Damaged', value: 'damaged' },
    { label: 'Closed', value: 'closed' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Toilet Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {/* Toilet Name */}
          <Text style={styles.toiletName}>{selectedToilet.name || 'Public Toilet'}</Text>

          {/* Address */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>📍 Address</Text>
            <Text style={styles.infoValue}>{selectedToilet.address}</Text>
          </View>

          {/* Hours */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>⏰ Hours</Text>
            <Text style={styles.infoValue}>{selectedToilet.hours || 'Not specified'}</Text>
          </View>

          {/* Cost */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>💷 Cost</Text>
            <Text style={styles.infoValue}>
              {selectedToilet.cost === 0 ? 'Free' : `£${selectedToilet.cost}`}
            </Text>
          </View>

          {/* Cleanliness Score */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>✨ Cleanliness Score</Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  { width: `${(selectedToilet.cleanlinessScore || 0) * 10}%` },
                ]}
              />
            </View>
            <Text style={styles.scoreText}>
              {selectedToilet.cleanlinessScore || 0}/10
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>⭐ Rating</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingValue}>
                {selectedToilet.rating || 0}/5
              </Text>
              <Text style={styles.ratingCount}>
                ({selectedToilet.ratingCount || 0} ratings)
              </Text>
            </View>
          </View>

          {/* PMR Accessible */}
          {selectedToilet.pmrAccessible && (
            <View style={[styles.infoSection, styles.pmrBadge]}>
              <Text style={styles.pmrText}>♿ PMR Accessible</Text>
            </View>
          )}

          {/* Rate This Toilet */}
          <View style={styles.rateSection}>
            <Text style={styles.rateLabel}>Rate this toilet</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRateToilet(star)}
                  disabled={isRating}
                >
                  <Text
                    style={[
                      styles.star,
                      userRating >= star && styles.starFilled,
                    ]}
                  >
                    {userRating >= star ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setReportMenu(true)}
            >
              <Text style={styles.actionButtonText}>📢 Report Issue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>🗺️ Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>📸 Add Photos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Report Menu */}
        {reportMenu && (
          <View style={styles.reportMenu}>
            <View style={styles.reportMenuHeader}>
              <Text style={styles.reportMenuTitle}>Report an Issue</Text>
              <TouchableOpacity onPress={() => setReportMenu(false)}>
                <Text style={styles.reportMenuClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reportMenuItems}>
              {issues.map((issue) => (
                <TouchableOpacity
                  key={issue.value}
                  style={styles.reportMenuItem}
                  onPress={() => handleReportIssue(issue.value)}
                >
                  <Text style={styles.reportMenuItemText}>{issue.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  toiletName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  scoreText: {
    fontSize: 14,
    marginTop: 8,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingCount: {
    fontSize: 14,
    marginLeft: 8,
    color: '#999',
  },
  pmrBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderBottomWidth: 0,
  },
  pmrText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  rateSection: {
    marginBottom: 24,
  },
  rateLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  star: {
    fontSize: 32,
  },
  starFilled: {
    opacity: 1,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  reportMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    maxHeight: '50%',
  },
  reportMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reportMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reportMenuClose: {
    fontSize: 24,
    color: '#666',
  },
  reportMenuItems: {
    gap: 8,
  },
  reportMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  reportMenuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ToiletDetailSheet;
