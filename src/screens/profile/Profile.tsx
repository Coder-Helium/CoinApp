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
    Alert.alert(
      'Edit Profile',
      'This feature is not yet implemented. You can update your profile through the ProfileSetup page.'
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            const success = await authStore.logout();
            if (success) {
              console.log('用户已登出');
              console.log('User logged out');
              // App会自动切换到登录页面
              // App will automatically switch to login page
            } else {
              Alert.alert('错误', '登出失败，请稍后再试');
              Alert.alert('Error', 'Logout failed, please try again later');
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
            <Ionicons name="location" size={16} color="#666" /> {profileStore.profile?.userCountry || 'Not set'}, {profileStore.profile?.userCity || 'Not set'}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="school-outline" size={20} color="#006400" style={styles.sectionIcon} /> Education
          </Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>University/School</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.userUni || 'Not set'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Field of Study</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.userField || 'Not set'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Level of Study</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.levelOfStudy || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="navigate-outline" size={20} color="#006400" style={styles.sectionIcon} /> Destination
          </Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Target City</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.userCity || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="language-outline" size={20} color="#006400" style={styles.sectionIcon} /> Language
          </Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Preferred Language</Text>
            <Text style={styles.infoValue}>
              {profileStore.profile?.userLanguage || 'Not set'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff3b30" style={styles.buttonIcon} />
          <Text style={styles.logoutButtonText}>Logout</Text>
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
