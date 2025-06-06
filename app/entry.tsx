import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, Image, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { saveEntry, saveMediaFile, Entry, MediaFile } from '@/lib/storage';
import { useActionSheet } from '@expo/react-native-action-sheet';

// Define templates
const templates = {
  general: {
    name: 'General Note',
    fields: [
      { id: 'title', label: 'Title', type: 'text' },
      { id: 'note', label: 'Note', type: 'multiline' },
    ],
  },
  field: {
    name: 'Field Note',
    fields: [
      { id: 'title', label: 'Title', type: 'text' },
      { id: 'field', label: 'Field', type: 'text' },
      { id: 'note', label: 'Note', type: 'multiline' },
    ],
  },
};

// Add type annotation for the Picker onValueChange callback
type TemplateKey = 'general' | 'field';

export default function EntryScreen() {
  const { id, template: templateParam } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [field, setField] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<TemplateKey>('general');
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [notes, setNotes] = useState<{ type: 'text' | 'photo'; content: string }[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to create an entry.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let id = await AsyncStorage.getItem('accountId');
      if (!id) {
        const userStr = await AsyncStorage.getItem('account');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            id = user.accountId;
          } catch {}
        }
      }
      setAccountId(id);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (templateParam && (templateParam === 'general' || templateParam === 'field')) {
        setTemplate(templateParam as TemplateKey);
        await AsyncStorage.setItem('lastTemplate', templateParam as string);
      } else {
        const last = await AsyncStorage.getItem('lastTemplate');
        if (last === 'general' || last === 'field') {
          setTemplate(last);
        } else {
          router.replace('/select-template');
        }
      }
    })();
  }, [templateParam]);

  const handleCaptureMedia = async (type: 'photo' | 'video' | 'audio') => {
    try {
      let result;
      
      if (type === 'photo') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
        });
      } else if (type === 'video') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required to record videos.');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          quality: 0.8,
          videoMaxDuration: 60,
        });
      } else {
        // Audio recording would go here
        // You'll need to implement audio recording using expo-av
        return;
      }

      if (!result.canceled && result.assets[0]) {
        const mediaFile = await saveMediaFile(result.assets[0].uri, type);
        setMedia(prev => [...prev, mediaFile]);
        if (type === 'photo') {
          setNotes(prev => [...prev, { type: 'photo', content: mediaFile.uri }]);
        }
      }
    } catch (error) {
      console.error('Error capturing media:', error);
      Alert.alert('Error', 'Failed to capture media');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    if (!accountId) {
      Alert.alert('Error', 'No account linked. Please scan your QR code.');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location is required');
      return;
    }

    setLoading(true);

    try {
      const entryData = {
        title,
        note,
        field,
        template,
        accountId,
        timestamp: new Date().toISOString(),
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        media,
      };

      await saveEntry(entryData);
      router.back();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = () => {
    router.push('/select-template');
  };

  const handleSendNote = () => {
    if (note.trim()) {
      setNotes(prev => [...prev, { type: 'text', content: note.trim() }]);
      setNote('');
    }
  };

  const handleNoteInputKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.shiftKey) {
      e.preventDefault?.();
      handleSendNote();
    }
  };

  const handleMorePress = () => {
    const options = ['Switch Template', 'Cancel'];
    const cancelButtonIndex = 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          router.push('/select-template');
        }
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background.default }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {title ? (
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
              {title.length > 24 ? title.slice(0, 24) + '...' : title}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={handleMorePress} style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveButton}>
          <Text style={[styles.saveButtonText, { color: theme.colors.primary.main }]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title and pin row */}
      <View style={styles.titleRow}>
        {isEditingTitle ? (
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.divider }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
              placeholderTextColor={theme.colors.text.hint}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={styles.titleHeading}>{title}</Text>
            <TouchableOpacity onPress={() => setIsEditingTitle(true)} style={styles.editButton}>
              <Ionicons name="pencil" size={20} color={theme.colors.primary.main} />
            </TouchableOpacity>
            {location && (
              <TouchableOpacity style={[styles.pinButton, { marginTop: -5, marginLeft: 8 }] }>
                <Ionicons name="location-sharp" size={32} color={theme.colors.primary.main} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Field for field template */}
      {template === 'field' && (
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Field</Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.divider }]}
            value={field}
            onChangeText={setField}
            placeholder="Enter field"
            placeholderTextColor={theme.colors.text.hint}
          />
        </View>
      )}

      {/* Conversation area for notes */}
      <ScrollView style={styles.conversation} contentContainerStyle={{ padding: 8 }}>
        {notes.map((msg, idx) => (
          <View key={idx} style={styles.bubbleRow}>
            <View style={styles.bubble}>
              {msg.type === 'text' ? (
                <Text style={styles.bubbleText}>{msg.content}</Text>
              ) : (
                <Image source={{ uri: msg.content }} style={styles.bubbleImage} />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Note input at the bottom */}
      <View style={styles.noteInputRow}>
        <TouchableOpacity 
          style={[styles.noteMediaButton, { backgroundColor: theme.colors.primary.main, marginRight: 8 }]}
          onPress={async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
              allowsEditing: false,
            });
            if (!result.canceled && result.assets[0]) {
              const mediaFile = await saveMediaFile(result.assets[0].uri, 'photo');
              setMedia(prev => [...prev, mediaFile]);
              setNotes(prev => [...prev, { type: 'photo', content: mediaFile.uri }]);
            }
          }}
        >
          <Ionicons name="add" size={22} color={theme.colors.neutral.white} />
        </TouchableOpacity>
        <TextInput
          style={[styles.noteInput, { color: theme.colors.text.primary, borderColor: theme.colors.divider }]}
          value={note}
          onChangeText={setNote}
          placeholder="Enter note"
          placeholderTextColor={theme.colors.text.hint}
          multiline
          onKeyPress={handleNoteInputKeyPress}
        />
        <TouchableOpacity 
          style={[styles.noteMediaButton, { backgroundColor: theme.colors.primary.main, marginLeft: 8 }]}
          onPress={() => handleCaptureMedia('audio')}
        >
          <MaterialCommunityIcons name="microphone" size={22} color={theme.colors.neutral.white} />
        </TouchableOpacity>
      </View>

      {/* Media preview below note input */}
      {media.length > 0 && (
        <View style={styles.mediaPreview}>
          {media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              {item.type === 'photo' && (
                <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
              )}
              {item.type === 'audio' && (
                <View style={[styles.mediaThumbnail, { backgroundColor: theme.colors.primary.light }]}> 
                  <MaterialCommunityIcons name="microphone" size={24} color={theme.colors.neutral.white} />
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.whiteBottom} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  templateSelector: {
    marginBottom: 16,
  },
  picker: {
    marginTop: 8,
    height: 50,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    marginTop: 16,
  },
  locationText: {
    fontSize: 14,
  },
  mediaContainer: {
    marginTop: 16,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  mediaButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  mediaItem: {
    margin: 4,
  },
  mediaThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  noteMediaColumn: {
    marginLeft: 8,
    justifyContent: 'flex-end',
  },
  noteMediaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pinButton: {
    marginLeft: 12,
    marginTop: 18,
    padding: 4,
  },
  conversation: {
    flex: 1,
    minHeight: 120,
    maxHeight: '60%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginBottom: 64,
  },
  bubbleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  bubble: {
    backgroundColor: '#DCF8C6',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    maxWidth: '80%',
  },
  bubbleText: {
    fontSize: 16,
    color: '#222B38',
  },
  noteInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 16,
    paddingTop: 16,
  },
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
    marginRight: 8,
  },
  bubbleImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  whiteBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    flex: 1,
    justifyContent: 'center',
  },
  editButton: {
    marginLeft: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 6,
  },
  titleHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222B38',
    flex: 1,
    textAlign: 'center',
  },
  moreButton: {
    marginRight: 8,
  },
}); 