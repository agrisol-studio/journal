import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  Platform,
  Image
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { router } from 'expo-router';
import { User, Globe, Database, Bell, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Cloud, Shield } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

export default function SettingsScreen() {
  const [user, setUser] = useState<{ name?: string; affiliation?: string; displayName?: string; email?: string }>({ name: '', affiliation: '', displayName: '', email: '' });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [city, setCity] = useState('Pretoria');
  const theme = useTheme();
  const styles = createStyles(theme);
  
  useEffect(() => {
    AsyncStorage.getItem('account').then(stored => {
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
    });
    AsyncStorage.getItem('weatherCity').then(stored => {
      if (stored) setCity(stored);
    });
  }, []);
  
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: () => router.replace('/(auth)/login'),
          style: 'destructive',
        },
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Change Language',
      'Select your preferred language',
      [
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'Afrikaans', onPress: () => console.log('Afrikaans selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleClearAccount = async () => {
    await AsyncStorage.removeItem('account');
    await Updates.reloadAsync();
  };

  const handleCityChange = () => {
    Alert.prompt(
      'Set City/Town',
      'Enter your city or town for weather updates:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (value) => {
            if (value) {
              setCity(value);
              AsyncStorage.setItem('weatherCity', value);
            }
          },
        },
      ],
      'plain-text',
      city
    );
  };

  return (
    <View style={styles.container}>
      {/* Agrisol logo top left if affiliation is agrisol */}
      {user && user.affiliation && user.affiliation.toLowerCase() === 'agrisol' && (
        <View style={styles.logoTopLeftContainerAbsolute}>
          <Image
            source={require('@/assets/images/AgrisolLogo.png')}
            style={styles.logoTopLeft}
          />
        </View>
      )}
      <Header title="Settings" affiliation={user.affiliation} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.profileImagePlaceholder}>
                <User size={32} color={theme.colors.neutral.white} />
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{user.displayName || user.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user.email || ''}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </Card>
          
          {/* Debug info */}
          <View style={{ padding: 12, backgroundColor: '#eee', borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>DEBUG user: {JSON.stringify(user)}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            <Card>
              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Bell size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Notifications</Text>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                  thumbColor={notifications ? theme.colors.primary.main : theme.colors.neutral.white}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Moon size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                  thumbColor={darkMode ? theme.colors.primary.main : theme.colors.neutral.white}
                />
              </View>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
                <View style={styles.settingIconContainer}>
                  <Globe size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Language</Text>
                <View style={styles.settingRightContainer}>
                  <Text style={styles.settingValue}>English</Text>
                  <ChevronRight size={20} color={theme.colors.text.secondary} />
                </View>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingItem} onPress={handleCityChange}>
                <View style={styles.settingIconContainer}>
                  <Globe size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Weather City/Town</Text>
                <View style={styles.settingRightContainer}>
                  <Text style={styles.settingValue}>{city}</Text>
                  <ChevronRight size={20} color={theme.colors.text.secondary} />
                </View>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingItem} onPress={() => router.replace('/')} accessibilityRole="button">
                <View style={styles.settingIconContainer}>
                  <Globe size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Web App Status</Text>
                <View style={styles.statusIndicatorContainer}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.error.main }]} />
                  <Text style={[styles.statusText, { color: theme.colors.error.main }]}>Inactive</Text>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            
            <Card>
              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Cloud size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Auto Sync</Text>
                <Switch
                  value={autoSync}
                  onValueChange={setAutoSync}
                  trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                  thumbColor={autoSync ? theme.colors.primary.main : theme.colors.neutral.white}
                />
              </View>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Database size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Export Data</Text>
                <ChevronRight size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </Card>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help & Support</Text>
            
            <Card>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <HelpCircle size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Help Center</Text>
                <ChevronRight size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Shield size={20} color={theme.colors.primary.main} />
                </View>
                <Text style={styles.settingText}>Privacy Policy</Text>
                <ChevronRight size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </Card>
          </View>
          
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="outline"
            icon={<LogOut size={20} color={theme.colors.error.main} />}
            style={styles.logoutButton}
          />
          
          <Button
            title="Clear Account"
            onPress={handleClearAccount}
            variant="outline"
            icon={<LogOut size={20} color={theme.colors.error.main} />}
            style={styles.logoutButton}
          />
          
          <Text style={styles.versionText}>
            Journal v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 48 : 24,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
      backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTextContainer: {
    marginLeft: 16,
  },
  profileName: {
      fontFamily: theme.fonts.medium,
    fontSize: 18,
      color: theme.colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.text.secondary,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
      backgroundColor: theme.colors.background.paper,
    borderRadius: 16,
  },
  editProfileText: {
      fontFamily: theme.fonts.medium,
    fontSize: 14,
      color: theme.colors.primary.main,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
      fontFamily: theme.fonts.medium,
    fontSize: 16,
      color: theme.colors.text.secondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
      backgroundColor: theme.colors.primary.light + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
      fontFamily: theme.fonts.regular,
    fontSize: 16,
      color: theme.colors.text.primary,
    flex: 1,
  },
  settingRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.text.secondary,
    marginRight: 8,
  },
  divider: {
    height: 1,
      backgroundColor: theme.colors.divider,
    marginVertical: 4,
  },
  logoutButton: {
    marginTop: 24,
      borderColor: theme.colors.error.main,
  },
  versionText: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
  },
    statusIndicatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    statusText: {
      fontFamily: theme.fonts.medium,
      fontSize: 16,
    },
    logoTopLeftContainer: {
      position: 'absolute',
      top: 24,
      left: 16,
      zIndex: 10,
    },
    logoTopLeft: {
      width: 168,
      height: 168,
      resizeMode: 'contain',
    },
    logoTopLeftContainerAbsolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 20,
      padding: 8,
    },
    logoTopRightContainerAbsolute: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 20,
      padding: 8,
    },
    logoTopRight: {
      width: 48,
      height: 48,
      resizeMode: 'contain',
    },
});
}