import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CheckCircle2, ArrowLeft, ArrowRight, Send, Trophy } from "lucide-react"
import api from "../../lib/api"
import { useAuth } from "../../context/AuthContext"
import { Card, Badge } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Alert, LoadingState } from "../../components/ui/Feedback"
import { cn } from "../../lib/utils"

interface Question {
  id: number
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  category?: string
}

export default function AttemptQuiz() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get<Question[]>(`/quiz/get/${id}`)
        setQuestions(Array.isArray(data) ? data : [])
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to load quiz.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  function selectAnswer(questionId: number, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const answeredCount = Object.keys(answers).length
  const total = questions.length
  const progress = total ? Math.round((answeredCount / total) * 100) : 0

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const responses = questions.map((q) => ({
        id: q.id,
        response: answers[q.id] ?? "",
      }))
      const { data } = await api.post(`/quiz/submit/${id}`, {
        userEmail: user?.email ?? "",
        responses,
      })
      const resultScore = typeof data === "number" ? data : (data?.score ?? 0)
      setScore(resultScore)
      setTimeout(() => navigate("/my-results"), 2500)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to submit quiz.")
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingState label="Loading quiz..." />

  // Success screen
  if (score !== null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="glass-strong max-w-md animate-pop-in text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
            <Trophy className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">Quiz Submitted!</h2>
          <p className="mt-2 text-muted-foreground">Here is how you scored:</p>
          <div className="mt-6 text-5xl font-bold text-accent">
            {score}
            <span className="text-2xl text-muted-foreground"> / {total}</span>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Redirecting to My Results...</p>
        </Card>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <Alert type="error" message={error} />
        <Button variant="secondary" className="mt-4" onClick={() => navigate("/quizzes")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Button>
      </div>
    )
  }

  const question = questions[current]
  const options = question
    ? [
        { key: "option1", value: question.option1 },
        { key: "option2", value: question.option2 },
        { key: "option3", value: question.option3 },
        { key: "option4", value: question.option4 },
      ]
    : []

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            Question {current + 1} of {total}
          </span>
          <span className="text-muted-foreground">{answeredCount} answered</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Alert type="error" message={error} />

      {question && (
        <Card className="animate-fade-in-up">
          {question.category && (
            <Badge tone="admin" className="mb-4">
              {question.category}
            </Badge>
          )}
          <h2 className="text-xl font-semibold leading-snug">{question.question}</h2>

          <fieldset className="mt-6 space-y-3">
            <legend className="sr-only">Answer options</legend>
            {options.map((opt) => {
              const selected = answers[question.id] === opt.value
              return (
                <label
                  key={opt.key}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition-all duration-200",
                    selected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-muted/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      selected ? "border-primary bg-primary" : "border-muted-foreground",
                    )}
                  >
                    {selected && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                  </span>
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={opt.value}
                    checked={selected}
                    onChange={() => selectAnswer(question.id, opt.value)}
                    className="sr-only"
                  />
                  {opt.value}
                </label>
              )
            })}
          </fieldset>
        </Card>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {current < total - 1 ? (
          <Button onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}>
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="primary" loading={submitting} onClick={handleSubmit}>
            <Send className="h-4 w-4" />
            Submit Quiz
          </Button>
        )}
      </div>

      {/* Question dots */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrent(i)}
            aria-label={`Go to question ${i + 1}`}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium transition-colors",
              i === current
                ? "bg-primary text-primary-foreground"
                : answers[q.id]
                  ? "bg-success/20 text-success"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {answers[q.id] ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
