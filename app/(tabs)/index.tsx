import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { Calendar, Droplets, Sun, Wind, ClipboardList, History, CircleAlert as AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [user, setUser] = React.useState({ name: 'User', affiliation: '' });
  const [city, setCity] = React.useState('Pretoria'); // Placeholder, will be set in settings
  const [weather, setWeather] = React.useState({
    temperature: 24,
    condition: 'Sunny',
    precipitation: '0%',
    humidity: '45%',
    wind: '12 km/h',
  });
  const [loading, setLoading] = React.useState(true);

  const recentEntries = [
    { id: '1', title: 'Corn Field Inspection', date: '2023-06-15', status: 'completed' },
    { id: '2', title: 'Soil Analysis - North Field', date: '2023-06-10', status: 'pending' },
  ];

  const alerts = [
    { id: '1', title: 'Low Soil Moisture', severity: 'high', date: '2023-06-14' },
    { id: '2', title: 'Pest Detection Alert', severity: 'medium', date: '2023-06-12' },
  ];

  const theme = useTheme();

  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('account'),
      AsyncStorage.getItem('weatherCity'),
    ]).then(([account, weatherCity]) => {
      if (account) {
        try {
          const parsed = JSON.parse(account);
          setUser(parsed);
        } catch {}
      }
      if (weatherCity) setCity(weatherCity);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Header title="Journal" showNotification affiliation={user.affiliation} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.farmerName}>{user.name || 'User'}</Text>
          </View>

          <Card style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <Text style={styles.weatherTitle}>Today's Weather</Text>
              <TouchableOpacity>
                <Text style={styles.weatherLocation}>{city}, SA</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.weatherContent}>
              <View style={styles.temperatureContainer}>
                <Sun size={24} color={theme.colors.secondary.main} />
                <Text style={styles.temperature}>{weather.temperature}°C</Text>
                <Text style={styles.weatherCondition}>{weather.condition}</Text>
              </View>
              
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetail}>
                  <Droplets size={16} color={theme.colors.primary.main} />
                  <Text style={styles.weatherDetailText}>Humidity: {weather.humidity}</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Wind size={16} color={theme.colors.primary.main} />
                  <Text style={styles.weatherDetailText}>Wind: {weather.wind}</Text>
                </View>
              </View>
            </View>
          </Card>

          <View style={styles.sectionHeader}>
            <ClipboardList size={20} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentEntries.map(entry => (
            <Card key={entry.id} onPress={() => {}}>
              <View style={styles.entryItem}>
                <View>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <View style={styles.entryDetail}>
                    <Calendar size={14} color={theme.colors.text.secondary} />
                    <Text style={styles.entryDetailText}>{entry.date}</Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge, 
                  entry.status === 'completed' ? styles.completedBadge : styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    entry.status === 'completed' ? styles.completedText : styles.pendingText
                  ]}>
                    {entry.status === 'completed' ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              </View>
            </Card>
          ))}

          <View style={styles.sectionHeader}>
            <AlertCircle size={20} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {alerts.map(alert => (
            <Card key={alert.id} onPress={() => {}}>
              <View style={styles.alertItem}>
                <View style={[
                  styles.alertSeverity,
                  alert.severity === 'high' ? styles.highSeverity : styles.mediumSeverity
                ]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertDate}>{alert.date}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
      fontFamily: theme.fonts.regular,
    fontSize: 16,
      color: theme.colors.text.secondary,
  },
  farmerName: {
      fontFamily: theme.fonts.bold,
    fontSize: 24,
      color: theme.colors.text.primary,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  weatherCard: {
    marginBottom: 24,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherTitle: {
      fontFamily: theme.fonts.medium,
    fontSize: 16,
      color: theme.colors.text.primary,
  },
  weatherLocation: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.primary.main,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatureContainer: {
    flex: 1,
    alignItems: 'center',
  },
  temperature: {
      fontFamily: theme.fonts.bold,
    fontSize: 32,
      color: theme.colors.text.primary,
    marginTop: 8,
  },
  weatherCondition: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.text.secondary,
  },
  weatherDetails: {
    flex: 1,
    marginLeft: 16,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherDetailText: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.text.secondary,
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
      fontFamily: theme.fonts.medium,
    fontSize: 18,
      color: theme.colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  seeAllText: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.primary.main,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTitle: {
      fontFamily: theme.fonts.medium,
    fontSize: 16,
      color: theme.colors.text.primary,
    marginBottom: 4,
  },
  entryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryDetailText: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedBadge: {
      backgroundColor: theme.colors.success.light,
  },
  pendingBadge: {
      backgroundColor: theme.colors.warning.light,
  },
  statusText: {
      fontFamily: theme.fonts.regular,
    fontSize: 12,
  },
  completedText: {
      color: theme.colors.success.dark,
  },
  pendingText: {
      color: theme.colors.warning.dark,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertSeverity: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  highSeverity: {
      backgroundColor: theme.colors.error.main,
  },
  mediumSeverity: {
      backgroundColor: theme.colors.warning.main,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
      fontFamily: theme.fonts.medium,
    fontSize: 16,
      color: theme.colors.text.primary,
    marginBottom: 4,
  },
  alertDate: {
      fontFamily: theme.fonts.regular,
    fontSize: 14,
      color: theme.colors.text.secondary,
  },
});
}