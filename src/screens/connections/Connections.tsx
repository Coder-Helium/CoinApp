import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 模拟推荐连接数据
// Mock recommended connection data
const recommendedConnections = [
  {
    id: 1,
    name: 'Sarah Kim',
    university: 'University of Sydney',
    department: 'Computer Science',
    avatar: 'https://picsum.photos/id/1027/200',
    mutualConnections: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    university: 'UNSW Sydney',
    department: 'Business',
    avatar: 'https://picsum.photos/id/1025/200',
    mutualConnections: 3,
  },
  {
    id: 3,
    name: 'Emma Wang',
    university: 'University of Melbourne',
    department: 'Arts',
    avatar: 'https://picsum.photos/id/1062/200',
    mutualConnections: 2,
  },
];

// 模拟活动数据
// Mock connection request data
const connectionRequests = [
  {
    id: 1,
    name: 'David Liu',
    university: 'University of Queensland',
    department: 'Engineering',
    avatar: 'https://picsum.photos/id/1074/200',
    requestTime: '2 days ago',
  },
  {
    id: 2,
    name: 'James Wilson',
    university: 'Monash University',
    department: 'Medicine',
    avatar: 'https://picsum.photos/id/1012/200',
    requestTime: '1 week ago',
  },
];

const ConnectionsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
              <View style={styles.section}>
          <Text style={styles.sectionTitle}>Find Connections</Text>
          <View style={styles.findConnectionsOptions}>
            <TouchableOpacity style={styles.findOption}>
              <View style={styles.findOptionIcon}>
                <Ionicons name="school-outline" size={24} color="#006400" />
              </View>
              <Text style={styles.findOptionText}>By University</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.findOption}>
              <View style={styles.findOptionIcon}>
                <Ionicons name="location-outline" size={24} color="#006400" />
              </View>
              <Text style={styles.findOptionText}>By Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.findOption}>
              <View style={styles.findOptionIcon}>
                <Ionicons name="book-outline" size={24} color="#006400" />
              </View>
              <Text style={styles.findOptionText}>By Interest</Text>
            </TouchableOpacity>
          </View>
        </View>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Connections</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Requests</Text>
          {connectionRequests.map(request => (
            <View key={request.id} style={styles.requestCard}>
              <Image source={{uri: request.avatar}} style={styles.avatar} />
              <View style={styles.requestInfo}>
                <Text style={styles.name}>{request.name}</Text>
                <Text style={styles.university}>{request.university}</Text>
                <Text style={styles.department}>{request.department}</Text>
                <Text style={styles.requestTime}>{request.requestTime}</Text>
              </View>
              <View style={styles.requestActions}>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineButton}>
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Connections</Text>
          {recommendedConnections.map(connection => (
            <View key={connection.id} style={styles.connectionCard}>
              <Image source={{uri: connection.avatar}} style={styles.avatar} />
              <View style={styles.connectionInfo}>
                <Text style={styles.name}>{connection.name}</Text>
                <Text style={styles.university}>{connection.university}</Text>
                <Text style={styles.department}>{connection.department}</Text>
                <Text style={styles.mutualConnections}>
                  <Ionicons name="people-outline" size={14} color="#666" />{' '}
                  {connection.mutualConnections} mutual connections
                </Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Recommendations</Text>
          </TouchableOpacity>
        </View>


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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  requestCard: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  university: {
    fontSize: 14,
    color: '#666',
  },
  department: {
    fontSize: 14,
    color: '#666',
  },
  requestTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  requestActions: {
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#006400',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  declineButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  declineButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  connectionCard: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  connectionInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  mutualConnections: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  connectButton: {
    backgroundColor: '#006400',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  viewAllButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  findConnectionsOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  findOption: {
    alignItems: 'center',
    width: '30%',
  },
  findOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  findOptionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default ConnectionsScreen; 