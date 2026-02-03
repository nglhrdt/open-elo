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
    sessionStorage.removeItem("auth_token")
    localStorage.removeItem("stay_signed_in")
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      // Optionally, fetch user data with the token here
    }
  }, [])

  useEffect(() => {
    if (token) {
      // Update the appropriate storage based on stay_signed_in preference
      const staySignedIn = localStorage.getItem("stay_signed_in") === "true"
      if (staySignedIn) {
        localStorage.setItem("auth_token", token)
      } else {
        sessionStorage.setItem("auth_token", token)
      }
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
