import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import InstructorDashboard from './pages/InstructorDashboard.jsx'
import ExamRoom from './pages/ExamRoom.jsx'
import ReportDetail from './pages/ReportDetail.jsx'

function App() {
  return (
    <Routes>
      {/* Ana sayfa: kullanici / yazdiginda otomatik /login'e gitsin */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login sayfasi: Layout DISINDA, cunku menu/header gostermek istemiyoruz */}
      <Route path="/login" element={<Login />} />

      {/* Diger tum sayfalar Layout icine sarmalanmis - ortak header/menu burada */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<InstructorDashboard />} />
        <Route path="/exam/:id" element={<ExamRoom />} />
        <Route path="/report/:id" element={<ReportDetail />} />
      </Route>

      {/* Bilinmeyen URL: kullanici /xyz123 gibi olmayan bir adres yazarsa */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App