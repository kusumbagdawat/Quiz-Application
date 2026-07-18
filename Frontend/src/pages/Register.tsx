import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Mail, Lock, ArrowRight } from "lucide-react"
import api from "../lib/api"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/Button"
import { Field, Input, Select } from "../components/ui/Input"
import { Alert } from "../components/ui/Feedback"
import { AuthShell } from "./Login"

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      }
      const { data } = await api.post("/auth/register", payload)
     setSuccess("Account created successfully. Redirecting to login...")

     setTimeout(() => {
       navigate("/login")
     }, 1500)

      setSuccess("Account created successfully. Redirecting to login...")
      setTimeout(() => navigate("/login"), 1200)
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Registration failed. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start building assessments in minutes.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <Field label="Full name" htmlFor="name">
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              required
              placeholder="Ada Lovelace"
              className="pl-10"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
        </Field>

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
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" htmlFor="password">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pl-10"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
          </Field>
          <Field label="Confirm" htmlFor="confirm">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="pl-10"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
              />
            </div>
          </Field>
        </div>



        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Create account
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
