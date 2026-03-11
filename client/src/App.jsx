import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import LoginPage from '@/pages/LoginPage'
import CobrancasPage from '@/pages/CobrancasPage'
import ClientesPage from '@/pages/ClientesPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/cobrancas"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CobrancasPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/cobrancas" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
