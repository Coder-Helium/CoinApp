import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {AuthStackParamList} from '../../../App';
import {useAuthStore} from '../../hooks/useAuthStore';
import {observer} from 'mobx-react-lite';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;
// todo: profile页面要加个返回按钮
const SignupScreen = observer(() => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const authStore = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      countdownTimer.current = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(countdownTimer.current as NodeJS.Timeout);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    };
  }, [countdown]);

  const handleSendVerificationCode = async () => {
    // Validate all fields before sending verification code
    if (!password.trim() || !confirmPassword.trim() || !name.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    try {
      setSendingCode(true);
      // Call API to send verification code
      const success = await authStore.sendVerificationCode(email);

      if (success) {
        setCountdown(60); // Start 60 second countdown
        Alert.alert('Success', 'Verification code has been sent to your email');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again later');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSignup = async () => {
    // Form validation
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !name.trim() || !verificationCode.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit verification code');
      return;
    }

    try {
      // Verify the code
      const isVerified = await authStore.verifyCode(email, verificationCode);
      
      if (!isVerified) {
        return; // Verification failed, authStore has already shown an error message
      }
      
      // Verification successful, prepare user data
      const userData = {
        name: name,
        email: email,
        password: password,
        level_of_study: '', // These fields will be set in ProfileSetup
        userCountry: '',
        userRegions: '',
        userCity: '',
        userField: '',
        userUni: '',
        userLanguage: '',
      };

      // Save registration data without calling the register API
      await AsyncStorage.setItem('temp_signup_data', JSON.stringify(userData));
      navigation.navigate('ProfileSetup');
    } catch (error) {
      console.error('Error during signup process:', error);
      Alert.alert('Error', 'An error occurred during signup. Please try again later');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView contentContainerStyle={styles.scrollView}>

          <Text style={styles.subtitle}>Please fill in the following information to create your account</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <Text style={styles.passwordHint}>Password must be at least 8 characters</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.verificationContainer}>
              <View style={styles.verificationInputContainer}>
                <TextInput
                  style={styles.verificationInput}
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.sendCodeButton,
                  (countdown > 0 || sendingCode) && styles.disabledButton,
                ]}
                onPress={handleSendVerificationCode}
                disabled={countdown > 0 || sendingCode}>
                {sendingCode ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendCodeButtonText}>
                    {countdown > 0 ? `${countdown} seconds` : 'Send Code'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              disabled={authStore.loading}>
              {authStore.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signupButtonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityContainer}>
              <Text style={styles.securityText}>Security by</Text>
              <Image
                source={require('../../../src/assets/security.png')}
                style={styles.securityIcon}
              />
              <Text style={styles.securityText}>Provider</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: '#006400',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#333',
  },
  loginLink: {
    fontSize: 14,
    color: '#006400',
    fontWeight: 'bold',
  },
  securityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#999',
  },
  securityIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 5,
  },
  verificationContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  verificationInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  verificationInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendCodeButton: {
    backgroundColor: '#006400',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: 100,
  },
  sendCodeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});

export default SignupScreen;
