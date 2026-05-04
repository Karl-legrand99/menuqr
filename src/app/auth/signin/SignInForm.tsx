"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [testCode, setTestCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showTest, setShowTest] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.error) {
        setError("Une erreur est survenue. Veuillez réessayer.")
      } else {
        window.location.href = "/auth/verify-request"
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("test", {
        code: testCode,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.error) {
        setError("Code invalide.")
      } else {
        window.location.href = "/dashboard"
      }
    } catch {
      setError("Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // Rediriger vers le dashboard avec un paramètre de démo
    window.location.href = "/dashboard?demo=true"
  }

  return (
    <div className="space-y-6">
      {/* Email Login */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Connexion par email</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi en cours..." : "Continuer avec l'email"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Un lien magique vous sera envoyé par email pour vous connecter sans mot de passe.
        </p>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">ou</span>
        </div>
      </div>

      {/* Test Account */}
      <div className="space-y-4">
        <button
          onClick={() => setShowTest(!showTest)}
          className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
        >
          {showTest ? "Masquer" : "Compte de test (développement)"}
        </button>

        {showTest && (
          <form onSubmit={handleTestSubmit} className="space-y-4">
            <div>
              <label htmlFor="testCode" className="block text-sm font-medium text-gray-700 mb-1">
                Code de test
              </label>
              <input
                id="testCode"
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                placeholder="Entrez le code..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter (test)"}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Code : menuqr2025
            </p>
          </form>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">ou</span>
        </div>
      </div>

      {/* Demo Mode */}
      <button
        type="button"
        onClick={handleDemoLogin}
        className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600"
      >
        🚀 Mode Démo (sans login)
      </button>
      <p className="text-xs text-gray-400 text-center">
        Accédez au dashboard immédiatement sans créer de compte
      </p>
    </div>
  )
}
