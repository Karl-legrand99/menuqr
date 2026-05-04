import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">MenuQR</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Démo</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Connecté</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Démo</h1>
          <p className="text-gray-600 mt-1">Voici un aperçu de l'interface administrateur.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">🍽️ Mon Restaurant</h3>
            <p className="text-gray-600 mb-4">Gérez votre menu, vos catégories et vos plats.</p>
            <Link href="/dashboard/menu" className="text-orange-500 hover:text-orange-600 font-medium">
              Gérer le menu →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">📱 QR Code</h3>
            <p className="text-gray-600 mb-4">Téléchargez votre QR code pour vos tables.</p>
            <Link href="/dashboard/qr" className="text-orange-500 hover:text-orange-600 font-medium">
              Voir le QR →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">📊 Commandes</h3>
            <p className="text-gray-600 mb-4">Suivez les commandes en temps réel.</p>
            <Link href="/dashboard/orders" className="text-orange-500 hover:text-orange-600 font-medium">
              Voir les commandes →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Menu Public (aperçu)</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-500 mb-2">Le Bistro Parisien</h3>
              <p className="text-gray-600">123 Rue de la Paix, Paris</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>🥗 Salade César</span>
                  <span className="font-bold">12.50€</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>🥩 Steak Frites</span>
                  <span className="font-bold">24.00€</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>🍰 Tiramisu</span>
                  <span className="font-bold">8.00€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
