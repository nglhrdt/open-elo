import qs from 'qs';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export type Team = 'home' | 'away';

export interface Game {
  id: string;
  score: string;
  leagueId: string;
  createdAt: Date;
  updatedAt: Date;
  players: Player[];
}

export interface Player {
  id: number;
  team: string;
  user: User;
}

export type User = {
  id: string;
  username: string;
  email: string;
}

export type LEAGUE_TYPE = "TABLE_SOCCER" | "INDOOR_SOCCER";

export interface Ranking {
  id: string;
  elo: number;
  position: number;
  league: League;
  user: User;
  leagueRankings: Ranking[];
}

export interface League {
  id: string;
  name: string;
  type: LEAGUE_TYPE;
  createdAt: Date;
  updatedAt: Date;
}

export async function login(data: { user: string, password: string }) {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(data: { username: string, email: string, password: string }) {
  const res = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function fetchCurrentUser(): Promise<User | null> {
  if (!localStorage.getItem('auth_token')) return null;
  const res = await fetch(`${baseUrl}/me`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export function createUser(data: {
  username: string;
}): Promise<void> {
  return fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, email: data.username, password: '' }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error creating game:', error);
      throw error;
    });
}

export function getUsers(): Promise<User[]> {
  return fetch(`${baseUrl}/users`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching users:', error);
      throw error;
    });
}

export function createLeague(data: {
  name: string;
  type: LEAGUE_TYPE;
}): Promise<void> {
  return fetch(`${baseUrl}/leagues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create league');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error creating league:', error);
      throw error;
    });
}

export function getLeagueById(leagueId: string): Promise<League> {
  return fetch(`${baseUrl}/leagues/${leagueId}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching leagues:', error);
      throw error;
    });
}

export function getLeagues(): Promise<League[]> {
  return fetch(`${baseUrl}/leagues`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching leagues:', error);
      throw error;
    });
}

export function getLeagueUsers(leagueId: string): Promise<User[]> {
  return fetch(`${baseUrl}/leagues/${leagueId}/users`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching users:', error);
      throw error;
    });
}

export async function joinLeague(leagueId: string) {
  const res = await fetch(`${baseUrl}/leagues/${leagueId}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) return null;
  return res.json();
}

export function addPlayerToLeague(data: {
  leagueId: string;
  userId: string;
}): Promise<void> {
  return fetch(`${baseUrl}/leagues/${data.leagueId}/join/${data.userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create league');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error creating league:', error);
      throw error;
    });
}

export function createGame(data: {
  score: string;
  players: { id: string, team: Team }[];
  leagueId: string;
}): Promise<void> {
  return fetch(`${baseUrl}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error creating game:', error);
      throw error;
    });
}

export function getLeagueGames(leagueId: string, params?: { count?: number }): Promise<Game[]> {
  return fetch(`${baseUrl}/leagues/${leagueId}/games${params ? `${qs.stringify(params, { addQueryPrefix: true })}` : ''}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching games:', error);
      throw error;
    });
}

export function getUserGames(userId: string, params?: { count?: number }): Promise<Game[]> {
  return fetch(`${baseUrl}/users/${userId}/games${params ? `${qs.stringify(params, { addQueryPrefix: true })}` : ''}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching games:', error);
      throw error;
    });
}

export async function fetchUserRankings(): Promise<Ranking[] | null> {
  const res = await fetch(`${baseUrl}/rankings`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}
