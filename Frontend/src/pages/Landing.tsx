import { Link } from "react-router-dom"
import {
  GraduationCap,
  ArrowRight,
  ListChecks,
  Database,
  BarChart3,
  ShieldCheck,
  Code2,
  Mail,
  Globe,
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"

const features = [
  {
    icon: ListChecks,
    title: "Quiz Management",
    desc: "Create, organize, and publish quizzes across categories in seconds with a streamlined workflow.",
  },
  {
    icon: Database,
    title: "Question Bank",
    desc: "Build a reusable repository of multiple-choice questions and generate quizzes automatically.",
  },
  {
    icon: BarChart3,
    title: "Result Analytics",
    desc: "Track scores, attempts, and performance trends for every learner in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure JWT Authentication",
    desc: "Role-based access with stateless JWT tokens keeps admins and users properly scoped.",
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-30 glass-strong">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">AssessPro</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px circle at 20% 10%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(500px circle at 85% 25%, rgba(129,140,248,0.18), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-accent animate-fade-in-up">
            Microservices-powered assessment engine
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-6xl animate-fade-in-up">
            The modern <span className="text-accent">Online Assessment</span> Platform
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg animate-fade-in-up">
            Build question banks, launch quizzes, and analyze results with a secure, scalable
            platform built for educators and teams.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up">
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Login
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                Create an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to assess</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A complete toolkit for creating and managing online assessments end to end.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent transition-transform duration-300 group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Card className="glass-strong flex flex-col items-center gap-6 rounded-3xl px-6 py-14 text-center">
          <h2 className="max-w-2xl text-balance text-2xl font-bold sm:text-3xl">
            Ready to launch your first assessment?
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Join AssessPro today and start building smarter quizzes in minutes.
          </p>
          <Link to="/register">
            <Button size="lg">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-semibold">AssessPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AssessPro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" aria-label="GitHub" className="transition-colors hover:text-foreground">
              <Code2 className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Contact" className="transition-colors hover:text-foreground">
              <Mail className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Website" className="transition-colors hover:text-foreground">
              <Globe className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
