import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { label: 'Registered Donors', value: '12,400+', icon: '🩸' },
  { label: 'Blood Banks', value: '340+', icon: '🏥' },
  { label: 'Hospitals', value: '850+', icon: '🏦' },
  { label: 'Lives Saved', value: '50,000+', icon: '❤️' },
];

const steps = [
  { step: '01', title: 'Register', desc: 'Sign up as a Blood Bank or Hospital in minutes.', color: 'from-red-500 to-rose-600' },
  { step: '02', title: 'Connect', desc: 'Blood banks list donors; hospitals raise blood requests.', color: 'from-orange-500 to-amber-600' },
  { step: '03', title: 'Fulfill', desc: 'Blood banks see requests and dispatch units to hospitals.', color: 'from-emerald-500 to-teal-600' },
  { step: '04', title: 'Save Lives', desc: 'Patients receive blood on time — every second counts.', color: 'from-blue-500 to-indigo-600' },
];

const roles = [
  {
    icon: '🏦',
    title: 'Blood Bank',
    desc: 'Manage donors, blood inventory, and fulfil hospital blood requests.',
    features: ['Donor Registration', 'Inventory Management', 'Request Fulfillment', 'Blood Availability'],
    cta: 'Blood Bank Portal',
    gradient: 'from-red-500 to-rose-600',
    shadow: 'shadow-red-500/30',
    path: '/login',
    bg: 'bg-red-50 dark:bg-red-900/10',
    border: 'border-red-200/60 dark:border-red-800/40',
  },
  {
    icon: '🏥',
    title: 'Hospital',
    desc: 'Raise blood requests for patients and track fulfillment status.',
    features: ['Blood Request Form', 'Request Status Tracking', 'Blood Availability Search', 'Patient Management'],
    cta: 'Hospital Portal',
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/30',
    path: '/login',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-200/60 dark:border-blue-800/40',
  },
  {
    icon: '🛡️',
    title: 'Admin',
    desc: 'Oversee all blood banks and hospitals, approve registrations.',
    features: ['View All Blood Banks', 'Manage Hospitals', 'System Analytics', 'Access Control'],
    cta: 'Admin Portal',
    gradient: 'from-purple-500 to-violet-600',
    shadow: 'shadow-purple-500/30',
    path: '/login',
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    border: 'border-purple-200/60 dark:border-purple-800/40',
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-x-hidden">
      
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white font-black text-lg">B</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight">Smart Blood Bank</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold mb-8 ring-1 ring-red-200 dark:ring-red-800/50">
            <span className="animate-pulse w-2 h-2 rounded-full bg-red-500 inline-block" />
            Saving lives through smart blood management
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            Blood When It{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
              Matters Most
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Smart Blood Bank connects blood banks, hospitals and donors on a single platform — so no patient waits for the blood they need.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 shadow-xl shadow-red-500/40 hover:shadow-red-500/60 hover:-translate-y-1 transition-all text-lg"
            >
              🩸 Register Your Organization
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-2xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md hover:shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 hover:-translate-y-1 transition-all text-lg"
            >
              Sign In →
            </button>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="py-20 px-6 bg-gradient-to-br from-red-600 to-rose-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center text-white">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-3xl md:text-4xl font-black mb-1">{s.value}</div>
                <div className="text-red-100 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Simple, fast, and life-saving in 4 steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl dark:shadow-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-800 hover:-translate-y-2 transition-transform group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white font-black text-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {s.step}
                </div>
                <h3 className="font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 text-2xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Role Cards ─── */}
      <section id="roles" className="py-24 px-6 bg-slate-100/60 dark:bg-slate-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Choose Your Role</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Dedicated dashboards for every stakeholder</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((r, i) => (
              <div key={i} className={`rounded-3xl p-8 ${r.bg} border ${r.border} ring-1 ring-slate-200/50 dark:ring-slate-700/50 hover:-translate-y-2 transition-all shadow-xl ${r.shadow} group`}>
                <div className="text-5xl mb-6">{r.icon}</div>
                <h3 className="text-2xl font-black mb-3">{r.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{r.desc}</p>
                <ul className="space-y-2 mb-8">
                  {r.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(r.path)}
                  className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${r.gradient} shadow-lg group-hover:shadow-xl hover:-translate-y-0.5 transition-all`}
                >
                  {r.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Blood Types Visual ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">All Blood Types Covered</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12">Our network supports the full ABO+Rh blood group system</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <div key={bg} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/30 hover:scale-110 transition-transform cursor-default">
                {bg}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-16 shadow-2xl shadow-red-500/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
          <h2 className="text-4xl font-black text-white mb-4 relative">Ready to Save Lives?</h2>
          <p className="text-red-100 text-lg mb-10 relative">Join hundreds of blood banks and hospitals already using Smart Blood Bank.</p>
          <div className="flex gap-4 justify-center relative">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-2xl font-bold text-red-600 bg-white hover:bg-red-50 shadow-xl hover:-translate-y-1 transition-all"
            >
              Register Now →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-2xl font-bold text-white border-2 border-white/50 hover:bg-white/10 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-10 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <span className="text-white font-black">B</span>
            </div>
            <span className="font-bold">Smart Blood Bank</span>
          </div>
          <p className="text-slate-400 text-sm">© 2024 Smart Blood Bank. Every drop counts.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <button onClick={() => navigate('/register')} className="hover:text-red-500 transition-colors">Register</button>
            <button onClick={() => navigate('/login')} className="hover:text-red-500 transition-colors">Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
