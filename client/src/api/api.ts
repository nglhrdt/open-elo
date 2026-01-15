import qs from 'qs';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

// Small helper that adds Authorization header (if token exists) and JSON Content-Type (when body is present)
async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const url = input.startsWith('http') ? input : `${baseUrl}${input}`;
  const token = localStorage.getItem('auth_token') ?? '';
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return fetch(url, { ...init, headers });
}

export type Team = 'home' | 'away';

export interface Game {
  id: string;
  score: string;
  leagueId: string;
  league: League;
  createdAt: Date;
  updatedAt: Date;
  players: Player[];
}

export interface Player {
  id: number;
  team: Team;
  user: User;
  eloBefore: number;
  eloAfter: number;
}

export type UserRole = 'user' | 'admin' | 'guest';

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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
  createdAt?: Date;
  updatedAt?: Date;
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
  const res = await apiFetch(`/me`);
  if (!res.ok) return null;
  return res.json();
}

export function createUser(data: {
  username: string;
  role: UserRole;
}): Promise<User> {
  return apiFetch(`/users`, {
    method: 'POST',
    body: JSON.stringify({ username: data.username, role: data.role }),
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
  return apiFetch(`/users`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching users:', error);
      throw error;
    });
}

export function getUserById(userId: string): Promise<User> {
  return apiFetch(`/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      throw error;
    });
}

export function convertGuestToRegistered(userId: string, data: {
  email: string;
  password: string;
}): Promise<User> {
  return apiFetch(`/users/${userId}/convert-to-registered`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to convert user');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error converting user:', error);
      throw error;
    });
}

export function createLeague(data: {
  name: string;
  type: LEAGUE_TYPE;
}): Promise<void> {
  return apiFetch(`/leagues`, {
    method: 'POST',
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
  return apiFetch(`/leagues/${leagueId}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching leagues:', error);
      throw error;
    });
}

export function getLeagues(): Promise<League[]> {
  return apiFetch(`/leagues`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching leagues:', error);
      throw error;
    });
}

export function getLeagueUsers(leagueId: string): Promise<User[]> {
  return apiFetch(`/leagues/${leagueId}/users`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching users:', error);
      throw error;
    });
}

export async function joinLeague(leagueId: string) {
  const res = await apiFetch(`/leagues/${leagueId}/join`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  if (!res.ok) return null;
  return res.json();
}

export function addPlayerToLeague(data: {
  leagueId: string;
  userId: string;
}): Promise<void> {
  return apiFetch(`/leagues/${data.leagueId}/join/${data.userId}`, {
    method: 'POST',
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
  return apiFetch(`/games`, {
    method: 'POST',
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
  return apiFetch(`/leagues/${leagueId}/games${params ? `${qs.stringify(params, { addQueryPrefix: true })}` : ''}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching games:', error);
      throw error;
    });
}

export function getUserGames(userId: string, params?: { count?: number; leagueId?: string }): Promise<Game[]> {
  return apiFetch(`/users/${userId}/games${params ? `${qs.stringify(params, { addQueryPrefix: true })}` : ''}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching games:', error);
      throw error;
    });
}

export async function fetchUserRankings(): Promise<Ranking[] | null> {
  const res = await apiFetch(`/rankings`);
  if (!res.ok) return null;
  return res.json();
}
