import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ServicesListPage from './pages/ServicesListPage'
import ServiceEditPage from './pages/ServiceEditPage'
import TeamPage from './pages/TeamPage'
import SiteContentPage from './pages/SiteContentPage'
import ReservationsListPage from './pages/ReservationsListPage'
import ReservationEditPage from './pages/ReservationEditPage'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="services" element={<ServicesListPage />} />
        <Route path="services/new" element={<ServiceEditPage />} />
        <Route path="services/:id" element={<ServiceEditPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="content" element={<SiteContentPage />} />
        <Route path="reservations" element={<ReservationsListPage />} />
        <Route path="reservations/new" element={<ReservationEditPage />} />
        <Route path="reservations/:id" element={<ReservationEditPage />} />
      </Route>
    </Routes>
  )
}
