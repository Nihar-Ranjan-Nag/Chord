import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { ScrollToTop } from '@/components/common/ScrollToTop'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { PortalLayout } from '@/components/layout/PortalLayout'

import { ProtectedRoute } from '@/features/auth/ProtectedRoute'

import { HomePage } from '@/pages/public/HomePage'
import { EventsPage } from '@/pages/public/EventsPage'
import { EventDetailsPage } from '@/pages/public/EventDetailsPage'
import { RewardsPage } from '@/pages/public/RewardsPage'
import { LeaderboardPage } from '@/pages/public/LeaderboardPage'
import { AboutPage } from '@/pages/public/AboutPage'

import { LoginPage } from '@/pages/auth/LoginPage'
import { UserRegisterPage } from '@/pages/auth/UserRegisterPage'
import { OrganizerRegisterPage } from '@/pages/auth/OrganizerRegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'

import { DashboardPage } from '@/pages/user/DashboardPage'
import { StudentEventsPage } from '@/pages/user/StudentEventsPage'
import { MyEventsPage } from '@/pages/user/MyEventsPage'
import { PointsPage } from '@/pages/user/PointsPage'
import { StudentRewardsPage } from '@/pages/user/StudentRewardsPage'
import { StudentLeaderboardPage } from '@/pages/user/StudentLeaderboardPage'
import { NotificationsPage } from '@/pages/user/NotificationsPage'
import { ProfilePage } from '@/pages/user/ProfilePage'
import { BooksPage } from '@/pages/user/BooksPage'
import { MyBooksPage } from '@/pages/user/MyBooksPage'
import { StudentEventDetailsPage } from '@/pages/user/StudentEventDetailsPage'

import { OrganizerDashboardPage } from '@/pages/organizer/OrganizerDashboardPage'
import { OrganizerEventsPage } from '@/pages/organizer/OrganizerEventsPage'
import { CreateOrganizerEventPage } from '@/pages/organizer/CreateOrganizerEventPage'
import { EditOrganizerEventPage } from '@/pages/organizer/EditOrganizerEventPage'
import { OrganizerEventUsersPage } from '@/pages/organizer/OrganizerEventParticipantsPage'
import { OrganizerBooksPage } from '@/pages/organizer/OrganizerBooksPage'
import { OrganizerBorrowsPage } from '@/pages/organizer/OrganizerBorrowsPage'

import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { StudentsPage } from '@/pages/admin/StudentsPage'
import { StudentDetailPage } from '@/pages/admin/StudentDetailPage'
import { OrganizersPage } from '@/pages/admin/OrganizersPage'
import { AdminEventsPage } from '@/pages/admin/AdminEventsPage'
import { CreateEventPage } from '@/pages/admin/CreateEventPage'
import { EditEventPage } from '@/pages/admin/EditEventPage'
import { EventUsersPage } from '@/pages/admin/EventParticipantsPage'
import { AdminRewardsPage } from '@/pages/admin/AdminRewardsPage'
import { RedemptionsPage } from '@/pages/admin/RedemptionsPage'
import { ReportsPage } from '@/pages/admin/ReportsPage'
import { AdminBooksPage } from '@/pages/admin/AdminBooksPage'
import { AdminBorrowsPage } from '@/pages/admin/AdminBorrowsPage'

import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRouter() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ======================================================
            PUBLIC
        ====================================================== */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/events"
            element={<EventsPage />}
          />

          <Route
            path="/events/:slug"
            element={<EventDetailsPage />}
          />

          <Route
            path="/rewards"
            element={<RewardsPage />}
          />

          <Route
            path="/leaderboard"
            element={<LeaderboardPage />}
          />

          <Route
            path="/about"
            element={<AboutPage />}
          />
        </Route>

        {/* ======================================================
            AUTH
        ====================================================== */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<UserRegisterPage />}
        />

        <Route
          path="/organizer/register"
          element={<OrganizerRegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        {/* ======================================================
            USER
        ====================================================== */}
        <Route
          element={
            <ProtectedRoute role="user" />
          }
        >
          <Route
            path="/dashboard"
            element={
              <PortalLayout mode="user" />
            }
          >
            <Route
              index
              element={<DashboardPage />}
            />

            <Route
              path="events"
              element={<StudentEventsPage />}
            />

            <Route
              path="events/:slug"
              element={<StudentEventDetailsPage />}
            />

            <Route
              path="my-events"
              element={<MyEventsPage />}
            />

            <Route
              path="books"
              element={<BooksPage />}
            />

            <Route
              path="my-books"
              element={<MyBooksPage />}
            />

            <Route
              path="points"
              element={<PointsPage />}
            />

            <Route
              path="rewards"
              element={<StudentRewardsPage />}
            />

            <Route
              path="leaderboard"
              element={<StudentLeaderboardPage />}
            />

            <Route
              path="notifications"
              element={<NotificationsPage />}
            />

            <Route
              path="profile"
              element={<ProfilePage />}
            />
          </Route>
        </Route>

        {/* ======================================================
            ORGANIZER
        ====================================================== */}
        <Route
          element={
            <ProtectedRoute role="organizer" />
          }
        >
          <Route
            path="/organizer"
            element={
              <PortalLayout mode="organizer" />
            }
          >
            <Route
              index
              element={
                <OrganizerDashboardPage />
              }
            />

            <Route
              path="events"
              element={<OrganizerEventsPage />}
            />

            <Route
              path="events/create"
              element={
                <CreateOrganizerEventPage />
              }
            />

            <Route
              path="events/:id/edit"
              element={
                <EditOrganizerEventPage />
              }
            />

            <Route
              path="events/:id/users"
              element={
                <OrganizerEventUsersPage />
              }
            />

            <Route
              path="books"
              element={
                <OrganizerBooksPage />
              }
            />

            <Route
              path="borrows"
              element={
                <OrganizerBorrowsPage />
              }
            />

            <Route
              path="profile"
              element={<ProfilePage />}
            />
          </Route>
        </Route>

        {/* ======================================================
            ADMIN
        ====================================================== */}
        <Route
          element={
            <ProtectedRoute role="admin" />
          }
        >
          <Route
            path="/admin"
            element={
              <PortalLayout mode="admin" />
            }
          >
            <Route
              index
              element={
                <AdminDashboardPage />
              }
            />

            <Route
              path="users"
              element={<StudentsPage />}
            />

            <Route
              path="users/:id"
              element={<StudentDetailPage />}
            />

            <Route
              path="organizers"
              element={<OrganizersPage />}
            />

            <Route
              path="events"
              element={<AdminEventsPage />}
            />

            <Route
              path="events/create"
              element={<CreateEventPage />}
            />

            <Route
              path="events/:id/edit"
              element={<EditEventPage />}
            />

            <Route
              path="events/:id/users"
              element={<EventUsersPage />}
            />

            <Route
              path="books"
              element={<AdminBooksPage />}
            />

            <Route
              path="borrows"
              element={<AdminBorrowsPage />}
            />

            <Route
              path="rewards"
              element={<AdminRewardsPage />}
            />

            <Route
              path="redemptions"
              element={<RedemptionsPage />}
            />

            <Route
              path="reports"
              element={<ReportsPage />}
            />
          </Route>
        </Route>

        {/* ======================================================
            LEGACY / FALLBACK
        ====================================================== */}
        <Route
          path="/student"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </>
  )
}