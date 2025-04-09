/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// Use Text instead of Icon because react-native-vector-icons is not installed
import Ionicons from 'react-native-vector-icons/Ionicons';
// Remove non-existent hook
// import {useAuthStore} from './src/hooks/useAuthStore';

// add type declaration for global objects
declare global {
  var setIsAuthenticated: ((value: boolean) => void) | undefined;
  var isAuthenticated: boolean | undefined;
}

// Auth Screens
import LoginScreen from './src/screens/auth/Login';
import SignupScreen from './src/screens/auth/Signup';
import ProfileSetupScreen from './src/screens/auth/ProfileSetup';

// Main Screens
import HomeScreen from './src/screens/home/Home';
import EventsScreen from './src/screens/events/Events';
import EventDetailScreen from './src/screens/events/EventDetail';
import ConnectionsScreen from './src/screens/connections/Connections';
import ConversationsScreen from './src/screens/conversations/Conversations';
import ChatScreen from './src/screens/conversations/Chat';
import ProfileScreen from './src/screens/profile/Profile';
import UserListScreen from './src/screens/profile/UserList';

// Define the param list for the auth stack
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ProfileSetup: undefined;
};

// Define the param list for the home stack
export type HomeStackParamList = {
  Home: undefined;
  EventDetail: {eventId: number};
};

// Define the param list for the events stack
export type EventsStackParamList = {
  EventsList: undefined;
  EventDetail: {eventId: number};
  AttendeeDetail: {attendeeId: number};
};

// Define the param list for the connections stack
export type ConnectionsStackParamList = {
  ConnectionsList: undefined;
};

// Define the param list for the conversations stack
export type ConversationsStackParamList = {
  ConversationsList: undefined;
  Chat: {userId: number; username: string};
};

// Define the param list for the profile stack
export type ProfileStackParamList = {
  UserProfile: undefined;
  UserList: {type: 'followers' | 'following'};
  ProfileSetup: undefined;
};

// Create the navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const EventsStack = createStackNavigator<EventsStackParamList>();
const ConnectionsStack = createStackNavigator<ConnectionsStackParamList>();
const ConversationsStack = createStackNavigator<ConversationsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{headerShown: true}}
      />
      <AuthStack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{
          title: 'Complete Your Profile',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
    </AuthStack.Navigator>
  );
};

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{title: 'Event Details'}}
      />
    </HomeStack.Navigator>
  );
};

// Events Stack Navigator
const EventsStackNavigator = () => {
  return (
    <EventsStack.Navigator>
      <EventsStack.Screen
        name="EventsList"
        component={EventsScreen}
        options={{headerShown: false}}
      />
      <EventsStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{title: 'Event Details'}}
      />
    </EventsStack.Navigator>
  );
};

// Connections Stack Navigator
const ConnectionsStackNavigator = () => {
  return (
    <ConnectionsStack.Navigator>
      <ConnectionsStack.Screen
        name="ConnectionsList"
        component={ConnectionsScreen}
        options={{headerShown: false}}
      />
    </ConnectionsStack.Navigator>
  );
};

// Conversations Stack Navigator
const ConversationsStackNavigator = () => {
  return (
    <ConversationsStack.Navigator>
      <ConversationsStack.Screen
        name="ConversationsList"
        component={ConversationsScreen}
        options={{headerShown: false}}
      />
      <ConversationsStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          title: route.params.username,
        })}
      />
    </ConversationsStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="UserList"
        component={UserListScreen}
        options={({route}) => ({
          title: route.params.type === 'followers' ? 'Followers' : 'Following',
        })}
      />
      <ProfileStack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{
          title: 'Edit Profile',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Connections') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // 使用Ionicons组件
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#006400',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Events"
        component={EventsStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Connections"
        component={ConnectionsStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Chats"
        component={ConversationsStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Account"
        component={ProfileStackNavigator}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

// Main App Component
const App = () => {
  // 使用本地状态代替store
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 将setIsAuthenticated函数暴露给全局，以便Login.tsx可以调用
  global.setIsAuthenticated = setIsAuthenticated;

  useEffect(() => {
    // 模拟检查登录状态
    // Simulate checking login status
    // 实际应用中应该从AsyncStorage或其他存储中获取
    // In a real application, it should be retrieved from AsyncStorage or other storage
    setTimeout(() => {
      setIsAuthenticated(false);
    }, 1000);

    // 检查全局登录状态
    const checkGlobalAuth = setInterval(() => {
      if (global.isAuthenticated) {
        console.log('Global authentication state detected, updating local state');
        setIsAuthenticated(true);
        global.isAuthenticated = false;
        clearInterval(checkGlobalAuth);
      }
    }, 100);

    return () => clearInterval(checkGlobalAuth);
  }, []);

  console.log('Current authentication state:', isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default App;

