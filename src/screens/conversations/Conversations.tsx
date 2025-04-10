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

type ConversationsScreenNavigationProp = StackNavigationProp<
  ConversationsStackParamList,
  'ConversationsList'
>;

const ConversationsScreen = observer(() => {
  const navigation = useNavigation<ConversationsScreenNavigationProp>();
  const conversationStore = useConversationStore();

  useEffect(() => {
    conversationStore.fetchConversations();
    conversationStore.fetchFriendRequests(0); // Replace 0 with actual user ID
  }, [conversationStore]);

  const renderConversationItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() =>
        navigation.navigate('Chat', {
          userId: item.userId,
          username: item.userName,
        })
      }>
      <View style={styles.avatarContainer}>
        <Image source={{uri: item.userAvatar}} style={styles.avatar} />
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timeStamp}>{item.lastMessageTime}</Text>
        </View>
        <Text
          style={[
            styles.lastMessage,
            item.unreadCount > 0 && styles.unreadMessage,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFriendRequest = ({item}: {item: any}) => (
    <View style={styles.friendRequestItem}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{uri: item.userAvatar || 'https://picsum.photos/50'}} 
          style={styles.avatar} 
        />
      </View>
      <View style={styles.requestInfo}>
        <Text style={styles.userName}>{item.userName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => conversationStore.handleFriendRequest(0, item.userId, 'accept')}>
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => conversationStore.handleFriendRequest(0, item.userId, 'reject')}>
            <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
      </View>

      {conversationStore.friendRequests.length > 0 && (
        <View style={styles.friendRequestsContainer}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <FlatList
            data={conversationStore.friendRequests}
            renderItem={renderFriendRequest}
            keyExtractor={item => item.userId.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendRequestsList}
          />
        </View>
      )}

      <FlatList
        data={conversationStore.conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id.toString()}
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
  friendRequestsContainer: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  friendRequestsList: {
    paddingHorizontal: 10,
  },
  friendRequestItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    width: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: '#006400',
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  rejectButtonText: {
    color: '#999',
  },
});

export default ConversationsScreen;
