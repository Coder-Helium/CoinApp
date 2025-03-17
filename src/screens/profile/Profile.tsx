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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useProfileStore} from '../../hooks/useProfileStore';
import type {ProfileStackParamList} from '../../../App';

type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'UserProfile'
>;

const ProfileScreen = observer(() => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const profileStore = useProfileStore();

  useEffect(() => {
    profileStore.fetchProfile();
  }, [profileStore]);

  const handleEditProfile = () => {
    navigation.navigate('UserProfile');
  };

  const handleLogout = () => {
    // 注释掉不存在的方法
    // profileStore.logout();
    console.log('Logout clicked');
    // After logout, navigate to Login screen
    // This navigation logic should be handled in the App.tsx based on auth state
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
              source={{uri: profileStore.profile?.avatar}}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.name}>{profileStore.profile?.name}</Text>
          <Text style={styles.location}>
            <Ionicons name="location" size={16} color="#666" /> {profileStore.profile?.country}, {profileStore.profile?.city}
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
            <Text style={styles.infoValue}>{profileStore.profile?.university}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Field of Study</Text>
            <Text style={styles.infoValue}>{profileStore.profile?.fieldOfStudy}</Text>
          </View>
          {/* 注释掉不存在的属性 */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Level of Study</Text>
            <Text style={styles.infoValue}>Not specified</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="navigate-outline" size={20} color="#006400" style={styles.sectionIcon} /> Destination
          </Text>
          {/* 注释掉不存在的属性 */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Destination City</Text>
            <Text style={styles.infoValue}>Not specified</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="language-outline" size={20} color="#006400" style={styles.sectionIcon} /> Language
          </Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Preferred Language</Text>
            <Text style={styles.infoValue}>
              {profileStore.profile?.languages?.join(', ') || 'Not specified'}
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