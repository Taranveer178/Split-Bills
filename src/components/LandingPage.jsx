import { useState, useEffect } from 'react';
import {
  Plus,
  UserPlus,
  Download,
  ChevronRight,
  ChevronDown,
  Pin,
  Bell,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  PieChart,
  CheckCircle2,
  IndianRupee,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  Users,
  Layers,
  Lock,
  Menu,
  X,
  Star,
  Share2,
  QrCode,
  Check,
  ArrowRight,
  Globe,
  Send,
} from 'lucide-react';

export default function LandingPage({
  onLogin,
  onGetStarted,
  onDownloadApp,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [activePreviewTab, setActivePreviewTab] = useState('command'); // 'command' | 'analytics' | 'chat'
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Calculator Demo State
  const [demoBillAmount, setDemoBillAmount] = useState(2400);
  const [demoMembers, setDemoMembers] = useState(4);

  // Listen for native PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else if (onDownloadApp) {
      onDownloadApp();
    } else {
      const el = document.getElementById('download-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Is SplitBills completely free for roommates and flatmates?',
      a: 'Yes! Creating unlimited spaces, logging bills, smart debt simplification, group chat, and monthly analytics are 100% free with zero hidden subscription walls.',
    },
    {
      q: 'How does the Smart Settlement algorithm work?',
      a: 'Instead of everyone paying everyone back for each individual grocery run or Swiggy order, SplitBills calculates the net position of each roommate and minimizes the total number of UPI transfers needed to settle the entire flat.',
    },
    {
      q: 'Can I install SplitBills as a native app on Android and iOS?',
      a: 'Absolutely. SplitBills is built as a Progressive Web App (PWA). Tap "Install App" in the header or footer to add it directly to your home screen with full-screen native gestures and instant loading.',
    },
    {
      q: 'How do my roommates join a flat space?',
      a: 'Every space generates a unique 6-character invite code. Your roommates simply tap "Join with Code" on their dashboard, enter the code, and all shared bills sync in real time.',
    },
    {
      q: 'Can we split bills unequally or exclude someone on a trip?',
      a: 'Yes. Use "Quick Expense" for instant equal splits, or switch to "Custom Split" to assign exact rupee amounts or custom shares when someone was away.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F3F7F3] font-sans text-slate-900 selection:bg-[#3E7754] selection:text-white">
      {/* =================================================================== */}
      {/* SOFT REFRACTIVE MESH BACKDROP (Matches Dashboard Liquid Glass)      */}
      {/* =================================================================== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[#9AB99F]/30 blur-3xl" />
        <div className="absolute top-1/4 -right-28 h-96 w-96 rounded-full bg-[#9AB99F]/25 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-[#BDD2C1]/30 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-[#BDD2C1]/25 blur-3xl" />
      </div>

      {/* =================================================================== */}
      {/* STICKY LIQUID GLASS NAVBAR                                          */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
        <nav className="mx-auto flex max-w-[1320px] items-center justify-between rounded-full border border-white/90 bg-white/75 px-4 py-2.5 shadow-lg shadow-[#233E2F]/5 backdrop-blur-2xl sm:px-6">
          {/* Brand Logo */}
          <a
            href="#top"
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#3E7754] to-[#3E7754] text-white shadow-md shadow-[#3E7754]/25">
              <IndianRupee size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="block text-base font-extrabold tracking-tight text-slate-900 leading-none">
                SplitBills
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-[#3E7754]">
                Liquid Ledger
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {[
              { label: 'Features', id: 'features' },
              { label: 'Mobile App', id: 'mobile-showcase' },
              { label: 'Command Center', id: 'desktop-preview' },
              { label: 'Smart Split', id: 'smart-split' },
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'FAQ', id: 'faq' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-[#EEF4EF]/80 hover:text-[#3E7754]"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons: Download App | Login | Get Started */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#BDD2C1]/80 bg-[#EEF4EF]/70 px-3.5 text-xs font-bold text-[#356447] transition-all hover:bg-[#DDE9DF]/80 active:scale-95"
            >
              <Download size={13} />
              <span>Install App</span>
            </button>

            <button
              type="button"
              onClick={onLogin}
              className="inline-flex h-9 items-center rounded-full border border-slate-200/90 bg-white/90 px-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-[#9AB99F] hover:text-[#3E7754] active:scale-95"
            >
              Log in
            </button>

            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-4 text-xs font-bold text-white shadow-md shadow-[#3E7754]/25 transition-all hover:from-[#588362] hover:to-[#3E7754] active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={onLogin}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/90 bg-white/90 text-slate-700 shadow-sm"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-[1320px] rounded-3xl border border-white/90 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Features', id: 'features' },
                { label: 'Mobile App', id: 'mobile-showcase' },
                { label: 'Command Center', id: 'desktop-preview' },
                { label: 'Smart Split', id: 'smart-split' },
                { label: 'How It Works', id: 'how-it-works' },
                { label: 'FAQ', id: 'faq' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="rounded-2xl bg-slate-100/80 px-3.5 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-[#EEF4EF] hover:text-[#3E7754]"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-200/70 pt-3">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-[#BDD2C1] bg-[#EEF4EF] text-xs font-bold text-[#356447]"
              >
                <Download size={14} />
                <span>Download / Install App</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onLogin}
                  className="h-10 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="h-10 rounded-2xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] text-xs font-bold text-white shadow-md shadow-[#3E7754]/20"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =================================================================== */}
      {/* SECTION 1: HERO SECTION + LIVE PHONE MOCKUP                         */}
      {/* =================================================================== */}
      <section
        id="top"
        className="relative z-10 mx-auto max-w-[1320px] px-4 pt-8 pb-16 sm:px-6 md:pt-14 md:pb-24"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left 7 Columns: Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
                Built for Flatmates, Trips & Hostels
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl leading-[1.08]">
              Split flat expenses{' '}
              <span className="bg-gradient-to-r from-[#3E7754] via-[#3E7754] to-[#588362] bg-clip-text text-transparent">
                without awkward
              </span>{' '}
              reminders.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-600 sm:text-base lg:mx-0 leading-relaxed">
              SplitBills is your shared expense command center. Track rent, electricity,
              Swiggy orders, and weekend trips in real time—complete with in-room chat,
              instant UPI settlements, and monthly category analytics.
            </p>

            {/* Primary CTAs: Get Started, Download App, Login */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-6 text-sm font-extrabold text-white shadow-lg shadow-[#3E7754]/30 transition-all hover:from-[#588362] hover:to-[#3E7754] active:scale-95"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/90 bg-white/85 px-5 text-sm font-extrabold text-slate-800 shadow-md shadow-slate-900/5 backdrop-blur-xl transition-all hover:bg-white hover:text-[#3E7754] active:scale-95"
              >
                <Download size={16} className="text-[#3E7754]" />
                <span>Download App</span>
              </button>

              <button
                type="button"
                onClick={onLogin}
                className="inline-flex h-12 items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/50 px-5 text-sm font-bold text-slate-700 backdrop-blur-md transition-all hover:bg-white/90 hover:text-slate-900 active:scale-95"
              >
                <span>Existing User? Log in</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Trust Metrics Strip */}
            <div className="mt-9 grid grid-cols-3 gap-3 rounded-3xl border border-white/90 bg-white/70 p-4 shadow-sm backdrop-blur-xl sm:max-w-lg lg:mx-0 mx-auto">
              <div>
                <p className="font-mono text-xl font-extrabold text-slate-900">1-Tap</p>
                <p className="text-[11px] font-semibold text-slate-500">Quick UPI Log</p>
              </div>
              <div className="border-x border-slate-200/70 px-3">
                <p className="font-mono text-xl font-extrabold text-[#3E7754]">0%</p>
                <p className="text-[11px] font-semibold text-slate-500">Platform Fees</p>
              </div>
              <div>
                <p className="font-mono text-xl font-extrabold text-emerald-600">Real-Time</p>
                <p className="text-[11px] font-semibold text-slate-500">Room Chat & Sync</p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Realistic Mobile Phone Frame Showing SplitBills Dashboard */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[350px]">
              {/* Floating Notification Badge Left */}
              <div className="hidden sm:flex absolute -left-14 top-16 z-20 items-center gap-2.5 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-xl backdrop-blur-xl animate-bounce">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Receipt size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-900">
                    Aarav paid ₹1,200
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-600">
                    WiFi Bill · Your share ₹300
                  </p>
                </div>
              </div>

              {/* Floating Settlement Badge Right */}
              <div className="hidden sm:flex absolute -right-10 bottom-24 z-20 items-center gap-2.5 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-xl backdrop-blur-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#DDE9DF]">
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-900">
                    Flat 402 Settled!
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    Paid via UPI · Just now
                  </p>
                </div>
              </div>

              {/* iPhone Hardware Bezel */}
              <div className="relative mx-auto rounded-[46px] border-[10px] border-slate-900 bg-[#F3F7F3] p-3 shadow-2xl shadow-[#14291D]/25">
                {/* Dynamic Island */}
                <div className="mx-auto mb-2.5 h-5 w-24 rounded-full bg-slate-900" />

                {/* Phone Screen Content (Exact Replica of Mobile Dashboard) */}
                <div className="space-y-3 overflow-hidden rounded-[32px] bg-[#F3F7F3] p-2.5">
                  {/* Mobile Top Bar */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 rounded-full border border-white/90 bg-white/85 py-1 pl-1.5 pr-3 shadow-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#3E7754] to-[#3E7754] text-[11px] font-bold text-white">
                        ₹
                      </span>
                      <div>
                        <span className="block text-[10px] font-extrabold text-slate-900 leading-none">
                          SplitBills
                        </span>
                        <span className="block text-[8px] font-semibold text-[#3E7754]">
                          Hi, Taran
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="flex h-7 items-center gap-1 rounded-full border border-[#BDD2C1]/70 bg-white/90 px-2.5 text-[10px] font-bold text-slate-700">
                        <UserPlus size={11} className="text-[#3E7754]" />
                        Join
                      </span>
                      <span className="flex h-7 items-center gap-1 rounded-full bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-2.5 text-[10px] font-bold text-white">
                        <Plus size={11} />
                        Create
                      </span>
                      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white bg-white/90 text-[#3E7754]">
                        <Bell size={12} />
                        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[8px] font-extrabold text-white">
                          3
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* 1. Native Wallet Hero Card */}
                  <div className="relative overflow-hidden rounded-[22px] border border-white/30 bg-gradient-to-br from-[#3E7754] via-[#3E7754] to-slate-900 p-3.5 text-white shadow-md shadow-[#3E7754]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#DDE9DF]/90">
                          Net Position
                        </span>
                        <div className="mt-0.5 flex items-baseline gap-1.5">
                          <span className="font-mono text-xl font-extrabold text-white">
                            +₹3,450
                          </span>
                          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-[#DDE9DF]">
                            Owed to you
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex h-8 items-center gap-1 rounded-xl border border-white/30 bg-white/20 px-2.5 text-[10px] font-bold text-white backdrop-blur-md">
                        <Plus size={12} /> Add Bill
                      </span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 divide-x divide-white/15 rounded-xl border border-white/20 bg-white/10 p-1.5 text-center backdrop-blur-md">
                      <div>
                        <p className="text-[9px] text-[#DDE9DF]/80">To Receive</p>
                        <p className="font-mono text-[11px] font-extrabold text-emerald-300">
                          +₹4,200
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#DDE9DF]/80">To Pay</p>
                        <p className="font-mono text-[11px] font-extrabold text-rose-300">
                          -₹750
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#DDE9DF]/80">Oct Share</p>
                        <p className="font-mono text-[11px] font-extrabold text-white">
                          ₹8,940
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Segmented Pill Bar */}
                  <div className="grid grid-cols-3 rounded-xl border border-white/80 bg-white/75 p-1 text-center text-[10px] font-bold">
                    <div className="rounded-lg bg-gradient-to-b from-[#3E7754] to-[#3E7754] py-1 text-white shadow-sm">
                      Spaces (3)
                    </div>
                    <div className="py-1 text-slate-600">Dues (2)</div>
                    <div className="py-1 text-slate-600">Recent (14)</div>
                  </div>

                  {/* 3. Space List Items */}
                  <div className="space-y-2">
                    {[
                      {
                        name: 'Flat 402 · Mohali',
                        members: '4 members · ₹28,400',
                        net: '+₹2,150',
                        positive: true,
                        unread: 2,
                        pinned: true,
                      },
                      {
                        name: 'Kasol Weekend Trip',
                        members: '5 members · ₹16,800',
                        net: '+₹1,300',
                        positive: true,
                        unread: 0,
                        pinned: true,
                      },
                      {
                        name: 'Office Lunch Club',
                        members: '6 members · ₹4,120',
                        net: '-₹450',
                        positive: false,
                        unread: 1,
                        pinned: false,
                      },
                    ].map((space) => (
                      <div
                        key={space.name}
                        className="flex items-center justify-between rounded-2xl border border-white/90 bg-white/85 px-3 py-2 shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3E7754] to-[#3E7754] text-xs font-bold text-white">
                            {space.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="truncate text-[11px] font-bold text-slate-900">
                                {space.name}
                              </p>
                              {space.pinned && (
                                <Pin size={9} className="text-[#3E7754]" />
                              )}
                            </div>
                            <p className="text-[9px] text-slate-500">{space.members}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {space.unread > 0 && (
                            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[8px] font-extrabold text-white">
                              {space.unread}
                            </span>
                          )}
                          <span
                            className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold border ${
                              space.positive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-600 border-rose-200'
                            }`}
                          >
                            {space.net}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 4. Floating Mobile Bottom Dock */}
                  <div className="mt-2 flex items-center justify-around rounded-2xl border border-white/90 bg-white/90 py-2 px-3 shadow-md">
                    <span className="text-[10px] font-extrabold text-[#3E7754]">Home</span>
                    <span className="text-[10px] font-semibold text-slate-400">Spaces</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-[#3E7754] to-[#3E7754] text-white shadow-sm">
                      <Plus size={14} />
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Stats</span>
                    <span className="text-[10px] font-semibold text-slate-400">Profile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 2: 3-PHONE MOBILE SHOWCASE (WALLET, CHAT, QUICK EXPENSE)    */}
      {/* =================================================================== */}
      <section
        id="mobile-showcase"
        className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6"
      >
        <div className="text-center">
          <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF]/80 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
            Mobile-First Experience
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Designed like a native iOS & Android app
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Every screen is crafted for one-handed thumb navigation—from 3-second bill
            logging to in-group chat and instant UPI settlements.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* PHONE 1: QUICK EXPENSE SHEET */}
          <div className="flex flex-col items-center rounded-[32px] border border-white/90 bg-white/65 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl">
            <span className="mb-4 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700">
              1. 3-Second Quick Bill Modal
            </span>
            <div className="w-full max-w-[290px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-3 shadow-lg">
              <div className="rounded-[24px] bg-white p-4 shadow-inner space-y-3">
                <div className="mx-auto h-1 w-8 rounded-full bg-slate-300" />
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      Quick Log Expense
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Split equally across space
                    </p>
                  </div>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <X size={12} />
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-600">Space</p>
                  <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900">
                    Flat 402 · Mohali (4 members)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] font-bold text-slate-600">Total (₹)</p>
                    <div className="mt-1 rounded-xl border border-[#779E80] bg-[#EEF4EF]/30 px-2.5 py-2 font-mono text-xs font-extrabold text-slate-900">
                      ₹ 1,600.00
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-600">Category</p>
                    <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-900">
                      Groceries
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-600">Description</p>
                  <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800">
                    Blinkit Weekly Essentials
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-[#3E7754]">
                    Custom split →
                  </span>
                  <span className="rounded-xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-4 py-2 text-[11px] font-bold text-white shadow-sm">
                    Save Bill
                  </span>
                </div>
              </div>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-slate-900">
              Log bills from anywhere
            </h3>
            <p className="mt-1 text-center text-xs text-slate-500">
              Tap the bottom + button to split groceries, utilities, or food orders across
              all members with automatic per-person share calculation.
            </p>
          </div>

          {/* PHONE 2: REAL-TIME ROOM CHAT & ACTIVITY */}
          <div className="flex flex-col items-center rounded-[32px] border border-white/90 bg-white/65 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl">
            <span className="mb-4 rounded-full bg-[#EEF4EF] border border-[#BDD2C1] px-3 py-1 text-[11px] font-bold text-[#356447]">
              2. Built-In Space Chat & Alerts
            </span>
            <div className="w-full max-w-[290px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-3 shadow-lg">
              <div className="rounded-[24px] bg-[#F3F7F3] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3E7754] text-xs font-bold text-white">
                      F
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Flat 402 Chat
                      </p>
                      <p className="text-[9px] text-emerald-600 font-semibold">
                        4 roommates online
                      </p>
                    </div>
                  </div>
                  <MessageSquare size={14} className="text-[#3E7754]" />
                </div>

                {/* System Expense Pill */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-2 text-center">
                  <p className="text-[10px] font-bold text-emerald-900">
                    Receipt Added: Electricity Bill (₹3,200)
                  </p>
                  <p className="text-[9px] text-emerald-700">Each share: ₹800.00</p>
                </div>

                {/* Chat Bubbles */}
                <div className="space-y-2 text-[11px]">
                  <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white p-2.5 shadow-sm">
                    <p className="text-[9px] font-bold text-[#3E7754]">Sushant</p>
                    <p className="text-slate-800">
                      Uploaded the power bill PDF. Please settle by Friday!
                    </p>
                  </div>

                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#3E7754] to-[#3E7754] p-2.5 text-white shadow-sm">
                    <p>Sent my ₹800 via UPI just now!</p>
                  </div>

                  <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white p-2.5 shadow-sm">
                    <p className="text-[9px] font-bold text-[#3E7754]">Rahul</p>
                    <p className="text-slate-800">Settling mine tonight</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-white bg-white px-3 py-1.5 shadow-sm">
                  <span className="flex-1 text-[10px] text-slate-400">
                    Message Flat 402...
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3E7754] text-white">
                    <Send size={10} />
                  </span>
                </div>
              </div>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-slate-900">
              Discuss bills inside the room
            </h3>
            <p className="mt-1 text-center text-xs text-slate-500">
              No more jumping between WhatsApp groups and spreadsheets. Every space has its
              own live chat stream and unread badges.
            </p>
          </div>

          {/* PHONE 3: SMART DUES & 1-TAP SETTLE */}
          <div className="flex flex-col items-center rounded-[32px] border border-white/90 bg-white/65 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl">
            <span className="mb-4 rounded-full bg-[#EEF4EF] border border-[#BDD2C1] px-3 py-1 text-[11px] font-bold text-[#356447]">
              3. Smart Optimized Settlements
            </span>
            <div className="w-full max-w-[290px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-3 shadow-lg">
              <div className="rounded-[24px] bg-[#F3F7F3] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      Balances & Dues
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Minimized transfers across spaces
                    </p>
                  </div>
                  <span className="rounded-lg bg-[#EEF4EF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#356447]">
                    3 Active
                  </span>
                </div>

                {[
                  {
                    title: 'Rahul owes you',
                    space: 'Flat 402 · Mohali',
                    amount: '+₹1,450',
                    owe: false,
                  },
                  {
                    title: 'Sushant owes you',
                    space: 'Kasol Weekend Trip',
                    amount: '+₹2,000',
                    owe: false,
                  },
                  {
                    title: 'You owe Manish',
                    space: 'Office Lunch Club',
                    amount: '-₹450',
                    owe: true,
                  },
                ].map((due) => (
                  <div
                    key={due.title}
                    className="flex items-center justify-between rounded-2xl border border-white bg-white/90 p-3 shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">
                        {due.title}
                      </p>
                      <p className="text-[10px] text-slate-500">{due.space}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-extrabold ${
                          due.owe ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {due.amount}
                      </span>
                      <span className="rounded-xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                        Settle
                      </span>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-center">
                  <p className="text-[10px] font-bold text-emerald-900">
                    UPI ID Linked: taran@okhdfcbank
                  </p>
                </div>
              </div>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-slate-900">
              Settle up in one click
            </h3>
            <p className="mt-1 text-center text-xs text-slate-500">
              See exactly who owes whom across all your rooms and record settlements
              instantly with UPI support.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 3: INTERACTIVE DESKTOP COMMAND CENTER PREVIEW               */}
      {/* =================================================================== */}
      <section
        id="desktop-preview"
        className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6"
      >
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
              Desktop Command Center
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Full-screen widescreen power on Desktop
            </h2>
          </div>

          {/* Interactive Preview Switcher */}
          <div className="flex rounded-2xl border border-white/90 bg-white/80 p-1.5 shadow-sm backdrop-blur-xl">
            {[
              { id: 'command', label: 'Command Center' },
              { id: 'analytics', label: 'Monthly Analytics' },
              { id: 'chat', label: 'Spaces Directory' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePreviewTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activePreviewTab === tab.id
                    ? 'bg-gradient-to-b from-[#3E7754] to-[#3E7754] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Browser Window Mockup */}
        <div className="mt-8 overflow-hidden rounded-[32px] border border-white/90 bg-white/60 shadow-2xl shadow-[#14291D]/10 backdrop-blur-2xl">
          {/* macOS Browser Top Chrome */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-100/80 px-4 py-1 text-[11px] font-semibold text-slate-500">
              <Lock size={11} className="text-emerald-600" />
              <span>app.splitbills.in/dashboard</span>
            </div>
            <button
              type="button"
              onClick={onGetStarted}
              className="text-xs font-bold text-[#3E7754] hover:underline"
            >
              Open Live App →
            </button>
          </div>

          {/* Inside Mockup Content */}
          <div className="bg-[#F3F7F3] p-4 sm:p-6 lg:p-8">
            {/* Top Command Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/90 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#3E7754]">
                  Command Center · Wed, Oct 28
                </p>
                <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  Welcome back, Taranveer
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-3 text-xs font-semibold text-white shadow-sm">
                  <Receipt size={13} /> Quick Expense
                </span>
                <span className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                  <UserPlus size={13} className="text-[#3E7754]" /> Join with Code
                </span>
                <span className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-3.5 text-xs font-semibold text-white shadow-sm">
                  <Plus size={14} /> New Space
                </span>
              </div>
            </div>

            {/* 4-Card Liquid Glass KPI Strip */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Net Position</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    <ArrowDownLeft size={16} />
                  </span>
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-emerald-600">
                  +₹3,450.00
                </p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">
                  <span className="text-emerald-600">+₹4,200 owed</span> ·{' '}
                  <span className="text-rose-600">-₹750 due</span>
                </p>
              </div>

              <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Oct 2026 Share</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#DDE9DF]">
                    <PieChart size={16} />
                  </span>
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900">
                  ₹8,940.00
                </p>
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[45%] bg-[#3E7754]" />
                    <div className="h-full w-[30%] bg-[#588362]" />
                    <div className="h-full w-[25%] bg-[#779E80]" />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Rent 45% · Food 30%</span>
                    <span className="text-[#3E7754] font-bold">Analytics →</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">You Paid Out</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#DDE9DF]">
                    <Wallet size={16} />
                  </span>
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900">
                  ₹12,390.00
                </p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">
                  3 active spaces
                </p>
              </div>

              <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Pending Settlements
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <CheckCircle2 size={16} />
                  </span>
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900">3</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">
                  Active dues ready to settle
                </p>
              </div>
            </div>

            {/* Bottom 12-Col Preview Area */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-8 rounded-3xl p-4 backdrop-blur-md">
                <div className="mb-3 flex items-center justify-between border-b border-slate-200/70 pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {activePreviewTab === 'analytics'
                        ? 'Monthly Category Breakdown'
                        : activePreviewTab === 'chat'
                          ? 'Active & Pinned Spaces Directory'
                          : 'Recent Ledger Activity'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Real-time synced across all members
                    </p>
                  </div>
                  <span className="rounded-xl bg-white px-3 py-1 text-xs font-bold text-[#3E7754] shadow-sm">
                    Live View
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      title: 'October Flat Rent & Maintenance',
                      room: 'Flat 402 · Mohali',
                      meta: 'You paid ₹18,000.00 via UPI · 2026-10-05',
                      impact: '+₹13,500.00',
                      positive: true,
                    },
                    {
                      title: 'Swiggy Instamart Groceries',
                      room: 'Flat 402 · Mohali',
                      meta: 'Sushant paid ₹1,640.00 via UPI · 2026-10-19',
                      impact: '-₹410.00',
                      positive: false,
                    },
                    {
                      title: 'Riverside Campsite Booking',
                      room: 'Kasol Weekend Trip',
                      meta: 'You paid ₹6,500.00 via UPI · 2026-10-24',
                      impact: '+₹5,200.00',
                      positive: true,
                    },
                  ].map((row) => (
                    <div
                      key={row.title}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#DDE9DF]">
                          <Receipt size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {row.title}
                            </p>
                            <span className="rounded-lg bg-[#EEF4EF] px-2 py-0.5 text-[10px] font-bold text-[#356447]">
                              {row.room}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{row.meta}</p>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-xs font-extrabold ${
                          row.positive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {row.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Pinned Spaces & Chat
                </h4>
                <p className="text-[11px] text-slate-500">
                  Instant jump to active flat rooms
                </p>
                <div className="mt-3 space-y-2.5">
                  {[
                    { name: 'Flat 402 · Mohali', badge: '2 new' },
                    { name: 'Kasol Weekend Trip', badge: 'Settled' },
                    { name: 'Office Lunch Club', badge: '1 new' },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3E7754] to-[#3E7754] text-xs font-extrabold text-white">
                          {p.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{p.name}</span>
                      </div>
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                        {p.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 4: BENTO GRID OF ALL DASHBOARD FEATURES                     */}
      {/* =================================================================== */}
      <section
        id="features"
        className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6"
      >
        <div className="text-center">
          <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
            Everything Included
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Every tool your shared flat needs
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Built specifically around Indian shared living—UPI-first logging, invite-code
            spaces, pin/archive controls, and smart settlement math.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Zap,
              color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
              title: 'Quick Expense Logging',
              desc: 'Log groceries, WiFi, or dinner bills in 3 seconds. Choose UPI, Cash, or Card and split equally or with custom shares.',
            },
            {
              icon: Layers,
              color: 'bg-[#EEF4EF] text-[#3E7754] border-[#BDD2C1]',
              title: 'Pin, Mute & Archive Spaces',
              desc: 'Keep your current flat pinned to the top, mute noisy trip groups, and archive completed trips without losing ledger history.',
            },
            {
              icon: MessageSquare,
              color: 'bg-[#EEF4EF] text-[#3E7754] border-[#BDD2C1]',
              title: 'Real-Time Room Chat & Badges',
              desc: 'Every space features its own live chat stream and unread counters so bill questions get resolved right next to the ledger.',
            },
            {
              icon: PieChart,
              color: 'bg-[#EEF4EF] text-[#356447] border-[#BDD2C1]',
              title: 'Monthly Category Analytics',
              desc: 'Track your personal monthly share across Food, Rent, Utilities, and Travel with segmented distribution bars.',
            },
            {
              icon: QrCode,
              color: 'bg-amber-50 text-amber-600 border-amber-200',
              title: '1-Click Invite Codes',
              desc: 'Copy your space invite code with a single tap and onboard new flatmates or trip friends in seconds.',
            },
            {
              icon: Bell,
              color: 'bg-rose-50 text-rose-600 border-rose-200',
              title: 'Slide-Out Activity Center',
              desc: 'Instant flyout drawer for new bills, settlements, and chat mentions—click any alert to jump straight to that space.',
            },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group rounded-3xl border border-white/90 bg-white/75 p-6 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${feat.color}`}
                >
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-slate-900">
                  {feat.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 5: INTERACTIVE SMART SPLIT & DEBT SIMPLIFIER                */}
      {/* =================================================================== */}
      <section
        id="smart-split"
        className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6"
      >
        <div className="rounded-[36px] border border-white/90 bg-gradient-to-br from-[#3E7754] via-[#3E7754] to-slate-900 p-6 text-white shadow-2xl shadow-[#233E2F]/20 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#DDE9DF] backdrop-blur-md">
                <Sparkles size={12} /> Interactive Split Preview
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Try the instant bill splitter right here
              </h2>
              <p className="text-sm text-[#DDE9DF]/90 leading-relaxed">
                Adjust the bill total or number of roommates below to see how SplitBills
                calculates your exact net impact and sends instant notifications to the
                rest of the room.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#DDE9DF]">Bill Amount</span>
                    <span className="font-mono text-base font-extrabold text-emerald-300">
                      ₹{demoBillAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="20000"
                    step="100"
                    value={demoBillAmount}
                    onChange={(e) => setDemoBillAmount(Number(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/25 accent-emerald-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#DDE9DF]">Roommates in Space</span>
                    <span className="font-mono text-base font-extrabold text-white">
                      {demoMembers} Members
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {[2, 3, 4, 5, 6].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setDemoMembers(count)}
                        className={`flex-1 rounded-xl py-2 text-xs font-extrabold transition-all ${
                          demoMembers === count
                            ? 'bg-white text-[#356447] shadow-md'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live Output Card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-white/25 bg-white/10 p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#BDD2C1]">
                      Live Split Calculation
                    </p>
                    <p className="text-lg font-extrabold text-white">
                      Flat 402 · Shared Expense
                    </p>
                  </div>
                  <span className="rounded-xl bg-emerald-400/20 border border-emerald-300/30 px-3 py-1 font-mono text-xs font-extrabold text-emerald-300">
                    Paid by You
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-[11px] text-[#DDE9DF]/80">Per Person Share</p>
                    <p className="mt-1 font-mono text-2xl font-extrabold text-white">
                      ₹{(demoBillAmount / demoMembers).toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/30 p-4">
                    <p className="text-[11px] text-emerald-100">You Lent (Owed to You)</p>
                    <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-300">
                      +₹
                      {(
                        demoBillAmount -
                        demoBillAmount / demoMembers
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/40 p-3.5 text-xs text-[#DDE9DF]">
                  <span className="font-bold text-white">Auto-Notification Preview: </span>
                  “You added a bill for ₹{demoBillAmount}. Each of the other{' '}
                  {demoMembers - 1} roommates owes ₹
                  {(demoBillAmount / demoMembers).toFixed(0)}.”
                </div>

                <button
                  type="button"
                  onClick={onGetStarted}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white text-xs font-extrabold text-[#356447] shadow-lg transition-transform active:scale-95"
                >
                  <span>Start Splitting with Your Roommates</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 6: HOW IT WORKS (3 SIMPLE STEPS)                            */}
      {/* =================================================================== */}
      <section
        id="how-it-works"
        className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6"
      >
        <div className="text-center">
          <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
            Zero Setup Friction
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Get your flat sorted in under 60 seconds
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Create or Join a Space',
              desc: 'Start a room for your flat, hostel wing, or Goa trip. Share the 6-digit invite code so roommates can join with one click.',
            },
            {
              step: '02',
              title: 'Log Bills & Chat Live',
              desc: 'Use Quick Expense whenever someone pays for groceries, WiFi, or food delivery. Every member gets an instant activity alert.',
            },
            {
              step: '03',
              title: 'Settle Optimized Dues',
              desc: 'At month-end, check your Net Position card and settle combined balances in a single UPI payment.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative rounded-3xl border border-white/90 bg-white/80 p-6 shadow-sm backdrop-blur-xl"
            >
              <span className="font-mono text-3xl font-extrabold text-[#3E7754]/25">
                {item.step}
              </span>
              <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 7: DOWNLOAD / INSTALL PWA & CROSS-PLATFORM BANNER           */}
      {/* =================================================================== */}
      <section
        id="download-section"
        className="relative z-10 mx-auto max-w-[1320px] px-4 py-12 sm:px-6"
      >
        <div className="rounded-[32px] border border-white/90 bg-white/85 p-6 shadow-xl backdrop-blur-2xl sm:p-10">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#3E7754] to-[#3E7754] text-white shadow-lg shadow-[#3E7754]/25">
                <Smartphone size={30} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF4EF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#3E7754]">
                  Progressive Web App (PWA)
                </div>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Install SplitBills on your Home Screen
                </h2>
                <p className="mt-1 max-w-xl text-xs sm:text-sm text-slate-600">
                  No 100MB app store download required. Install directly from your browser
                  for a full-screen native experience on Android, iOS, Windows, and macOS.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-6 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-[#3E7754]/25 transition-all hover:from-[#588362] hover:to-[#3E7754] active:scale-95"
              >
                <Download size={16} />
                <span>Install SplitBills App</span>
              </button>

              <button
                type="button"
                onClick={onLogin}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-xs sm:text-sm font-bold text-slate-700 shadow-sm hover:border-[#9AB99F] hover:text-[#3E7754]"
              >
                <span>Open Web Login</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 8: FREQUENTLY ASKED QUESTIONS                               */}
      {/* =================================================================== */}
      <section
        id="faq"
        className="relative z-10 mx-auto max-w-[920px] px-4 py-16 sm:px-6"
      >
        <div className="text-center">
          <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-white/90 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm font-extrabold text-slate-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-[#3E7754]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 border-t border-slate-200/60 pt-2.5 text-xs leading-relaxed text-slate-600">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 9: FINAL CTA & FOOTER                                       */}
      {/* =================================================================== */}
      <footer className="relative z-10 border-t border-white/80 bg-white/60 backdrop-blur-2xl">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/90 bg-gradient-to-r from-[#3E7754] to-[#3E7754] p-8 text-center text-white shadow-xl sm:flex-row sm:text-left">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                Ready to simplify your flat expenses?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#DDE9DF]">
                Create your first shared room in seconds or log in to your existing spaces.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-2xl bg-white px-5 py-3 text-xs font-extrabold text-[#356447] shadow-md transition-transform active:scale-95"
              >
                Get Started Free
              </button>
              <button
                type="button"
                onClick={onLogin}
                className="rounded-2xl border border-white/40 bg-white/15 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition-transform active:scale-95"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className="rounded-2xl border border-white/40 bg-white/15 px-4 py-3 text-xs font-bold text-white backdrop-blur-md transition-transform active:scale-95"
              >
                Install App
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#3E7754] font-bold text-white">
                ₹
              </span>
              <span className="font-extrabold text-slate-900">SplitBills</span>
              <span>· Shared Expense & Flat Ledger</span>
            </div>
            <div className="flex items-center gap-5 font-semibold">
              <button type="button" onClick={onLogin} className="hover:text-[#3E7754]">
                Login
              </button>
              <button type="button" onClick={onGetStarted} className="hover:text-[#3E7754]">
                Sign Up
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className="hover:text-[#3E7754]"
              >
                Download App
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}