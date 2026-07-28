import Link from "next/link";
import ScrollReveal from "./components/ScrollReveal";
import BusinessCountBadge from "./components/BusinessCountBadge";
import FAQ from "./components/FAQ";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: "Inventory & Services",
    desc: "Track products, services, stock levels, and SKUs — all in one place.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: "Orders & Sales",
    desc: "Create orders, track statuses, and maintain a complete sales history.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Customer Management",
    desc: "Keep a clean record of every customer, their orders, and contact details.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "Expense Tracking",
    desc: "Log expenses by category and see exactly where your money goes.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Analytics Dashboard",
    desc: "Revenue trends, top sellers, expense breakdowns — beautiful charts that tell the story.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "PIN-Based Security",
    desc: "Every account is protected with a secure 6-digit PIN — simple yet safe.",
  },
];

const STATS = [
  { value: "10k+", label: "Businesses Registered" },
  { value: "99.9%", label: "Uptime" },
  { value: "PIN", label: "Every Account" },
  { value: "$0", label: "To Get Started" },
];

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Basecrew</span>
          </Link>
          <div className="hidden sm:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1 animate-float" />
      <div className="hero-orb hero-orb-2 animate-float-delayed" />
      <div className="hero-orb hero-orb-3 animate-float-slow" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 glass-badge text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            Now in public beta
          </div>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <div className="mb-6">
            <BusinessCountBadge />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.08]">
            Run your business
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              from one dashboard
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Register your business, manage inventory, track orders, log expenses, and see it all come together in real-time analytics. Built for small business owners who want clarity, not complexity.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200"
            >
              Start for free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 glass-card text-gray-700 font-semibold px-8 py-3.5 rounded-xl text-base transition-all"
            >
              See what&apos;s included
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Dashboard Preview Mockup */}
      <ScrollReveal direction="scale" delay={200} className="mt-20 max-w-5xl mx-auto relative z-10">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="glass-input rounded-md px-3 py-1 text-xs text-gray-400 max-w-sm mx-auto text-center">
                basecrew.app/dashboard
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Revenue", value: "$24,580", change: "+12.5%" },
                { label: "Orders", value: "342", change: "+8.2%" },
                { label: "Customers", value: "1,204", change: "+23.1%" },
                { label: "Expenses", value: "$8,420", change: "-3.4%" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">{stat.change}</p>
                </div>
              ))}
            </div>
            <div className="glass-card rounded-xl p-4 h-32 sm:h-40 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                  <div
                    className="rounded-sm bg-gradient-to-t from-indigo-500 to-indigo-400 opacity-80"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="hero-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", top: "10%", left: "-100px" }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Everything you need to run your business
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              No bloat, no learning curve. Just the tools a small business owner actually needs, done well.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80}>
              <div className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 rounded-xl glass-badge flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Create your account",
      desc: "Sign up with your email and set a 6-digit PIN. No complex passwords to remember.",
    },
    {
      num: "2",
      title: "Register your business",
      desc: "Give your business a name, pick a category, add a description. Takes 30 seconds.",
    },
    {
      num: "3",
      title: "Start managing",
      desc: "Add products, log orders, track expenses. Your dashboard updates in real time.",
    },
  ];
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/70 relative overflow-hidden">
      <div className="hero-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", bottom: "-100px", right: "-100px" }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              No complex setup. No credit card required.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 120} direction="scale">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full glass-card bg-indigo-600/10 text-indigo-600 flex items-center justify-center text-lg font-bold mx-auto mb-4 border border-indigo-200/50">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 glass-dark relative overflow-hidden">
      <div className="hero-orb" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", top: "-50px", left: "20%" }} />
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 relative z-10">
        {STATS.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 100} direction="scale">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">{s.value}</p>
              <p className="mt-2 text-sm text-gray-400">{s.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="hero-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <ScrollReveal direction="scale">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Ready to take control of your business?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Join thousands of business owners managing their operations with Basecrew.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-indigo-200"
            >
              Get started — it&apos;s free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10 px-4 sm:px-6 lg:px-8 glass">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900">Basecrew</span>
        </div>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Basecrew. All rights reserved.{" "}
          <Link href="/terms" className="hover:text-gray-600 underline underline-offset-2">Terms & Privacy</Link>
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}
