import type { GetPlayersParams, Player } from '@open-elo/shared';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

const PLAYERS_QUERY_KEY = ['players'];

const fetchPlayers = async (params: GetPlayersParams): Promise<Player[]> => {
  return apiClient.get<Player[]>('/players', { params });
};

export const useGetPlayers = (params: GetPlayersParams) => {
  return useQuery<Player[], Error>({ queryKey: [...PLAYERS_QUERY_KEY, params], queryFn: () => fetchPlayers(params) });
};
