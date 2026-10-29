import { useState, useEffect, useRef } from 'react';
import sharebillsIcon from '../assets/sharebills-icon.webp';
import {
  Plus,
  UserPlus,
  Download,
  ChevronDown,
  Pin,
  Bell,
  Receipt,
  ArrowDownLeft,
  Wallet,
  PieChart,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Zap,
  Smartphone,
  Layers,
  Lock,
  Menu,
  X,
  QrCode,
  ArrowRight,
  Globe,
  Send,
  Link,
  CodeXml,
  Mail,
  Users,
} from 'lucide-react';

// ===================================================================
// CUSTOM SCROLL ANIMATION HOOK & COMPONENT
// ===================================================================
const RevealOnScroll = ({ children, className = '', delay = 0, threshold = 0.15 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function LandingPage({
  onLogin,
  onGetStarted,
  onDownloadApp,
  isStandaloneWebApp = false,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [activePreviewTab, setActivePreviewTab] = useState('command'); // 'command' | 'analytics' | 'chat'
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!isStandaloneWebApp) return undefined;

    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!statusBarMeta) return undefined;

    const previousStyle = statusBarMeta.content;
    statusBarMeta.content = 'black-translucent';
    return () => {
      statusBarMeta.content = previousStyle;
    };
  }, [isStandaloneWebApp]);

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
      q: 'Is Sharebills completely free for roommates and flatmates?',
      a: 'Yes! Creating unlimited spaces, logging bills, smart debt simplification, group chat, and monthly analytics are 100% free with zero hidden subscription walls.',
    },
    {
      q: 'How does the Smart Settlement algorithm work?',
      a: 'Instead of everyone paying everyone back for each individual grocery run or Swiggy order, Sharebills calculates the net position of each roommate and minimizes the total number of UPI transfers needed to settle the entire flat.',
    },
    {
      q: 'Can I install Sharebills as a native app on Android and iOS?',
      a: 'Absolutely. Sharebills is built as a Progressive Web App (PWA). Tap "Install App" in the header or footer to add it directly to your home screen with full-screen native gestures and instant loading.',
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

  if (isStandaloneWebApp) {
    return (
      <main className="flex min-h-[100dvh] flex-col bg-[#3E7754] pt-[env(safe-area-inset-top)] text-white">
        <RevealOnScroll className="flex flex-1 flex-col items-center justify-center px-8 text-center" delay={100}>
          <img
            src={sharebillsIcon}
            alt=""
            className="mb-6 h-24 w-24 rounded-[2rem] shadow-xl shadow-black/15"
          />
          <h1 className="text-4xl font-extrabold tracking-tight">Sharebills</h1>
          <p className="mt-3 max-w-xs text-base font-medium text-white/85">
            Shared expenses, simplified.
          </p>
        </RevealOnScroll>
        <footer className="rounded-t-[2rem] bg-white px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-slate-900 animate-slide-up">
          <button
            type="button"
            onClick={onLogin}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#3E7754] px-6 text-base font-bold text-white transition-colors hover:bg-[#356447] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3E7754]"
          >
            Get started
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </footer>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F3F7F3] font-sans text-slate-900 selection:bg-[#3E7754] selection:text-white">
      {/* SOFT REFRACTIVE MESH BACKDROP */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[#9AB99F]/30 blur-3xl transition-transform duration-[10000ms] ease-in-out hover:scale-110" />
        <div className="absolute top-1/4 -right-28 h-96 w-96 rounded-full bg-[#9AB99F]/25 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-[#BDD2C1]/30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-[#BDD2C1]/25 blur-3xl transition-transform duration-[15000ms] ease-in-out hover:scale-125" />
      </div>

      {/* STICKY LIQUID GLASS NAVBAR */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
        <nav className="mx-auto flex max-w-[1320px] items-center justify-between rounded-full border border-white/90 bg-white/75 px-4 py-2.5 shadow-lg shadow-[#233E2F]/5 backdrop-blur-2xl sm:px-6">
          <a href="#top" className="flex items-center gap-2.5 text-left focus:outline-none group">
            <img
              src={sharebillsIcon}
              alt=""
              className="h-10 w-10 rounded-2xl object-cover shadow-md shadow-[#3E7754]/25 transition-transform group-hover:scale-105"
            />
            <div>
              <span className="block text-base font-extrabold tracking-tight text-slate-900 leading-none">
                Sharebills
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-[#3E7754]">
                Liquid Ledger
              </span>
            </div>
          </a>

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

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#BDD2C1]/80 bg-[#EEF4EF]/70 px-3.5 text-xs font-bold text-[#356447] transition-all hover:bg-[#DDE9DF]/80 active:scale-95 hover:-translate-y-0.5"
            >
              <Download size={13} />
              <span>Install App</span>
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex h-9 items-center rounded-full border border-slate-200/90 bg-white/90 px-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-[#9AB99F] hover:text-[#3E7754] active:scale-95 hover:-translate-y-0.5"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-4 text-xs font-bold text-white shadow-md shadow-[#3E7754]/25 transition-all hover:from-[#588362] hover:to-[#3E7754] active:scale-95 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </button>
          </div>

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

        {mobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-[1320px] rounded-3xl border border-white/90 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl lg:hidden animate-in slide-in-from-top-4 fade-in duration-300">
             {/* ... Mobile Menu Content ... (Kept original logic) */}
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
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1: HERO SECTION */}
      <section id="top" className="relative z-10 mx-auto max-w-[1320px] px-4 pt-8 pb-16 sm:px-6 md:pt-14 md:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 text-center lg:text-left">
            <RevealOnScroll delay={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
                  Built for Flatmates, Trips & Hostels
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl leading-[1.08]">
                Split flat expenses{' '}
                <span className="bg-gradient-to-r from-[#3E7754] via-[#3E7754] to-[#588362] bg-clip-text text-transparent">
                  without awkward
                </span>{' '}
                reminders.
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-600 sm:text-base lg:mx-0 leading-relaxed">
                Sharebills is your shared expense command center. Track rent, electricity,
                Swiggy orders, and weekend trips in real time—complete with in-room chat,
                instant UPI settlements, and monthly category analytics.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-6 text-sm font-extrabold text-white shadow-lg shadow-[#3E7754]/30 transition-all hover:from-[#588362] hover:to-[#3E7754] hover:-translate-y-1 active:translate-y-0"
                >
                  <span>Existing User? Log in</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/90 bg-white/85 px-5 text-sm font-extrabold text-slate-800 shadow-md shadow-slate-900/5 backdrop-blur-xl transition-all hover:bg-white hover:text-[#3E7754] hover:-translate-y-1 active:translate-y-0"
                >
                  <Download size={16} className="text-[#3E7754]" />
                  <span>Download App</span>
                </button>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Hero Image / Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <RevealOnScroll delay={500} className="relative w-full max-w-[350px]">
               {/* Original Phone UI Code (Kept intact) */}
               {/* Floating Notification Badge Left */}
               <div className="hidden sm:flex absolute -left-14 top-16 z-20 items-center gap-2.5 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-xl backdrop-blur-xl animate-bounce" style={{animationDuration: '3s'}}>
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
              <div className="hidden sm:flex absolute -right-10 bottom-24 z-20 items-center gap-2.5 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-xl backdrop-blur-xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#DDE9DF]">
                  <CheckCircle2 size={15} />
                </div>
              </div>

              {/* iPhone Hardware Bezel */}
              <div className="relative mx-auto rounded-[46px] border-[10px] border-slate-900 bg-[#F3F7F3] p-3 shadow-2xl shadow-[#14291D]/25 transition-transform duration-500 hover:scale-[1.02]">
                {/* Dynamic Island */}
                <div className="mx-auto mb-2.5 h-5 w-24 rounded-full bg-slate-900" />
                {/* Phone Screen Content */}
                <div className="space-y-3 overflow-hidden rounded-[32px] bg-[#F3F7F3] p-2.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 rounded-full border border-white/90 bg-white/85 py-1 pl-1.5 pr-3 shadow-sm">
                      <img src={sharebillsIcon} alt="" className="h-6 w-6 rounded-full object-cover" />
                      <div>
                        <span className="block text-[10px] font-extrabold text-slate-900 leading-none">Sharebills</span>
                        <span className="block text-[8px] font-semibold text-[#3E7754]">Hi, Taran</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="flex h-7 items-center gap-1 rounded-full border border-[#BDD2C1]/70 bg-white/90 px-2.5 text-[10px] font-bold text-slate-700">
                        <UserPlus size={11} className="text-[#3E7754]" /> Join
                      </span>
                      <span className="flex h-7 items-center gap-1 rounded-full bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-2.5 text-[10px] font-bold text-white">
                        <Plus size={11} /> Create
                      </span>
                      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white bg-white/90 text-[#3E7754]">
                        <Bell size={12} />
                        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[8px] font-extrabold text-white">3</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[22px] border border-white/30 bg-gradient-to-br from-[#3E7754] via-[#3E7754] to-slate-900 p-3.5 text-white shadow-md shadow-[#3E7754]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#DDE9DF]/90">Net Position</span>
                        <div className="mt-0.5 flex items-baseline gap-1.5">
                          <span className="font-mono text-xl font-extrabold text-white">+₹3,450</span>
                          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-[#DDE9DF]">Owed to you</span>
                        </div>
                      </div>
                      <span className="inline-flex h-8 items-center gap-1 rounded-xl border border-white/30 bg-white/20 px-2.5 text-[10px] font-bold text-white backdrop-blur-md">
                        <Plus size={12} /> Add Bill
                      </span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-3 divide-x divide-white/15 rounded-xl border border-white/20 bg-white/10 p-1.5 text-center backdrop-blur-md">
                      <div><p className="text-[9px] text-[#DDE9DF]/80">To Receive</p><p className="font-mono text-[11px] font-extrabold text-emerald-300">+₹4,200</p></div>
                      <div><p className="text-[9px] text-[#DDE9DF]/80">To Pay</p><p className="font-mono text-[11px] font-extrabold text-rose-300">-₹750</p></div>
                      <div><p className="text-[9px] text-[#DDE9DF]/80">Oct Share</p><p className="font-mono text-[11px] font-extrabold text-white">₹8,940</p></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 rounded-xl border border-white/80 bg-white/75 p-1 text-center text-[10px] font-bold">
                    <div className="rounded-lg bg-gradient-to-b from-[#3E7754] to-[#3E7754] py-1 text-white shadow-sm">Spaces (3)</div>
                    <div className="py-1 text-slate-600">Dues (2)</div>
                    <div className="py-1 text-slate-600">Recent (14)</div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Flat 402 · Mohali', members: '4 members · ₹28,400', net: '+₹2,150', positive: true, unread: 2, pinned: true },
                      { name: 'Kasol Trip', members: '5 members · ₹16,800', net: '+₹1,300', positive: true, unread: 0, pinned: true },
                      { name: 'Office Lunch', members: '6 members · ₹4,120', net: '-₹450', positive: false, unread: 1, pinned: false },
                    ].map((space) => (
                      <div key={space.name} className="flex items-center justify-between rounded-2xl border border-white/90 bg-white/85 px-3 py-2 shadow-sm">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3E7754] to-[#3E7754] text-xs font-bold text-white">
                            {space.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="truncate text-[11px] font-bold text-slate-900">{space.name}</p>
                              {space.pinned && <Pin size={9} className="text-[#3E7754]" />}
                            </div>
                            <p className="text-[9px] text-slate-500">{space.members}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {space.unread > 0 && (
                            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[8px] font-extrabold text-white">{space.unread}</span>
                          )}
                          <span className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold border ${space.positive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                            {space.net}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

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
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* SECTION 2: 3-PHONE MOBILE SHOWCASE */}
      <section id="mobile-showcase" className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6">
        <RevealOnScroll className="text-center">
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
        </RevealOnScroll>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* PHONE 1 */}
          <RevealOnScroll delay={100} className="flex flex-col items-center rounded-[32px] border border-white/90 bg-white/65 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl">
             {/* Same Phone 1 UI Code */}
             <span className="mb-4 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700">
              1. 3-Second Quick Bill Modal
            </span>
            <div className="w-full max-w-[290px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-3 shadow-lg hover:scale-105 transition-transform duration-300">
              {/* Box internals */}
              <div className="rounded-[24px] bg-white p-4 shadow-inner space-y-3">
                <div className="mx-auto h-1 w-8 rounded-full bg-slate-300" />
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Quick Log Expense</p>
                    <p className="text-[10px] text-slate-500">Split equally across space</p>
                  </div>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500"><X size={12} /></span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-600">Space</p>
                  <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900">Flat 402 · Mohali (4 members)</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] font-bold text-slate-600">Total (₹)</p>
                    <div className="mt-1 rounded-xl border border-[#779E80] bg-[#EEF4EF]/30 px-2.5 py-2 font-mono text-xs font-extrabold text-slate-900">₹ 1,600.00</div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-600">Category</p>
                    <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-900">Groceries</div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-600">Description</p>
                  <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800">Blinkit Weekly Essentials</div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-[#3E7754]">Custom split →</span>
                  <span className="rounded-xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-4 py-2 text-[11px] font-bold text-white shadow-sm">Save Bill</span>
                </div>
              </div>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-slate-900">Log bills from anywhere</h3>
            <p className="mt-1 text-center text-xs text-slate-500">Tap the bottom + button to split groceries, utilities, or food orders across all members with automatic per-person share calculation.</p>
          </RevealOnScroll>

          {/* PHONE 2 */}
          <RevealOnScroll delay={300} className="flex flex-col items-center rounded-[32px] border border-white/90 bg-white/65 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl">
             <span className="mb-4 rounded-full bg-[#EEF4EF] border border-[#BDD2C1] px-3 py-1 text-[11px] font-bold text-[#356447]">
              2. Built-In Space Chat & Alerts
            </span>
            <div className="w-full max-w-[290px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-3 shadow-lg hover:scale-105 transition-transform duration-300">
               {/* Internal UI */}
               <div className="rounded-[24px] bg-[#F3F7F3] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3E7754] text-xs font-bold text-white">F</div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Flat 402 Chat</p>
                      <p className="text-[9px] text-emerald-600 font-semibold">4 roommates online</p>
                    </div>
                  </div>
                  <MessageSquare size={14} className="text-[#3E7754]" />
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-2 text-center">
                  <p className="text-[10px] font-bold text-emerald-900">Receipt Added: Electricity Bill (₹3,200)</p>
                  <p className="text-[9px] text-emerald-700">Each share: ₹800.00</p>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white p-2.5 shadow-sm">
                    <p className="text-[9px] font-bold text-[#3E7754]">Sushant</p>
                    <p className="text-slate-800">Uploaded the power bill PDF. Please settle by Friday!</p>
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
                  <span className="flex-1 text-[10px] text-slate-400">Message Flat 402...</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3E7754] text-white"><Send size={10} /></span>
                </div>
              </div>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-slate-900">Discuss bills inside the room</h3>
            <p className="mt-1 text-center text-xs text-slate-500">No more jumping between WhatsApp groups and spreadsheets. Every space has its own live chat stream and unread badges.</p>
          </RevealOnScroll>

          {/* PHONE 3 */}
          <RevealOnScroll delay={500} className="flex flex-col items-center rounded-[32px] border border-white/90 bg-white/65 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl">
             <span className="mb-4 rounded-full bg-[#EEF4EF] border border-[#BDD2C1] px-3 py-1 text-[11px] font-bold text-[#356447]">
              3. Smart Optimized Settlements
            </span>
            <div className="w-full max-w-[290px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-3 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="rounded-[24px] bg-[#F3F7F3] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Balances & Dues</p>
                    <p className="text-[10px] text-slate-500">Minimized transfers across spaces</p>
                  </div>
                  <span className="rounded-lg bg-[#EEF4EF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#356447]">3 Active</span>
                </div>
                {[
                  { title: 'Rahul owes you', space: 'Flat 402 · Mohali', amount: '+₹1,450', owe: false },
                  { title: 'Sushant owes you', space: 'Kasol Weekend Trip', amount: '+₹2,000', owe: false },
                  { title: 'You owe Manish', space: 'Office Lunch Club', amount: '-₹450', owe: true },
                ].map((due) => (
                  <div key={due.title} className="flex items-center justify-between rounded-2xl border border-white bg-white/90 p-3 shadow-sm">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">{due.title}</p>
                      <p className="text-[10px] text-slate-500">{due.space}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-extrabold ${due.owe ? 'text-rose-600' : 'text-emerald-600'}`}>{due.amount}</span>
                      <span className="rounded-xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">Settle</span>
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-center">
                  <p className="text-[10px] font-bold text-emerald-900">UPI ID Linked: taran@okhdfcbank</p>
                </div>
              </div>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-slate-900">Settle up in one click</h3>
            <p className="mt-1 text-center text-xs text-slate-500">See exactly who owes whom across all your rooms and record settlements instantly with UPI support.</p>
          </RevealOnScroll>
        </div>
      </section>

      {/* SECTION 3: DESKTOP COMMAND CENTER */}
      <section id="desktop-preview" className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6">
        <RevealOnScroll className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
              Desktop Command Center
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Full-screen widescreen power on Desktop
            </h2>
          </div>
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
        </RevealOnScroll>

        <RevealOnScroll delay={200} className="mt-8 overflow-hidden rounded-[32px] border border-white/90 bg-white/60 shadow-2xl shadow-[#14291D]/10 backdrop-blur-2xl">
          {/* macOS Browser Top Chrome */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400 hover:scale-110 transition-transform" />
              <span className="h-3 w-3 rounded-full bg-amber-400 hover:scale-110 transition-transform" />
              <span className="h-3 w-3 rounded-full bg-emerald-400 hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-100/80 px-4 py-1 text-[11px] font-semibold text-slate-500">
              <Lock size={11} className="text-emerald-600" />
              <span>app.sharebills.in/dashboard</span>
            </div>
            <button type="button" onClick={onGetStarted} className="text-xs font-bold text-[#3E7754] hover:underline">
              Open Live App →
            </button>
          </div>

          <div className="bg-[#F3F7F3] p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/90 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#3E7754]">Command Center · Wed, Oct 28</p>
                <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">Welcome back, Taranveer</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-3 text-xs font-semibold text-white shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                  <Receipt size={13} /> Quick Expense
                </span>
                <span className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:-translate-y-1 transition-transform cursor-pointer">
                  <UserPlus size={13} className="text-[#3E7754]" /> Join with Code
                </span>
                <span className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-3.5 text-xs font-semibold text-white shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                  <Plus size={14} /> New Space
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {/* 4 Cards (Net Position, Oct Share, Paid out, Pending) */}
               <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Net Position</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60"><ArrowDownLeft size={16} /></span>
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-emerald-600">+₹3,450.00</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500"><span className="text-emerald-600">+₹4,200 owed</span> · <span className="text-rose-600">-₹750 due</span></p>
              </div>

              <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Oct 2026 Share</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#DDE9DF]"><PieChart size={16} /></span>
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900">₹8,940.00</p>
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

              <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">You Paid Out</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#DDE9DF]"><Wallet size={16} /></span>
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900">₹12,390.00</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">3 active spaces</p>
              </div>

              <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Pending Settlements</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 size={16} /></span>
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900">3</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">Active dues ready to settle</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-8 rounded-3xl p-4 backdrop-blur-md">
                <div className="mb-3 flex items-center justify-between border-b border-slate-200/70 pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Recent Ledger Activity</h4>
                    <p className="text-xs text-slate-500">Real-time synced across all members</p>
                  </div>
                  <span className="rounded-xl bg-white px-3 py-1 text-xs font-bold text-[#3E7754] shadow-sm">Live View</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { title: 'October Flat Rent & Maintenance', room: 'Flat 402 · Mohali', meta: 'You paid ₹18,000.00 via UPI · 2026-10-05', impact: '+₹13,500.00', positive: true },
                    { title: 'Swiggy Instamart Groceries', room: 'Flat 402 · Mohali', meta: 'Sushant paid ₹1,640.00 via UPI · 2026-10-19', impact: '-₹410.00', positive: false },
                    { title: 'Riverside Campsite Booking', room: 'Kasol Weekend Trip', meta: 'You paid ₹6,500.00 via UPI · 2026-10-24', impact: '+₹5,200.00', positive: true },
                  ].map((row) => (
                    <div key={row.title} className="flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm hover:bg-white transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#DDE9DF]"><Receipt size={16} /></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold text-slate-900">{row.title}</p>
                            <span className="rounded-lg bg-[#EEF4EF] px-2 py-0.5 text-[10px] font-bold text-[#356447]">{row.room}</span>
                          </div>
                          <p className="text-xs text-slate-500">{row.meta}</p>
                        </div>
                      </div>
                      <span className={`font-mono text-xs font-extrabold ${row.positive ? 'text-emerald-600' : 'text-rose-600'}`}>{row.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm">
                <h4 className="text-sm font-extrabold text-slate-900">Pinned Spaces & Chat</h4>
                <p className="text-[11px] text-slate-500">Instant jump to active flat rooms</p>
                <div className="mt-3 space-y-2.5">
                  {[
                    { name: 'Flat 402 · Mohali', badge: '2 new' },
                    { name: 'Kasol Weekend Trip', badge: 'Settled' },
                    { name: 'Office Lunch Club', badge: '1 new' },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3E7754] to-[#3E7754] text-xs font-extrabold text-white">{p.name.charAt(0)}</div>
                        <span className="text-xs font-bold text-slate-900">{p.name}</span>
                      </div>
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-600">{p.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* SECTION 4: BENTO GRID */}
      <section id="features" className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6">
        <RevealOnScroll className="text-center">
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
        </RevealOnScroll>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Zap, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', title: 'Quick Expense Logging', desc: 'Log groceries, WiFi, or dinner bills in 3 seconds. Choose UPI, Cash, or Card and split equally or with custom shares.' },
            { icon: Layers, color: 'bg-[#EEF4EF] text-[#3E7754] border-[#BDD2C1]', title: 'Pin, Mute & Archive Spaces', desc: 'Keep your current flat pinned to the top, mute noisy trip groups, and archive completed trips without losing ledger history.' },
            { icon: MessageSquare, color: 'bg-[#EEF4EF] text-[#3E7754] border-[#BDD2C1]', title: 'Real-Time Room Chat & Badges', desc: 'Every space features its own live chat stream and unread counters so bill questions get resolved right next to the ledger.' },
            { icon: PieChart, color: 'bg-[#EEF4EF] text-[#356447] border-[#BDD2C1]', title: 'Monthly Category Analytics', desc: 'Track your personal monthly share across Food, Rent, Utilities, and Travel with segmented distribution bars.' },
            { icon: QrCode, color: 'bg-amber-50 text-amber-600 border-amber-200', title: '1-Click Invite Codes', desc: 'Copy your space invite code with a single tap and onboard new flatmates or trip friends in seconds.' },
            { icon: Bell, color: 'bg-rose-50 text-rose-600 border-rose-200', title: 'Slide-Out Activity Center', desc: 'Instant flyout drawer for new bills, settlements, and chat mentions—click any alert to jump straight to that space.' },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <RevealOnScroll key={feat.title} delay={idx * 100}>
                <div className="group h-full rounded-3xl border border-white/90 bg-white/75 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl hover:shadow-[#3E7754]/10">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feat.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-slate-900 transition-colors group-hover:text-[#3E7754]">
                    {feat.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {feat.desc}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 5: CREATIVE & ANIMATED SIMPLIFIED SECTION                   */}
      {/* =================================================================== */}
      <section id="smart-split" className="relative z-10 overflow-hidden bg-white/30 px-4 py-20 sm:px-6 sm:py-24 border-y border-white/80">
        {/* Animated glowing backdrop meshes */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
           <div className="absolute top-[10%] left-[20%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-emerald-200/40 blur-[100px] duration-[5000ms]" />
           <div className="absolute bottom-[10%] right-[10%] h-[350px] w-[350px] translate-x-1/2 translate-y-1/2 animate-pulse rounded-full bg-[#9AB99F]/30 blur-[80px] duration-[7000ms]" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Left Typography Side */}
          <RevealOnScroll>
            <div className="relative">
              {/* Floating Decorative Icon */}
              <div className="absolute -left-8 -top-8 hidden h-14 w-14 animate-bounce items-center justify-center rounded-2xl bg-white/70 p-3 shadow-xl backdrop-blur-xl sm:flex" style={{ animationDuration: '4s' }}>
                <Receipt className="text-emerald-500" />
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-[#326b4a] shadow-sm">
                <Sparkles size={14} className="animate-pulse text-emerald-500" />
                Shared life, simplified
              </span>
              
              <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl md:leading-[1.1]">
                More living.<br />
                <span className="relative inline-block text-[#43855F]">
                  Less keeping score.
                  {/* Hand-drawn SVG underline effect */}
                  <svg className="absolute -bottom-2 left-0 w-full animate-[pulse_3s_ease-in-out_infinite]" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00034 6.70295C48.0691 -0.999557 122.951 -1.48833 198.001 6.70295" stroke="#43855F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">
                Track shared expenses, instantly settle up, and keep your friendships intact without the awkward mental math.
              </p>
              
              <button
                type="button"
                onClick={onGetStarted}
                className="group mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#3E7754] to-[#28583c] px-6 text-sm font-bold text-white shadow-xl shadow-[#3E7754]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#3E7754]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63B686] focus-visible:ring-offset-2"
              >
                Get started today
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </RevealOnScroll>

          {/* Right Interactive/Animated Bento Cards */}
          <div className="relative grid gap-4 sm:grid-cols-2">
            {[
              { icon: Receipt, title: 'Add shared expenses instantly', delay: 100, color: 'text-rose-500', bg: 'bg-rose-50' },
              { icon: Users, title: 'Keep everyone in sync live', delay: 200, color: 'text-blue-500', bg: 'bg-blue-50', extraClass: 'sm:translate-y-8' },
              { icon: CheckCircle2, title: 'See balances clearly', delay: 300, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: Wallet, title: 'Settle up in 1-tap', delay: 400, color: 'text-amber-500', bg: 'bg-amber-50', extraClass: 'sm:translate-y-8' },
            ].map(({ icon: Icon, title, delay, color, bg, extraClass }) => (
              <RevealOnScroll key={title} delay={delay}>
                <div className={`group relative flex flex-col items-start gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-2xl ${extraClass || ''}`}>
                  {/* Subtle pulsing background behind icon */}
                  <div className={`absolute left-6 top-6 h-12 w-12 rounded-2xl ${bg} opacity-50 animate-ping duration-[3000ms]`} />
                  
                  <span className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-sm ${color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon size={24} />
                  </span>
                  
                  <span className="text-sm font-extrabold text-slate-800 transition-colors group-hover:text-[#326b4a]">{title}</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-[1320px] px-4 py-16 sm:px-6">
        <RevealOnScroll className="text-center">
          <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
            Zero Setup Friction
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Get your flat sorted in under 60 seconds
          </h2>
        </RevealOnScroll>

        <div className="relative mx-auto mt-12 max-w-5xl">
          <div aria-hidden="true" className="absolute bottom-8 left-[19px] top-8 w-px bg-gradient-to-b from-[#63B686] via-[#91CCA7] to-[#DCEFE2] md:bottom-auto md:left-[16.66%] md:right-[16.66%] md:top-[23px] md:h-px md:w-auto md:bg-gradient-to-r" />
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {[
              { step: '01', icon: UserPlus, title: 'Create or Join a Space', desc: 'Start a room for your flat, hostel wing, or Goa trip. Share the 6-digit invite code so roommates can join with one click.' },
              { step: '02', icon: Receipt, title: 'Log Bills & Chat Live', desc: 'Use Quick Expense whenever someone pays for groceries, WiFi, or food delivery. Every member gets an instant activity alert.' },
              { step: '03', icon: CheckCircle2, title: 'Settle Optimized Dues', desc: 'At month-end, check your Net Position card and settle combined balances in a single UPI payment.' },
            ].map(({ step, icon: Icon, title, desc }, index) => (
              <RevealOnScroll key={step} delay={index * 200}>
                <article className="group relative pl-14 md:pl-0 md:pt-14">
                  <div className="absolute left-0 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border-[5px] border-[#F3F7F3] bg-[#326b4a] text-white shadow-[0_0_0_1px_rgba(67,133,95,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#63B686] group-hover:shadow-[0_0_0_6px_rgba(99,182,134,0.14)] md:left-1/2 md:top-0 md:-translate-x-1/2 md:group-hover:-translate-x-1/2">
                    <Icon size={14} strokeWidth={2.5} />
                  </div>
                  <div className="h-full rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#BDD2C1] group-hover:shadow-xl group-hover:shadow-[#326b4a]/10 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#43855F]">Step {step}</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#DCEFE2] to-transparent" />
                      <span className="font-mono text-xs font-bold text-slate-300">0{index + 1}/03</span>
                    </div>
                    <h3 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900">{title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{desc}</p>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: DOWNLOAD PWA */}
      <section id="download-section" className="relative z-10 mx-auto max-w-[1320px] px-4 py-12 sm:px-6">
        <RevealOnScroll className="rounded-[32px] border border-white/90 bg-white/85 p-6 shadow-xl backdrop-blur-2xl sm:p-10 transition-transform duration-500 hover:scale-[1.01]">
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
                  Install Sharebills on your Home Screen
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
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#3E7754] to-[#3E7754] px-6 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-[#3E7754]/25 transition-all hover:from-[#588362] hover:to-[#3E7754] hover:-translate-y-1 active:scale-95"
              >
                <Download size={16} />
                <span>Install Sharebills App</span>
              </button>

              <button
                type="button"
                onClick={onLogin}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-[#9AB99F] hover:text-[#3E7754] hover:-translate-y-1 active:scale-95"
              >
                <span>Open Web Login</span>
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* SECTION 8: DEVELOPERS */}
      <section id="developers" className="relative z-10 overflow-hidden px-4 py-20 sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#BDD2C1]/25 blur-3xl" />
        <div className="relative mx-auto max-w-[1120px]">
          <RevealOnScroll className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#BDD2C1] bg-white/80 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#356447] shadow-sm">
              <Sparkles size={12} />
              The people behind the product
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Meet the <span className="text-[#43855F]">builders.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
              Curious minds, practical ideas, and a shared mission to make everyday life a little more balanced.
            </p>
          </RevealOnScroll>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              { name: 'Taranveer Singh', initials: 'TS', links: [{ label: 'Portfolio', href: 'https://taranveer.in', icon: Globe }, { label: 'GitHub', href: 'https://github.com/taranveer178', icon: CodeXml }, { label: 'LinkedIn', href: 'https://www.linkedin.com/in/taranveer-singh-2445871b6/', icon: Link }, { label: 'Email', href: 'mailto:staranveer178@gmail.com', icon: Mail }] },
              { name: 'Sushant Monga', initials: 'SM', links: [{ label: 'Portfolio', href: 'https://sushantmonga.in', icon: Globe }, { label: 'GitHub', href: 'https://github.com/Sushantmonga87', icon: CodeXml }, { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sushant-monga-8a757b227/', icon: Link }, { label: 'Email', href: 'mailto:sushantmonga87@gmail.com', icon: Mail }] },
            ].map((developer, idx) => (
              <RevealOnScroll key={developer.name} delay={idx * 200}>
                <article className="group relative isolate overflow-hidden rounded-[28px] border border-white/90 bg-white/75 p-6 shadow-[0_16px_50px_-28px_rgba(20,41,29,0.28)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#9AB99F] hover:shadow-[0_28px_65px_-30px_rgba(20,80,48,0.42)] focus-within:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="flex h-[4.25rem] w-[4.25rem] flex-shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#63B686] to-[#326b4a] text-lg font-black tracking-tight text-white shadow-lg shadow-[#326b4a]/20 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
                      {developer.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#43855F]">Developer</p>
                      <h3 className="mt-1 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-[1.7rem]">{developer.name}</h3>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {developer.links.map(({ label, href, icon: Icon }) => (
                      <a key={label} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'} className="group/link inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 text-xs font-bold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#63B686] hover:bg-[#eff8f2] hover:text-[#28583c] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63B686] focus-visible:ring-offset-2">
                        <Icon size={14} />
                        {label}
                        <ArrowRight size={12} className="opacity-0 -translate-x-1 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-70" />
                      </a>
                    ))}
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section id="faq" className="relative z-10 mx-auto max-w-[920px] px-4 py-16 sm:px-6">
        <RevealOnScroll className="text-center">
          <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </RevealOnScroll>

        <div className="mt-8 space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <RevealOnScroll key={item.q} delay={idx * 100}>
                <div className="rounded-2xl border border-white/90 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : idx)} className="flex w-full items-center justify-between gap-4 text-left outline-none">
                    <span className="text-sm font-extrabold text-slate-900">{item.q}</span>
                    <ChevronDown size={18} className={`flex-shrink-0 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#3E7754]' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5 pt-2.5 border-t border-slate-200/60' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-xs leading-relaxed text-slate-600">{item.a}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* SECTION 10: FINAL CTA & FOOTER */}
      <footer className="relative z-10 border-t border-[#2F6746] bg-[#173F2D] text-white">
        <RevealOnScroll className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img src={sharebillsIcon} alt="" className="h-10 w-10 rounded-xl object-cover shadow-sm transition-transform hover:scale-105" />
              <div>
                <p className="text-sm font-extrabold tracking-tight text-white">Sharebills</p>
                <p className="mt-0.5 text-xs text-white/65">Shared expenses, made simple.</p>
              </div>
            </div>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/70">
              <button type="button" onClick={onLogin} className="transition-colors hover:text-white">Login</button>
              <button type="button" onClick={onGetStarted} className="transition-colors hover:text-white">Sign up</button>
              <button type="button" onClick={handleInstallClick} className="transition-colors hover:text-white">Download app</button>
            </nav>
          </div>
          <div className="flex flex-col gap-2 pt-5 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Sharebills. All rights reserved.</p>
            <p>Made for better shared living.</p>
          </div>
        </RevealOnScroll>
      </footer>
    </div>
  );
}