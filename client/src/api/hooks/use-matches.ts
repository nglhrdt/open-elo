import type { GetMatchesParams, GetMatchesResponse } from '@open-elo/shared';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

const MATCHES_QUERY_KEY = ['matches'];

const fetchMatches = async (params: GetMatchesParams): Promise<GetMatchesResponse> => {
  return apiClient.get<GetMatchesResponse>('/matches', { params });
};

export const useGetMatches = (params: GetMatchesParams) => {
  return useQuery<GetMatchesResponse, Error>({ queryKey: [...MATCHES_QUERY_KEY, params], queryFn: () => fetchMatches(params) });
};
