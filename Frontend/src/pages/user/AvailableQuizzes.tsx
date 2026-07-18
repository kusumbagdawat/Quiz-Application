import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, Play, RefreshCw, HelpCircle } from "lucide-react"
import api from "../../lib/api"
import PageHeader from "../../components/layout/PageHeader"
import { Card, Badge } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Alert, LoadingState, EmptyState } from "../../components/ui/Feedback"

interface Quiz {
  id: number
  title?: string
  quizTitle?: string
  category?: string
  numQuestions?: number
}

export default function AvailableQuizzes() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get<Quiz[]>("/quiz/all")
      setQuizzes(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load quizzes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <PageHeader
        icon={BookOpen}
        title="Available Quizzes"
        subtitle="Choose a quiz and test your knowledge."
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
        <LoadingState label="Loading quizzes..." />
      ) : quizzes.length === 0 ? (
        <EmptyState title="No quizzes available" description="Check back later once an admin creates a quiz." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, idx) => {
            const title = quiz.title || quiz.quizTitle || `Quiz #${quiz.id}`
            return (
              <Card
                key={quiz.id}
                className="group flex h-full animate-fade-in-up flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="h-6 w-6" />
                  </span>
                  <Badge>ID #{quiz.id}</Badge>
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug">{title}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {quiz.category && <Badge tone="admin">{quiz.category}</Badge>}
                  {typeof quiz.numQuestions === "number" && (
                    <span className="inline-flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      {quiz.numQuestions} questions
                    </span>
                  )}
                </div>
                <div className="mt-auto pt-6">
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/quizzes/${quiz.id}/attempt`)}
                  >
                    <Play className="h-4 w-4" />
                    Start Quiz
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
