import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import {useConversationStore} from '../../hooks/useConversationStore';
import type {ConversationsStackParamList} from '../../../App';
import {useAuthStore} from '../../hooks/useAuthStore';

type ConversationsScreenNavigationProp = StackNavigationProp<
  ConversationsStackParamList,
  'ConversationsList'
>;

const ConversationsScreen = observer(() => {
  const navigation = useNavigation<ConversationsScreenNavigationProp>();
  const conversationStore = useConversationStore();
  const authStore = useAuthStore();
  const currentUserId = authStore.user?.id;
  useEffect(() => {
    conversationStore.fetchConversations(currentUserId);
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

  if (conversationStore.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
});

export default ConversationsScreen;
