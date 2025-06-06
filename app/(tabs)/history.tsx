import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  FlatList,
} from 'react-native';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { Search, Calendar, MapPin, Filter, SlidersHorizontal } from 'lucide-react-native';

// Mock data for demonstration
interface Entry {
  id: string;
  title: string;
  date: string;
  location: string;
  cropType: string;
  status: 'completed' | 'pending' | 'syncing';
}

const mockEntries: Entry[] = [
  {
    id: '1',
    title: 'North Field Inspection',
    date: '2023-06-15',
    location: 'North Field, Sector A',
    cropType: 'Corn',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Soil Analysis - East Field',
    date: '2023-06-10',
    location: 'East Field, Sector B',
    cropType: 'Wheat',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Irrigation Check',
    date: '2023-06-05',
    location: 'South Field, Sector C',
    cropType: 'Soybean',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Pest Control Assessment',
    date: '2023-06-01',
    location: 'West Field, Sector D',
    cropType: 'Cotton',
    status: 'pending',
  },
  {
    id: '5',
    title: 'Fertilizer Application Check',
    date: '2023-05-28',
    location: 'Central Field, Sector E',
    cropType: 'Corn',
    status: 'syncing',
  },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>(mockEntries);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // TODO: Replace with real user state/context
  const user = { affiliation: 'melior' };

  // Filter entries based on search query
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(entry => {
        const searchableText = 
          `${entry.title} ${entry.location} ${entry.cropType}`.toLowerCase();
        return searchableText.includes(text.toLowerCase());
      });
      setFilteredEntries(filtered);
    }
  };

  const handleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    
    // Apply filtering logic based on selected filter
    let filtered = [...entries];
    
    if (filter === 'completed' && activeFilter !== 'completed') {
      filtered = entries.filter(entry => entry.status === 'completed');
    } else if (filter === 'pending' && activeFilter !== 'pending') {
      filtered = entries.filter(entry => entry.status === 'pending' || entry.status === 'syncing');
    } else if (filter === 'newest' && activeFilter !== 'newest') {
      filtered = [...entries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (filter === 'oldest' && activeFilter !== 'oldest') {
      filtered = [...entries].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
    
    setFilteredEntries(filtered);
  };

  const getStatusStyle = (status: Entry['status']) => {
    switch (status) {
      case 'completed':
        return {
          container: styles.completedStatus,
          text: styles.completedText,
        };
      case 'pending':
        return {
          container: styles.pendingStatus,
          text: styles.pendingText,
        };
      case 'syncing':
        return {
          container: styles.syncingStatus,
          text: styles.syncingText,
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  };

  const renderEntryItem = ({ item }: { item: Entry }) => {
    const statusStyle = getStatusStyle(item.status);
    
    return (
      <Card onPress={() => {}}>
        <View style={styles.entryItemContainer}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>{item.title}</Text>
            <View style={[styles.statusContainer, statusStyle.container]}>
              <Text style={[styles.statusText, statusStyle.text]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.entryDetails}>
            <View style={styles.entryDetail}>
              <Calendar size={16} color={Colors.text.secondary} />
              <Text style={styles.entryDetailText}>{item.date}</Text>
            </View>
            <View style={styles.entryDetail}>
              <MapPin size={16} color={Colors.text.secondary} />
              <Text style={styles.entryDetailText}>{item.location}</Text>
            </View>
          </View>
          
          <View style={styles.cropTag}>
            <Text style={styles.cropTagText}>{item.cropType}</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="History" 
        rightComponent={
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        }
        affiliation={user.affiliation}
      />
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        
        {showFilters && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            <TouchableOpacity 
              style={[
                styles.filterChip,
                activeFilter === 'completed' && styles.activeFilterChip
              ]}
              onPress={() => handleFilter('completed')}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === 'completed' && styles.activeFilterText
              ]}>
                Completed
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterChip,
                activeFilter === 'pending' && styles.activeFilterChip
              ]}
              onPress={() => handleFilter('pending')}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === 'pending' && styles.activeFilterText
              ]}>
                Pending/Syncing
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterChip,
                activeFilter === 'newest' && styles.activeFilterChip
              ]}
              onPress={() => handleFilter('newest')}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === 'newest' && styles.activeFilterText
              ]}>
                Newest First
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterChip,
                activeFilter === 'oldest' && styles.activeFilterChip
              ]}
              onPress={() => handleFilter('oldest')}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === 'oldest' && styles.activeFilterText
              ]}>
                Oldest First
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        
        <View style={styles.listHeader}>
          <Text style={styles.resultsText}>
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
          </Text>
        </View>
        
        <FlatList
          data={filteredEntries}
          renderItem={renderEntryItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        
        {filteredEntries.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No entries found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingRight: 16,
  },
  filterChip: {
    backgroundColor: Colors.background.paper,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary.main,
  },
  filterChipText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  activeFilterText: {
    color: Colors.neutral.white,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  listContent: {
    paddingBottom: 16,
  },
  entryItemContainer: {
    position: 'relative',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },
  completedStatus: {
    backgroundColor: Colors.success.light,
  },
  completedText: {
    color: Colors.success.dark,
  },
  pendingStatus: {
    backgroundColor: Colors.warning.light,
  },
  pendingText: {
    color: Colors.warning.dark,
  },
  syncingStatus: {
    backgroundColor: Colors.info.light,
  },
  syncingText: {
    color: Colors.info.dark,
  },
  entryDetails: {
    marginBottom: 8,
  },
  entryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryDetailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  cropTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cropTagText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: Colors.neutral.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});