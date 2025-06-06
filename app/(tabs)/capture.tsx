import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
  Image
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import Colors from '@/constants/Colors';
import { Camera as FlipCamera, Camera, X, Check } from 'lucide-react-native';
import { router } from 'expo-router';

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.Back);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const toggleCameraType = () => {
    setCameraType(current => (
      current === CameraType.Back ? CameraType.Front : CameraType.Back
    ));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
      console.error(error);
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const savePhoto = () => {
    // In a real app, you would save the photo to storage or state
    Alert.alert(
      'Photo Saved',
      'Your photo has been attached to the entry',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  // If camera permissions aren't granted
  if (!permission || !permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need camera permissions to take photos
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If photo is taken, show preview
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        
        <View style={styles.photoControls}>
          <TouchableOpacity 
            style={[styles.photoButton, styles.cancelButton]}
            onPress={retakePicture}
          >
            <X size={24} color={Colors.neutral.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.photoButton, styles.saveButton]}
            onPress={savePhoto}
          >
            <Check size={24} color={Colors.neutral.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
      >
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleCancel}
        >
          <X size={24} color={Colors.neutral.white} />
        </TouchableOpacity>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.flipButton}
            onPress={toggleCameraType}
          >
            <FlipCamera size={24} color={Colors.neutral.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <View style={styles.spacer} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: Platform.OS === 'ios' ? 48 : 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 48 : 16,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    borderRadius: 30,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.neutral.white,
  },
  spacer: {
    width: 56,
    height: 56,
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  photoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 48 : 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  photoButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.error.main,
  },
  saveButton: {
    backgroundColor: Colors.success.main,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  permissionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.neutral.white,
  },
});