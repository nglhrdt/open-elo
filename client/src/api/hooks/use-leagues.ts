import type { GAME, GetLeaguesParams, League, Member, User } from '@open-elo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

const LEAGUES_QUERY_KEY = ['leagues'];

const fetchLeagues = async (params: GetLeaguesParams): Promise<League[]> => {
  return apiClient.get<League[]>('/leagues', { params });
};

export const useGetLeagues = (params: GetLeaguesParams) => {
  return useQuery<League[], Error>({ queryKey: [...LEAGUES_QUERY_KEY, params], queryFn: () => fetchLeagues(params) });
};

const fetchLeagueById = async (leagueId: string): Promise<League> => {
  return apiClient.get<League>(`/leagues/${leagueId}`);
}

export const useGetLeagueById = (leagueId: string) => {
  return useQuery<League, Error>({
    queryKey: [...LEAGUES_QUERY_KEY, leagueId],
    queryFn: () => fetchLeagueById(leagueId),
  });
}

const fetchLeagueMembers = async (leagueId: string): Promise<Member[]> => {
  return apiClient.get<Member[]>(`/leagues/${leagueId}/members`);
}

export const useGetLeagueMembers = (leagueId: string) => {
  return useQuery<Member[], Error>({
    queryKey: [...LEAGUES_QUERY_KEY, leagueId, 'members'],
    queryFn: () => fetchLeagueMembers(leagueId),
  });
}

const createGuestUser = async (leagueId: string, username: string) => {
  return apiClient.post<User>(`/leagues/${leagueId}/guests`, { username });
}

export const useCreateGuestUser = (leagueId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => createGuestUser(leagueId, username),
    onSuccess: () => {
      // Invalidate members query to refetch the updated list of members
      queryClient.invalidateQueries({ queryKey: [...LEAGUES_QUERY_KEY, leagueId, 'members'] });
    },
  });
}

const createLeague = (data: { name: string; game: GAME; }) => {
  return apiClient.post<League>(`/leagues`, data)
}

export const useCreateLeague = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAGUES_QUERY_KEY });
    },
  });
}

const joinLeague = async (leagueId: string) => {
  return apiClient.post(`/leagues/${leagueId}/join`, {});
}

export const useJoinLeague = (leagueId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => joinLeague(leagueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAGUES_QUERY_KEY });
    },
  });
}
