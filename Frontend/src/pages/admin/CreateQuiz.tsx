import { useState, type FormEvent } from "react"
import { PlusSquare, Sparkles } from "lucide-react"
import api from "../../lib/api"
import PageHeader from "../../components/layout/PageHeader"
import { Card } from "../../components/ui/Card"
import { Field, Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Alert } from "../../components/ui/Feedback"

export default function CreateQuiz() {
  const [category, setCategory] = useState("")
  const [numQuestions, setNumQuestions] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    setLoading(true)
    try {
      await api.post("/quiz/create", {
        categoryName: category,
        numQuestions: Number(numQuestions),
        title,
      })
      setSuccess(`Quiz "${title}" created successfully.`)
      setCategory("")
      setNumQuestions("")
      setTitle("")
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create quiz.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={PlusSquare}
        title="Create Quiz"
        subtitle="Generate a quiz from your question bank by category."
      />

      <Card className="mx-auto max-w-xl animate-fade-in-up">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Alert type="success" message={success} />
          <Alert type="error" message={error} />

          <Field label="Category Name" htmlFor="category">
            <Input
              id="category"
              required
              placeholder="e.g. Geography"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Field>

          <Field label="Number Of Questions" htmlFor="num">
            <Input
              id="num"
              type="number"
              min={1}
              required
              placeholder="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </Field>

          <Field label="Quiz Title" htmlFor="title">
            <Input
              id="title"
              required
              placeholder="World Geography Challenge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={loading}>
              <Sparkles className="h-4 w-4" />
              Create Quiz
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
