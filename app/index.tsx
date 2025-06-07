import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/components/Button';
import { ArrowRight, Languages, QrCode } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Temporary user object for affiliation concept
const user = {
  affiliation: 'melior', // or 'agrisol', can be extended later
};

function QRScanner({ onClose, onScan }: { onClose: () => void; onScan: (data: string) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme, {});

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission is required to scan QR codes</Text>
        <TouchableOpacity style={styles.closeButton} onPress={requestPermission}>
          <Text style={styles.closeButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => {
          if (!scanned) {
            setScanned(true);
            onScan(data);
          }
        }}
      />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WelcomeScreen() {
  const { t, language, setLanguage } = useLanguage();
  const theme = useTheme();
  const [showScanner, setShowScanner] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('account');
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setLoading(false);
    };
    loadUser();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'af' : 'en');
  };

  const handleBarCodeScanned = async (data: string) => {
    setShowScanner(false);
    try {
      const parsed = JSON.parse(data);
      if (parsed.affiliation) {
        setUser(parsed);
        await AsyncStorage.setItem('account', JSON.stringify(parsed));
      }
    } catch {}
    router.push({ pathname: './web-app-connect', params: { data } });
  };

  if (loading) {
    return null;
  }
  if (showScanner) {
    return (
      <QRScanner
        onClose={() => setShowScanner(false)}
        onScan={handleBarCodeScanned}
      />
    );
  }
  const styles = createStyles(theme, user);
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg' }}
        style={styles.backgroundImage}
      />
      {(!user || !user.affiliation) && (
        <View style={styles.neutralWelcomeTopContainer}>
          <Text style={styles.logoText}>
            {language === 'af' ? 'Welkom By Journal' : 'Welcome at Journal'}
          </Text>
        </View>
      )}
      <View style={
        user && user.affiliation && user.affiliation.toLowerCase() === 'agrisol'
          ? styles.contentAgrisol
          : styles.content
      }>
        <View style={
          user && user.affiliation && user.affiliation.toLowerCase() === 'agrisol'
            ? styles.logoTopContainerAgrisol
            : styles.logoTopContainer
        }>
          {user && user.affiliation && user.affiliation.toLowerCase() === 'agrisol' && (
            <Image
              source={require('@/assets/images/AgrisolLogo.png')}
              style={[styles.logo, { width: styles.logo.width * 2, height: styles.logo.height * 2 }]}
            />
          )}
          {user && user.affiliation && user.affiliation.toLowerCase() === 'melior' && (
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
            />
          )}
          {user && user.affiliation && ['agrisol', 'melior'].includes(user.affiliation.toLowerCase()) && (
            <Text style={styles.logoText}>{language === 'af' ? 'Welkom By Journal' : 'Welcome at Journal'}</Text>
          )}
        </View>
        {!(user && user.affiliation && user.affiliation.toLowerCase() === 'agrisol') && user && user.affiliation && user.affiliation.toLowerCase() !== 'melior' && (
          <View style={styles.centeredMessageContainer}>
            <Text style={styles.logoText}>
              {language === 'af' ? 'Welkom By Journal' : 'Welcome at Journal'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.bottomButtonContainer}>
        {user ? (
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.qrButtonText}>{t('welcome.getStarted')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setShowScanner(true)}
          >
            <QrCode color={theme.colors.neutral.white} size={24} />
            <Text style={styles.qrButtonText}>{t('welcome.scanQr')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function createStyles(theme: any, user: any) {
  return StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: theme.colors.background.default,
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
      // Overlay removed
  },
  languageButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  languageText: {
      color: theme.colors.neutral.white,
    marginLeft: 8,
      fontFamily: theme.fonts.medium,
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
      alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
    contentAgrisol: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 24,
      paddingTop: 40,
      paddingBottom: 40,
    },
    logoTopContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 64,
    },
    logoTopContainerAgrisol: {
      width: '100%',
    alignItems: 'center',
      marginTop: 16,
      marginBottom: 16,
    },
    centeredMessageContainer: {
      flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    bottomButtonContainer: {
      width: '100%',
      alignItems: 'center',
      position: 'absolute',
      bottom: 24,
      left: 0,
      right: 0,
    },
    logo: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    marginBottom: 16,
  },
  logoText: {
      fontFamily: theme.fonts.bold,
    fontSize: 28,
      color: theme.colors.primary.main,
    textAlign: 'center',
  },
  title: {
      fontFamily: theme.fonts.bold,
    fontSize: 36,
      color: theme.colors.primary.main,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  subtitle: {
      fontFamily: theme.fonts.regular,
    fontSize: 16,
      color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: '80%',
  },
    qrButton: {
      backgroundColor: theme.colors.primary.main,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginBottom: 16,
      marginTop: 32,
    },
    qrButtonText: {
      color: theme.colors.neutral.white,
      fontFamily: theme.fonts.medium,
      fontSize: 16,
      marginLeft: 8,
    },
    permissionText: {
      color: theme.colors.text.primary,
      fontFamily: theme.fonts.regular,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 16,
    },
    closeButton: {
      backgroundColor: theme.colors.primary.main,
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    closeButtonText: {
      color: theme.colors.neutral.white,
      fontFamily: theme.fonts.medium,
      fontSize: 16,
    },
    neutralWelcomeTopContainer: {
    width: '100%',
      alignItems: 'center',
      marginTop: 64,
      marginBottom: 16,
  },
});
}