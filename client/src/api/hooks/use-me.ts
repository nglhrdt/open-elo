import type { User } from '@open-elo/shared';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

const ME_QUERY_KEY = ['me'];

const fetchMe = () => {
  return apiClient.get<User>(`/me`);
}

export const useGetMe = () => {
  return useQuery<User | null, Error>({
    queryKey: [...ME_QUERY_KEY],
    queryFn: () => fetchMe(),
    retry: false,
  });
}
