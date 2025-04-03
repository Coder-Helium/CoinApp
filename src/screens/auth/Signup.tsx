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
import {useAuthStore} from '../../hooks/useAuthStore';
import {observer} from 'mobx-react-lite';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen = observer(() => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const authStore = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async () => {
    // 表单验证
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !name.trim()) {
      Alert.alert('错误', '请填写所有必填字段');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('错误', '两次输入的密码不匹配');
      return;
    }

    if (password.length < 8) {
      Alert.alert('错误', '密码至少需要8个字符');
      return;
    }

    // 用户注册只有基本信息，其他信息需要在个人资料设置页面填写
    try {
      const userData = {
        name: name,
        email: email,
        password: password,
        level_of_study: "", // 这些字段将在ProfileSetup中设置
        userCountry: "",
        userRegions: "",
        userCity: "",
        userField: "",
        userUni: "",
        userLanguage: "",
      };
      
      const success = await authStore.register(userData);
      
      if (success) {
        // 注册成功后导航到个人资料设置页面
        navigation.navigate('ProfileSetup');
      }
    } catch (error) {
      console.error('注册错误:', error);
      Alert.alert('注册失败', '发生错误，请稍后重试');
    }
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
            <Text style={styles.headerTitle}>创建您的账户</Text>
          </View>

          <Text style={styles.subtitle}>请填写以下信息创建您的账户</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="姓名"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="邮箱"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="确认密码"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <Text style={styles.passwordHint}>密码必须至少包含8个字符</Text>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              disabled={authStore.loading}>
              {authStore.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signupButtonText}>继续</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>已有账号? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>登录</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityContainer}>
              <Text style={styles.securityText}>安全由</Text>
              <Image
                source={require('../../../src/assets/icons/security.png')}
                style={styles.securityIcon}
              />
              <Text style={styles.securityText}>提供</Text>
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
});

export default SignupScreen;
