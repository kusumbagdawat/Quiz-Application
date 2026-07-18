import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from "./components/RouteGuards"
import DashboardLayout from "./components/layout/DashboardLayout"

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

import AddQuestion from "./pages/admin/AddQuestion"
import ManageQuestions from "./pages/admin/ManageQuestions"
import CreateQuiz from "./pages/admin/CreateQuiz"
import ViewResults from "./pages/admin/ViewResults"

import AvailableQuizzes from "./pages/user/AvailableQuizzes"
import AttemptQuiz from "./pages/user/AttemptQuiz"
import MyResults from "./pages/user/MyResults"
import Profile from "./pages/user/Profile"

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Protected app shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User */}
        <Route path="/quizzes" element={<AvailableQuizzes />} />
        <Route path="/quizzes/:id/attempt" element={<AttemptQuiz />} />
        <Route path="/my-results" element={<MyResults />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin */}
        <Route
          path="/admin/add-question"
          element={
            <AdminRoute>
              <AddQuestion />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <ManageQuestions />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/create-quiz"
          element={
            <AdminRoute>
              <CreateQuiz />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/results"
          element={
            <AdminRoute>
              <ViewResults />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
