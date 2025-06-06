import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const templates = [
  {
    key: 'general',
    name: 'General Note',
    description: 'A simple note for any observation or event. Includes title, note, and location.',
    image: require('@/assets/images/icon.png'),
  },
  {
    key: 'field',
    name: 'Field Note',
    description: 'A note specific to a field, including field name, title, note, and location.',
    image: require('@/assets/images/icon.png'),
  },
];

export default function SelectTemplateScreen() {
  const router = useRouter();

  const handleSelect = async (key: string) => {
    await AsyncStorage.setItem('lastTemplate', key);
    router.replace({ pathname: '/entry', params: { template: key } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose a Template</Text>
      </View>
      <FlatList
        data={templates}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelect(item.key)}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222B38',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#E6EAF0',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222B38',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#5A6A85',
  },
}); 