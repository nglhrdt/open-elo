import type { CreateMatchData, EloChartData, GetSeasonsParams, Match, Ranking, Season } from '@open-elo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

const SEASONS_QUERY_KEY = ['seasons'];

const fetchSeasons = async (params: GetSeasonsParams): Promise<Season[]> => {
  return apiClient.get<Season[]>('/seasons', { params });
};

export const useGetSeasons = (params: GetSeasonsParams) => {
  return useQuery<Season[], Error>({ queryKey: [...SEASONS_QUERY_KEY, params], queryFn: () => fetchSeasons(params) });
};

const fetchSeasonById = async (seasonId: string): Promise<Season> => {
  return apiClient.get<Season>(`/seasons/${seasonId}`);
}

export const useGetSeasonById = (seasonId: string) => {
  return useQuery<Season, Error>({ queryKey: [...SEASONS_QUERY_KEY, seasonId], queryFn: () => fetchSeasonById(seasonId) });
};

const fetchSeasonRankings = async (seasonId: string): Promise<Ranking[]> => {
  return apiClient.get<Ranking[]>(`/seasons/${seasonId}/rankings`);
}

export const useGetSeasonRanking = (seasonId: string) => {
  return useQuery<Ranking[], Error>({ queryKey: [...SEASONS_QUERY_KEY, seasonId, 'rankings'], queryFn: () => fetchSeasonRankings(seasonId) });
}

const fetchSeasonMatches = async (seasonId: string, params: { count?: number }): Promise<Match[]> => {
  return apiClient.get<Match[]>(`/seasons/${seasonId}/matches`, { params });
}

export const useGetSeasonMatches = (seasonId: string, params: { count?: number }) => {
  return useQuery<Match[], Error>({ queryKey: [...SEASONS_QUERY_KEY, seasonId, 'matches', params], queryFn: () => fetchSeasonMatches(seasonId, params) });
}

const fetchSeasonEloChart = async (seasonId: string): Promise<EloChartData[]> => {
  return apiClient.get<EloChartData[]>(`/seasons/${seasonId}/elo-chart`);
}

export const useGetSeasonEloChart = (seasonId: string) => {
  return useQuery<EloChartData[], Error>({ queryKey: [...SEASONS_QUERY_KEY, seasonId, 'elo-chart'], queryFn: () => fetchSeasonEloChart(seasonId) });
}

const createMatch = async (match: CreateMatchData) => {
  return apiClient.post<Match>(`/seasons/${match.seasonId}/matches`, match);
}

export const useCreateSeasonMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEASONS_QUERY_KEY });
    }
  });
};

export const useSetSeasonEnd = (seasonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { endAt?: string }) => apiClient.put<Season>(`/seasons/${seasonId}/set-end`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEASONS_QUERY_KEY });
    }
  });
};
