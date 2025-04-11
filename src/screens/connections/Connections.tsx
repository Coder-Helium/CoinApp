// ConnectionsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useConnections, { FilterState, Connection, DEFAULT_FILTER_STATE } from '../../hooks/useConnections';
import { useAuthStore } from '../../hooks/useAuthStore';



const ConnectionsScreen: React.FC = () => {
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const authStore = useAuthStore();
  const currentUserId = authStore.user?.id;
  const {
    connections,
    isLoading,
    addedFriends,
    loadMoreConnections,
    sendFriendRequest,
    fetchUserProfile,
    fetchConnections,
    selectedUser,
    setSelectedUser,
    isProfileLoading,
  } = useConnections(filterState, currentUserId);


  const university = authStore.user?.userUni || '';
  const field = authStore.user?.userField || '';
  const city = authStore.user?.userCity || '';

  useEffect(() => {
    fetchConnections(1, filterState);
  }, [filterState]);

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  const clearFilters = () => {
    setFilterState({ degree: null, university: null, city: null });
  };

  const isFilterActive = (type: keyof FilterState, value: string): boolean =>
    filterState[type] === value;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter Connections</Text>
          <View style={styles.findConnectionsOptions}>
            <TouchableOpacity
              style={[styles.findOption, isFilterActive('degree', field) && styles.activeFilter]}
              onPress={() => toggleFilter('degree', field)}
            >
              <View style={styles.findOptionIcon}>
                <Ionicons name="school-outline" size={20} color="#006400" />
              </View>
              <Text style={styles.findOptionText}>Degree</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.findOption, isFilterActive('university', university) && styles.activeFilter]}
              onPress={() => toggleFilter('university', university)}
            >
              <View style={styles.findOptionIcon}>
                <Ionicons name="business-outline" size={20} color="#006400" />
              </View>
              <Text style={styles.findOptionText}>University</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.findOption, isFilterActive('city', city) && styles.activeFilter]}
              onPress={() => toggleFilter('city', city)}
            >
              <View style={styles.findOptionIcon}>
                <Ionicons name="location-outline" size={20} color="#006400" />
              </View>
              <Text style={styles.findOptionText}>City</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.findOption} onPress={clearFilters}>
              <View style={styles.findOptionIcon}>
                <Ionicons name="close-outline" size={20} color="#333" />
              </View>
              <Text style={styles.findOptionText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connections For You</Text>
          {isLoading && <ActivityIndicator size="small" color="#006400" />}

          {connections.map(connection => (
            <View key={connection.id} style={styles.connectionCard}>
              <TouchableOpacity onPress={() => fetchUserProfile(connection.id)}>
                <Image
                  source={{ uri: `https://picsum.photos/id/${connection.id % 100 + 100}/200` }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View style={styles.connectionInfo}>
                <Text style={[styles.text, styles.name]}>{connection.name}</Text>
                <Text style={styles.text}>{connection.userUni}</Text>
                <Text style={styles.text}>{connection.userField}</Text>
                <Text style={styles.text}>{connection.userCity}</Text>
              </View>
              <TouchableOpacity
                style={[styles.connectButton, addedFriends.includes(connection.id) && styles.disabledButton]}
                onPress={() => sendFriendRequest(connection.id)}
                disabled={addedFriends.includes(connection.id)}
              >
                <Text style={[styles.connectButtonText, addedFriends.includes(connection.id) && { color: '#999' }]}> 
                  {addedFriends.includes(connection.id) ? 'Added' : 'Add Friend'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.loadMoreContainer}>
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={loadMoreConnections}
              disabled={isLoading}
            >
              <Text style={styles.loadMoreText}>{isLoading ? 'Loading...' : 'Load More'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={!!selectedUser}
        onRequestClose={() => setSelectedUser(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedUser(null)}>
          <View style={styles.modalCard}>
            {isProfileLoading ? (
              <ActivityIndicator size="large" color="#006400" />
            ) : selectedUser && (
              <>
                <Image
                  source={{ uri: `https://picsum.photos/id/${selectedUser.id % 100 + 100}/200` }}
                  style={styles.modalAvatar}
                />
                <Text style={styles.modalName}>{selectedUser.name}</Text>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🎓 Education</Text>
                  <Text style={styles.sectionItem}>University/School: {selectedUser.userUni || 'Not set'}</Text>
                  <Text style={styles.sectionItem}>Field of Study: {selectedUser.userField || 'Not set'}</Text>
                  <Text style={styles.sectionItem}>Level of Study: {selectedUser.levelOfStudy || 'Not set'}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📍 Destination</Text>
                  <Text style={styles.sectionItem}>Target City: {selectedUser.userCity || 'Not set'}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🗣 Language</Text>
                  <Text style={styles.sectionItem}>Preferred Language: {selectedUser.userLanguage || 'Not set'}</Text>
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  section: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#006400', marginBottom: 8 },
  sectionItem: { fontSize: 14, color: '#333', marginBottom: 4 },
  connectionCard: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  connectionInfo: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  text: { fontSize: 14, color: '#333', marginBottom: 2 },
  name: { fontWeight: 'bold' },
  connectButton: {
    backgroundColor: '#006400',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
  },
  connectButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  disabledButton: { backgroundColor: '#ddd' },
  findConnectionsOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  findOption: { alignItems: 'center', width: '23%', marginBottom: 8 },
  findOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  findOptionText: { fontSize: 12, color: '#333', textAlign: 'center' },
  activeFilter: { opacity: 0.5 },
  loadMoreContainer: { alignItems: 'center', marginTop: 10 },
  loadMoreButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadMoreText: { fontSize: 14, color: '#333', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 15,
  },
});

export default ConnectionsScreen;
