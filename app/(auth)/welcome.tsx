import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { QrCode } from 'lucide-react-native';
import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Colors from '@/constants/Colors';

function QRScanner({ onClose, onScan }: { onClose: () => void; onScan: (data: string) => void }) {
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
  const [showScanner, setShowScanner] = useState(false);

  const handleBarCodeScanned = (data: string) => {
    setShowScanner(false);
    console.log('Scanned QR Code:', data);
  };

  if (showScanner) {
    return (
      <QRScanner
        onClose={() => setShowScanner(false)}
        onScan={handleBarCodeScanned}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.qrButton}
        onPress={() => setShowScanner(true)}
      >
        <QrCode color={Colors.neutral.white} size={32} />
        <Text style={styles.qrButtonText}>Scan QR Code</Text>
      </TouchableOpacity>
      <Text style={styles.debugText}>DEBUG: If you see this, the button is rendering!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
  },
  qrButton: {
    backgroundColor: 'purple',
    padding: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'red',
    marginBottom: 40,
  },
  qrButtonText: {
    color: 'white',
    marginLeft: 16,
    fontSize: 22,
    fontWeight: 'bold',
  },
  debugText: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionText: {
    color: Colors.neutral.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
    padding: 24,
  },
});