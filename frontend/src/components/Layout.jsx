import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  // Cikis fonksiyonu: ileride token silme islemi de buraya eklenecek
  const handleLogout = () => {
    // TODO: localStorage.removeItem('token') eklenecek (Adim: Protected Route gorevi)
    navigate('/login')
  }

  // Aktif linki belirlemek icin yardimci fonksiyon
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ÜST HEADER - tum sayfalarda gorunur */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Sol: Logo + isim */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="text-lg font-semibold text-gray-800">ProctorAI</span>
          </Link>

          {/* Orta: Navigasyon linkleri */}
          <nav className="flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Sag: Cikis butonu */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cikis Yap
          </button>
        </div>
      </header>

      {/* ANA ICERIK - URL'e gore degisen sayfa buraya gelir */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* ALT FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2026 ProctorAI - Bursa Teknik Universitesi
        </div>
      </footer>
    </div>
  )
}

export default Layout