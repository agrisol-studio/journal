import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [field, setField] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<TemplateKey>('general');

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
    AsyncStorage.getItem('accountId').then(setAccountId);
  }, []);

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
      };

      // For now, just log the entry data
      console.log('Entry data:', entryData);
      
      // TODO: Save entry data to your backend when ready
      
      router.back();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          {id ? 'Edit Entry' : 'New Entry'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveButton}>
          <Text style={[styles.saveButtonText, { color: theme.colors.primary.main }]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.templateSelector}>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Template</Text>
          <Picker
            selectedValue={template}
            onValueChange={(value: string) => setTemplate(value as TemplateKey)}
            style={[styles.picker, { color: theme.colors.text.primary, backgroundColor: theme.colors.background.paper }]}
          >
            {Object.entries(templates).map(([key, t]) => (
              <Picker.Item key={key} label={t.name} value={key} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Title</Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.divider }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            placeholderTextColor={theme.colors.text.hint}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Note</Text>
          <TextInput
            style={[styles.textArea, { color: theme.colors.text.primary, borderColor: theme.colors.divider }]}
            value={note}
            onChangeText={setNote}
            placeholder="Enter note"
            placeholderTextColor={theme.colors.text.hint}
            multiline
            numberOfLines={4}
          />
        </View>

        {location && (
          <View style={styles.locationContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>Location</Text>
            <Text style={[styles.locationText, { color: theme.colors.text.secondary }]}>
              Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
}); 