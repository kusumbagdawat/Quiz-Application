import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  PlusSquare,
  BarChart3,
  BookOpen,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  description: string
}

export const adminNav: NavItem[] = [
  {
    label: "Add Question",
    to: "/admin/add-question",
    icon: FilePlus2,
    description: "Create a new question for the bank",
  },
  {
    label: "Manage Questions",
    to: "/admin/questions",
    icon: ListChecks,
    description: "View, edit and delete questions",
  },
  {
    label: "Create Quiz",
    to: "/admin/create-quiz",
    icon: PlusSquare,
    description: "Generate a quiz from a category",
  },
  {
    label: "View Results",
    to: "/admin/results",
    icon: BarChart3,
    description: "See all user results and scores",
  },
]

export const userNav: NavItem[] = [
  {
    label: "Available Quizzes",
    to: "/quizzes",
    icon: BookOpen,
    description: "Browse and start a quiz",
  },
  {
    label: "My Results",
    to: "/my-results",
    icon: Trophy,
    description: "Track your quiz scores",
  },
  {
    label: "Profile",
    to: "/profile",
    icon: User,
    description: "Manage your account",
  },
]

export const dashboardItem: NavItem = {
  label: "Dashboard",
  to: "/dashboard",
  icon: LayoutDashboard,
  description: "Overview and quick actions",
}
