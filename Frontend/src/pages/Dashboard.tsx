import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { adminNav, userNav } from "../lib/navigation"
import { Card, Badge } from "../components/ui/Card"
import { useEffect, useState } from "react"
import api from "../lib/api"

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const items = isAdmin ? adminNav : userNav
 const [stats, setStats] = useState({
   questions: 0,
   quizzes: 0,
   attempts: 0,
   bestScore: 0,
   latestScore: 0,
 })
useEffect(() => {
  async function loadStats() {
    try {
      if (isAdmin) {
        const [questions, quizzes, results] = await Promise.all([
          api.get("/question/allQuestions"),
          api.get("/quiz/all"),
          api.get("/result/all"),
        ])

     const resultsData = results.data || []

     const bestScore =
       resultsData.length > 0
         ? Math.max(...resultsData.map((r: any) => r.score || 0))
         : 0

     const latestScore =
       resultsData.length > 0
         ? resultsData[0]?.score || 0
         : 0

     setStats({
       questions: 0,
       quizzes: quizzes.data.length,
       attempts: resultsData.length,
       bestScore,
       latestScore,
     })
      } else {
        const [quizzes, results] = await Promise.all([
          api.get("/quiz/all"),
          api.get(`/result/user/${user?.email}`),
        ])

        setStats({
          questions: 0,
          quizzes: quizzes.data.length,
          attempts: results.data.length,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  loadStats()
}, [isAdmin, user?.email])
  return (

    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center">
          <Badge tone={isAdmin ? "admin" : "user"}>
            {isAdmin ? "Administrator" : "Standard User"}
          </Badge>
        </div>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isAdmin
            ? "Manage your question bank, quizzes, and monitor results."
            : "Take quizzes, track your progress, and manage your profile."}
        </p>
      </div>
<div className="grid gap-4 sm:grid-cols-3">
  {isAdmin ? (
    <>
      <Card className="text-center">
        <p className="text-sm text-muted-foreground">Questions</p>
        <p className="mt-2 text-3xl font-bold">{stats.questions}</p>
      </Card>

      <Card className="text-center">
        <p className="text-sm text-muted-foreground">Quizzes</p>
        <p className="mt-2 text-3xl font-bold">{stats.quizzes}</p>
      </Card>

      <Card className="text-center">
        <p className="text-sm text-muted-foreground">Attempts</p>
        <p className="mt-2 text-3xl font-bold">{stats.attempts}</p>
      </Card>
    </>
 ) : (
   <>
     <Card className="text-center">
       <p className="text-sm text-muted-foreground">
         Available Quizzes
       </p>
       <p className="mt-2 text-3xl font-bold">
         {stats.quizzes}
       </p>
     </Card>

     <Card className="text-center">
       <p className="text-sm text-muted-foreground">
         My Attempts
       </p>
       <p className="mt-2 text-3xl font-bold">
         {stats.attempts}
       </p>
     </Card>

     <Card className="text-center">
       <p className="text-sm text-muted-foreground">
         Best Score
       </p>
       <p className="mt-2 text-3xl font-bold">
         {stats.bestScore}
       </p>
     </Card>

     <Card className="text-center">
       <p className="text-sm text-muted-foreground">
         Latest Score
       </p>
       <p className="mt-2 text-3xl font-bold">
         {stats.latestScore}
       </p>
     </Card>
   </>
 )}
</div>
      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <Link key={item.to} to={item.to} className="group block">
            <Card
              className="h-full animate-fade-in-up transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
