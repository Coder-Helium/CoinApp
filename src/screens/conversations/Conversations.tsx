import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import {useConversationStore} from '../../hooks/useConversationStore';
import type {ConversationsStackParamList} from '../../../App';
import {useAuthStore} from '../../hooks/useAuthStore';
import {request} from '../../services/mock/conversations';

type ConversationsScreenNavigationProp = StackNavigationProp<
  ConversationsStackParamList,
  'ConversationsList'
>;

const ConversationsScreen = observer(() => {
  const navigation = useNavigation<ConversationsScreenNavigationProp>();
  const conversationStore = useConversationStore();
  const authStore = useAuthStore();
  const currentUserId = authStore.user?.id;
  const [friendId, setFriendId] = useState('');
  useEffect(() => {
    conversationStore.fetchConversations(currentUserId);
    conversationStore.fetchRequest(currentUserId);
  }, [conversationStore, currentUserId]);

  const renderConversationItem = ({item}: {item: any}) => {
    // 获取未读消息数，如果不存在则默认为0
    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          navigation.navigate('Chat', {
            userId: authStore.user?.id || 0,
            contactId: item.contactId,
            username: item.contactName,
          })
        }>
        <View style={styles.avatarContainer}>
          <Image source={{uri: item.contactAvatar}} style={styles.avatar} />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{item.contactName}</Text>
            <Text style={styles.timeStamp}>{new Date(item.lastMessageTime).toLocaleDateString('zh-CN', {year: 'numeric', month: 'numeric', day: 'numeric'})}</Text>
          </View>
          <Text
            style={[
              styles.lastMessage,
              unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {typeof item.lastMessage === 'object' ? item.lastMessage.content : item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFriendRequestItem = ({ item }: { item: any }) => {
    return (
      <View key={item.id} style={styles.requestCard}>
        <Image source={{ uri: `https://picsum.photos/id/${item.Friend_ID % 100 + 100}/200` }} style={styles.requestAvatar} />
        <View style={styles.requestInfo}>
          <Text style={styles.name}>{item.friend_name}</Text>
        </View>
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => {
              if (currentUserId !== undefined) {
                conversationStore.acceptFriendRequest(currentUserId, item.Friend_ID);
              } else {
                console.error('Current user ID is undefined');
              }
            }}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => {
              if (currentUserId !== undefined) {
                conversationStore.rejectFriendRequest(currentUserId, item.id);
              } else {
                console.error('Current user ID is undefined');
              }
            }}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (conversationStore.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>


      {conversationStore.request.length > 0 && (
        <View style={styles.friendRequestsContainer}>
          <Text style={styles.friendRequestsTitle}>Connection Requests</Text>
          <FlatList
            data={conversationStore.requestinfo}
            renderItem={renderFriendRequestItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
        {/* <TouchableOpacity
          style={styles.wsTestButton}
          onPress={() => navigation.navigate('WebSocketTest')}>
          <Text style={styles.wsTestButtonText}>WebSocket测试</Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={conversationStore.conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.conversationsList}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Add padding for Android devices
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  conversationsList: {
    padding: 10,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#006400',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeStamp: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#333',
  },
  wsTestButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  wsTestButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  addFriendContainer: {
    padding: 15,
    alignItems: 'flex-start', // Align content to the left
  },
  addFriendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10, // Add spacing between the title and the input row
    textAlign: 'center', // Center the title
  },
  addFriendRow: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    width: '100%',
  },
  addFriendButton: {
    backgroundColor: '#006400',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addFriendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    flex: 1, // Allow the input to take up remaining space
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10, // Add spacing between the input and button
  },
  friendRequestsContainer: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  friendRequestsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  requestAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  university: {
    fontSize: 13,
    color: '#777',
    marginBottom: 1,
  },
  department: {
    fontSize: 13,
    color: '#777',
    marginBottom: 3,
  },
  requestTime: {
    fontSize: 11,
    color: '#999',
  },
  requestActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 90,
  },
  acceptButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 8,
    width: 80,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  declineButtonText: {
    color: '#777',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ConversationsScreen;
