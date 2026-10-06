import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Products } from './pages/Products'
import { Login } from './pages/Login'

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })))
const Customers = lazy(() => import('./pages/Customers').then((m) => ({ default: m.Customers })))
const Orders = lazy(() => import('./pages/Orders').then((m) => ({ default: m.Orders })))
const Team = lazy(() => import('./pages/OtherPages').then((m) => ({ default: m.Team })))
const Notifications = lazy(() => import('./pages/OtherPages').then((m) => ({ default: m.Notifications })))
const Settings = lazy(() => import('./pages/OtherPages').then((m) => ({ default: m.Settings })))
const Profile = lazy(() => import('./pages/OtherPages').then((m) => ({ default: m.Profile })))

function PageLoading() {
  return <div className="page-loading" role="status"><span className="loading-spinner" />Loading workspace...</div>
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('nexusops-theme') === 'dark')
  const [token, setToken] = useState(() => localStorage.getItem('nexusops-token'))
  useEffect(() => { localStorage.setItem('nexusops-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => {
    const syncAuth = () => setToken(localStorage.getItem('nexusops-token'))
    window.addEventListener('nexusops-auth', syncAuth)
    return () => window.removeEventListener('nexusops-auth', syncAuth)
  }, [])
  useEffect(() => {
    const syncTheme = () => setDark(localStorage.getItem('nexusops-theme') === 'dark')
    window.addEventListener('nexusops-theme', syncTheme)
    return () => window.removeEventListener('nexusops-theme', syncTheme)
  }, [])
  const isAuthenticated = Boolean(token)
  return <div className={dark ? 'dark' : ''}><Suspense fallback={<PageLoading />}><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="*" element={isAuthenticated ? <Layout dark={dark} setDark={setDark}><Routes>
      <Route path="/" element={<Dashboard />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/analytics" element={<Analytics />} />
      <Route path="/customers" element={<Customers />} /><Route path="/products" element={<Products />} /><Route path="/orders" element={<Orders />} />
      <Route path="/team" element={<Team />} /><Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} /><Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes></Layout> : <Navigate to="/login" replace />} />
  </Routes></Suspense></div>
}
