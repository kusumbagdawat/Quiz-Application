import { useEffect, useState } from "react"
import { ListChecks, Trash2, Pencil, RefreshCw, CheckCircle2 } from "lucide-react"
import api from "../../lib/api"
import PageHeader from "../../components/layout/PageHeader"
import { Card, Badge } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Field, Input, Textarea } from "../../components/ui/Input"
import { Alert, LoadingState, EmptyState } from "../../components/ui/Feedback"
import Modal from "../../components/ui/Modal"

interface Question {
  id: number
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  rightAnswer: string
  difficultyLevel: string
  category: string
}

export default function ManageQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Question | null>(null)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [deleteQuestion, setDeleteQuestion] = useState<Question | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState("")

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get<Question[]>("/question/allQuestions")
      setQuestions(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load questions.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: number) {
    setDeletingId(id)
    setNotice(null)
    setError(null)
    try {
      await api.delete(`/question/delete/${id}`)
      setQuestions((prev) => prev.filter((q) => q.id !== id))
      setNotice("Question deleted successfully.")
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete question.")
    } finally {
      setDeletingId(null)
    }
  }
const filteredQuestions = questions.filter((q) => {
  const matchesSearch =
    q.question?.toLowerCase().includes(search.toLowerCase())

  const matchesCategory =
    categoryFilter === "" ||
    q.category?.toLowerCase().includes(categoryFilter.toLowerCase())

  const matchesDifficulty =
    difficultyFilter === "" ||
    q.difficultyLevel === difficultyFilter

  return (
    matchesSearch &&
    matchesCategory &&
    matchesDifficulty
  )
})


  return (
    <div>
      <PageHeader
        icon={ListChecks}
        title="Manage Questions"
    subtitle={`${filteredQuestions.length} question${filteredQuestions.length === 1 ? "" : "s"} found.`}
        action={
          <Button variant="secondary" onClick={load} disabled={loading}>
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
        }
      />
      <Card className="mb-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Input
            placeholder="Filter by category..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-input/60 px-4 py-3 text-sm"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </Card>
      <div className="mb-4 space-y-3">
        <Alert type="success" message={notice} />
        <Alert type="error" message={error} />
      </div>

      {loading ? (
        <LoadingState label="Loading questions..." />
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="Add questions from the Add Question page to populate the bank."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredQuestions.map((q, idx) => (
            <Card
              key={q.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 40}ms` }}
            >

             <div className="flex items-start justify-between gap-3">
               <div className="flex gap-2">
                 <Badge tone="admin">{q.category}</Badge>
                 <Badge tone="warning">{q.difficultyLevel}</Badge>
               </div>

               <span className="text-xs text-muted-foreground">#{q.id}</span>
             </div>
              <h3 className="mt-3 font-semibold leading-snug">{q.question}</h3>
              <ul className="mt-4 space-y-2">
                {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => {
                  const correct = opt === q.rightAnswer
                  return (
                    <li
                      key={i}
                      className={
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm " +
                        (correct
                          ? "border-success/40 bg-success/10 text-success"
                          : "border-border bg-muted/40 text-muted-foreground")
                      }
                    >
                      {correct && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                      <span>{opt}</span>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-5 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(q)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setDeleteQuestion(q)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

     <EditQuestionModal
       question={editing}
       onClose={() => setEditing(null)}
       onUpdated={load}
     />
     <Modal
       open={!!deleteQuestion}
       onClose={() => setDeleteQuestion(null)}
       title="Delete Question"
     >
       {deleteQuestion && (
         <div className="space-y-4">
           <p className="text-sm text-muted-foreground">
             Are you sure you want to delete this question?
           </p>

           <div className="rounded-xl border border-border p-3 text-sm">
             {deleteQuestion.question}
           </div>

           <div className="flex justify-end gap-3">
             <Button
               variant="secondary"
               onClick={() => setDeleteQuestion(null)}
             >
               Cancel
             </Button>

             <Button
               variant="danger"
               loading={deletingId === deleteQuestion.id}
               onClick={async () => {
                 await handleDelete(deleteQuestion.id)
                 setDeleteQuestion(null)
               }}
             >
               Delete
             </Button>
           </div>
         </div>
       )}
     </Modal>
    </div>
  )
}

function EditQuestionModal({
  question,
  onClose,
  onUpdated,
}: {
  question: Question | null
  onClose: () => void
  onUpdated: () => void
}) {
    const [form, setForm] = useState({
      question: question?.question || "",
      option1: question?.option1 || "",
      option2: question?.option2 || "",
      option3: question?.option3 || "",
      option4: question?.option4 || "",
      rightAnswer: question?.rightAnswer || "",
      difficultyLevel: question?.difficultyLevel || "",
      category: question?.category || "",
    })

    useEffect(() => {
      if (question) {
        setForm({
          question: question.question,
          option1: question.option1,
          option2: question.option2,
          option3: question.option3,
          option4: question.option4,
          rightAnswer: question.rightAnswer,
          difficultyLevel: question.difficultyLevel,
          category: question.category,
        })
      }
    }, [question])

const [saving, setSaving] = useState(false)
const [message, setMessage] = useState<string | null>(null)

async function handleSave() {
  if (!question) return

  setSaving(true)
  setMessage(null)

  try {
    await api.put(`/question/update/${question.id}`, form)

    setMessage("Question updated successfully.")

    onUpdated()

    setTimeout(() => {
      onClose()
    }, 800)
  } catch (err: any) {
    setMessage(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update question."
    )
  } finally {
    setSaving(false)
  }
}

  return (
    <Modal open={!!question} onClose={onClose} title="Edit Question">
      {question && (
        <div className="flex flex-col gap-4">
       <Alert type="success" message={message} />
          <Field label="Question">
            <Textarea
              value={form.question}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
           <Field label="Option 1">
             <Input
               value={form.option1}
               onChange={(e) =>
                 setForm((prev) => ({
                   ...prev,
                   option1: e.target.value,
                 }))
               }
             />
           </Field>

           <Field label="Option 2">
             <Input
               value={form.option2}
               onChange={(e) =>
                 setForm((prev) => ({
                   ...prev,
                   option2: e.target.value,
                 }))
               }
             />
           </Field>

           <Field label="Option 3">
             <Input
               value={form.option3}
               onChange={(e) =>
                 setForm((prev) => ({
                   ...prev,
                   option3: e.target.value,
                 }))
               }
             />
           </Field>

           <Field label="Option 4">
             <Input
               value={form.option4}
               onChange={(e) =>
                 setForm((prev) => ({
                   ...prev,
                   option4: e.target.value,
                 }))
               }
             />
           </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
         <Field label="Right Answer">
           <Input
             value={form.rightAnswer}
             onChange={(e) =>
               setForm((prev) => ({
                 ...prev,
                 rightAnswer: e.target.value,
               }))
             }
           />
         </Field>

         <Field label="Category">
           <Input
             value={form.category}
             onChange={(e) =>
               setForm((prev) => ({
                 ...prev,
                 category: e.target.value,
               }))
             }
           />
         </Field>
         <Field label="Difficulty Level">
           <Input
             value={form.difficultyLevel}
             onChange={(e) =>
               setForm((prev) => ({
                 ...prev,
                 difficultyLevel: e.target.value,
               }))
             }
           />
         </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
