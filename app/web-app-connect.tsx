import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WebAppConnectScreen() {
  const { data } = useLocalSearchParams();
  const [syncing, setSyncing] = useState(false);
  const theme = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('account').then(stored => {
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
    });
  }, []);

  let parsed: any = {};
  try {
    parsed = typeof data === 'string' ? JSON.parse(data) : {};
  } catch (e) {
    parsed = {};
  }

  const nameValue = parsed.displayName || '-';
  const emailValue = parsed.email || '-';
  const showDebug = !parsed.displayName;

  const handleClose = () => {
    router.replace('/(tabs)/settings');
  };

  const handleSync = () => {
    setSyncing(true);
    // Placeholder for sync action
  };

  return (
    <View style={createStyles(theme).container}>
      <TouchableOpacity style={createStyles(theme).closeButton} onPress={handleClose}>
        <X size={28} color={theme.colors.neutral.white} />
      </TouchableOpacity>
      <View style={createStyles(theme).logoTopContainer}>
        {user && user.affiliation && user.affiliation.toLowerCase() === 'agrisol' && (
          <Image
            source={require('@/assets/images/AgrisolLogo.png')}
            style={[createStyles(theme).logo, { width: 160, height: 160 }]}
          />
        )}
        {user && user.affiliation && user.affiliation.toLowerCase() === 'melior' && (
          <Image
            source={require('@/assets/images/icon.png')}
            style={[createStyles(theme).logo, { width: 220, height: 220 }]}
          />
        )}
      </View>
      <View style={createStyles(theme).contentTop}>
        <Text style={createStyles(theme).title}>Web App Connect</Text>
      </View>
      <View style={createStyles(theme).card}>
        <Text style={createStyles(theme).label}>Name:</Text>
        <Text style={createStyles(theme).value}>{nameValue}</Text>
        <Text style={[createStyles(theme).label, { marginTop: 16 }]}>Email:</Text>
        <Text style={createStyles(theme).value}>{emailValue}</Text>
      </View>
      {showDebug && (
        <View style={createStyles(theme).card}>
          <Text style={createStyles(theme).label}>Debug: All QR Data</Text>
          <Text style={createStyles(theme).debugValue}>{typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
      <View style={createStyles(theme).buttonContainerAbsolute}>
        {syncing ? (
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        ) : (
          <TouchableOpacity style={createStyles(theme).syncButton} onPress={handleSync}>
            <Text style={createStyles(theme).syncButtonText}>Sync My Data</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
      paddingTop: 48,
    },
    closeButton: {
      position: 'absolute',
      top: 48,
      right: 24,
      zIndex: 10,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 20,
      padding: 8,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    logoTopContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 24,
    },
    logo: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary.main,
      marginBottom: 32,
      fontFamily: theme.fonts.bold,
    },
    card: {
      width: '100%',
      backgroundColor: theme.colors.neutral.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      fontFamily: theme.fonts.medium,
    },
    value: {
      fontSize: 15,
      color: theme.colors.text.primary,
      fontFamily: theme.fonts.regular,
      marginTop: 2,
    },
    debugValue: {
      fontSize: 12,
      color: theme.colors.error.main,
      fontFamily: theme.fonts.regular,
      marginTop: 8,
    },
    buttonContainerAbsolute: {
      width: '100%',
      alignItems: 'center',
      position: 'absolute',
      bottom: 32,
      left: 0,
      right: 0,
    },
    syncButton: {
      backgroundColor: theme.colors.primary.main,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    syncButtonText: {
      color: theme.colors.neutral.white,
      fontSize: 16,
      fontFamily: theme.fonts.bold,
    },
    contentTop: {
      width: '100%',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 8,
    },
  });
} 