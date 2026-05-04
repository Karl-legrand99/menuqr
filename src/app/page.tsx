"use client"

import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold">MenuQR</span>
          <div className="space-x-4">
            <a href="#pricing" className="hover:text-orange-200">Tarifs</a>
            <a href="#faq" className="hover:text-orange-200">FAQ</a>
            <Link href="/auth/signin" className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium">
              Connexion
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Votre menu digital<br />en 2 minutes
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Créez un menu QR code magnifique pour votre restaurant. Vos clients scannent et commandent directement depuis leur téléphone.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signin"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50"
            >
              Commencer gratuitement
            </Link>
            <a
              href="#demo"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10"
            >
              Voir la démo
            </a>
          </div>
          <p className="mt-4 text-orange-200">14 jours d'essai gratuit • Sans engagement</p>
        </div>
      </header>

      {/* How it works */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Comment ça marche ?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Créez votre menu</h3>
            <p className="text-gray-600">
              Ajoutez vos catégories et plats en quelques clics. Personnalisez les couleurs et le design.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Générez le QR code</h3>
            <p className="text-gray-600">
              Téléchargez votre QR code personnalisé et affichez-le sur vos tables ou vitrine.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Vos clients commandent</h3>
            <p className="text-gray-600">
              Ils scannent, voient le menu, et commandent directement. Simple et rapide !
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tarifs simples et transparents
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-600 mb-6">Pour démarrer</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                9,90€<span className="text-lg text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Menu QR illimité</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Design personnalisable</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Jusqu'à 50 plats</li>
                <li className="flex items-center"><span className="text-gray-400 mr-2">✗</span> Commande en ligne</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200"
              >
                Choisir Basic
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Le plus populaire
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">Pour les restaurants actifs</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                29€<span className="text-lg text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Tout du plan Basic</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Commande en ligne (Stripe)</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Plats illimités</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Analytics basiques</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full text-center bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600"
              >
                Choisir Pro
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">Pour les chaînes et groupes</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                59€<span className="text-lg text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Tout du plan Pro</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Réservation de tables</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Analytics avancés</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Support prioritaire</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200"
              >
                Choisir Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">Comment fonctionne le QR code ?</summary>
            <p className="mt-4 text-gray-600">
              Vous générez un QR code unique pour votre restaurant. Vos clients le scannent avec leur téléphone et accèdent instantanément à votre menu digital. Pas besoin d'application !
            </p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">Puis-je modifier mon menu à tout moment ?</summary>
            <p className="mt-4 text-gray-600">
              Oui ! Votre menu est mis à jour en temps réel. Modifiez un prix, ajoutez un plat, et vos clients voient immédiatement les changements.
            </p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">Comment se passe la commande en ligne ?</summary>
            <p className="mt-4 text-gray-600">
              Avec le plan Pro, vos clients peuvent commander et payer directement via Stripe. Vous recevez les commandes en temps réel.
            </p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">Y a-t-il un engagement ?</summary>
            <p className="mt-4 text-gray-600">
              Non ! Vous pouvez annuler à tout moment. Nous proposons aussi 14 jours d'essai gratuit pour tester sans risque.
            </p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à moderniser votre restaurant ?
          </h2>
          <p className="text-gray-400 mb-8">
            Rejoignez des centaines de restaurateurs qui utilisent déjà MenuQR.
          </p>
          <Link
            href="/auth/signin"
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 inline-block"
          >
            Commencer gratuitement
          </Link>
          <p className="mt-4 text-gray-500">14 jours d'essai • Sans carte bancaire</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center">
        <p>© 2025 MenuQR. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
