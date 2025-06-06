import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ChevronLeft, Bell } from 'lucide-react-native';

type HeaderProps = {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  rightComponent?: React.ReactNode;
  affiliation?: string;
};

export default function Header({ 
  title, 
  showBack = false, 
  showNotification = false,
  rightComponent,
  affiliation
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {affiliation === 'melior' && title && (
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        )}
        {affiliation === 'agrisol' && title && (
          <Image source={require('@/assets/images/AgrisolLogo.png')} style={styles.logo} />
        )}
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ChevronLeft color={Colors.primary.main} size={24} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent}
        {showNotification && (
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color={Colors.text.primary} size={24} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: Colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  leftContainer: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  rightContainer: {
    width: 56,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  notificationButton: {
    padding: 8,
    marginRight: -8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error.main,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});