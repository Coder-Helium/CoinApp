import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useConversationStore} from '../../hooks/useConversationStore';
import {wsBridge} from '../../services/websocket/bridge';
import {wsService} from '../../services/websocket';
import {WebSocketMessage} from '../../services/websocket/types';
import {mockUsers} from '../../services/mock/conversations';

const WebSocketTestScreen = observer(() => {
  const conversationStore = useConversationStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [statusChangesEnabled, setStatusChangesEnabled] = useState(false);
  const [statusInterval, setStatusInterval] = useState<number | null>(null);

  // Add log with useCallback
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [...prevLogs, `[${timestamp}] ${message}`]);
  }, []);

  // Initialize
  useEffect(() => {
    addLog('WebSocket test page loaded');
    
    // Add event listeners
    const messageHandler = (data: WebSocketMessage) => {
      if (data.type === 'message' && data.data) {
        addLog(`Message received: ${data.data.text.substring(0, 20)}${data.data.text.length > 20 ? '...' : ''}`);
      } else if (data.type === 'connected') {
        addLog(`User status change: UserID=${data.userId || 'unknown'}, Status=${data.status || 'unknown'}`);
      }
    };
    
    const connectedHandler = () => {
      addLog('WebSocket connection event: Connected');
      setConnected(true);
    };
    
    const disconnectedHandler = () => {
      addLog('WebSocket connection event: Disconnected');
      setConnected(false);
    };
    
    // Register event listeners
    wsService.on('message', messageHandler);
    wsService.on('connected', connectedHandler);
    wsService.on('disconnected', disconnectedHandler);
    
    // Connect to WebSocket
    conversationStore.connectWebSocket('ws://54.252.49.201:8080').then(success => {
      if (success) {
        setConnected(true);
        addLog('WebSocket connected');
      } else {
        addLog('WebSocket connection failed');
      }
    });

    return () => {
      // Remove event listeners
      wsService.off('message', messageHandler);
      wsService.off('connected', connectedHandler);
      wsService.off('disconnected', disconnectedHandler);
      
      // Clear timer
      if (statusInterval) {
        clearInterval(statusInterval);
      }
      
      // Disconnect
      conversationStore.disconnectWebSocket();
      addLog('WebSocket disconnected');
    };
  }, [conversationStore, statusInterval, addLog]);

  // Listen for automatic status change switch
  useEffect(() => {
    if (statusChangesEnabled && connected) {
      const interval = setInterval(() => {
        wsBridge.simulateUserStatusChange();
        addLog('Simulating user status change...');
      }, 5000);
      
      setStatusInterval(interval as unknown as number);
      return () => clearInterval(interval);
    } else if (statusInterval) {
      clearInterval(statusInterval);
      setStatusInterval(null);
    }
  }, [statusChangesEnabled, connected, statusInterval, addLog]);

  // Listen for automatic reply switch
  useEffect(() => {
    let autoReplyInterval: number | null = null;
    
    if (autoReplyEnabled && connected) {
      autoReplyInterval = setInterval(() => {
        // Randomly select a user to reply
        const randomUserIndex = Math.floor(Math.random() * mockUsers.length);
        const randomUser = mockUsers[randomUserIndex];
        
        wsBridge.simulateReply(randomUser.id);
        addLog(`Automatic reply: Simulated message from user ${randomUser.name}`);
      }, 3000) as unknown as number;
    }
    
    return () => {
      if (autoReplyInterval) {
        clearInterval(autoReplyInterval);
      }
    };
  }, [autoReplyEnabled, connected, addLog]);

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Connect/disconnect WebSocket
  const toggleConnection = async () => {
    if (connected) {
      conversationStore.disconnectWebSocket();
      setConnected(false);
      addLog('WebSocket disconnected');
    } else {
      const success = await conversationStore.connectWebSocket('ws://54.252.49.201:8080');
      setConnected(success);
      if (success) {
        addLog('WebSocket connected');
      } else {
        addLog('WebSocket connection failed');
      }
    }
  };

  // Simulate receiving a message
  const simulateReceiveMessage = (userId: number) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;
    
    wsBridge.simulateReply(userId);
    addLog(`Simulated message from user ${user.name} received`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WebSocket test page</Text>
      
      <View style={styles.controlPanel}>
        <View style={styles.connectionStatus}>
          <Text>Connection status: </Text>
          <View style={[
            styles.statusIndicator, 
            {backgroundColor: connected ? '#4CAF50' : '#FF5252'}
          ]} />
          <Text>{connected ? 'Connected' : 'Disconnected'}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.button, connected ? styles.disconnectButton : styles.connectButton]}
          onPress={toggleConnection}>
          <Text style={styles.buttonText}>
            {connected ? 'Disconnect' : 'Connect'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.switchContainer}>
          <Text>Automatic status change:</Text>
          <Switch
            value={statusChangesEnabled}
            onValueChange={setStatusChangesEnabled}
            disabled={!connected}
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text>Automatic reply:</Text>
          <Switch
            value={autoReplyEnabled}
            onValueChange={setAutoReplyEnabled}
            disabled={!connected}
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Simulate user messages</Text>
      <View style={styles.userButtonsContainer}>
        {mockUsers.map(user => (
          <TouchableOpacity
            key={user.id}
            style={[styles.userButton, !connected && styles.disabledButton]}
            onPress={() => simulateReceiveMessage(user.id)}
            disabled={!connected}>
            <Text style={styles.userButtonText}>{user.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.logsContainer}>
        <View style={styles.logsHeader}>
          <Text style={styles.sectionTitle}>WebSocket logs</Text>
          <TouchableOpacity onPress={clearLogs}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.logs}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  controlPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 8,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
  },
  disconnectButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  userButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  userButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    margin: 4,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  userButtonText: {
    color: '#fff',
  },
  logsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  logs: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default WebSocketTestScreen; 