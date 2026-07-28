"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const faqs = [
  {
    q: "What is Basecrew?",
    a: "Basecrew is a free business management platform. You can register your business, manage products and services, track orders, log expenses, and view real-time analytics — all from one clean dashboard.",
  },
  {
    q: "Is it really free?",
    a: "Yes. Basecrew is free to use with no hidden charges, no credit card required, and no trial limits.",
  },
  {
    q: "How does account security work?",
    a: "Every account is protected with a 6-digit PIN instead of a traditional password. Your PIN is securely hashed and stored. We also send OTP codes via email for verification.",
  },
  {
    q: "Can I manage multiple businesses?",
    a: "Yes. You can register and switch between multiple businesses from a single account using the business switcher in your dashboard.",
  },
  {
    q: "What currencies are supported?",
    a: "Basecrew supports PKR, USD, EUR, GBP, SAR, and AED. You can switch currencies from the dashboard.",
  },
  {
    q: "Is my data private?",
    a: "Absolutely. We do not sell, share, or collect your data for advertising. Your business data is yours alone. Read our full Privacy Policy on the Terms page.",
  },
  {
    q: "I forgot my PIN — what do I do?",
    a: "Click 'Forgot PIN?' on the sign-in page. We'll send a reset code to your email. Enter the code and set a new 6-digit PIN.",
  },
  {
    q: "Who built Basecrew?",
    a: "Basecrew was built by Musab Dawood as a project to help small business owners manage their operations easily.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Quick answers to common questions.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {open === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
