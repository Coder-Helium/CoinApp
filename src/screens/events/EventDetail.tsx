import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEventStore} from '../../hooks/useEventStore';
import type {EventsStackParamList} from '../../../App';
import {eventApi} from '../../services/api';
import type {Attendee} from '../../services/mock/events';
import useConnections, { DEFAULT_FILTER_STATE } from '../../hooks/useConnections';
import { useAuthStore } from '../../hooks/useAuthStore';


type EventDetailRouteProp = RouteProp<EventsStackParamList, 'EventDetail'>;
type EventDetailNavigationProp = StackNavigationProp<
  EventsStackParamList,
  'EventDetail'
>;

const EventDetailScreen = observer(() => {
  const route = useRoute<EventDetailRouteProp>();
  const navigation = useNavigation<EventDetailNavigationProp>();
  const {eventId} = route.params;
  const eventStore = useEventStore();

  // add state to control the bottom drawer
  const [isAttendeeListVisible, setIsAttendeeListVisible] = useState<boolean>(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // get user id and connections store
  const userStore = useAuthStore();
  const currentUserId = userStore?.user?.id || 0;
  const connectionsStore = useConnections(DEFAULT_FILTER_STATE, currentUserId);

  useEffect(() => {
    eventStore.fetchEventById(eventId);
  }, [eventId, eventStore]);

  useEffect(() => {
    if (eventStore.currentEvent) {
      navigation.setOptions({
        title: eventStore.currentEvent.title,
      });
    }
  }, [eventStore.currentEvent, navigation]);

  // fetch attendees list
  const fetchAttendees = async () => {
    setIsLoading(true);
    try {
      const myUserId = currentUserId;
      const data = await eventApi.getEventAttendees(eventId, myUserId);
      setAttendees(data);
    } catch (error) {
      console.error('Failed to fetch attendees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle add friend
  const handleAddFriend = (attendeeId: number) => {
    // call connectionsStore.sendFriendRequest and update UI status
    connectionsStore.sendFriendRequest(attendeeId);

    // update local UI status
    setAttendees(prev =>
      prev.map(attendee =>
        attendee.id === attendeeId
          ? {...attendee, isAdded: !attendee.isAdded}
          : attendee
      )
    );
  };

  const handleRegister = async () => {
    if (!eventStore.currentEvent) {return;}

    if (eventStore.currentEvent.isRegistered) {
      await eventStore.unregisterEvent(eventStore.currentEvent.id, currentUserId);
    } else {
      await eventStore.registerEvent(eventStore.currentEvent.id, currentUserId);

      // 检查事件是否有外部链接，如果有则跳转
      if (eventStore.currentEvent.externalLink) {
        // 直接导入 Linking 而不使用 NativeEventEmitter
        const { Linking } = require('react-native');
        try {
          await Linking.openURL(eventStore.currentEvent.externalLink || '');
        } catch (err) {
          console.error('无法打开链接:', err);
        }
      }
    }
  };

  // click to view attendees list
  const handleViewAttendees = () => {
    fetchAttendees();
    setIsAttendeeListVisible(true);
  };

  if (eventStore.loading || !eventStore.currentEvent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  const event = eventStore.currentEvent;

  // render attendees list item
  const renderAttendeeItem = ({item}: {item: Attendee}) => (
    <View style={styles.attendeeItem}>
      <Image source={{uri: 'https://picsum.photos/id/1000/200'}} style={styles.attendeeAvatar} />
      <View style={styles.attendeeInfo}>
        <Text style={styles.attendeeName}>{item.name}</Text>
        <Text style={styles.attendeeDetail}>{item.userUni}</Text>
        <Text style={styles.attendeeDetail}>{item.userField}</Text>
      </View>
      <TouchableOpacity
        style={[styles.addButton, item.isAdded && styles.addedButton]}
        onPress={() => handleAddFriend(item.id)}>
        <Text style={styles.addButtonText}>
          {item.isAdded ? 'Added' : 'Add'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{uri: event.image}} style={styles.eventImage} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>
                <Ionicons name="calendar-outline" size={16} color="#666" style={styles.metaIcon} /> Date
              </Text>
              <Text style={styles.metaValue}>{event.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>
                <Ionicons name="time-outline" size={16} color="#666" style={styles.metaIcon} /> Time
              </Text>
              <Text style={styles.metaValue}>{event.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>
                <Ionicons name="location-outline" size={16} color="#666" style={styles.metaIcon} /> Location
              </Text>
              <Text style={styles.metaValue}>{event.location}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.attendeesContainer}
            onPress={handleViewAttendees}
            activeOpacity={0.7}>
            <View style={styles.attendeesInner}>
              <Ionicons name="people-outline" size={18} color="#333" style={styles.metaIcon} />
              <Text style={styles.attendeesText}>
                {event.attendees} people have registered for this event
              </Text>
              <Ionicons name="chevron-down-outline" size={16} color="#666" style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>
              <Ionicons name="information-circle-outline" size={20} color="#333" style={styles.metaIcon} /> Event Details
            </Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              event.isRegistered && styles.registeredButton,
            ]}
            onPress={handleRegister}>
            <Ionicons
              name={event.isRegistered ? 'close-circle-outline' : 'checkmark-circle-outline'}
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.registerButtonText}>
              {event.isRegistered ? 'Cancel Registration' : 'Register Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* attendees list bottom drawer */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAttendeeListVisible}
        onRequestClose={() => setIsAttendeeListVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerHandle} />
              <Text style={styles.drawerTitle}>Event Attendees</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsAttendeeListVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={styles.loadingAttendeesContainer}>
                <ActivityIndicator size="large" color="#006400" />
                <Text style={styles.loadingText}>Loading attendees list...</Text>
              </View>
            ) : (
              <FlatList
                data={attendees}
                renderItem={renderAttendeeItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.attendeesList}
              />
            )}
          </View>
        </View>
      </Modal>
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
  eventImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  metaItem: {},
  metaLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 5,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 21, // Align with the text after icon
  },
  attendeesContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  attendeesInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 5,
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registeredButton: {
    backgroundColor: '#f44336',
  },
  buttonIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // bottom drawer styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '60%',
    maxHeight: '80%',
  },
  drawerHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  attendeesList: {
    padding: 15,
  },
  attendeeItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  attendeeAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  attendeeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  attendeeDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#006400',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  addedButton: {
    backgroundColor: '#ddd',
  },
  loadingAttendeesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default EventDetailScreen;
