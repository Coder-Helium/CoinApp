import {makeAutoObservable} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import { userApi } from '../services/api';

// User type
export interface User {
  id: number;
  name: string;
  email: string;
  levelOfStudy?: string;
  userType?: string;
  userCity?: string;
  userCountry?: string;
  userField?: string;
  userLanguage?: string;
  userRegions?: string;
  userUni?: string;
  createdAt?: string;
  token?: string;
}

class AuthStore {
  user: User | null = null;
  isAuthenticated = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  // Initialize: Check if user information and token exist in local storage
  async init() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');

      if (userJson && token) {
        this.user = JSON.parse(userJson);
        this.isAuthenticated = true;

        // Set global authentication state
        // @ts-ignore
        if (typeof global.setIsAuthenticated === 'function') {
          // @ts-ignore
          global.setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error initializing authentication state:', error);
    }
  }

  // Login
  async login(email: string, password: string) {
    this.loading = true;

    try {
      const result = await userApi.login(email, password);

      if (result.code === 200) {
        this.user = result.data;
        this.isAuthenticated = true;
        // console.log('result.data', result.data);
        // Save user information and token to local storage
        await AsyncStorage.setItem('user', JSON.stringify(result.data));
        await AsyncStorage.setItem('token', result.data.token);

        // Set global authentication state
        // @ts-ignore
        if (typeof global.setIsAuthenticated === 'function') {
          // @ts-ignore
          global.setIsAuthenticated(true);
        }

        return true;
      } else {
        Alert.alert('Login Failed', result.message);
        console.log(result);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Network request failed, please try again later');
      return false;
    } finally {
      this.loading = false;
    }
  }

  // Register
  async register(userData: {
    name: string;
    email: string;
    password: string;
    level_of_study: string;
    userCountry: string;
    userRegions: string;
    userCity: string;
    userField: string;
    userUni: string;
    userLanguage: string;
  }) {
    this.loading = true;

    try {
      const result = await userApi.register(userData);

      if (result.code === 200) {
        // After successful registration, do not log in automatically
        // User will need to log in manually
        Alert.alert('Registration Successful', 'Your account has been created. Please log in with your credentials.');
        return true;
      } else {
        Alert.alert('Registration Failed', result.message);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', 'Network request failed, please try again later');
      return false;
    } finally {
      this.loading = false;
    }
  }

  // Complete user profile
  async updateProfile(userId: number, profileData: Partial<{
    userCountry: string;
    userRegions: string;
    userCity: string;
    userField: string;
    levelOfStudy: string;
    userUni: string;
    userLanguage: string;
  }>) {
    this.loading = true;

    try {
      const result = await userApi.updateProfile(userId, profileData);

      if (result.code === 200) {
        // Update user info in local state
        if (this.user) {
          this.user = {...this.user, ...result.data};
          await AsyncStorage.setItem('user', JSON.stringify(this.user));
        }

        return true;
      } else {
        Alert.alert('Update Profile Failed', result.message);
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Update Profile Failed', 'Network request failed, please try again later');
      return false;
    } finally {
      this.loading = false;
    }
  }

  // Logout
  async logout() {
    try {
      // Call logout API (although it's just a client-side operation)
      await userApi.logout();
      
      // Clear local storage regardless of API result
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');

      this.user = null;
      this.isAuthenticated = false;

      // Set global logout state
      // @ts-ignore
      if (typeof global.setIsAuthenticated === 'function') {
        // @ts-ignore
        global.setIsAuthenticated(false);
      }
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  // 发送邮箱验证码
  async sendVerificationCode(email: string) {
    this.loading = true;
    
    try {
      const result = await userApi.sendVerificationCode(email);
      
      if (result.code === 200) {
        return true;
      } else {
        Alert.alert('Failed to Send', result.message || 'Failed to send verification code. Please try again later.');
        return false;
      }
    } catch (error) {
      console.error('Send verification code error:', error);
      Alert.alert('Failed to Send', 'Network request failed. Please try again later.');
      return false;
    } finally {
      this.loading = false;
    }
  }
  
  // 验证邮箱验证码
  async verifyCode(email: string, code: string) {
    this.loading = true;
    
    try {
      const result = await userApi.verifyCode(email, code);
      
      if (result.code === 200) {
        return true;
      } else {
        Alert.alert('Verification Failed', result.message || 'Failed to verify code. Please check and try again.');
        return false;
      }
    } catch (error) {
      console.error('Verify code error:', error);
      Alert.alert('Verification Failed', 'Network request failed. Please try again later.');
      return false;
    } finally {
      this.loading = false;
    }
  }
}

const authStore = new AuthStore();

export const useAuthStore = () => authStore;
