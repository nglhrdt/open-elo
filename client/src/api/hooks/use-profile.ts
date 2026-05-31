import type { Profile } from '@open-elo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

const PROFILE_QUERY_KEY = ['profile'];

const fetchProfile = () => {
  return apiClient.get<Profile>(`/profile`);
}

export const useGetProfile = () => {
  return useQuery<Profile, Error>({
    queryKey: [...PROFILE_QUERY_KEY],
    queryFn: () => fetchProfile(),
  });
}

export const useUploadAvatar = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return apiClient.upload<{ avatarUrl: string }>(`/users/${userId}/avatar`, formData);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
};

export const useDeleteAvatar = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete<{ avatarUrl: null }>(`/users/${userId}/avatar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
};
