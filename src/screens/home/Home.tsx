/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useEventStore} from '../../hooks/useEventStore';
import type {EventsStackParamList} from '../../../App';
import useConnections, { DEFAULT_FILTER_STATE } from '../../hooks/useConnections';
import { useAuthStore } from '../../hooks/useAuthStore';

type HomeScreenNavigationProp = StackNavigationProp<EventsStackParamList, 'EventsList'>;

// 模拟大使数据
const ambassadors = [
  {
    id: 1,
    name: 'Reuben Roy',
    university: 'University of New South Wales',
    department: 'Business',
    location: 'Kerala',
    avatar: 'https://picsum.photos/id/1005/200',
  },
  {
    id: 2,
    name: 'Reuben Roy',
    university: 'University of New South Wales',
    department: 'Business',
    location: 'Kerala',
    avatar: 'https://picsum.photos/id/1012/200',
  },
  {
    id: 3,
    name: 'Reuben Roy',
    university: 'University of New South Wales',
    department: 'Business',
    location: 'Kerala',
    avatar: 'https://picsum.photos/id/1025/200',
  },
  {
    id: 4,
    name: 'Reuben Roy',
    university: 'University of New South Wales',
    department: 'Business',
    location: 'Kerala',
    avatar: 'https://picsum.photos/id/1027/200',
  },
];


const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const eventStore = useEventStore();
  const [featuredEvent, setFeaturedEvent] = useState<any>(null);
  const userStore = useAuthStore();
  const currentUserId = userStore.user?.id;

  const connectionsStore = useConnections(DEFAULT_FILTER_STATE, currentUserId);

  useEffect(() => {
    eventStore.fetchEvents();
  }, []);

  // set featured event
  useEffect(() => {
    if (eventStore.events.length > 0) {
      setFeaturedEvent(eventStore.events[0]);
    }
  }, [eventStore.events]);

  const renderEventItem = useCallback(({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetail', {eventId: item.id})}>
      <Image source={{uri: item.image}} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.eventTime}>
          {item.date} {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);


  const renderAmbassadorItem = useCallback(({item}: {item: any}) => (
    <View style={styles.ambassadorCard}>
      <Image source={{uri: item.avatar}} style={styles.ambassadorAvatar} />
      <Text style={styles.ambassadorName}>{item.name}</Text>
      <Text style={styles.ambassadorDetail}>{item.department}</Text>
      <Text style={styles.ambassadorDetail} numberOfLines={1}>
        {item.university}
      </Text>
      <Text style={styles.ambassadorLocation}>{item.location}</Text>
      <TouchableOpacity style={styles.addFriendButton} onPress={() => connectionsStore.sendFriendRequest(item.id)}>
        <Text style={styles.addFriendText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  ), [connectionsStore]);

  // 使用 useMemo 缓存事件列表计算结果
  const eventsList = useMemo(() => {
    return eventStore.events.slice(1);
  }, [eventStore.events]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
            <Image source={require('../../assets/rekro.png')} style={styles.logoImage} />
      </View>

      <ScrollView style={styles.scrollView}>
      <Text style={styles.sectionTitle}>Reach Out Connections</Text>

        <FlatList
          data={ambassadors}
          renderItem={renderAmbassadorItem}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ambassadorsList}
        />
        <Text style={styles.sectionTitle}>Events for You</Text>

        {featuredEvent && (
          <TouchableOpacity
            style={styles.featuredEventCard}
            onPress={() => navigation.navigate('EventDetail', {eventId: featuredEvent.id})}>
            <Image source={{uri: featuredEvent.image}} style={styles.featuredEventImage} />
            <View style={styles.featuredEventContent}>
              <Text style={styles.featuredEventTitle}>{featuredEvent.title}</Text>
              <Text style={styles.featuredEventTime}>
                {featuredEvent.date} {featuredEvent.time}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <FlatList
          data={eventsList}
          renderItem={renderEventItem}
          keyExtractor={item => item.id.toString()}
          horizontal={false}
          scrollEnabled={false}
        />

        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Events')}>
          <Text style={styles.exploreButtonText}>Explore All Events</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2E4D40',
    padding: 5,
    alignItems: 'flex-start',
  },
  logoImage: {
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginLeft: -35,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    marginHorizontal: 15,
    color: '#333',
  },
  featuredEventCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  featuredEventImage: {
    width: '100%',
    height: 200,
  },
  featuredEventContent: {
    padding: 15,
  },
  featuredEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featuredEventTime: {
    fontSize: 14,
    color: '#666',
  },
  eventCard: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  eventImage: {
    width: 100,
    height: 80,
  },
  eventContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  exploreButton: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ambassadorsList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  ambassadorCard: {
    width: 120,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  ambassadorAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  ambassadorName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  ambassadorDetail: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  ambassadorLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  addFriendButton: {
    backgroundColor: '#2E4D40',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  addFriendText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeScreen;
