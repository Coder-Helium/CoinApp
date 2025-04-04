import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
import {userApi} from '../../services/api';

type ProfileSetupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ProfileSetup'
>;

const ProfileSetupScreen = observer(() => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const authStore = useAuthStore();
  
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [levelOfStudy, setLevelOfStudy] = useState('');
  const [university, setUniversity] = useState('');
  const [language, setLanguage] = useState('');
  
  const [_countries, setCountries] = useState<Array<{code: string, name: string}>>([]);
  const [_regions, setRegions] = useState<Array<{code: string, name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // 加载国家列表
  // Load country list
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await userApi.getCountries();
        setCountries(data || []);
      } catch (error) {
        console.error('获取国家列表失败:', error);
        console.error('Failed to get country list:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchCountries();
  }, []);

  // 当选择国家后获取地区列表
  // Get region list after selecting a country
  useEffect(() => {
    if (country) {
      const fetchRegions = async () => {
        setLoadingData(true);
        try {
          // 假设country存储的是国家代码
          // Assume country stores the country code
          const data = await userApi.getRegions(country);
          setRegions(data || []);
        } catch (error) {
          console.error('获取地区列表失败:', error);
          console.error('Failed to get region list:', error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchRegions();
    }
  }, [country]);

  const handleComplete = async () => {
    // 验证必填字段
    // Validate required fields
    if (!country || !region || !city || !fieldOfStudy || !levelOfStudy || !university || !language) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // 构建个人资料数据
      // Build profile data
      const profileData = {
        userCountry: country,
        userRegions: region,
        userCity: city,
        userField: fieldOfStudy,
        levelOfStudy,
        userUni: university,
        userLanguage: language,
      };

      // 检查是否有当前用户ID
      // Check if there is a current user ID
      if (!authStore.user?.id) {
        // 这里应该不会发生，因为通常个人资料设置是在注册后、登录前
        // This should not happen, as profile setup is usually done after registration but before login
        Alert.alert('Error', 'Please login first before completing your profile');
        navigation.navigate('Login');
        return;
      }

      const success = await authStore.updateProfile(authStore.user.id, profileData);

      if (success) {
        Alert.alert('Success', 'Your profile has been updated');
        // 完成后可以导航到主页面
        // After completion, can navigate to main page
        // 此时App.tsx会检测到认证状态变化并显示主标签导航
        // At this point, App.tsx will detect authentication state change and display main tab navigation
      }
    } catch (error) {
      console.error('完善个人资料错误:', error);
      console.error('Error completing profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.headerTitle}>Complete Your Profile</Text>
          </View>

          <Text style={styles.subtitle}>Please fill in the following information to complete your profile</Text>

          <View style={styles.formContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Current Country</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your current country"
                  value={country}
                  onChangeText={setCountry}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Current Region</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your current region"
                  value={region}
                  onChangeText={setRegion}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Target City</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your target city"
                  value={city}
                  onChangeText={setCity}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Field of Study</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your field of study"
                  value={fieldOfStudy}
                  onChangeText={setFieldOfStudy}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Level of Study</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your level of study"
                  value={levelOfStudy}
                  onChangeText={setLevelOfStudy}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>University/School</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your university or school"
                  value={university}
                  onChangeText={setUniversity}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Preferred Language</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your preferred language"
                  value={language}
                  onChangeText={setLanguage}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.completeButtonText}>Complete Profile</Text>
              )}
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#006400',
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
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 50,
  },
  selectInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  selectArrow: {
    paddingHorizontal: 15,
    fontSize: 12,
    color: '#666',
  },
  completeButton: {
    backgroundColor: '#006400',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileSetupScreen;
