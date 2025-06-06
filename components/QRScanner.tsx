import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Colors from '@/constants/Colors';

interface QRScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export default function QRScanner({ onClose, onScan }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

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
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.default },
  closeButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 8,
    zIndex: 1,
  },
  closeButtonText: {
    color: Colors.neutral.white,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  permissionText: {
    color: Colors.neutral.white,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
    padding: 24,
  },
}); 