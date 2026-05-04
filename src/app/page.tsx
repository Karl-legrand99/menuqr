"use client"

import Link from "next/link"
import { useTranslation } from "@/i18n/I18nContext"
import LanguageSelector from "@/i18n/LanguageSelector"

export default function LandingPage() {
  const { t } = useTranslation()

  const nav = t("landing.nav") as Record<string, string>
  const hero = t("landing.hero") as Record<string, string>
  const how = t("landing.how_it_works") as Record<string, string>
  const pricing = t("landing.pricing") as Record<string, string>
  const faq = t("landing.faq") as Record<string, string>
  const cta = t("landing.cta") as Record<string, string>
  const footer = t("landing.footer") as string

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold">MenuQR</span>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 mr-2">
              <a href="#pricing" className="hover:text-orange-200">{nav.pricing}</a>
              <a href="#faq" className="hover:text-orange-200">{nav.faq}</a>
            </div>
            <LanguageSelector />
            <Link href="/auth/signin" className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium">
              {nav.signin}
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: hero.title }} />
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/auth/signin"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50"
            >
              {hero.cta_start}
            </Link>
            <a
              href="#demo"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10"
            >
              {hero.cta_demo}
            </a>
          </div>
          <p className="mt-4 text-orange-200">{hero.trial}</p>
        </div>
      </header>

      {/* How it works */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {how.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{how.step1_title}</h3>
            <p className="text-gray-600">{how.step1_desc}</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{how.step2_title}</h3>
            <p className="text-gray-600">{how.step2_desc}</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{how.step3_title}</h3>
            <p className="text-gray-600">{how.step3_desc}</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {pricing.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pricing.basic_name}</h3>
              <p className="text-gray-600 mb-6">{pricing.basic_desc}</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {pricing.basic_price}<span className="text-lg text-gray-500">{pricing.basic_period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.basic_feature1}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.basic_feature2}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.basic_feature3}</li>
                <li className="flex items-center"><span className="text-gray-400 mr-2">✗</span> {pricing.basic_feature4}</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200"
              >
                {pricing.basic_cta}
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                {pricing.pro_badge}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pricing.pro_name}</h3>
              <p className="text-gray-600 mb-6">{pricing.pro_desc}</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {pricing.pro_price}<span className="text-lg text-gray-500">{pricing.pro_period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.pro_feature1}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.pro_feature2}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.pro_feature3}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.pro_feature4}</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full text-center bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600"
              >
                {pricing.pro_cta}
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pricing.premium_name}</h3>
              <p className="text-gray-600 mb-6">{pricing.premium_desc}</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {pricing.premium_price}<span className="text-lg text-gray-500">{pricing.premium_period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.premium_feature1}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.premium_feature2}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.premium_feature3}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.premium_feature4}</li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200"
              >
                {pricing.premium_cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {faq.title}
        </h2>
        <div className="space-y-4">
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">{faq.q1}</summary>
            <p className="mt-4 text-gray-600">{faq.a1}</p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">{faq.q2}</summary>
            <p className="mt-4 text-gray-600">{faq.a2}</p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">{faq.q3}</summary>
            <p className="mt-4 text-gray-600">{faq.a3}</p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">{faq.q4}</summary>
            <p className="mt-4 text-gray-600">{faq.a4}</p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
          <p className="text-gray-400 mb-8">{cta.subtitle}</p>
          <Link
            href="/auth/signin"
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 inline-block"
          >
            {cta.cta}
          </Link>
          <p className="mt-4 text-gray-500">{cta.trial}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center">
        <p>{footer}</p>
      </footer>
    </div>
  )
}
