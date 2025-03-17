import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEventStore} from '../../hooks/useEventStore';
import type {EventsStackParamList} from '../../../App';

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

  const handleRegister = async () => {
    if (!eventStore.currentEvent) return;

    if (eventStore.currentEvent.isRegistered) {
      await eventStore.unregisterEvent(eventStore.currentEvent.id);
    } else {
      await eventStore.registerEvent(eventStore.currentEvent.id);
    }
  };

  if (eventStore.loading || !eventStore.currentEvent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  const event = eventStore.currentEvent;

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

          <View style={styles.attendeesContainer}>
            <Text style={styles.attendeesText}>
              <Ionicons name="people-outline" size={18} color="#333" style={styles.metaIcon} />
              {event.attendees} people have registered for this event
            </Text>
          </View>

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
              name={event.isRegistered ? "close-circle-outline" : "checkmark-circle-outline"} 
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
  },
  attendeesText: {
    fontSize: 16,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default EventDetailScreen; 