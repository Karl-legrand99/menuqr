export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">MenuQR</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-700 hover:text-orange-500">Dashboard</a>
              <a href="/dashboard/menu" className="text-gray-700 hover:text-orange-500">Menu</a>
              <a href="/dashboard/orders" className="text-gray-700 hover:text-orange-500">Commandes</a>
              <a href="/dashboard/settings" className="text-gray-700 hover:text-orange-500">Paramètres</a>
              <a href="/dashboard/qr" className="text-gray-700 hover:text-orange-500">QR Code</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
