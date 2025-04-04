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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEventStore} from '../../hooks/useEventStore';
import type {EventsStackParamList} from '../../../App';

type EventsScreenNavigationProp = StackNavigationProp<
  EventsStackParamList,
  'EventsList'
>;

const EventsScreen = observer(() => {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const eventStore = useEventStore();

  useEffect(() => {
    eventStore.fetchEvents();
  }, [eventStore]);

  const renderEventItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetail', {eventId: item.id})}>
      <Image source={{uri: item.image}} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventMeta}>
          <Text style={styles.eventDate}>
            <Ionicons name="calendar-outline" size={14} color="#666" style={styles.metaIcon} />
            {item.date} at {item.time}
          </Text>
          <Text style={styles.eventLocation}>
            <Ionicons name="location-outline" size={14} color="#666" style={styles.metaIcon} />
            {item.location}
          </Text>
        </View>
        <View style={styles.eventFooter}>
          <Text style={styles.attendees}>
            <Ionicons name="people-outline" size={14} color="#666" style={styles.metaIcon} />
            {item.attendees} attendees
          </Text>
          <TouchableOpacity
            style={[
              styles.registerButton,
              item.isRegistered && styles.registeredButton,
            ]}
            onPress={e => {
              e.stopPropagation();
              if (item.isRegistered) {
                eventStore.unregisterEvent(item.id);
              } else {
                eventStore.registerEvent(item.id);
              }
            }}>
            <Ionicons
              name={item.isRegistered ? 'checkmark' : 'add'}
              size={14}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.registerButtonText}>
              {item.isRegistered ? 'Registered' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (eventStore.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Ionicons name="calendar" size={24} color="#006400" style={styles.headerIcon} /> Events
        </Text>
      </View>
      <FlatList
        data={eventStore.events}
        renderItem={renderEventItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.eventsList}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 5,
  },
  eventsList: {
    padding: 15,
  },
  eventCard: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventMeta: {
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendees: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#006400',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  registeredButton: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    marginRight: 4,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default EventsScreen;
