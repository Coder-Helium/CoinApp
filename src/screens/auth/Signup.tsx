import React, {useState} from 'react';
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {AuthStackParamList} from '../../../App';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // API call for signup should be here
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Signup', {email, password});
    // After successful signup, navigate to profile setup
    navigation.navigate('ProfileSetup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Your Account</Text>
          </View>

          <Text style={styles.subtitle}>Please fill in the information below to create your account</Text>

          <View style={styles.formContainer}>
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

            <Text style={styles.passwordHint}>Password must contain at least 8 characters</Text>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Continue</Text>
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
                source={require('../../../src/assets/icons/security.png')}
                style={styles.securityIcon}
              />
              <Text style={styles.securityText}>Provider</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
});

export default SignupScreen;
