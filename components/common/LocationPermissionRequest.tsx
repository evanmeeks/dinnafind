import type React from 'react';
import { useEffect, useState } from 'react';

import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Icon } from '@rneui/themed';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/theme';

interface LocationPermissionRequestProps {
  onRequestLocation: () => void;
}

/**
 * Location Permission Request Component
 * - Explains why the app needs location access
 * - Provides options to grant permission or open settings
 * - Fully accessible with clear instructions
 */
export const LocationPermissionRequest: React.FC<LocationPermissionRequestProps> = ({
  onRequestLocation,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  // Check permission status on component mount
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  // Check current permission status
  const checkPermissionStatus = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);

      // If permission is already granted, call onRequestLocation
      if (status === 'granted') {
        onRequestLocation();
      }
    } catch (error) {
      console.error('Error checking permission status:', error);
    }
  };

  // Request location permission
  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        onRequestLocation();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  // Open app settings
  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <Icon
            color={theme.colors.primary}
            containerStyle={styles.icon}
            name="location-on"
            size={80}
            type="material"
          />
        </View>

        <Text style={styles.title}>Location Access Needed</Text>

        <Text style={styles.description}>
          Restaurant Bucket List needs access to your location to find restaurants near you. We use
          this information only to show you relevant results and never track or store your location
          data.
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Icon color={theme.colors.primary} name="place" size={24} type="material" />
            <Text style={styles.benefitText}>Discover nearby restaurants</Text>
          </View>

          <View style={styles.benefitItem}>
            <Icon color={theme.colors.primary} name="star" size={24} type="material" />
            <Text style={styles.benefitText}>Get personalized recommendations</Text>
          </View>

          <View style={styles.benefitItem}>
            <Icon color={theme.colors.primary} name="directions" size={24} type="material" />
            <Text style={styles.benefitText}>See distances and get directions</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            accessible
            accessibilityLabel="Allow location access"
            accessibilityRole="button"
            buttonStyle={styles.primaryButton}
            icon={{
              name: 'location-on',
              type: 'material',
              size: 20,
              color: 'white',
            }}
            iconContainerStyle={styles.buttonIcon}
            iconRight={false}
            testID="allow-location-button"
            title="Allow Location Access"
            titleStyle={styles.buttonTitle}
            onPress={requestPermission}
          />

          <Button
            accessible
            accessibilityLabel="Open app settings"
            accessibilityRole="button"
            buttonStyle={styles.secondaryButton}
            icon={{
              name: 'settings',
              type: 'material',
              size: 20,
              color: theme.colors.primary,
            }}
            iconContainerStyle={styles.buttonIcon}
            iconRight={false}
            title="Open Settings"
            titleStyle={styles.secondaryButtonTitle}
            type="outline"
            onPress={openSettings}
          />

          <Text style={styles.privacyNote}>
            You can change this permission later in your device settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.grey5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: theme.colors.grey1,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.grey2,
    lineHeight: 24,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    color: theme.colors.grey2,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 16,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 20,
  },
  secondaryButtonTitle: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  privacyNote: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors.grey3,
    marginTop: 8,
  },
});
