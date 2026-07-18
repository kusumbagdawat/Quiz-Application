import { useEffect, useState } from "react"
import { Trophy, RefreshCw } from "lucide-react"
import api from "../../lib/api"
import { useAuth } from "../../context/AuthContext"
import PageHeader from "../../components/layout/PageHeader"
import { Card, Badge } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Alert, LoadingState, EmptyState } from "../../components/ui/Feedback"
import { formatDate } from "../../lib/utils"

interface Result {
  id?: number
  quizId?: number | string
  score?: number
  attemptDate?: string
  date?: string
}

export default function MyResults() {
  const { user } = useAuth()
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!user?.email) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get<Result[]>(`/result/user/${encodeURIComponent(user.email)}`)
      setResults(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load your results.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email])

  const best = results.reduce((m, r) => Math.max(m, r.score ?? 0), 0)

  return (
    <div>
      <PageHeader
        icon={Trophy}
        title="My Results"
        subtitle="Your quiz attempts and scores."
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

      {loading ? (
        <LoadingState label="Loading your results..." />
      ) : results.length === 0 ? (
        <EmptyState
          title="No attempts yet"
          description="Take a quiz from the Available Quizzes page to see your results here."
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card className="text-center">
              <p className="text-sm text-muted-foreground">Total Attempts</p>
              <p className="mt-1 text-3xl font-bold">{results.length}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-muted-foreground">Best Score</p>
              <p className="mt-1 text-3xl font-bold text-accent">{best}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-muted-foreground">Latest Attempt</p>
              <p className="mt-1 text-sm font-medium">
                {formatDate(results[0]?.attemptDate || results[0]?.date)}
              </p>
            </Card>
          </div>

          <Card className="animate-fade-in-up overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
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
                      <td className="px-6 py-4 font-medium text-foreground">#{r.quizId ?? "—"}</td>
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
        </>
      )}
    </div>
  )
}
