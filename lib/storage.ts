import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Types
export interface MediaFile {
  uri: string;
  type: 'photo' | 'video' | 'audio';
  filename: string;
}

export interface Entry {
  id: string;
  title: string;
  note: string;
  field?: string;
  template: 'general' | 'field';
  accountId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  media?: MediaFile[];
  synced: boolean;
}

// Storage keys
const ENTRIES_KEY = '@entries';
const MEDIA_DIR = `${FileSystem.documentDirectory}media/`;

// Ensure media directory exists
const ensureMediaDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(MEDIA_DIR, { intermediates: true });
  }
};

// Save a media file and return its local URI
export const saveMediaFile = async (uri: string, type: 'photo' | 'video' | 'audio'): Promise<MediaFile> => {
  await ensureMediaDir();
  
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${type === 'photo' ? 'jpg' : type === 'video' ? 'mp4' : 'm4a'}`;
  const destination = `${MEDIA_DIR}${filename}`;
  
  await FileSystem.copyAsync({
    from: uri,
    to: destination
  });

  return {
    uri: destination,
    type,
    filename
  };
};

// Save an entry
export const saveEntry = async (entry: Omit<Entry, 'id' | 'synced'>): Promise<Entry> => {
  const entries = await getEntries();
  const newEntry: Entry = {
    ...entry,
    id: Date.now().toString(),
    synced: false
  };
  
  entries.push(newEntry);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  
  return newEntry;
};

// Get all entries
export const getEntries = async (): Promise<Entry[]> => {
  const entriesJson = await AsyncStorage.getItem(ENTRIES_KEY);
  return entriesJson ? JSON.parse(entriesJson) : [];
};

// Get unsynced entries
export const getUnsyncedEntries = async (): Promise<Entry[]> => {
  const entries = await getEntries();
  return entries.filter(entry => !entry.synced);
};

// Mark entries as synced
export const markEntriesAsSynced = async (entryIds: string[]): Promise<void> => {
  const entries = await getEntries();
  const updatedEntries = entries.map(entry => 
    entryIds.includes(entry.id) ? { ...entry, synced: true } : entry
  );
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
};

// Delete an entry and its media files
export const deleteEntry = async (entryId: string): Promise<void> => {
  const entries = await getEntries();
  const entry = entries.find(e => e.id === entryId);
  
  if (entry?.media) {
    // Delete media files
    await Promise.all(
      entry.media.map(media => FileSystem.deleteAsync(media.uri, { idempotent: true }))
    );
  }
  
  const updatedEntries = entries.filter(e => e.id !== entryId);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
}; 