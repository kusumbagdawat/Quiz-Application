import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode"
import { TOKEN_KEY } from "../lib/api"

export type Role = "ROLE_ADMIN" | "ROLE_USER" | string

export interface DecodedToken {
  sub?: string
  email?: string
  name?: string
  role?: Role
  roles?: Role[]
  authorities?: string[]
  exp?: number
  [key: string]: unknown
}

export interface AuthUser {
  email: string
  name: string
  role: Role
  raw: DecodedToken
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function parseUser(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token)

    // Expiry check
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null
    }

    // Normalize role across common JWT shapes
    let role: Role = "ROLE_USER"
    if (decoded.role) {
      role = decoded.role
    } else if (Array.isArray(decoded.roles) && decoded.roles.length) {
      role = decoded.roles[0]
    } else if (Array.isArray(decoded.authorities) && decoded.authorities.length) {
      role = decoded.authorities[0]
    }

    const email = decoded.email || decoded.sub || ""
    const name = decoded.name || (email ? email.split("@")[0] : "User")

    return { email, name, role, raw: decoded }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    return stored ? parseUser(stored) : null
  })

  useEffect(() => {
    if (token) {
      const parsed = parseUser(token)
      if (parsed) {
        localStorage.setItem(TOKEN_KEY, token)
        setUser(parsed)
      } else {
        // invalid or expired
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      }
    } else {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
    }
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ROLE_ADMIN",
      login: (newToken: string) => setToken(newToken),
      logout: () => setToken(null),
    }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
