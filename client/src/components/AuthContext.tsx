import type { User } from "@/api/api";
import { createContext } from "react";

export type AuthState = {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

const initialState: AuthState = {
  user: null,
  token: null,
  setUser: () => null,
  setToken: () => null,
  logout: () => null,
}

export const AuthContext = createContext<AuthState>(initialState);
