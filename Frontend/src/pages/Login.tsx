import { useState, type FormEvent } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react"
import api from "../lib/api"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/Button"
import { Field, Input } from "../components/ui/Input"
import { Alert } from "../components/ui/Feedback"
import { Card } from "../components/ui/Card"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/dashboard"

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post("/auth/login", { email, password })

      console.log("LOGIN RESPONSE =", data);


      // Support common token response shapes
      const token = data?.token || data?.accessToken || data?.jwt || data
      if (typeof token !== "string") {
        throw new Error("No token returned from server")
      }
      login(token)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please check your credentials.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your assessment dashboard."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Alert type="error" message={error} />
        <Field label="Email" htmlFor="email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Field>
        <Field label="Password" htmlFor="password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Field>
        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Sign in
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Register
        </Link>
      </p>
    </AuthShell>
  )
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 15% 20%, rgba(99,102,241,0.22), transparent 45%), radial-gradient(500px circle at 85% 80%, rgba(129,140,248,0.16), transparent 45%)",
        }}
      />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold tracking-tight">AssessPro</span>
        </Link>
        <Card className="glass-strong">
          <h1 className="text-center text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </Card>
      </div>
    </div>
  )
}
