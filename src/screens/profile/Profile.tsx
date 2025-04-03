import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useProfileStore} from '../../hooks/useProfileStore';
import {useAuthStore} from '../../hooks/useAuthStore';

const ProfileScreen = observer(() => {
  const profileStore = useProfileStore();
  const authStore = useAuthStore();

  useEffect(() => {
    profileStore.fetchProfile();
  }, [profileStore]);

  const handleEditProfile = () => {
    // 导航到资料编辑页面
    // 在实际应用中这可能是另一个页面
    Alert.alert(
      '编辑个人资料',
      '此功能尚未实现。您可以通过ProfileSetup页面更新资料。'
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      '登出确认',
      '您确定要登出吗?',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            const success = await authStore.logout();
            if (success) {
              console.log('用户已登出');
              // App会自动切换到登录页面
            } else {
              Alert.alert('错误', '登出失败，请稍后再试');
            }
          },
        },
      ]
    );
  };

  if (profileStore.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{uri: 'https://picsum.photos/200'}}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.name}>{profileStore.profile?.name}</Text>
          <Text style={styles.location}>
            <Ionicons name="location" size={16} color="#666" /> {profileStore.profile?.userCountry || '未设置'}, {profileStore.profile?.userCity || '未设置'}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.editButtonText}>编辑个人资料</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="school-outline" size={20} color="#006400" style={styles.sectionIcon} /> 教育
          </Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>大学/学校</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.userUni || '未设置'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>学习领域</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.userField || '未设置'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>学习阶段</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.levelOfStudy || '未设置'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="navigate-outline" size={20} color="#006400" style={styles.sectionIcon} /> 目的地
          </Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>目标城市</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.userCity || '未设置'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="language-outline" size={20} color="#006400" style={styles.sectionIcon} /> 语言
          </Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>首选语言</Text>
            <Text style={styles.infoValue}>
              {profileStore.profile?.userLanguage || '未设置'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff3b30" style={styles.buttonIcon} />
          <Text style={styles.logoutButtonText}>登出</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#006400',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#006400',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 5,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
