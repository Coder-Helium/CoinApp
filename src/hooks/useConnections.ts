// hooks/useConnections.ts
import { useState, useEffect, useCallback } from 'react';
import { connectionApi } from '../services/api';

export interface FilterState {
  degree: string | null;
  university: string | null;
  city: string | null;
}

export interface Connection {
  id: number;
  name: string;
  userCity: string;
  userField: string;
  userUni: string;
  email?: string;
  userLanguage?: string;
  levelOfStudy?: string;
  introduction?: string;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  degree: null,
  university: null,
  city: null,
};

export default function useConnections(filterState: FilterState = DEFAULT_FILTER_STATE, currentUserId = 0) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addedFriends, setAddedFriends] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<Connection | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);

  // fetchConnections function using the API service
  const fetchConnections = useCallback(async (pageNum: number = 1, filters: FilterState = DEFAULT_FILTER_STATE) => {
    try {
      setIsLoading(true);
      const response = await connectionApi.getConnections(pageNum, 6, currentUserId, filters);

      if (response.code === 200 && response.data) {
        const records = response.data.records || [];
        setConnections(records);
      } else {
        console.warn('Failed to fetch connections:', response.message);
        setConnections([]);
      }
    } catch (error) {
      console.error('Error in fetchConnections:', error);
      setConnections([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch connections when filterState changes
  useEffect(() => {
    fetchConnections(1, filterState);
    setPage(1);
  }, [filterState, fetchConnections]);

  // Load more connections
  const loadMoreConnections = async () => {
    const nextPage = page + 1;
    try {
      const response = await connectionApi.getConnections(nextPage, 6, currentUserId, filterState);

      if (response.code === 200 && response.data) {
        const moreRecords = response.data.records || [];
        setConnections(prev => [...prev, ...moreRecords]);
        setPage(nextPage);
      } else {
        console.warn('Failed to load more connections:', response.message);
      }
    } catch (error) {
      console.error('Error in loadMoreConnections:', error);
    }
  };

  // Send friend request using the API service
  const sendFriendRequest = async (friendId: number) => {
    if (!currentUserId) {
      console.error('Cannot send friend request: currentUserId is undefined');
      return;
    }

    try {
      console.log('Sending friend request', currentUserId, friendId);
      const result = await connectionApi.sendFriendRequest(currentUserId, friendId);

      if (result.code === 200) {
        setAddedFriends(prev => [...prev, friendId]);
      } else {
        console.warn('Friend request failed:', result.message);
      }
    } catch (error) {
      console.error('Error in sendFriendRequest:', error);
    }
  };

  // Fetch user profile using the API service
  const fetchUserProfile = async (userId: number) => {
    try {
      setIsProfileLoading(true);
      const result = await connectionApi.getUserProfile(userId);

      if (result.code === 200 && result.data) {
        setSelectedUser(result.data);
      } else {
        console.warn('Failed to fetch user profile:', result.message);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  return {
    connections,
    isLoading,
    addedFriends,
    loadMoreConnections,
    sendFriendRequest,
    fetchUserProfile,
    selectedUser,
    fetchConnections,
    setSelectedUser,
    isProfileLoading,
  };
}
