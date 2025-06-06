import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { Save, ChevronDown, Camera } from 'lucide-react-native';
import { router } from 'expo-router';

// Form field types
type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'photo';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  value: any;
}

// TODO: Replace with real user state/context
const user = { affiliation: 'melior' };

export default function NewEntryScreen() {
  // Sample form fields based on agricultural data collection needs
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: 'farmName',
      type: 'text',
      label: 'Farm Name',
      placeholder: 'Enter farm name',
      required: true,
      value: '',
    },
    {
      id: 'fieldLocation',
      type: 'text',
      label: 'Field Location',
      placeholder: 'Enter field location or coordinates',
      required: true,
      value: '',
    },
    {
      id: 'date',
      type: 'date',
      label: 'Date of Inspection',
      required: true,
      value: new Date().toISOString().split('T')[0],
    },
    {
      id: 'cropType',
      type: 'dropdown',
      label: 'Crop Type',
      required: true,
      options: ['Corn', 'Wheat', 'Soybean', 'Cotton', 'Other'],
      value: '',
    },
    {
      id: 'growthStage',
      type: 'dropdown',
      label: 'Growth Stage',
      options: ['Germination', 'Seedling', 'Vegetative', 'Reproductive', 'Maturity'],
      value: '',
    },
    {
      id: 'soilMoisture',
      type: 'dropdown',
      label: 'Soil Moisture',
      options: ['Dry', 'Slightly Moist', 'Moist', 'Wet', 'Saturated'],
      value: '',
    },
    {
      id: 'pestPresence',
      type: 'checkbox',
      label: 'Pest Presence Detected',
      value: false,
    },
    {
      id: 'pestType',
      type: 'text',
      label: 'Pest Type (if detected)',
      placeholder: 'Describe the pest observed',
      value: '',
    },
    {
      id: 'diseasePresence',
      type: 'checkbox',
      label: 'Disease Presence Detected',
      value: false,
    },
    {
      id: 'diseaseType',
      type: 'text',
      label: 'Disease Type (if detected)',
      placeholder: 'Describe the disease observed',
      value: '',
    },
    {
      id: 'notes',
      type: 'text',
      label: 'Additional Notes',
      placeholder: 'Enter any additional observations',
      value: '',
    },
    {
      id: 'photo',
      type: 'photo',
      label: 'Field Photo',
      value: null,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleInputChange = (id: string, value: any) => {
    setFormFields(fields =>
      fields.map(field =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const selectDropdownOption = (fieldId: string, option: string) => {
    handleInputChange(fieldId, option);
    setDropdownOpen(null);
  };

  const validateForm = () => {
    const requiredFields = formFields.filter(field => field.required);
    const emptyRequiredFields = requiredFields.filter(field => {
      if (typeof field.value === 'string') return !field.value.trim();
      return field.value === null || field.value === undefined;
    });

    if (emptyRequiredFields.length > 0) {
      const fieldNames = emptyRequiredFields.map(field => field.label).join(', ');
      Alert.alert('Missing Information', `Please fill in the following required fields: ${fieldNames}`);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call to submit data
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Your farm data has been submitted successfully',
        [
          { 
            text: 'OK', 
            onPress: () => router.push('/(tabs)/')
          }
        ]
      );
    }, 1500);
  };

  const handleTakePhoto = () => {
    router.push('/(tabs)/capture');
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <View style={styles.field} key={field.id}>
            <Text style={styles.label}>
              {field.label} {field.required && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={value => handleInputChange(field.id, value)}
            />
          </View>
        );
      
      case 'number':
        return (
          <View style={styles.field} key={field.id}>
            <Text style={styles.label}>
              {field.label} {field.required && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={value => handleInputChange(field.id, value)}
              keyboardType="numeric"
            />
          </View>
        );
      
      case 'date':
        return (
          <View style={styles.field} key={field.id}>
            <Text style={styles.label}>
              {field.label} {field.required && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={value => handleInputChange(field.id, value)}
              placeholder="YYYY-MM-DD"
            />
          </View>
        );
      
      case 'dropdown':
        return (
          <View style={styles.field} key={field.id}>
            <Text style={styles.label}>
              {field.label} {field.required && <Text style={styles.required}>*</Text>}
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => toggleDropdown(field.id)}
            >
              <Text style={field.value ? styles.dropdownText : styles.dropdownPlaceholder}>
                {field.value || `Select ${field.label}`}
              </Text>
              <ChevronDown size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
            
            {dropdownOpen === field.id && (
              <View style={styles.dropdownOptions}>
                {field.options?.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => selectDropdownOption(field.id, option)}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      option === field.value && styles.dropdownOptionSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      
      case 'checkbox':
        return (
          <View style={styles.checkboxField} key={field.id}>
            <Text style={styles.checkboxLabel}>{field.label}</Text>
            <Switch
              value={field.value}
              onValueChange={value => handleInputChange(field.id, value)}
              trackColor={{ false: Colors.neutral.light, true: Colors.primary.light }}
              thumbColor={field.value ? Colors.primary.main : Colors.neutral.white}
            />
          </View>
        );
      
      case 'photo':
        return (
          <View style={styles.field} key={field.id}>
            <Text style={styles.label}>{field.label}</Text>
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={handleTakePhoto}
            >
              <Camera size={24} color={Colors.primary.main} />
              <Text style={styles.photoButtonText}>
                {field.value ? 'Change Photo' : 'Take Photo'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="New Entry" showBack affiliation={user.affiliation} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Farm Data Collection</Text>
            <Text style={styles.subtitle}>Please fill in the details below</Text>
            
            {formFields.map(renderField)}
            
            <View style={styles.buttonContainer}>
              <Button
                title="Save Entry"
                onPress={handleSubmit}
                loading={loading}
                icon={<Save size={20} color={Colors.neutral.white} />}
                size="large"
                style={styles.submitButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: Colors.error.main,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.default,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.default,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  dropdownPlaceholder: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  dropdownOptions: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    backgroundColor: Colors.background.default,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1000,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  dropdownOptionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  dropdownOptionSelected: {
    color: Colors.primary.main,
    fontFamily: 'Montserrat-Medium',
  },
  checkboxField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary.main,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.default,
  },
  photoButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.primary.main,
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
  submitButton: {
    width: '100%',
  },
});