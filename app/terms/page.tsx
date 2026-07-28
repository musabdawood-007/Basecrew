"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link href="/signup" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-8">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to sign up
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Terms of Service & Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: July 2026</p>

        <div className="space-y-10 text-gray-600 leading-relaxed text-[15px]">
          {/* Privacy */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Your Data Is Your Privacy</h2>
            <p className="mb-3">
              At Basecrew, we believe your business data belongs to you — not us. We will never sell, share, or rent your personal information or business data to third parties for marketing purposes. Ever.
            </p>
            <p className="mb-3">
              The information you provide — including your name, email, business details, products, customers, orders, and expenses — is stored securely and used solely to power your Basecrew experience.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>We do not sell your data.</strong> Your business information is yours alone.</li>
              <li><strong>We do not run ads.</strong> Basecrew is ad-free. Your data is never used for targeted advertising.</li>
              <li><strong>We do not share with third parties.</strong> No data brokers, no analytics companies, no exceptions.</li>
              <li><strong>You can export or delete your data at any time.</strong> If you close your account, your data is permanently removed from our servers.</li>
            </ul>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. What We Collect</h2>
            <p className="mb-3">We collect only what is necessary to provide the service:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Account information:</strong> Name and email address used for authentication.</li>
              <li><strong>Business data:</strong> Products, customers, orders, and expenses you choose to enter.</li>
              <li><strong>Usage data:</strong> Basic analytics (page views, feature usage) to improve the product — this is anonymized and never linked to your identity.</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Protect Your Data</h2>
            <p className="mb-3">
              Your data is encrypted in transit (TLS/HTTPS) and at rest. We use industry-standard security practices including hashed passwords, secure API authentication, and regular security audits. We maintain strict access controls — only you can access your business data.
            </p>
          </section>

          {/* Account Responsibilities */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Your Account, Your Responsibility</h2>
            <p className="mb-3">
              You are responsible for maintaining the confidentiality of your account credentials (email and PIN). You agree to notify us immediately if you suspect unauthorized access to your account.
            </p>
            <p>
              You are responsible for all activity that occurs under your account. Basecrew is not liable for any loss or damage resulting from unauthorized use of your account.
            </p>
          </section>

          {/* Terms of Use */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
            <p className="mb-3">By using Basecrew, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Use the service for any unlawful purpose.</li>
              <li>Attempt to gain unauthorized access to other accounts or systems.</li>
              <li>Interfere with or disrupt the service or its infrastructure.</li>
              <li>Transmit malicious code, viruses, or harmful content.</li>
              <li>Use automated tools to scrape or abuse the API.</li>
            </ul>
          </section>

          {/* Data Portability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Portability & Deletion</h2>
            <p className="mb-3">
              You own your data. You can export your business data at any time. If you delete your account, all associated data is permanently removed from our active systems within 30 days. We may retain anonymized, non-identifiable data for aggregate analytics purposes only.
            </p>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
            <p>
              We strive to keep Basecrew running 24/7, but we do not guarantee uninterrupted service. We may perform maintenance, updates, or experience downtime. We will endeavor to provide advance notice for planned maintenance when possible.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p>
              We may update these terms from time to time. If we make material changes, we will notify you via email or through the application. Continued use of Basecrew after changes are posted constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about this policy or how your data is handled, reach out to us at{" "}
              <a href="https://musab-007.netlify.app" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2">musab-007.netlify.app</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
