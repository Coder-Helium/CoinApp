import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {useProfileStore} from '../../hooks/useProfileStore';
import type {ProfileStackParamList} from '../../../App';

type UserListRouteProp = RouteProp<ProfileStackParamList, 'UserList'>;

const UserListScreen = observer(() => {
  const route = useRoute<UserListRouteProp>();
  const {type} = route.params;
  const profileStore = useProfileStore();

  useEffect(() => {
    if (type === 'followers') {
      profileStore.fetchFollowers();
    } else {
      profileStore.fetchFollowing();
    }
  }, [type, profileStore]);

  const handleFollowToggle = async (userId: number, isFollowing: boolean) => {
    if (isFollowing) {
      await profileStore.unfollowUser(userId);
    } else {
      await profileStore.followUser(userId);
    }
  };

  const renderUserItem = ({item}: {item: any}) => (
    <View style={styles.userItem}>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userBio} numberOfLines={1}>
          {item.bio}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          item.isFollowing && styles.followingButton,
        ]}
        onPress={() => handleFollowToggle(item.id, item.isFollowing)}>
        <Text style={styles.followButtonText}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (profileStore.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  const data = type === 'followers' ? profileStore.followers : profileStore.following;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderUserItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.usersList}
      />
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
  usersList: {
    padding: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#006400',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  followingButton: {
    backgroundColor: '#ccc',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default UserListScreen; 