import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, ShieldCheck, UserCircle, Mail, KeyRound, LogOut, Save } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import PageHeader from "../../components/layout/PageHeader"
import { Card, Badge } from "../../components/ui/Card"
import { Field, Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Alert } from "../../components/ui/Feedback"

export default function Profile() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [notice, setNotice] = useState<string | null>(null)

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setNotice("Profile form is ready. Connect it to your update endpoint to persist changes.")
  }

  return (
    <div>
      <PageHeader icon={User} title="Profile" subtitle="Manage your account information." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Identity card */}
        <Card className="glass-strong flex flex-col items-center text-center lg:col-span-1">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-accent">
            {isAdmin ? <ShieldCheck className="h-10 w-10" /> : <UserCircle className="h-10 w-10" />}
          </span>
          <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {user?.email}
          </p>
          <div className="mt-4">
            <Badge tone={isAdmin ? "admin" : "user"}>
              {isAdmin ? "Administrator" : "Standard User"}
            </Badge>
          </div>
          <div className="mt-6 w-full border-t border-border pt-6">
            <Button variant="danger" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </Card>

        {/* Forms */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Alert type="info" message={notice} />

          {/* Edit profile */}
          <Card>
            <h3 className="text-lg font-semibold">Edit Profile</h3>
            <p className="mt-1 text-sm text-muted-foreground">Update your display information.</p>
            <form onSubmit={handleProfileSave} className="mt-5 flex flex-col gap-4">
              <Field label="Name" htmlFor="name">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Change password */}
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <KeyRound className="h-5 w-5 text-accent" />
              Change Password
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your password to keep your account secure.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setNotice("Change password UI is ready. Connect it to your backend endpoint.")
              }}
              className="mt-5 flex flex-col gap-4"
            >
              <Field label="Current Password" htmlFor="current">
                <Input id="current" type="password" placeholder="••••••••" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="New Password" htmlFor="new">
                  <Input id="new" type="password" placeholder="••••••••" />
                </Field>
                <Field label="Confirm New Password" htmlFor="confirm">
                  <Input id="confirm" type="password" placeholder="••••••••" />
                </Field>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="outline">
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
