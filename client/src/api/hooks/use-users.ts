import type { League, SeasonStats, User } from '@open-elo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

const USERS_QUERY_KEY = ['users'];

const fetchUsers = async () => {
  return apiClient.get<User[]>('/users');
};

export const useGetUsers = () => {
  return useQuery<User[], Error>({ queryKey: [...USERS_QUERY_KEY], queryFn: () => fetchUsers() });
};

const fetchUserById = (userId: string) => {
  return apiClient.get<User>(`/users/${userId}`);
}

export const useGetUserById = (userId: string) => {
  return useQuery<User, Error>({
    queryKey: [...USERS_QUERY_KEY, userId],
    queryFn: () => fetchUserById(userId),
  });
}

const convertGuestToRegistered = async (userId: string, data: { email: string; password: string }) => {
  return apiClient.post<User>(`/users/${userId}/convert`, data);
}

export const useConvertGuestToRegistered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { email: string; password: string } }) => convertGuestToRegistered(userId, data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY, user.id] });
    },
  });
}

const updateUser = (userId: string, data: { username: string; }): Promise<User> => {
  return apiClient.put<User>(`/users/${userId}`, data)
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { username: string; } }) => updateUser(userId, data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY, user.id] });
    },
  });
}

const deleteUser = (userId: string): Promise<{ success: boolean; message: string }> => {
  return apiClient.delete(`/users/${userId}`)
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY] });
    },
  });
}

export async function fetchOwnedLeagues(userID: string): Promise<League[]> {
  return apiClient.get<League[]>(`/users/${userID}/owned-leagues`);
}

export const useGetUserOwnedLeagues = (userId: string) => {
  return useQuery<League[], Error>({
    queryKey: [...USERS_QUERY_KEY, userId, 'owned-leagues'],
    queryFn: () => fetchOwnedLeagues(userId),
  });
}

export async function fetchUserSeasonStats(userId: string, seasonId: string): Promise<SeasonStats> {
  return apiClient.get<SeasonStats>(`/users/${userId}/seasons/${seasonId}/stats`);
}

export const useGetUserSeasonStats = (userId: string, seasonId: string) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, userId, 'seasons', seasonId, 'stats'],
    queryFn: () => fetchUserSeasonStats(userId, seasonId),
  });
}
