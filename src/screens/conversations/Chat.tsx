import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
// 导入Ionicons
import Ionicons from 'react-native-vector-icons/Ionicons';
import {observer} from 'mobx-react-lite';
import {useConversationStore} from '../../hooks/useConversationStore';
import type {ConversationsStackParamList} from '../../../App';

type ChatRouteProp = RouteProp<ConversationsStackParamList, 'Chat'>;
type ChatNavigationProp = StackNavigationProp<ConversationsStackParamList, 'Chat'>;

const ChatScreen = observer(() => {
  const route = useRoute<ChatRouteProp>();
  const navigation = useNavigation<ChatNavigationProp>();
  const {userId, username} = route.params;
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const conversationStore = useConversationStore();

  useEffect(() => {
    navigation.setOptions({
      title: username,
    });
    conversationStore.fetchMessages(userId);

    // 标记消息为已读 - 注释掉不存在的方法
    // conversationStore.markAsRead(userId);

    return () => {
      // 如果需要清理
    };
  }, [navigation, username, userId, conversationStore]);

  const sendMessage = () => {
    if (message.trim()) {
      // 修正方法调用
      conversationStore.sendMessage(message);
      setMessage('');
    }
  };

  const renderMessageItem = ({item}: {item: any}) => {
    const isMyMessage = item.senderId === 'me';
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  // 修正属性名称
  if (conversationStore.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={flatListRef}
          data={conversationStore.currentMessages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!message.trim()}>
            {/* 使用Ionicons代替Text */}
            <Ionicons 
              name="send" 
              size={24} 
              color={message.trim() ? '#006400' : '#ccc'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: '#dcf8c6',
  },
  theirMessageBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen; 