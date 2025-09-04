import type { User } from "@/api/api"
import { useEffect, useState, type ReactNode } from "react"
import { AuthContext } from "./AuthContext"

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      // Optionally, fetch user data with the token here
    }
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token)
    }
  }, [token])

  const value = {
    user,
    token,
    setUser,
    setToken,
    logout,
  }

  return (
    <AuthContext.Provider {...props} value={value}>
      {children}
    </AuthContext.Provider>
  )
}
