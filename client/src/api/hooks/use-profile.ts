import type { Profile } from '@open-elo/shared';
import { useQuery } from '@tanstack/react-query';
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
