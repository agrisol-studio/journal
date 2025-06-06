import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { User, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg' }}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
          <View style={styles.logoWrapper}>
            <Text style={styles.logoText}>Agrisol Journal</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <User color={Colors.primary.main} size={20} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock color={Colors.primary.main} size={20} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(17, 140, 79, 0.7)', // Semi-transparent green
  },
  logoWrapper: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  logoText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.primary.main,
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    backgroundColor: Colors.background.default,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.primary.main,
  },
  loginButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.neutral.white,
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  registerLink: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.primary.main,
  },
  errorContainer: {
    backgroundColor: Colors.error.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.error.dark,
  },
});