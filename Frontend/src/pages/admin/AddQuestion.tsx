import { useState, type FormEvent } from "react"
import { FilePlus2, Save } from "lucide-react"
import api from "../../lib/api"
import PageHeader from "../../components/layout/PageHeader"
import { Card } from "../../components/ui/Card"
import { Field, Input, Textarea } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Alert } from "../../components/ui/Feedback"

const emptyForm = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  rightAnswer: "",
  difficultyLevel: "",
  category: "",
}

export default function AddQuestion() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const options = [form.option1, form.option2, form.option3, form.option4].filter(Boolean)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    setLoading(true)
    console.log("FORM DATA =", form)
    try {
    await api.post("/question/add", {
      question: form.question,
      option1: form.option1,
      option2: form.option2,
      option3: form.option3,
      option4: form.option4,
      rightAnswer: form.rightAnswer,
      difficultyLevel: form.difficultyLevel,
      category: form.category,
    })
      setSuccess("Question added successfully.")
      setForm(emptyForm)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to add question.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={FilePlus2}
        title="Add Question"
        subtitle="Create a new question for your question bank."
      />

      <Card className="mx-auto max-w-3xl animate-fade-in-up">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Alert type="success" message={success} />
          <Alert type="error" message={error} />

         <Field label="Question" htmlFor="question">
           <Textarea
             id="question"
             required
             placeholder="What is the capital of France?"
             value={form.question}
             onChange={(e) => update("question", e.target.value)}
           />
         </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Option 1" htmlFor="option1">
              <Input
                id="option1"
                required
                placeholder="Option 1"
                value={form.option1}
                onChange={(e) => update("option1", e.target.value)}
              />
            </Field>
            <Field label="Option 2" htmlFor="option2">
              <Input
                id="option2"
                required
                placeholder="Option 2"
                value={form.option2}
                onChange={(e) => update("option2", e.target.value)}
              />
            </Field>
            <Field label="Option 3" htmlFor="option3">
              <Input
                id="option3"
                required
                placeholder="Option 3"
                value={form.option3}
                onChange={(e) => update("option3", e.target.value)}
              />
            </Field>
            <Field label="Option 4" htmlFor="option4">
              <Input
                id="option4"
                required
                placeholder="Option 4"
                value={form.option4}
                onChange={(e) => update("option4", e.target.value)}
              />
            </Field>
          </div>

       <div className="grid gap-5 sm:grid-cols-3">
         <Field label="Right Answer" htmlFor="rightAnswer">
           <Input
             id="rightAnswer"
             required
             list="option-suggestions"
             placeholder="Exact matching option text"
             value={form.rightAnswer}
             onChange={(e) => update("rightAnswer", e.target.value)}
           />
           <datalist id="option-suggestions">
             {options.map((opt, i) => (
               <option key={i} value={opt} />
             ))}
           </datalist>
         </Field>

         <Field label="Difficulty Level" htmlFor="difficultyLevel">
           <select
             id="difficultyLevel"
             required
             value={form.difficultyLevel}
             onChange={(e) => update("difficultyLevel", e.target.value)}
             className="w-full rounded-xl bg-input/60 border border-border px-4 py-3 text-sm"
           >
             <option value="">Select Difficulty</option>
             <option value="Easy">Easy</option>
             <option value="Medium">Medium</option>
             <option value="Hard">Hard</option>
           </select>
         </Field>

         <Field label="Category" htmlFor="category">
           <Input
             id="category"
             required
             placeholder="e.g. Geography"
             value={form.category}
             onChange={(e) => update("category", e.target.value)}
           />
         </Field>
       </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setForm(emptyForm)}
              disabled={loading}
            >
              Reset
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="h-4 w-4" />
              Save Question
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
