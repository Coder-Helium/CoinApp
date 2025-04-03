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
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await userApi.getCountries();
        setCountries(data || []);
      } catch (error) {
        console.error('获取国家列表失败:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchCountries();
  }, []);

  // 当选择国家后获取地区列表
  useEffect(() => {
    if (country) {
      const fetchRegions = async () => {
        setLoadingData(true);
        try {
          // 假设country存储的是国家代码
          const data = await userApi.getRegions(country);
          setRegions(data || []);
        } catch (error) {
          console.error('获取地区列表失败:', error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchRegions();
    }
  }, [country]);

  const handleComplete = async () => {
    // 验证必填字段
    if (!country || !region || !city || !fieldOfStudy || !levelOfStudy || !university || !language) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }

    setLoading(true);
    try {
      // 构建个人资料数据
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
      if (!authStore.user?.id) {
        // 这里应该不会发生，因为通常个人资料设置是在注册后、登录前
        // 我们可以先登录获取ID
        Alert.alert('错误', '请先登录后再完善个人资料');
        navigation.navigate('Login');
        return;
      }

      const success = await authStore.updateProfile(authStore.user.id, profileData);

      if (success) {
        Alert.alert('成功', '个人资料已更新');
        // 完成后可以导航到主页面
        // 此时App.tsx会检测到认证状态变化并显示主标签导航
      }
    } catch (error) {
      console.error('完善个人资料错误:', error);
      Alert.alert('错误', '更新个人资料时发生错误');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
        <Text style={styles.loadingText}>加载数据中...</Text>
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
            <Text style={styles.headerTitle}>完善您的个人资料</Text>
          </View>

          <Text style={styles.subtitle}>请填写以下信息完善您的个人资料</Text>

          <View style={styles.formContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>当前国家</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="选择您的当前国家"
                  value={country}
                  onChangeText={setCountry}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>当前地区</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="选择您的当前地区"
                  value={region}
                  onChangeText={setRegion}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>目标城市</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="选择您的目标城市"
                  value={city}
                  onChangeText={setCity}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>学习领域</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="选择您的学习领域"
                  value={fieldOfStudy}
                  onChangeText={setFieldOfStudy}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>学习阶段</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="选择您的学习阶段"
                  value={levelOfStudy}
                  onChangeText={setLevelOfStudy}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>大学/学校</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="选择您的大学或学校"
                  value={university}
                  onChangeText={setUniversity}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>首选语言</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="选择您的首选语言"
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
                <Text style={styles.completeButtonText}>完成个人资料</Text>
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
