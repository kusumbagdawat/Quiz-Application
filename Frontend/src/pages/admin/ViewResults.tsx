import { useEffect, useState } from "react"
import { BarChart3, RefreshCw } from "lucide-react"
import api from "../../lib/api"
import PageHeader from "../../components/layout/PageHeader"
import { Card, Badge } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Alert, LoadingState, EmptyState } from "../../components/ui/Feedback"
import { formatDate } from "../../lib/utils"

interface Result {
  id?: number
  userEmail?: string
  email?: string
  quizId?: number | string
  score?: number
  attemptDate?: string
  date?: string
}

export default function ViewResults() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get<Result[]>("/result/all")
      setResults(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load results.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

const totalAttempts = results.length

const highestScore =
  results.length > 0
    ? Math.max(...results.map((r) => r.score || 0))
    : 0

const averageScore =
  results.length > 0
    ? (
        results.reduce((sum, r) => sum + (r.score || 0), 0) /
        results.length
      ).toFixed(1)
    : 0

const uniqueUsers = new Set(
  results.map((r) => r.userEmail || r.email)
).size

  return (
    <div>
      <PageHeader
        icon={BarChart3}
        title="View Results"
        subtitle="All quiz attempts across every user."
        action={
          <Button variant="secondary" onClick={load} disabled={loading}>
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
        }
      />

      <div className="mb-4">
        <Alert type="error" message={error} />
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="text-center">
          <p className="text-sm text-muted-foreground">
            Total Attempts
          </p>
          <p className="mt-2 text-3xl font-bold">
            {totalAttempts}
          </p>
        </Card>

        <Card className="text-center">
          <p className="text-sm text-muted-foreground">
            Highest Score
          </p>
          <p className="mt-2 text-3xl font-bold">
            {highestScore}
          </p>
        </Card>

        <Card className="text-center">
          <p className="text-sm text-muted-foreground">
            Average Score
          </p>
          <p className="mt-2 text-3xl font-bold">
            {averageScore}
          </p>
        </Card>

        <Card className="text-center">
          <p className="text-sm text-muted-foreground">
            Unique Users
          </p>
          <p className="mt-2 text-3xl font-bold">
            {uniqueUsers}
          </p>
        </Card>
      </div>

      {loading ? (
        <LoadingState label="Loading results..." />
      ) : results.length === 0 ? (
        <EmptyState title="No results yet" description="Results will appear once users attempt quizzes." />
      ) : (
        <Card className="animate-fade-in-up overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-4 font-medium">User Email</th>
                  <th className="px-6 py-4 font-medium">Quiz ID</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Attempt Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={r.id ?? i}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {r.userEmail || r.email || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">#{r.quizId ?? "—"}</td>
                    <td className="px-6 py-4">
                      <Badge tone="success">{r.score ?? 0}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(r.attemptDate || r.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
