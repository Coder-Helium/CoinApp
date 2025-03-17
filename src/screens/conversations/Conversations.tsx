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
});

export default ConversationsScreen;
