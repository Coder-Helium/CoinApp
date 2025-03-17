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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {AuthStackParamList} from '../../../App';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

// 定义响应类型
type LoginResponse = {
  success: boolean;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

// 模拟axios请求
const mockAxios = {
  post: (url: string, data: any): Promise<{data: LoginResponse}> => {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 始终返回成功
        resolve({
          data: {
            success: true,
            token: 'mock-jwt-token',
            user: {
              id: 1,
              name: 'John Doe',
              email: data.email,
            },
          },
        });
      }, 1000);
    });
  },
};

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 简单的表单验证
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);

      // 模拟API调用
      const response = await mockAxios.post('/api/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);

      // 模拟保存token到本地存储
      // 实际应用中应该使用AsyncStorage
      console.log('Token saved:', response.data.token);

      // 登录成功后重置表单
      setEmail('');
      setPassword('');

      // 修改App.tsx中的isAuthenticated状态
      // 在App.tsx中，我们需要将setIsAuthenticated函数暴露给全局
      // 添加以下代码到App.tsx:
      // global.setIsAuthenticated = setIsAuthenticated;
      
      // 尝试使用全局暴露的setIsAuthenticated函数
      // @ts-ignore
      if (typeof global.setIsAuthenticated === 'function') {
        // @ts-ignore
        global.setIsAuthenticated(true);
        console.log('Authentication state updated via global function');
      } else {
        console.log('No global setIsAuthenticated function found, using alternative method');
        
        // 如果没有全局函数，我们可以尝试直接修改App.tsx中的状态
        // 这种方法不是理想的，但在演示中可以工作
        
        // 在App.tsx中添加以下代码:
        // useEffect(() => {
        //   // 检查全局登录状态
        //   const checkGlobalAuth = setInterval(() => {
        //     if (global.isAuthenticated) {
        //       setIsAuthenticated(true);
        //       global.isAuthenticated = false;
        //       clearInterval(checkGlobalAuth);
        //     }
        //   }, 100);
        //   return () => clearInterval(checkGlobalAuth);
        // }, []);
        
        // @ts-ignore
        global.isAuthenticated = true;
        
        // 提示用户
        Alert.alert(
          'Login Successful',
          'Please restart the app to see the main screen. In a real app, this would happen automatically.',
          [
            {
              text: 'OK',
              onPress: () => {
                // 重置导航栈，回到登录页面
                // 这样用户可以再次尝试登录
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ]
        );
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>reKro</Text>
          </View>

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

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => console.log('Forgot password')}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Sign up</Text>
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
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#006400',
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#006400',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#006400',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#333',
  },
  signupLink: {
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

export default LoginScreen;
