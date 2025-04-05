// hooks/useConnections.ts
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

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

interface ApiResponse {
  code: number;
  message: string;
  data: {
    records: Connection[];
  } | null;
}

interface ProfileResponse {
  code: number;
  message: string;
  data: Connection | null;
}

export default function useConnections(filterState: FilterState, currentUserId: number) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addedFriends, setAddedFriends] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<Connection | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchConnections(1, filterState);
    setPage(1);
  }, [filterState]);

  const buildQuery = (filters: FilterState, pageNum: number = 1, size: number = 6): string => {
    const params = new URLSearchParams({
      current: pageNum.toString(),
      size: size.toString(),
    });
    if (filters.degree) params.append('field', filters.degree);
    if (filters.university) params.append('university', filters.university);
    if (filters.city) params.append('city', filters.city);
    return params.toString();
  };

  const fetchConnections = async (pageNum: number = 1, filters: FilterState = {}) => {
    try {
      setIsLoading(true);
      const query = buildQuery(filters, pageNum);
      const res = await fetch(`${API_BASE_URL}/user/randomPage?${query}`);
      const json: ApiResponse = await res.json();
      const records = json?.data?.records || [];
      setConnections(records);
    } catch (error) {
      console.error('Failed to fetch connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreConnections = async () => {
    const nextPage = page + 1;
    try {
      const query = buildQuery(filterState, nextPage);
      const res = await fetch(`${API_BASE_URL}/user/randomPage?${query}`);
      const json: ApiResponse = await res.json();
      const moreRecords = json?.data?.records || [];
      setConnections(prev => [...prev, ...moreRecords]);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more connections:', error);
    }
  };

  const sendFriendRequest = async (friendId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, friendId }),
      });
      const result = await res.json();
      if (result.code === 200) {
        setAddedFriends(prev => [...prev, friendId]);
      } else {
        console.warn('Friend request failed:', result.message);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const fetchUserProfile = async (userId: number) => {
    try {
      setIsProfileLoading(true);
      const res = await fetch(`${API_BASE_URL}/user/detail/${userId}`);
      const json: ProfileResponse = await res.json();
      if (json.code === 200 && json.data) {
        setSelectedUser(json.data);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
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
    setSelectedUser,
    isProfileLoading,
  };
}
