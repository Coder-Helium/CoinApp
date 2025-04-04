import {makeAutoObservable} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import { mockLoginResponse } from '../services/mock/login';

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
    //   const response = await fetch('http://localhost:8080/user/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email,
    //       password,
    //     }),
    //   });

      // const result = await response.json();
      const result = mockLoginResponse(email, password);

      if (result.code === 200) {
        this.user = result.data;
        this.isAuthenticated = true;

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
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.code === 200) {
        // After successful registration, do not log in automatically, user needs to log in manually
        Alert.alert('Registration Successful', 'Please log in with your email and password');
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
      // 获取token
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`http://localhost:8080/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (result.code === 200) {
        // 更新本地用户信息
        if (this.user) {
          this.user = {...this.user, ...result.data};
          await AsyncStorage.setItem('user', JSON.stringify(this.user));
        }

        return true;
      } else {
        Alert.alert('Update profile failed', result.message);
        return false;
      }
    } catch (error) {
      console.error('update profile error:', error);
      Alert.alert('update profile failed', 'network request failed, please try again later');
      return false;
    } finally {
      this.loading = false;
    }
  }

  // Logout
  async logout() {
    try {
      // 清除本地存储
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');

      this.user = null;
      this.isAuthenticated = false;

      // 设置全局登出状态
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
}

const authStore = new AuthStore();

export const useAuthStore = () => authStore;
