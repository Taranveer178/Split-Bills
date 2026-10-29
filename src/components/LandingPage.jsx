import { Children, useState, useEffect, useRef } from 'react';
import {
 Plus,
 Download,
 Pause,
 Play,
 ChevronDown,
 Pin,
 Bell,
 BellOff,
 Receipt,
 ArrowDownLeft,
 ArrowLeftRight,
 Wallet,
 PieChart,
 CheckCircle2,
 CheckCheck,
 Check,
 MessageSquare,
 Sparkles,
 Zap,
 Smartphone,
 Layers,
 Lock,
 Menu,
 X,
 QrCode,
 ScanLine,
 Camera,
 ArrowRight,
 Globe,
 Send,
 Link,
 CodeXml,
 Mail,
 Users,
 AlertTriangle,
 Home,
 CircleDollarSign,
 FileDown,
 FileText,
 Smile,
 ImagePlus,
 CornerUpRight,
 Moon,
 Sun,
 Search,
 Copy,
 ShieldCheck,
 CalendarDays,
 Utensils,
 Car,
 ShoppingBag,
 SlidersHorizontal,
} from 'lucide-react';

const sharebillsIcon = 'data:image/webp;base64,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';

// ===================================================================
// CUSTOM SCROLL ANIMATION HOOK & COMPONENT
// ===================================================================
const RevealOnScroll = ({
 children,
 className = '',
 delay = 0,
 threshold = 0.12,
 dataShowcaseSlide,
}) => {
 const [isVisible, setIsVisible] = useState(false);
 const ref = useRef(null);

 useEffect(() => {
  const currentRef = ref.current;
  if (!currentRef || typeof IntersectionObserver === 'undefined') {
   setIsVisible(true);
   return undefined;
  }
  const observer = new IntersectionObserver(
   ([entry]) => {
    if (entry.isIntersecting) {
     setIsVisible(true);
     observer.unobserve(entry.target);
    }
   },
   { threshold, rootMargin: '0px 0px -40px 0px' }
  );

  observer.observe(currentRef);
  return () => {
   if (currentRef) observer.unobserve(currentRef);
  };
 }, [threshold]);

 return (
  <div
   ref={ref}
   data-showcase-slide={dataShowcaseSlide}
   className={`transition-all duration-700 ease-out ${
    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
   } ${className}`}
   style={{ transitionDelay: `${delay}ms` }}
  >
   {children}
  </div>
 );
};

function ShowcaseMarquee({ children, duration }) {
 const slides = Children.toArray(children);
 const [isPaused, setIsPaused] = useState(false);

 return (
  <div className="showcase-carousel mt-10">
   <div className="mb-3 flex justify-end px-4">
    <button
     type="button"
     onClick={() => setIsPaused((paused) => !paused)}
     aria-pressed={isPaused}
     className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-[#BDD2C1] hover:bg-[#EEF4EF] hover:text-[#356447]"
    >
     {isPaused ? <Play size={14} /> : <Pause size={14} />}
     {isPaused ? 'Resume carousel' : 'Pause carousel'}
    </button>
   </div>
   <div className="showcase-viewport overflow-hidden px-4 py-4">
    <div
     className={`showcase-track${isPaused ? ' is-paused' : ''}`}
     style={{ '--showcase-duration': duration }}
    >
    <div className="showcase-track-set">
      {slides}
    </div>
    <div className="showcase-track-set" aria-hidden="true" inert>
      {slides}
    </div>
   </div>
   </div>
  </div>
 );
}

const heroPreviewDisputes = [
 { title: 'WiFi + OTT Bill', raisedBy: 'Sushant', space: 'Flat 402 · Tap to resolve in chat' },
 { title: 'Groceries · ₹2,450', raisedBy: 'Aarav', space: 'Flat 402 · Your share was updated' },
 { title: 'Weekend cab · ₹980', raisedBy: 'Tanmay', space: 'Kasol Trip · Review split in chat' },
];

export default function LandingPage({
 onLogin,
 onGetStarted,
 onCreateAccount,
 onDownloadApp,
 onInstallApp,
 deferredPromptAvailable = false,
 isAppInstalled = false,
 isStandaloneWebApp = false,
}) {
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [deferredPrompt, setDeferredPrompt] = useState(null);

 // Interactive preview states for redesigned mockups & screenshots
 const [heroPhoneTab, setHeroPhoneTab] = useState('overview'); // 'overview' | 'chat' | 'dues'
 const [heroDarkPreview, setHeroDarkPreview] = useState(false);
 const [activeHeroDisputeIndex, setActiveHeroDisputeIndex] = useState(0);
 const [activePreviewTab, setActivePreviewTab] = useState('command'); // 'command' | 'analytics' | 'rent' | 'transactions' | 'spaces'
 const [desktopDarkPreview, setDesktopDarkPreview] = useState(false);
 const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
 const [isFeatureCarouselPaused, setIsFeatureCarouselPaused] = useState(false);
 const [disputeDemoStatus, setDisputeDemoStatus] = useState('open'); // 'open' | 'updated' | 'solved'
 const [rentDemoPaid, setRentDemoPaid] = useState(false);
 const [simplifyMode, setSimplifyMode] = useState('smart'); // 'smart' | 'raw'
 const [splitDemoMode, setSplitDemoMode] = useState('equal'); // 'equal' | 'custom'
 const [selectedCurrency, setSelectedCurrency] = useState('INR');
 const [exportScopeDemo, setExportScopeDemo] = useState('all');
 const [copiedCode, setCopiedCode] = useState(false);
 const [openFaq, setOpenFaq] = useState(0);
 const [previewModal, setPreviewModal] = useState(null); // null | 'login' | 'signup' | 'install'

 useEffect(() => {
  if (heroPhoneTab !== 'overview' || heroPreviewDisputes.length < 2) return undefined;
  const intervalId = window.setInterval(() => {
   setActiveHeroDisputeIndex((index) => (index + 1) % heroPreviewDisputes.length);
  }, 4000);
  return () => window.clearInterval(intervalId);
 }, [heroPhoneTab]);

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

 const triggerLogin = () => {
  if (typeof onLogin === 'function') {
   onLogin();
  } else {
   setPreviewModal('login');
  }
 };

 const triggerGetStarted = () => {
  const handler = onCreateAccount || onGetStarted || onLogin;
  if (typeof handler === 'function') {
   handler();
  } else {
   setPreviewModal('signup');
  }
 };

 const handleInstallClick = async () => {
  if (deferredPrompt) {
   deferredPrompt.prompt();
   await deferredPrompt.userChoice;
   setDeferredPrompt(null);
   return;
  }
  if (deferredPromptAvailable && typeof onInstallApp === 'function') {
   await onInstallApp();
   return;
  }
  if (typeof onDownloadApp === 'function') {
   onDownloadApp();
   return;
  }
  setPreviewModal('install');
 };

 const scrollToSection = (id) => {
  setMobileMenuOpen(false);
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: 'smooth' });
 };

 const handleCopyDemoCode = () => {
  try {
   if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText('FLT402');
   }
  } catch {
   // Fallback for sandboxed environments
  }
  setCopiedCode(true);
  setTimeout(() => setCopiedCode(false), 2000);
 };

 const currencySymbols = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
 };
 const sym = currencySymbols[selectedCurrency] || '₹';

 const faqs = [
  {
   q: 'Is Sharebills completely free for roommates, flatmates, and trips?',
   a: 'Yes! Creating unlimited spaces, logging expenses, tracking monthly rent, raising in-chat expense disputes, smart debt simplification, rich group chat, and exporting CSV/PDF statements are 100% free with zero paywalls.',
  },
  {
   q: 'How do Expense Disputes work inside a space?',
   a: 'Long-press or right-click any bill to raise a dispute with a note (for example, if you were away that weekend). Sharebills posts an interactive Dispute Card directly in the group chat and notifies members. The payer or creator can update the bill amounts/splits, mark it solved, or delete it in one tap.',
  },
  {
   q: 'How is the Monthly Rent Tracker different from regular expenses?',
   a: 'Every space includes a dedicated Monthly Rent Panel that splits flat rent down to the exact cent across members, tracks individual Paid vs. Unpaid status with timestamps, and sends automatic daily rent reminders until everyone marks their share as paid.',
  },
  {
   q: 'How does the Smart Settlement algorithm and Google Pay / UPI link work?',
   a: 'Instead of everyone paying everyone back for every Blinkit or Swiggy order, Sharebills calculates each member’s net position and minimizes total transfers. When settling in INR spaces, tapping "Pay via UPI" deep-links straight into Google Pay / UPI with your roommate’s UPI ID and exact amount pre-filled.',
  },
  {
   q: 'How do roommates join a space using the QR Scanner or Invite Code?',
   a: 'Every space generates a 6-character invite code, a direct join link, and a scannable QR code. Roommates can tap "Join a Space" and use the built-in live camera QR scanner or paste the code to sync instantly.',
  },
  {
   q: 'Can we export transactions to CSV or PDF and use multiple currencies?',
   a: 'Yes! You can configure spaces in INR (₹), USD ($), EUR (€), GBP (£), CAD (CA$), or AUD (A$). From the Transactions tab, open the Export modal to filter by All, Paid by Me, or Settlements across custom date ranges and download a CSV spreadsheet or printable PDF report.',
  },
 ];

 const landingFeatures = [
  { icon: AlertTriangle, badge: 'NEW & UNIQUE', color: 'bg-amber-50 text-amber-600 border-amber-200', title: 'In-Chat Expense Disputes', desc: 'Long-press any bill to raise a dispute. A live group-chat card lets the payer update splits, edit amounts, or mark it solved.' },
  { icon: Home, badge: 'NEW & UNIQUE', color: 'bg-[#EEF4EF] text-[#3E7754] border-[#BDD2C1]', title: 'Monthly Flat Rent Tracker', desc: 'A dedicated monthly rent ledger tracks each member’s paid status and sends automatic reminders until everyone is settled.' },
  { icon: MessageSquare, badge: 'UPGRADED', color: 'bg-sky-50 text-sky-600 border-sky-200', title: 'Room Chat with Rich Media', desc: 'Reply to messages, react with emoji, share GIFs, stickers, photos, videos, and PDFs, and preview links in chat.' },
  { icon: Zap, badge: 'INDIA FIRST', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', title: 'Direct GPay & UPI Payments', desc: 'Launch Google Pay with your roommate’s UPI ID and settlement amount ready, then confirm payments in one tap.' },
  { icon: QrCode, badge: 'QUICK JOIN', color: 'bg-[#EEF4EF] text-[#356447] border-[#BDD2C1]', title: 'QR Scanner & Invite Codes', desc: 'Join a shared space with a live QR scanner, downloadable QR card, shareable invite link, or six-character code.' },
  { icon: FileDown, badge: 'EXPORTS', color: 'bg-purple-50 text-purple-600 border-purple-200', title: 'CSV & PDF Exports', desc: 'Download audit-ready spreadsheets or printable statements filtered by payer, settlement type, and date.' },
  { icon: Globe, badge: 'GLOBAL', color: 'bg-amber-50 text-amber-700 border-amber-200', title: 'Six Global Currencies', desc: 'Choose INR, USD, EUR, GBP, CAD, or AUD for each shared space, whether it’s home or an international trip.' },
  { icon: PieChart, badge: 'ANALYTICS', color: 'bg-[#EEF4EF] text-[#3E7754] border-[#BDD2C1]', title: 'Monthly Spending Analytics', desc: 'Compare your share with what you paid and explore monthly spending across food, rent, travel, and more.' },
  { icon: SlidersHorizontal, badge: 'SMART MATH', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', title: 'Equal & Custom Splits', desc: 'Split bills equally, exclude roommates who were away, or assign exact amounts to each member.' },
  { icon: Layers, badge: 'SPACE TOOLS', color: 'bg-slate-100 text-slate-700 border-slate-200', title: 'Pin, Mute & Archive Spaces', desc: 'Keep important spaces close, mute noisy notifications, and archive finished trips without losing their history.' },
  { icon: Moon, badge: 'DESIGN', color: 'bg-slate-900 text-amber-300 border-slate-700', title: 'Liquid Glass & AMOLED Dark', desc: 'Switch between a polished glass interface and deep-black AMOLED mode with comfortable controls.' },
  { icon: Smartphone, badge: 'APP + PWA', color: 'bg-rose-50 text-rose-600 border-rose-200', title: 'Android App, PWA & Push', desc: 'Install the app or PWA and receive Firebase push notifications with convenient Google sign-in.' },
 ];

 useEffect(() => {
  if (isFeatureCarouselPaused) return undefined;
  const intervalId = window.setInterval(() => {
   setActiveFeatureIndex((index) => (index + 1) % landingFeatures.length);
  }, 5000);
  return () => window.clearInterval(intervalId);
 }, [isFeatureCarouselPaused, landingFeatures.length]);

 if (isStandaloneWebApp) {
  return (
   <main className="flex min-h-[100dvh] flex-col bg-[#3E7754] pt-[env(safe-area-inset-top)] text-white">
    <RevealOnScroll className="flex flex-1 flex-col items-center justify-center px-8 text-center" delay={100}>
     <img
      src={sharebillsIcon}
      alt="Sharebills"
      className="mb-6 h-24 w-24 rounded-[2rem] shadow-xl shadow-black/15"
     />
     <h1 className="text-4xl font-extrabold tracking-tight">Sharebills</h1>
     <p className="mt-3 max-w-xs text-base font-medium text-white/85">
      Shared flat expenses, rent tracking, live disputes & instant UPI settlements.
     </p>
    </RevealOnScroll>
    <footer className="rounded-t-[2rem] bg-white px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-slate-900">
     <button
      type="button"
      onClick={triggerLogin}
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
   {/* SOFT REFRACTIVE LIQUID GLASS MESH BACKDROP */}
   <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[#9AB99F]/30 blur-3xl" />
    <div className="absolute top-1/4 -right-28 h-96 w-96 rounded-full bg-[#9AB99F]/25 blur-3xl animate-pulse" />
    <div
     className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-[#BDD2C1]/30 blur-3xl animate-pulse"
     style={{ animationDelay: '2s' }}
    />
    <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-[#BDD2C1]/25 blur-3xl" />
   </div>

   {/* STICKY LIQUID GLASS NAVBAR */}
   <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
    <nav className="mx-auto flex max-w-[1340px] items-center justify-between rounded-full border border-white/90 bg-white/80 px-4 py-2.5 shadow-lg shadow-[#233E2F]/5 backdrop-blur-2xl sm:px-6">
     <a href="#top" className="group flex items-center gap-2.5 text-left focus:outline-none">
      <img
       src={sharebillsIcon}
       alt="Sharebills Logo"
       className="h-10 w-10 rounded-2xl object-cover shadow-md shadow-[#3E7754]/25 transition-transform group-hover:scale-105"
      />
      <div>
       <div className="flex items-center gap-1.5">
        <span className="block text-base font-extrabold leading-none tracking-tight text-slate-900">
         Sharebills
        </span>
        <span className="rounded-full bg-[#EEF4EF] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#3E7754] border border-[#BDD2C1]">
         v2.5
        </span>
       </div>
       <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-[#3E7754]">
        Liquid Ledger
       </span>
      </div>
     </a>

     <div className="hidden items-center gap-1 lg:flex">
      {[
       { label: 'App Screenshots', id: 'mobile-showcase' },
       { label: 'Command Center', id: 'desktop-preview' },
       { label: 'All Features', id: 'features' },
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
      {!isAppInstalled && (
       <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#BDD2C1]/80 bg-[#EEF4EF]/70 px-3.5 text-xs font-bold text-[#356447] transition-all hover:-translate-y-0.5 hover:bg-[#DDE9DF]/80 active:scale-95"
       >
        <Download size={13} />
        <span>Install App</span>
       </button>
      )}
      <button
       type="button"
       onClick={triggerLogin}
       className="inline-flex h-9 items-center rounded-full border border-slate-200/90 bg-white/90 px-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#9AB99F] hover:text-[#3E7754] active:scale-95"
      >
       Log in
      </button>
      <button
       type="button"
       onClick={triggerGetStarted}
       className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-b from-[#3E7754] to-[#2C503A] px-4 text-xs font-bold text-white shadow-md shadow-[#3E7754]/25 transition-all hover:-translate-y-0.5 hover:from-[#588362] hover:to-[#3E7754] hover:shadow-lg active:scale-95"
      >
       <span>Get Started</span>
       <ArrowRight size={13} />
      </button>
     </div>

     <div className="flex items-center gap-2 sm:hidden">
      <button
       type="button"
       onClick={triggerLogin}
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
     <div className="mx-auto mt-2 max-w-[1340px] rounded-3xl border border-white/90 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl lg:hidden">
      <div className="grid grid-cols-2 gap-2">
       {[
        { label: 'App Screenshots', id: 'mobile-showcase' },
        { label: 'Command Center', id: 'desktop-preview' },
        { label: 'All Features', id: 'features' },
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
         onClick={triggerLogin}
         className="h-10 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
        >
         Log in
        </button>
        <button
         type="button"
         onClick={triggerGetStarted}
         className="h-10 rounded-2xl bg-gradient-to-b from-[#3E7754] to-[#2C503A] text-xs font-bold text-white shadow-md shadow-[#3E7754]/20"
        >
         Get Started
        </button>
       </div>
      </div>
     </div>
    )}
   </header>

   {/* =================================================================== */}
   {/* SECTION 1: REDESIGNED HERO + INTERACTIVE LIVE PHONE MOCKUP          */}
   {/* =================================================================== */}
   <section id="top" className="relative z-10 mx-auto max-w-[1340px] px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-12">
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
     {/* Left Column: concise value proposition */}
     <div className="text-center lg:col-span-7 lg:text-left">
      <RevealOnScroll delay={50}>
       <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/85 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
         Shared expenses, made simple
        </span>
       </div>
      </RevealOnScroll>

      <RevealOnScroll delay={150}>
       <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
        Split bills.{' '}
        <span className="bg-gradient-to-r from-[#3E7754] via-[#2C503A] to-emerald-600 bg-clip-text text-transparent">
         Stay in sync.
        </span>
       </h1>
      </RevealOnScroll>

      <RevealOnScroll delay={250}>
       <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base lg:mx-0">
        Sharebills is your shared expense command center. Track rent, electricity, Swiggy orders, and weekend trips in real time—complete with in-room chat, instant UPI settlements, and monthly category analytics.
       </p>
      </RevealOnScroll>

      {/* Key features */}
      <RevealOnScroll delay={320}>
       <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {[
         { icon: Receipt, label: 'Split expenses' },
         { icon: Home, label: 'Track rent' },
         { icon: CheckCircle2, label: 'Settle with ease' },
        ].map(({ icon: Icon, label }) => (
         <span
          key={label}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/90 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md"
         >
          <Icon size={13} className="text-[#3E7754]" />
          <span>{label}</span>
         </span>
        ))}
       </div>
      </RevealOnScroll>

      <RevealOnScroll delay={400}>
       <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
        <button
         type="button"
         onClick={triggerLogin}
         className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#3E7754] to-[#2C503A] px-6 text-sm font-extrabold text-white shadow-lg shadow-[#3E7754]/30 transition-all hover:-translate-y-0.5 hover:from-[#588362] hover:to-[#3E7754]"
        >
         <span>Login</span>
        </button>

        <button
         type="button"
         onClick={handleInstallClick}
         className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-5 text-sm font-extrabold text-slate-800 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[#9AB99F] hover:text-[#3E7754]"
        >
         <Download size={16} className="text-[#3E7754]" />
         <span>Download App</span>
        </button>
       </div>
      </RevealOnScroll>
     </div>

     {/* Right Column: Updated Interactive Phone Screenshot with Screen & Theme Switcher */}
     <div className="flex flex-col items-center justify-center lg:col-span-5">
      <RevealOnScroll delay={300} className="relative w-full max-w-[370px]">
       {/* Interactive Screen & Theme Controls Above Phone */}
       <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-white/90 bg-white/85 p-1.5 shadow-md backdrop-blur-xl">
        <div className="flex items-center gap-1">
         {[
          { id: 'overview', label: 'Overview' },
          { id: 'chat', label: 'Dispute Chat' },
          { id: 'dues', label: 'Rent & UPI' },
         ].map((tab) => (
          <button
           key={tab.id}
           type="button"
           onClick={() => setHeroPhoneTab(tab.id)}
           className={`rounded-xl px-2.5 py-1.5 text-[11px] font-extrabold transition-all ${
            heroPhoneTab === tab.id
             ? 'bg-[#3E7754] text-white shadow-xs'
             : 'text-slate-600 hover:bg-slate-100'
           }`}
          >
           {tab.label}
          </button>
         ))}
        </div>
        <button
         type="button"
         onClick={() => setHeroDarkPreview((prev) => !prev)}
         title="Toggle Light / AMOLED Dark Mode Preview"
         className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition-all ${
          heroDarkPreview
           ? 'border-slate-700 bg-slate-900 text-amber-300'
           : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
         }`}
        >
         {heroDarkPreview ? <Moon size={12} /> : <Sun size={12} />}
         <span>{heroDarkPreview ? 'AMOLED' : 'Light'}</span>
        </button>
       </div>

       

       {/* Floating Rent Paid Badge Right */}
       <div
        className="hidden sm:flex absolute -right-12 bottom-28 z-20 items-center gap-2.5 rounded-2xl border border-white/90 bg-white/95 p-3 shadow-xl backdrop-blur-xl animate-bounce"
        style={{ animationDuration: '4.2s', animationDelay: '0.8s' }}
       >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754] border border-[#BDD2C1]">
         <Home size={16} />
        </div>
        <div>
         <p className="text-[11px] font-extrabold text-slate-900">Oct Rent Paid ✓</p>
         <p className="text-[10px] font-semibold text-[#3E7754]">₹6,000 via GPay UPI</p>
        </div>
       </div>

       {/* iPhone Hardware Bezel */}
       <div className="relative mx-auto rounded-[42px] border-[7px] border-slate-900 bg-slate-900 p-2 shadow-2xl shadow-[#14291D]/30 transition-all duration-300">
        {/* Phone Screen Content (Supports Light & True AMOLED Dark Mode) */}
        <div
         className={`hero-phone-screen flex h-[560px] flex-col gap-3 overflow-hidden rounded-[34px] p-2.5 transition-colors duration-300 ${
          heroDarkPreview ? 'bg-black text-white' : 'bg-[#F4F7F3] text-slate-900'
         }`}
        >
         {/* Top Native Mobile Greeting Bar (Matches updated Dashboard.jsx) */}
         <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
           <img
            src={sharebillsIcon}
            alt=""
            className="h-8 w-8 rounded-full border border-white/80 object-cover shadow-xs"
           />
           <div>
            <span
             className={`block text-xs font-extrabold leading-tight ${
              heroDarkPreview ? 'text-white' : 'text-slate-900'
             }`}
            >
             Hi, Taranveer
            </span>
            <span className="block text-[10px] font-bold text-[#3E7754]">
             Good Evening
            </span>
           </div>
          </div>
          <div className="flex items-center gap-1.5">
           <button
            type="button"
            onClick={() => setHeroPhoneTab('chat')}
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border shadow-xs ${
             heroDarkPreview
              ? 'border-white/20 bg-zinc-900 text-white'
              : 'border-white bg-white text-[#3E7754]'
            }`}
            aria-label="Notifications"
           >
            <Bell size={13} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[8px] font-extrabold text-white">
             4
            </span>
           </button>
          </div>
         </div>

         {/* TAB 1: UPDATED MOBILE OVERVIEW SCREENSHOT */}
         {heroPhoneTab === 'overview' && (
          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto">
           {/* Updated Native Wallet Hero Card */}
           <div
            className={`rounded-[22px] border p-3.5 shadow-sm ${
             heroDarkPreview
              ? 'border-white/15 bg-zinc-900/95 text-white'
              : 'border-slate-200/80 bg-white text-slate-900'
            }`}
           >
            <div className="flex items-center justify-between">
             <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
               Net Position
              </span>
              <div className="mt-0.5 flex items-baseline gap-1.5">
               <span className="font-mono text-xl font-extrabold text-emerald-500">
                +₹3,450
               </span>
               <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-2 py-0.5 text-[9px] font-bold text-[#356447]">
                To receive
               </span>
              </div>
             </div>
             <span className="inline-flex h-8 items-center gap-1 rounded-xl bg-[#3E7754] px-2.5 text-[10px] font-bold text-white shadow-xs">
              <Plus size={12} strokeWidth={2.5} /> Add Bill
             </span>
            </div>
            <div
             className={`mt-2.5 grid grid-cols-3 divide-x rounded-xl border p-1.5 text-center ${
              heroDarkPreview
               ? 'divide-white/10 border-white/10 bg-black/50'
               : 'divide-slate-200 border-slate-200/80 bg-slate-50/80'
             }`}
            >
             <div>
              <p className="text-[9px] text-slate-400">To Receive</p>
              <p className="font-mono text-[11px] font-extrabold text-emerald-500">
               +₹4,200
              </p>
             </div>
             <div>
              <p className="text-[9px] text-slate-400">To Pay</p>
              <p className="font-mono text-[11px] font-extrabold text-rose-500">
               -₹750
              </p>
             </div>
             <div>
              <p className="text-[9px] text-slate-400">Oct Share</p>
              <p className="font-mono text-[11px] font-extrabold">₹8,940</p>
             </div>
            </div>
           </div>

           {/* Updated iOS Segmented Glass Control: Active | Archived | Dues */}
           <div
            className={`grid grid-cols-3 gap-1 rounded-xl border p-1 text-center text-[10px] font-bold ${
             heroDarkPreview
              ? 'border-white/15 bg-zinc-900'
              : 'border-white/90 bg-white/85'
            }`}
           >
            <div className="rounded-lg bg-[#3E7754] py-1 text-white shadow-xs">
             Active (3)
            </div>
            <div className="py-1 text-slate-400">Archived (2)</div>
            <button
             type="button"
             onClick={() => setHeroPhoneTab('dues')}
             className="py-1 text-slate-400 hover:text-[#3E7754]"
            >
             Dues (3)
            </button>
           </div>

           {/* Active disputes carousel */}
           <div
            className={`overflow-hidden rounded-2xl border ${
             heroDarkPreview
              ? 'border-amber-500/40 bg-amber-950/30'
              : 'border-amber-200 bg-amber-50/90'
            }`}
            aria-live="polite"
           >
            <div
             className="flex transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(-${activeHeroDisputeIndex * 100}%)` }}
            >
             {heroPreviewDisputes.map((dispute, index) => (
              <button
               key={dispute.title}
               type="button"
               onClick={() => setHeroPhoneTab('chat')}
               aria-label={`Open dispute: ${dispute.title}, raised by ${dispute.raisedBy}`}
               aria-hidden={activeHeroDisputeIndex !== index}
               inert={activeHeroDisputeIndex !== index}
               className={`flex w-full flex-none items-center justify-between gap-2 px-3 py-2 text-left ${
                heroDarkPreview ? 'text-amber-200' : 'text-slate-900'
               }`}
              >
               <div className="flex min-w-0 items-center gap-2">
                <AlertTriangle size={13} className="flex-shrink-0 text-amber-600" />
                <div className="min-w-0">
                 <p className="truncate text-[10px] font-extrabold">
                  {dispute.title} · Raised by {dispute.raisedBy}
                 </p>
                 <p className="truncate text-[9px] text-slate-500">{dispute.space}</p>
                </div>
               </div>
               <span className="flex-none rounded-lg bg-amber-600 px-2 py-0.5 text-[9px] font-bold text-white">
                Dispute
               </span>
              </button>
             ))}
            </div>
           </div>

           {/* Updated Space Rows with Pin, Rent Due ($), Mute & Net Chip */}
           <div className="space-y-2">
            {[
             {
              name: 'Flat 402 · Mohali',
              members: '4 members · ₹28,400',
              net: '+₹2,150',
              positive: true,
              unread: 2,
              pinned: true,
              rentDue: true,
              muted: false,
             },
             {
              name: 'Kasol Weekend Trip',
              members: '5 members · ₹16,800',
              net: '+₹1,300',
              positive: true,
              unread: 0,
              pinned: true,
              rentDue: false,
              muted: false,
             },
             {
              name: 'Office Lunch Club',
              members: '6 members · ₹4,120',
              net: 'Settled',
              positive: null,
              unread: 1,
              pinned: false,
              rentDue: false,
              muted: true,
             },
            ].map((space) => (
             <div
              key={space.name}
              className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 shadow-xs ${
               heroDarkPreview
                ? 'border-white/15 bg-zinc-900/90'
                : 'border-white/90 bg-white/90'
              }`}
             >
              <div className="flex min-w-0 items-center gap-2.5">
               <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#3E7754] text-xs font-bold text-white">
                {space.name.charAt(0)}
               </div>
               <div className="min-w-0">
                <div className="flex items-center gap-1">
                 <p className="truncate text-[11px] font-bold">{space.name}</p>
                 {space.pinned && <Pin size={9} className="text-[#3E7754]" />}
                 {space.rentDue && (
                  <span
                   title="Monthly Rent Due"
                   className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                  >
                   <CircleDollarSign size={10} />
                  </span>
                 )}
                 {space.muted && <BellOff size={9} className="text-amber-500" />}
                </div>
                <p className="text-[9px] text-slate-400">{space.members}</p>
               </div>
              </div>
              <div className="flex items-center gap-1.5">
               {space.unread > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[8px] font-extrabold text-white">
                 {space.unread}
                </span>
               )}
               <span
                className={`rounded-lg border px-2 py-0.5 font-mono text-[10px] font-bold ${
                 space.positive === true
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : space.positive === false
                   ? 'border-rose-200 bg-rose-50 text-rose-600'
                   : 'border-slate-200 bg-slate-100 text-slate-600'
                }`}
               >
                {space.net}
               </span>
              </div>
             </div>
            ))}
           </div>
          </div>
         )}

         {/* TAB 2: IN-CHAT EXPENSE DISPUTE & RICH CHAT SCREENSHOT */}
         {heroPhoneTab === 'chat' && (
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
           <div
            className={`flex items-center justify-between rounded-2xl border px-3 py-2 ${
             heroDarkPreview
              ? 'border-white/15 bg-zinc-900'
              : 'border-white bg-white'
            }`}
           >
            <div className="flex items-center gap-2">
             <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3E7754] text-[11px] font-bold text-white">
              F
             </span>
             <div>
              <p className="text-[11px] font-extrabold">Flat 402 · Mohali</p>
              <p className="text-[9px] font-semibold text-emerald-500">
               Sushant is typing...
              </p>
             </div>
            </div>
            <span className="rounded-lg bg-[#EEF4EF] px-2 py-0.5 text-[9px] font-bold text-[#3E7754]">
             Chat
            </span>
           </div>

           {/* Expense Dispute Message Card inside Chat */}
           <div className="rounded-2xl border border-amber-300 bg-amber-50 p-2.5 text-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-900">
             <span className="flex items-center gap-1">
              <AlertTriangle size={12} /> Expense dispute
             </span>
             <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[8px] uppercase">
              Open
             </span>
            </div>
            <p className="mt-1 text-[11px] font-extrabold">
             WiFi + Fiber Bill · ₹1,800.00
            </p>
            <p className="mt-1 rounded-lg bg-white/85 px-2 py-1 text-[10px] text-slate-700">
             “I was in Delhi for 2 weeks, please adjust my share to ₹250.”
            </p>
            <div className="mt-2 flex items-center gap-1.5">
             <span className="rounded-lg bg-amber-700 px-2 py-1 text-[9px] font-bold text-white">
              Update Bill
             </span>
             <span className="rounded-lg bg-emerald-600 px-2 py-1 text-[9px] font-bold text-white">
              Mark Solved
             </span>
            </div>
           </div>

           {/* Threaded Reply + Reaction Bubble */}
           <div
            className={`relative max-w-[85%] rounded-2xl border p-2.5 text-[10px] ${
             heroDarkPreview
              ? 'border-white/15 bg-zinc-900 text-white'
              : 'border-slate-200 bg-white text-slate-800'
            }`}
           >
            <div className="mb-1 border-l-2 border-[#3E7754] bg-[#EEF4EF]/60 px-2 py-0.5 text-[9px] text-[#2C503A]">
             <span className="font-bold">You:</span> Uploaded October Electricity PDF
            </div>
            <p className="font-medium">Sent my ₹800 share on GPay just now! ⚡</p>
            <span className="mt-1 inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white px-1.5 py-0.2 text-[9px] text-slate-700 shadow-2xs">
             ❤️ 👍 2
            </span>
           </div>

           {/* Outgoing Bubble with Read Receipt */}
           <div className="ml-auto max-w-[82%] rounded-2xl bg-[#3E7754] p-2.5 text-[10px] text-white shadow-xs">
            <div className="flex items-center justify-between gap-2">
             <span>Confirmed! Updated the WiFi split too.</span>
             <CheckCheck size={12} className="text-emerald-200 flex-shrink-0" />
            </div>
           </div>

           {/* Chat Composer with GIF/Sticker/Media icons */}
           <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 ${
             heroDarkPreview
              ? 'border-white/15 bg-zinc-900'
              : 'border-slate-200 bg-white'
            }`}
           >
            <Smile size={13} className="text-slate-400" />
            <ImagePlus size={13} className="text-slate-400" />
            <span className="rounded border border-slate-300 px-1 text-[8px] font-extrabold text-slate-500">
             GIF
            </span>
            <span className="flex-1 text-[9px] text-slate-400">Message Flat 402...</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3E7754] text-white">
             <Send size={10} />
            </span>
           </div>
          </div>
         )}

         {/* TAB 3: MONTHLY RENT & UPI SETTLEMENTS SCREENSHOT */}
         {heroPhoneTab === 'dues' && (
          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto">
           <div
            className={`rounded-2xl border p-3 ${
             heroDarkPreview
              ? 'border-amber-500/40 bg-zinc-900'
              : 'border-amber-200 bg-amber-50/70'
            }`}
           >
            <div className="flex items-center justify-between">
             <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-800">
              <Home size={12} /> Oct 2026 Flat Rent
             </span>
             <span className="font-mono text-[10px] font-extrabold text-amber-900">
              ₹24,000 total
             </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-600">
             Your share: <strong className="font-mono">₹6,000.00</strong> · 3/4 paid
            </p>
            <div className="mt-2 flex items-center justify-between">
             <span className="text-[9px] font-semibold text-emerald-700">
              ✓ Sushant, Tanmay &amp; You paid
             </span>
             <span className="rounded-lg bg-[#3E7754] px-2.5 py-1 text-[9px] font-bold text-white">
              Rent Tracker →
             </span>
            </div>
           </div>

           <div className="space-y-1.5">
            {[
             {
              title: 'Tanmay owes you',
              sub: 'Flat 402 · Minimized from 5 bills',
              amt: '+₹1,450',
              action: 'Confirm Paid',
              owe: false,
             },
             {
              title: 'You owe Manish',
              sub: 'Office Lunch · manish@okaxis',
              amt: '-₹450',
              action: 'Pay via GPay',
              owe: true,
             },
            ].map((item) => (
             <div
              key={item.title}
              className={`flex items-center justify-between rounded-2xl border p-2.5 ${
               heroDarkPreview
                ? 'border-white/15 bg-zinc-900'
                : 'border-white bg-white'
              }`}
             >
              <div className="min-w-0">
               <p className="truncate text-[10px] font-extrabold">{item.title}</p>
               <p className="truncate text-[9px] text-slate-400">{item.sub}</p>
              </div>
              <div className="flex items-center gap-1.5">
               <span
                className={`font-mono text-[10px] font-extrabold ${
                 item.owe ? 'text-rose-500' : 'text-emerald-500'
                }`}
               >
                {item.amt}
               </span>
               <span className="rounded-lg bg-[#3E7754] px-2 py-1 text-[9px] font-bold text-white">
                {item.action}
               </span>
              </div>
             </div>
            ))}
           </div>
          </div>
         )}

         {/* Updated 5-Column Liquid Glass Bottom Nav Dock (Matches PrimaryNav.jsx) */}
         <div
          className={`mt-auto grid flex-none grid-cols-5 items-center rounded-[22px] border p-1.5 text-center shadow-md ${
           heroDarkPreview
            ? 'border-white/15 bg-zinc-900/95'
            : 'border-white/90 bg-white/95'
          }`}
         >
          <button
           type="button"
           onClick={() => setHeroPhoneTab('overview')}
           className={`flex flex-col items-center py-1 text-[9px] font-extrabold ${
            heroPhoneTab === 'overview' ? 'text-[#3E7754]' : 'text-slate-400'
           }`}
          >
           <span>Overview</span>
          </button>
          <button
           type="button"
           onClick={() => setHeroPhoneTab('dues')}
           className={`flex flex-col items-center py-1 text-[9px] font-semibold ${
            heroPhoneTab === 'dues' ? 'text-[#3E7754] font-extrabold' : 'text-slate-400'
           }`}
          >
           <span>Txns</span>
          </button>
          <div className="flex justify-center">
           <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-500 to-[#3E7754] text-white shadow-sm">
            <Receipt size={14} />
           </span>
          </div>
          <button
           type="button"
           onClick={() => setHeroPhoneTab('chat')}
           className={`flex flex-col items-center py-1 text-[9px] font-semibold ${
            heroPhoneTab === 'chat' ? 'text-[#3E7754] font-extrabold' : 'text-slate-400'
           }`}
          >
           <span>Monthly</span>
          </button>
          <button
           type="button"
           onClick={() => setHeroDarkPreview((prev) => !prev)}
           className="flex flex-col items-center py-1 text-[9px] font-semibold text-slate-400"
          >
           <span>Profile</span>
          </button>
         </div>
        </div>
       </div>
      </RevealOnScroll>
     </div>
    </div>
   </section>

   {/* =================================================================== */}
   {/* SECTION 2: UPDATED 6-SCREEN MOBILE SCREENSHOT GALLERY               */}
   {/* =================================================================== */}
   <section id="mobile-showcase" className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6">
    <RevealOnScroll className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
     <div>
      <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF]/90 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
       Updated App Screenshots · v2.5
      </span>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
       See every new workflow in action
      </h2>
      <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
       Interactive previews of the newly shipped features—from in-chat expense dispute
       resolution and monthly flat rent tracking to QR scanning, GPay deep-links, and CSV/PDF exports.
      </p>
     </div>

     <div className="rounded-2xl border border-white/90 bg-white/85 p-1.5 shadow-sm backdrop-blur-xl">
      <span className="inline-flex rounded-xl bg-[#3E7754] px-3.5 py-2 text-xs font-bold text-white shadow-xs">
       All 6 Screens
      </span>
     </div>
    </RevealOnScroll>

    <ShowcaseMarquee
     duration="48s"
    >
     {/* SCREENSHOT 1: IN-CHAT EXPENSE DISPUTES & RESOLUTION (NEW) */}
     {(
      <RevealOnScroll
       delay={50}
       dataShowcaseSlide={0}
       className="showcase-slide flex flex-col items-center rounded-[32px] border border-white/90 bg-white/75 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl"
      >
       <div className="showcase-card-header mb-4 flex w-full items-center justify-between">
        <span className="showcase-card-label rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-800">
         1. In-Chat Expense Disputes
        </span>
        <span className="rounded-md bg-[#3E7754] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
         New
        </span>
       </div>

       <div className="showcase-phone-frame w-full max-w-[300px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-2.5 shadow-lg">
        <div className="showcase-phone-screen space-y-2.5 rounded-[24px] bg-[#F3F7F3] p-3.5">
         <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
           <AlertTriangle size={14} className="text-amber-600" />
           <div>
            <p className="text-xs font-extrabold text-slate-900">Dispute Resolution</p>
            <p className="text-[9px] font-semibold text-slate-500">
             Long-press any bill to flag
            </p>
           </div>
          </div>
          <span
           className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
            disputeDemoStatus === 'open'
             ? 'bg-amber-200 text-amber-900'
             : 'bg-emerald-100 text-emerald-700'
           }`}
          >
           {disputeDemoStatus === 'open'
            ? 'Open'
            : disputeDemoStatus === 'updated'
             ? 'Edited & Solved'
             : 'Resolved'}
          </span>
         </div>

         <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-3">
          <div className="flex items-center justify-between">
           <p className="text-xs font-extrabold text-slate-900">
            Swiggy Dinner Order
           </p>
           <span className="font-mono text-xs font-extrabold text-amber-900">
            {disputeDemoStatus === 'updated' ? '₹1,120.00' : '₹1,480.00'}
           </span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-600">
           Raised by <strong>Sushant</strong> in Flat 402
          </p>
          <p className="mt-2 rounded-xl bg-white/90 p-2 text-[10px] text-slate-700">
           “Dessert was only for 2 people—please adjust custom split shares.”
          </p>

          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
           <button
            type="button"
            onClick={() => setDisputeDemoStatus('updated')}
            className={`rounded-lg py-1.5 text-[9px] font-extrabold transition-all ${
             disputeDemoStatus === 'updated'
              ? 'bg-[#3E7754] text-white'
              : 'bg-white text-slate-800 border border-amber-200 hover:bg-amber-100'
            }`}
           >
            Edit Bill
           </button>
           <button
            type="button"
            onClick={() => setDisputeDemoStatus('solved')}
            className={`rounded-lg py-1.5 text-[9px] font-extrabold transition-all ${
             disputeDemoStatus === 'solved'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-800 border border-amber-200 hover:bg-amber-100'
            }`}
           >
            Mark Solved
           </button>
           <button
            type="button"
            onClick={() => setDisputeDemoStatus('open')}
            className="rounded-lg border border-slate-200 bg-white py-1.5 text-[9px] font-bold text-slate-600 hover:bg-slate-100"
           >
            Reset
           </button>
          </div>
         </div>

         <div className="flex items-center justify-between rounded-xl border border-white bg-white px-3 py-2 text-[10px]">
          <span className="font-semibold text-slate-600">Auto-notifies all members</span>
          <span className="font-extrabold text-[#3E7754]">Push + Chat ✓</span>
         </div>
        </div>
       </div>

       <h3 className="showcase-card-title mt-5 text-base font-extrabold text-slate-900">
        Flag &amp; fix wrong bills without friction
       </h3>
      </RevealOnScroll>
     )}

     {/* SCREENSHOT 2: MONTHLY RENT TRACKER & REMINDERS (NEW) */}
     {(
      <RevealOnScroll
       delay={120}
       dataShowcaseSlide={1}
       className="showcase-slide flex flex-col items-center rounded-[32px] border border-white/90 bg-white/75 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl"
      >
       <div className="showcase-card-header mb-4 flex w-full items-center justify-between">
        <span className="showcase-card-label rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3 py-1 text-[11px] font-extrabold text-[#356447]">
         2. Monthly Flat Rent Tracker
        </span>
        <span className="rounded-md bg-[#3E7754] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
         New
        </span>
       </div>

       <div className="showcase-phone-frame w-full max-w-[300px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-2.5 shadow-lg">
        <div className="showcase-phone-screen space-y-2.5 rounded-[24px] bg-white p-3.5">
         <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
           <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <Home size={14} />
           </span>
           <div>
            <p className="text-xs font-extrabold text-slate-900">October 2026 Rent</p>
            <p className="text-[9px] text-slate-500">Flat 402 · ₹24,000 total</p>
           </div>
          </div>
          <span className="rounded-lg bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800">
           ₹6,000/ea
          </span>
         </div>

         <div className="space-y-1.5">
          {[
           { name: 'Taranveer (You)', share: '₹6,000', paid: rentDemoPaid },
           { name: 'Sushant Monga', share: '₹6,000', paid: true },
           { name: 'Tanmay Sharma', share: '₹6,000', paid: true },
           { name: 'Aarav Verma', share: '₹6,000', paid: false },
          ].map((member) => (
           <div
            key={member.name}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-2.5 py-1.5 text-[10px]"
           >
            <span className="font-bold text-slate-800">{member.name}</span>
            <div className="flex items-center gap-1.5">
             <span className="font-mono font-semibold text-slate-600">
              {member.share}
             </span>
             <span
              className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold ${
               member.paid
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-800'
              }`}
             >
              {member.paid ? 'Paid ✓' : 'Pending'}
             </span>
            </div>
           </div>
          ))}
         </div>

         <button
          type="button"
          onClick={() => setRentDemoPaid((prev) => !prev)}
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-extrabold text-white shadow-xs transition-all ${
           rentDemoPaid
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : 'bg-[#3E7754] hover:bg-[#356447]'
          }`}
         >
          <Check size={13} />
          <span>
           {rentDemoPaid ? 'Your Rent Share Marked Paid!' : 'Tap to Mark Your ₹6,000 Paid'}
          </span>
         </button>
        </div>
       </div>

       <h3 className="showcase-card-title mt-5 text-base font-extrabold text-slate-900">
        Dedicated monthly rent ledger
       </h3>
      </RevealOnScroll>
     )}

     {/* SCREENSHOT 3: WHATSAPP-GRADE SPACE CHAT (UPDATED) */}
     {(
      <RevealOnScroll
       delay={190}
       dataShowcaseSlide={2}
       className="showcase-slide flex flex-col items-center rounded-[32px] border border-white/90 bg-white/75 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl"
      >
       <div className="showcase-card-header mb-4 flex w-full items-center justify-between">
        <span className="showcase-card-label rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3 py-1 text-[11px] font-extrabold text-[#356447]">
         3. Rich Media, GIF &amp; Reply Chat
        </span>
        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
         Upgraded
        </span>
       </div>

       <div className="showcase-phone-frame w-full max-w-[300px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-2.5 shadow-lg">
        <div className="showcase-phone-screen space-y-2 rounded-[24px] bg-[#F3F7F3] p-3.5">
         {/* Quick Emoji Reaction Bar Preview */}
         <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-white bg-white/95 px-3 py-1 text-xs shadow-md">
          {['❤️', '👍', '😂', '😮', '😢', '🙏'].map((emoji) => (
           <span key={emoji} className="cursor-pointer transition-transform hover:scale-125">
            {emoji}
           </span>
          ))}
         </div>

         {/* Message with Link Preview & Forwarded tag */}
         <div className="rounded-2xl border border-slate-200/80 bg-white p-2.5 text-[10px] shadow-2xs">
          <div className="flex items-center gap-1 text-[9px] font-semibold italic text-slate-400">
           <CornerUpRight size={10} /> Forwarded from Kasol Trip
          </div>
          <p className="mt-0.5 font-bold text-[#3E7754]">Sushant</p>
          <p className="text-slate-800">Booked our riverside camp! Check link:</p>
          <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
           <p className="text-[8px] font-bold uppercase text-slate-400">booking.kasol.in</p>
           <p className="text-[10px] font-bold text-slate-800">
            Parvati Valley Riverside Cottages · 5 Guests
           </p>
          </div>
         </div>

         {/* Swipe to Reply Message */}
         <div className="ml-auto max-w-[86%] rounded-2xl bg-[#3E7754] p-2.5 text-[10px] text-white shadow-xs">
          <div className="mb-1 rounded border-l-2 border-white bg-white/15 px-2 py-0.5 text-[9px]">
           <span className="font-bold">Sushant:</span> Booked our riverside camp!
          </div>
          <div className="flex items-center justify-between gap-2">
           <span>Awesome! Uploading petrol receipt PDF 🧾</span>
           <CheckCheck size={12} className="text-emerald-200" />
          </div>
         </div>

         {/* Sticker / GIF Picker Strip */}
         <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-600">
          <span>😊 Emoji</span>
          <span className="rounded bg-[#EEF4EF] px-1.5 py-0.5 text-[#3E7754]">
           GIPHY GIFs
          </span>
          <span>🐼 Stickers</span>
          <span>📎 Media</span>
         </div>
        </div>
       </div>

       <h3 className="showcase-card-title mt-5 text-base font-extrabold text-slate-900">
        WhatsApp-grade chat inside every room
       </h3>
      </RevealOnScroll>
     )}

     {/* SCREENSHOT 4: DIRECT GOOGLE PAY / UPI & SMART SETTLEMENT (CORE) */}
     {(
      <RevealOnScroll
       delay={260}
       dataShowcaseSlide={3}
       className="showcase-slide flex flex-col items-center rounded-[32px] border border-white/90 bg-white/75 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl"
      >
       <div className="showcase-card-header mb-4 flex w-full items-center justify-between">
        <span className="showcase-card-label rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700">
         4. 1-Tap GPay UPI &amp; Breakdown
        </span>
        <span className="rounded-md bg-[#3E7754] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
         Core
        </span>
       </div>

       <div className="showcase-phone-frame w-full max-w-[300px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-2.5 shadow-lg">
        <div className="showcase-phone-screen space-y-2.5 rounded-[24px] bg-[#F3F7F3] p-3.5">
         <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-900">Smart Balances</span>
          <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-[9px] font-bold">
           <span className="rounded-md bg-white px-2 py-0.5 text-[#3E7754] shadow-2xs">
            Optimized
           </span>
           <span className="px-2 py-0.5 text-slate-500">Pairwise</span>
          </div>
         </div>

         <div className="rounded-2xl border border-white bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between">
           <div>
            <p className="text-xs font-extrabold text-slate-900">You owe Sushant</p>
            <p className="font-mono text-[9px] text-slate-500">
             UPI: sushant@okicici
            </p>
           </div>
           <span className="font-mono text-sm font-extrabold text-rose-600">
            -₹1,240
           </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
           <span className="flex items-center justify-center gap-1 rounded-xl bg-[#3E7754] py-1.5 text-[10px] font-bold text-white shadow-xs">
            <Zap size={11} /> Pay via GPay
           </span>
           <span className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-[10px] font-bold text-slate-700">
            View 4 Bills
           </span>
          </div>
         </div>

         {/* Custom Quick Pay Strip */}
         <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-2.5">
          <p className="text-[10px] font-extrabold text-emerald-950">
           Custom Quick Pay &amp; Confirmations
          </p>
          <p className="mt-0.5 text-[9px] text-emerald-800">
           Record partial payments or confirm received settlements with instant push alerts.
          </p>
         </div>
        </div>
       </div>

       <h3 className="showcase-card-title mt-5 text-base font-extrabold text-slate-900">
        Deep-linked Google Pay &amp; UPI intents
       </h3>
      </RevealOnScroll>
     )}

     {/* SCREENSHOT 5: CAMERA QR SCANNER & MULTI-CURRENCY SPACES (NEW) */}
     {(
      <RevealOnScroll
       delay={330}
       dataShowcaseSlide={4}
       className="showcase-slide flex flex-col items-center rounded-[32px] border border-white/90 bg-white/75 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl"
      >
       <div className="showcase-card-header mb-4 flex w-full items-center justify-between">
        <span className="showcase-card-label rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3 py-1 text-[11px] font-extrabold text-[#356447]">
         5. Camera QR Scan &amp; 6 Currencies
        </span>
        <span className="rounded-md bg-[#3E7754] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
         New
        </span>
       </div>

       <div className="showcase-phone-frame w-full max-w-[300px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-2.5 shadow-lg">
        <div className="showcase-phone-screen space-y-2.5 rounded-[24px] bg-white p-3.5">
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
           <QrCode size={14} className="text-[#3E7754]" />
           <span className="text-xs font-extrabold text-slate-900">
            Scan or Share Invite
           </span>
          </div>
          <button
           type="button"
           onClick={handleCopyDemoCode}
           className="inline-flex items-center gap-1 rounded-lg border border-[#BDD2C1] bg-[#EEF4EF] px-2 py-0.5 font-mono text-[10px] font-extrabold text-[#3E7754]"
          >
           <Copy size={10} />
           <span>{copiedCode ? 'Copied!' : 'FLT402'}</span>
          </button>
         </div>

         {/* Simulated Camera QR Viewfinder */}
         <div className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-950 p-3.5 text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 bg-white/10">
           <ScanLine size={34} className="text-emerald-400 animate-pulse" />
          </div>
          <p className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-emerald-300">
           <Camera size={11} /> Point camera at roommate’s QR code
          </p>
         </div>

         {/* Interactive Multi-Currency Switcher */}
         <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
           <span>Room Currency</span>
           <span className="font-mono text-[#3E7754]">
            Example: {sym}1,250.00
           </span>
          </div>
          <div className="mt-1.5 grid grid-cols-6 gap-1">
           {['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'].map((cur) => (
            <button
             key={cur}
             type="button"
             onClick={() => setSelectedCurrency(cur)}
             className={`rounded-lg py-1 text-[9px] font-extrabold transition-all ${
              selectedCurrency === cur
               ? 'bg-[#3E7754] text-white shadow-2xs'
               : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
             }`}
            >
             {cur}
            </button>
           ))}
          </div>
         </div>
        </div>
       </div>

       <h3 className="showcase-card-title mt-5 text-base font-extrabold text-slate-900">
        Instant QR onboarding &amp; global currencies
       </h3>
      </RevealOnScroll>
     )}

     {/* SCREENSHOT 6: CSV & PRINTABLE PDF EXPORT MODAL (NEW) */}
     {(
      <RevealOnScroll
       delay={400}
       dataShowcaseSlide={5}
       className="showcase-slide flex flex-col items-center rounded-[32px] border border-white/90 bg-white/75 p-6 shadow-xl shadow-[#14291D]/5 backdrop-blur-xl"
      >
       <div className="showcase-card-header mb-4 flex w-full items-center justify-between">
        <span className="showcase-card-label rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3 py-1 text-[11px] font-extrabold text-[#356447]">
         6. CSV &amp; Printable PDF Exports
        </span>
        <span className="rounded-md bg-[#3E7754] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
         New
        </span>
       </div>

       <div className="showcase-phone-frame w-full max-w-[300px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900/10 p-2.5 shadow-lg">
        <div className="showcase-phone-screen space-y-2.5 rounded-[24px] bg-white p-3.5">
         <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
           <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF4EF] text-[#3E7754]">
            <FileText size={14} />
           </span>
           <div>
            <p className="text-xs font-extrabold text-slate-900">Export Transactions</p>
            <p className="text-[9px] text-slate-500">28 records matched</p>
           </div>
          </div>
          <FileDown size={14} className="text-[#3E7754]" />
         </div>

         <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
           Filter Scope
          </p>
          <div className="mt-1 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
           {[
            { id: 'all', label: 'All' },
            { id: 'mine', label: 'Paid by me' },
            { id: 'settlements', label: 'Settlements' },
           ].map((item) => (
            <button
             key={item.id}
             type="button"
             onClick={() => setExportScopeDemo(item.id)}
             className={`rounded-lg py-1 text-[9px] font-bold transition-all ${
              exportScopeDemo === item.id
               ? 'bg-white text-[#3E7754] shadow-2xs'
               : 'text-slate-600'
             }`}
            >
             {item.label}
            </button>
           ))}
          </div>
         </div>

         <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
           Date Window
          </p>
          <div className="mt-1 grid grid-cols-3 gap-1 text-center text-[9px] font-bold">
           <span className="rounded-lg border border-[#3E7754] bg-[#EEF4EF] py-1 text-[#3E7754]">
            This Month
           </span>
           <span className="rounded-lg border border-slate-200 py-1 text-slate-600">
            Last 90d
           </span>
           <span className="rounded-lg border border-slate-200 py-1 text-slate-600">
            All Time
           </span>
          </div>
         </div>

         <div className="grid grid-cols-2 gap-2 pt-1">
          <button
           type="button"
           onClick={triggerGetStarted}
           className="flex items-center justify-center gap-1 rounded-xl bg-[#3E7754] py-2 text-[10px] font-bold text-white shadow-xs"
          >
           <Download size={11} /> CSV File
          </button>
          <button
           type="button"
           onClick={triggerGetStarted}
           className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-2 text-[10px] font-bold text-slate-700"
          >
           <FileText size={11} /> Print PDF
          </button>
         </div>
        </div>
       </div>

       <h3 className="showcase-card-title mt-5 text-base font-extrabold text-slate-900">
        One-click CSV &amp; PDF ledger statements
       </h3>
      </RevealOnScroll>
     )}
    </ShowcaseMarquee>
   </section>

   {/* =================================================================== */}
   {/* SECTION 3: INTERACTIVE DESKTOP COMMAND CENTER (ALL 5 TABS LIVE!)    */}
   {/* =================================================================== */}
   <section id="desktop-preview" className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6">
    <RevealOnScroll className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:flex-nowrap lg:items-end lg:gap-8">
     <div>
      <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
       Interactive Desktop Command Center
      </span>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
       Explore all 5 desktop views live
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
       Click any tab below to inspect the redesigned widescreen workspace—including the new
       Rent &amp; Disputes Hub, Monthly Analytics drilldowns, and AMOLED Dark Mode.
      </p>
     </div>

     {/* 5-Tab Switcher + Dark Mode Toggle */}
     <div className="hidden shrink-0 items-center gap-2 xl:flex">
      <div className="flex flex-nowrap rounded-2xl border border-white/90 bg-white/85 p-1 shadow-sm backdrop-blur-xl">
       {[
        { id: 'command', label: '1. Overview' },
        { id: 'analytics', label: '2. Monthly Analytics' },
        { id: 'rent', label: '3. Rent & Disputes' },
        { id: 'transactions', label: '4. Transactions & Export' },
        { id: 'spaces', label: '5. Shared Spaces' },
       ].map((tab) => (
        <button
         key={tab.id}
         type="button"
         onClick={() => setActivePreviewTab(tab.id)}
         className={`whitespace-nowrap rounded-xl px-2.5 py-2 text-[11px] font-bold transition-all ${
          activePreviewTab === tab.id
           ? 'bg-gradient-to-b from-[#3E7754] to-[#2C503A] text-white shadow-sm'
           : 'text-slate-600 hover:text-slate-900'
         }`}
        >
         {tab.label}
        </button>
       ))}
      </div>

      <button
       type="button"
       onClick={() => setDesktopDarkPreview((prev) => !prev)}
       className={`inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-2xl border px-3 text-xs font-bold shadow-xs transition-all ${
        desktopDarkPreview
         ? 'border-slate-700 bg-slate-900 text-amber-300'
         : 'border-white/90 bg-white/90 text-slate-700 hover:bg-white'
       }`}
      >
       {desktopDarkPreview ? <Moon size={14} /> : <Sun size={14} />}
       <span>{desktopDarkPreview ? 'AMOLED Dark' : 'Light Glass'}</span>
      </button>
     </div>
    </RevealOnScroll>

    <RevealOnScroll
     delay={100}
     className="mt-7 overflow-hidden rounded-[28px] border border-white/90 bg-white/70 shadow-xl shadow-[#14291D]/10 backdrop-blur-xl xl:hidden"
    >
     <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3">
      <div className="flex items-center gap-2">
       <img src={sharebillsIcon} alt="" className="h-8 w-8 rounded-xl object-cover" />
       <div>
        <p className="text-xs font-extrabold text-slate-900">Sharebills</p>
        <p className="text-[10px] font-semibold text-[#3E7754]">Workspace overview</p>
       </div>
      </div>
      <span className="rounded-full bg-[#EEF4EF] px-2.5 py-1 text-[10px] font-bold text-[#356447]">
       Live preview
      </span>
     </div>
     <div className="space-y-3 bg-[#F3F7F3] p-3 sm:p-4">
      <div className="flex items-center justify-between rounded-2xl border border-white bg-white p-3 shadow-xs">
       <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Net position</p>
        <p className="mt-1 font-mono text-xl font-extrabold text-emerald-600">+₹3,450</p>
       </div>
       <span className="rounded-xl bg-[#3E7754] px-3 py-2 text-[10px] font-bold text-white">
        + New expense
       </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
       {[
        { label: 'To receive', value: '₹4,200', tone: 'text-emerald-600' },
        { label: 'To pay', value: '₹750', tone: 'text-rose-500' },
        { label: 'This month', value: '₹8,940', tone: 'text-slate-900' },
        { label: 'Active spaces', value: '3 groups', tone: 'text-[#3E7754]' },
       ].map((item) => (
        <div key={item.label} className="rounded-2xl border border-white bg-white p-3 shadow-xs">
         <p className="text-[10px] font-semibold text-slate-400">{item.label}</p>
         <p className={`mt-1 font-mono text-sm font-extrabold ${item.tone}`}>{item.value}</p>
        </div>
       ))}
      </div>
      <div className="rounded-2xl border border-white bg-white p-3 shadow-xs">
       <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-extrabold text-slate-900">Recent activity</p>
        <span className="text-[10px] font-bold text-[#3E7754]">View all</span>
       </div>
       {[
        { title: 'October flat rent', detail: 'Flat 402 · Today', amount: '+₹6,000' },
        { title: 'Dinner with friends', detail: 'Weekend trip · Yesterday', amount: '-₹480' },
       ].map((item) => (
        <div key={item.title} className="flex items-center justify-between border-t border-slate-100 py-2 first:border-0">
         <div>
          <p className="text-[11px] font-bold text-slate-800">{item.title}</p>
          <p className="text-[10px] text-slate-400">{item.detail}</p>
         </div>
         <span className="font-mono text-[11px] font-extrabold text-slate-700">{item.amount}</span>
        </div>
       ))}
      </div>
     </div>
    </RevealOnScroll>

    <RevealOnScroll
     delay={150}
     className="mt-7 hidden overflow-hidden rounded-[32px] border border-white/90 bg-white/60 shadow-2xl shadow-[#14291D]/10 backdrop-blur-2xl xl:block"
    >
     {/* macOS Browser Top Chrome */}
     <div
      className={`flex items-center justify-between border-b px-5 py-3 transition-colors ${
       desktopDarkPreview
        ? 'border-white/15 bg-zinc-950 text-white'
        : 'border-slate-200/80 bg-white/90 text-slate-800'
      }`}
     >
      <div className="flex items-center gap-2">
       <span className="h-3 w-3 rounded-full bg-rose-400" />
       <span className="h-3 w-3 rounded-full bg-amber-400" />
       <span className="h-3 w-3 rounded-full bg-emerald-400" />
      </div>
      <div
       className={`flex items-center gap-2 rounded-full border px-4 py-1 text-[11px] font-semibold ${
        desktopDarkPreview
         ? 'border-white/15 bg-zinc-900 text-slate-300'
         : 'border-slate-200/90 bg-slate-100/80 text-slate-500'
       }`}
      >
       <Lock size={11} className="text-emerald-500" />
       <span>
        sharebills.in/?tab=
        {activePreviewTab === 'command' ? 'groups' : activePreviewTab}
       </span>
      </div>
      <button
       type="button"
       onClick={triggerGetStarted}
       className="text-xs font-bold text-[#3E7754] hover:underline"
      >
       Open Live App →
      </button>
     </div>

     {/* Desktop App Body with Sidebar + Active Viewport */}
     <div
      className={`grid grid-cols-1 lg:grid-cols-12 transition-colors duration-300 ${
       desktopDarkPreview ? 'bg-black text-white' : 'bg-[#F3F7F3] text-slate-900'
      }`}
     >
      {/* Desktop Left Sidebar Navigation (Matches PrimaryNav.jsx) */}
      <aside
       className={`hidden border-r p-4 lg:col-span-3 lg:flex lg:flex-col lg:justify-between xl:col-span-2 ${
        desktopDarkPreview
         ? 'border-white/10 bg-zinc-950/90'
         : 'border-white/80 bg-white/75'
       }`}
      >
       <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-2">
         <img src={sharebillsIcon} alt="" className="h-8 w-8 rounded-xl object-cover" />
         <div>
          <p className="text-xs font-extrabold">Sharebills</p>
          <p className="text-[10px] font-semibold text-[#3E7754]">Desktop v2.5</p>
         </div>
        </div>

        <div className="space-y-1">
         {[
          { id: 'command', label: 'Overview', icon: Layers },
          { id: 'spaces', label: 'Spaces (3)', icon: Users },
          { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
          { id: 'rent', label: 'Rent & Settlements', icon: CircleDollarSign, badge: '4' },
          { id: 'analytics', label: 'Analytics', icon: PieChart },
         ].map(({ id, label, icon: Icon, badge }) => (
          <button
           key={id}
           type="button"
           onClick={() => setActivePreviewTab(id)}
           className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-xs font-bold transition-all ${
            activePreviewTab === id
             ? 'bg-[#3E7754] text-white shadow-sm'
             : desktopDarkPreview
              ? 'text-slate-400 hover:bg-zinc-900 hover:text-white'
              : 'text-slate-600 hover:bg-white hover:text-slate-900'
           }`}
          >
           <span className="flex items-center gap-2">
            <Icon size={15} />
            <span>{label}</span>
           </span>
           {badge && (
            <span
             className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
              activePreviewTab === id
               ? 'bg-white/20 text-white'
               : 'bg-amber-100 text-amber-800'
             }`}
            >
             {badge}
            </span>
           )}
          </button>
         ))}
        </div>
       </div>

       <div
        className={`mt-6 rounded-2xl border p-3 text-[11px] ${
         desktopDarkPreview
          ? 'border-white/15 bg-zinc-900'
          : 'border-[#BDD2C1] bg-[#EEF4EF]/80'
        }`}
       >
        <p className="font-extrabold text-[#3E7754]">UPI Linked</p>
        <p className="mt-0.5 truncate font-mono text-[10px] opacity-80">
         taran@okhdfcbank
        </p>
       </div>
      </aside>

      {/* Main Desktop Content Area */}
      <div className="p-4 sm:p-6 lg:col-span-9 xl:col-span-10">
       {/* Top Command Bar */}
       <div
        className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl border p-4 shadow-sm ${
         desktopDarkPreview
          ? 'border-white/15 bg-zinc-900/90'
          : 'border-white/90 bg-white/85'
        }`}
       >
        <div>
         <p className="text-[11px] font-bold uppercase tracking-wider text-[#3E7754]">
          {activePreviewTab === 'command' && 'Overview Command Center · Real-Time Sync'}
          {activePreviewTab === 'analytics' && 'Monthly Category Analytics · October 2026'}
          {activePreviewTab === 'rent' && 'Rent, Active Disputes & Optimized Settlements'}
          {activePreviewTab === 'transactions' && 'Full Audit Ledger · CSV & PDF Export'}
          {activePreviewTab === 'spaces' && 'Shared Spaces Directory · Active, Pinned & Archived'}
         </p>
         <h3 className="text-lg font-extrabold sm:text-xl">
          Good Evening, Taranveer
         </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
         <div
          className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:flex ${
           desktopDarkPreview
            ? 'border-white/15 bg-black text-slate-300'
            : 'border-slate-200 bg-white text-slate-500'
          }`}
         >
          <Search size={13} className="text-[#3E7754]" />
          <span>Search spaces or bills...</span>
         </div>
         <button
          type="button"
          onClick={triggerGetStarted}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-3 text-xs font-bold text-white shadow-sm"
         >
          <Receipt size={13} /> Quick Expense
         </button>
         <button
          type="button"
          onClick={triggerGetStarted}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#3E7754] px-3.5 text-xs font-bold text-white shadow-sm"
         >
          <Plus size={14} /> New Space
         </button>
        </div>
       </div>

       {/* VIEW 1: OVERVIEW COMMAND CENTER */}
       {activePreviewTab === 'command' && (
        <div className="mt-5 space-y-5">
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
           className={`rounded-3xl border p-4 shadow-xs ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900'
             : 'border-white/90 bg-white/85'
           }`}
          >
           <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Net Position</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
             <ArrowDownLeft size={16} />
            </span>
           </div>
           <p className="mt-2 font-mono text-2xl font-extrabold text-emerald-500">
            +₹3,450.00
           </p>
           <p className="mt-1.5 text-[11px] font-semibold text-slate-400">
            <span className="text-emerald-500">+₹4,200 to receive</span> ·{' '}
            <span className="text-rose-500">-₹750 to pay</span>
           </p>
          </div>

          <div
           onClick={() => setActivePreviewTab('analytics')}
           className={`cursor-pointer rounded-3xl border p-4 shadow-xs transition-transform hover:-translate-y-0.5 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900'
             : 'border-white/90 bg-white/85'
           }`}
          >
           <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Oct 2026 Share</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754]">
             <PieChart size={16} />
            </span>
           </div>
           <p className="mt-2 font-mono text-2xl font-extrabold">₹8,940.00</p>
           <div className="mt-2 space-y-1">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
             <div className="h-full w-[45%] bg-[#3E7754]" />
             <div className="h-full w-[30%] bg-amber-500" />
             <div className="h-full w-[25%] bg-sky-500" />
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
             <span>Rent 45% · Food 30%</span>
             <span className="font-bold text-[#3E7754]">Analytics →</span>
            </div>
           </div>
          </div>

          <div
           onClick={() => setActivePreviewTab('transactions')}
           className={`cursor-pointer rounded-3xl border p-4 shadow-xs transition-transform hover:-translate-y-0.5 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900'
             : 'border-white/90 bg-white/85'
           }`}
          >
           <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">You Paid Out</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754]">
             <Wallet size={16} />
            </span>
           </div>
           <p className="mt-2 font-mono text-2xl font-extrabold">₹12,390.00</p>
           <p className="mt-1.5 text-[11px] font-semibold text-slate-400">
            Across 14 bills · View Txns →
           </p>
          </div>

          <div
           onClick={() => setActivePreviewTab('rent')}
           className={`cursor-pointer rounded-3xl border p-4 shadow-xs transition-transform hover:-translate-y-0.5 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900'
             : 'border-white/90 bg-white/85'
           }`}
          >
           <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
             Pending Rent &amp; Dues
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
             <CircleDollarSign size={16} />
            </span>
           </div>
           <p className="mt-2 font-mono text-2xl font-extrabold">4</p>
           <p className="mt-1.5 text-[11px] font-semibold text-amber-600">
            1 rent share · 1 dispute · 2 dues →
           </p>
          </div>
         </div>

         <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div
           className={`rounded-3xl border p-4 lg:col-span-8 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900/90'
             : 'border-white/90 bg-white/85'
           }`}
          >
           <div className="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2.5">
            <div>
             <h4 className="text-sm font-extrabold">Recent Ledger Activity</h4>
             <p className="text-[11px] text-slate-400">
              Long-press or right-click any bill to raise a dispute
             </p>
            </div>
            <button
             type="button"
             onClick={() => setActivePreviewTab('transactions')}
             className="rounded-xl bg-[#EEF4EF] px-3 py-1 text-xs font-bold text-[#3E7754]"
            >
             Export CSV / PDF →
            </button>
           </div>
           <div className="space-y-2">
            {[
             {
              title: 'October Flat Rent & Maintenance',
              room: 'Flat 402 · Mohali',
              meta: 'You paid ₹24,000.00 via UPI · Split ₹6,000/ea',
              impact: '+₹18,000.00',
              positive: true,
              badge: 'Rent Ledger',
             },
             {
              title: 'WiFi + OTT Fiber Bill',
              room: 'Flat 402 · Mohali',
              meta: 'Aarav paid ₹1,800.00 · Edited after dispute resolution',
              impact: '-₹300.00',
              positive: false,
              badge: 'Edited ✓',
             },
             {
              title: 'Riverside Campsite Booking',
              room: 'Kasol Weekend Trip',
              meta: 'You paid ₹6,500.00 via GPay · 5 participants',
              impact: '+₹5,200.00',
              positive: true,
              badge: 'Travel',
             },
            ].map((row) => (
             <div
              key={row.title}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 ${
               desktopDarkPreview
                ? 'border-white/10 bg-black/50'
                : 'border-slate-200/70 bg-white'
              }`}
             >
              <div className="flex min-w-0 items-center gap-3">
               <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF4EF] text-[#3E7754]">
                <Receipt size={15} />
               </span>
               <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                 <p className="truncate text-xs font-extrabold">{row.title}</p>
                 <span className="rounded-md bg-[#EEF4EF] px-2 py-0.5 text-[9px] font-bold text-[#356447]">
                  {row.room}
                 </span>
                 <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                  {row.badge}
                 </span>
                </div>
                <p className="text-[11px] text-slate-400">{row.meta}</p>
               </div>
              </div>
              <span
               className={`font-mono text-xs font-extrabold ${
                row.positive ? 'text-emerald-500' : 'text-rose-500'
               }`}
              >
               {row.impact}
              </span>
             </div>
            ))}
           </div>
          </div>

          <div
           className={`rounded-3xl border p-4 lg:col-span-4 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900/90'
             : 'border-white/90 bg-white/85'
           }`}
          >
           <h4 className="text-sm font-extrabold">Rent, Disputes &amp; Quick Dues</h4>
           <p className="text-[11px] text-slate-400">Actionable items across spaces</p>
           <div className="mt-3 space-y-2">
            <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 p-3 text-slate-900">
             <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-900">
               <AlertTriangle size={13} /> Active Dispute
              </span>
              <span className="font-mono text-xs font-extrabold">₹1,480</span>
             </div>
             <p className="mt-0.5 text-[10px] text-slate-600">
              Swiggy Dinner · Raised by Sushant
             </p>
            </div>

            <div className="rounded-2xl border border-[#BDD2C1] bg-[#EEF4EF]/80 p-3 text-slate-900">
             <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#2C503A]">
               <Home size={13} /> Oct Rent Share
              </span>
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white">
               3/4 Paid
              </span>
             </div>
             <p className="mt-0.5 text-[10px] text-slate-600">
              Flat 402 · ₹6,000 per roommate
             </p>
            </div>

            <div
             className={`flex items-center justify-between rounded-2xl border p-3 ${
              desktopDarkPreview
               ? 'border-white/10 bg-black/50'
               : 'border-slate-200 bg-white'
             }`}
            >
             <div>
              <p className="text-xs font-bold">Tanmay owes you</p>
              <p className="text-[10px] text-slate-400">Flat 402 · UPI Ready</p>
             </div>
             <span className="font-mono text-xs font-extrabold text-emerald-500">
              +₹1,450
             </span>
            </div>
           </div>
          </div>
         </div>
        </div>
       )}

       {/* VIEW 2: MONTHLY ANALYTICS TAB */}
       {activePreviewTab === 'analytics' && (
        <div className="mt-5 space-y-5">
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
           className={`rounded-3xl border p-5 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900'
             : 'border-white/90 bg-white/90'
           }`}
          >
           <span className="text-xs font-bold text-slate-400">
            Your October 2026 Share
           </span>
           <p className="mt-1 font-mono text-3xl font-extrabold text-[#3E7754]">
            ₹8,940.00
           </p>
           <p className="mt-1 text-[11px] text-slate-400">
            Includes ₹6,000 flat rent + ₹2,940 daily bills
           </p>
          </div>
          <div
           className={`rounded-3xl border p-5 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900'
             : 'border-white/90 bg-white/90'
           }`}
          >
           <span className="text-xs font-bold text-slate-400">You Paid Out</span>
           <p className="mt-1 font-mono text-3xl font-extrabold">₹12,390.00</p>
           <p className="mt-1 text-[11px] text-emerald-500 font-semibold">
            +₹3,450 net positive this month
           </p>
          </div>
          <div
           className={`rounded-3xl border p-5 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900'
             : 'border-white/90 bg-white/90'
           }`}
          >
           <span className="text-xs font-bold text-slate-400">Total Group Spend</span>
           <p className="mt-1 font-mono text-3xl font-extrabold">₹49,320.00</p>
           <p className="mt-1 text-[11px] text-slate-400">
            Across 3 active spaces · Tap any category to drill down
           </p>
          </div>
         </div>

         <div
          className={`rounded-3xl border p-5 ${
           desktopDarkPreview
            ? 'border-white/15 bg-zinc-900'
            : 'border-white/90 bg-white/90'
          }`}
         >
          <div className="flex items-center justify-between mb-4">
           <div>
            <h4 className="text-sm font-extrabold">Category Distribution Breakdown</h4>
            <p className="text-xs text-slate-400">
             Click any category in the app to inspect individual bills
            </p>
           </div>
           <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#BDD2C1] bg-[#EEF4EF] px-3 py-1.5 text-xs font-bold text-[#3E7754]">
            <CalendarDays size={13} /> Oct 2026
           </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
           {[
            { name: 'Rent & Housing', amount: '₹6,000', pct: 67, icon: Home, bar: 'bg-slate-800' },
            { name: 'Food & Groceries', amount: '₹1,420', pct: 16, icon: Utensils, bar: 'bg-amber-500' },
            { name: 'Travel & Fuel', amount: '₹820', pct: 9, icon: Car, bar: 'bg-sky-500' },
            { name: 'Electricity & WiFi', amount: '₹450', pct: 5, icon: Zap, bar: 'bg-[#3E7754]' },
            { name: 'Shopping & Essentials', amount: '₹250', pct: 3, icon: ShoppingBag, bar: 'bg-emerald-500' },
           ].map(({ name, amount, pct, icon: Icon, bar }) => (
            <div
             key={name}
             className={`rounded-2xl border p-3.5 ${
              desktopDarkPreview
               ? 'border-white/10 bg-black/50'
               : 'border-slate-200/80 bg-slate-50/70'
             }`}
            >
             <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-extrabold">
               <Icon size={14} className="text-[#3E7754]" /> {name}
              </span>
              <span className="font-mono text-xs font-extrabold">{amount}</span>
             </div>
             <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
             </div>
             <p className="mt-1 text-[10px] font-semibold text-slate-400">
              {pct}% of your monthly share
             </p>
            </div>
           ))}
          </div>
         </div>
        </div>
       )}

       {/* VIEW 3: RENT & DISPUTES HUB */}
       {activePreviewTab === 'rent' && (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
         <div
          className={`rounded-3xl border p-5 ${
           desktopDarkPreview
            ? 'border-white/15 bg-zinc-900'
            : 'border-white/90 bg-white/90'
          }`}
         >
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
           <div>
            <h4 className="text-sm font-extrabold">Monthly Rent Ledger</h4>
            <p className="text-xs text-slate-400">
             Automatic cent-accurate split &amp; daily reminders
            </p>
           </div>
           <span className="rounded-lg bg-amber-100 px-2.5 py-1 font-mono text-xs font-bold text-amber-900">
            Oct 2026 · ₹24,000
           </span>
          </div>
          <div className="mt-3 space-y-2">
           {[
            { member: 'Taranveer Singh (Admin)', share: '₹6,000.00', status: 'Paid Oct 02' },
            { member: 'Sushant Monga', share: '₹6,000.00', status: 'Paid Oct 03' },
            { member: 'Tanmay Sharma', share: '₹6,000.00', status: 'Paid Oct 04' },
            { member: 'Aarav Verma', share: '₹6,000.00', status: 'Reminder Sent', unpaid: true },
           ].map((r) => (
            <div
             key={r.member}
             className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 text-xs ${
              desktopDarkPreview
               ? 'border-white/10 bg-black/40'
               : 'border-slate-200/70 bg-slate-50'
             }`}
            >
             <span className="font-bold">{r.member}</span>
             <div className="flex items-center gap-2">
              <span className="font-mono font-bold">{r.share}</span>
              <span
               className={`rounded-lg px-2 py-0.5 text-[10px] font-extrabold ${
                r.unpaid
                 ? 'bg-amber-100 text-amber-800'
                 : 'bg-emerald-100 text-emerald-700'
               }`}
              >
               {r.status}
              </span>
             </div>
            </div>
           ))}
          </div>
         </div>

         <div
          className={`rounded-3xl border p-5 ${
           desktopDarkPreview
            ? 'border-white/15 bg-zinc-900'
            : 'border-white/90 bg-white/90'
          }`}
         >
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
           <div>
            <h4 className="text-sm font-extrabold">Active Expense Disputes</h4>
            <p className="text-xs text-slate-400">
             Synced directly with group chat threads
            </p>
           </div>
           <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-900">
            1 Open
           </span>
          </div>
          <div className="mt-3 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-slate-900">
           <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold">
             Swiggy Instamart Midnight Order · ₹1,480.00
            </span>
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
             Open in Chat
            </span>
           </div>
           <p className="mt-1 text-xs text-slate-600">
            Raised by Sushant · “Please split snacks only among 3 people.”
           </p>
           <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-xl bg-[#3E7754] px-3 py-1.5 text-[11px] font-bold text-white">
             Update Expense &amp; Resolve
            </span>
            <span className="rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700">
             Mark as Solved
            </span>
           </div>
          </div>
         </div>
        </div>
       )}

       {/* VIEW 4: TRANSACTIONS & EXPORT */}
       {activePreviewTab === 'transactions' && (
        <div className="mt-5 space-y-4">
         <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-3xl border p-4 ${
           desktopDarkPreview
            ? 'border-white/15 bg-zinc-900'
            : 'border-white/90 bg-white/90'
          }`}
         >
          <div className="flex items-center gap-2">
           <span className="rounded-full bg-[#3E7754] px-3 py-1 text-xs font-bold text-white">
            All (28)
           </span>
           <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
            Paid by Me (11)
           </span>
           <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
            Settlements (6)
           </span>
          </div>
          <div className="flex items-center gap-2">
           <button
            type="button"
            onClick={triggerGetStarted}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3E7754] px-3.5 py-2 text-xs font-bold text-white shadow-xs"
           >
            <FileDown size={14} /> Export CSV / PDF Statement
           </button>
          </div>
         </div>

         <div
          className={`rounded-3xl border p-4 space-y-2 ${
           desktopDarkPreview
            ? 'border-white/15 bg-zinc-900'
            : 'border-white/90 bg-white/90'
          }`}
         >
          {[
           { date: 'Today · Oct 29', title: 'Blinkit Groceries & Milk', payer: 'You paid via UPI', amt: '₹640.00', share: '+₹480.00' },
           { date: 'Yesterday · Oct 28', title: 'Settlement: Tanmay → You', payer: 'Confirmed via GPay', amt: '₹1,450.00', share: 'Settled ✓' },
           { date: 'Oct 25, 2026', title: 'HP Petrol Pump Highway Refill', payer: 'Sushant paid via Card', amt: '₹2,500.00', share: '-₹500.00' },
          ].map((t) => (
           <div
            key={t.title}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
             desktopDarkPreview
              ? 'border-white/10 bg-black/50'
              : 'border-slate-200/70 bg-slate-50/70'
            }`}
           >
            <div>
             <span className="text-[10px] font-bold uppercase text-[#3E7754]">
              {t.date}
             </span>
             <p className="text-xs font-extrabold">{t.title}</p>
             <p className="text-[11px] text-slate-400">{t.payer}</p>
            </div>
            <div className="text-right font-mono">
             <p className="text-xs font-extrabold">{t.amt}</p>
             <p className="text-[11px] font-bold text-emerald-500">{t.share}</p>
            </div>
           </div>
          ))}
         </div>
        </div>
       )}

       {/* VIEW 5: SHARED SPACES DIRECTORY */}
       {activePreviewTab === 'spaces' && (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
         {[
          {
           name: 'Flat 402 · Mohali',
           code: 'FLT402',
           cur: 'INR (₹)',
           spend: '₹28,400',
           net: '+₹2,150',
           status: 'Pinned · Rent Tracked',
          },
          {
           name: 'Kasol Weekend Trip',
           code: 'KSL901',
           cur: 'INR (₹)',
           spend: '₹16,800',
           net: '+₹1,300',
           status: 'Pinned · 5 Members',
          },
          {
           name: 'Euro Grad Backpack',
           code: 'EUR204',
           cur: 'EUR (€)',
           spend: '€1,420',
           net: 'Settled',
           status: 'Multi-Currency Space',
          },
         ].map((sp) => (
          <div
           key={sp.name}
           className={`rounded-3xl border p-5 ${
            desktopDarkPreview
             ? 'border-white/15 bg-zinc-900'
             : 'border-white/90 bg-white/90'
           }`}
          >
           <div className="flex items-center justify-between">
            <span className="rounded-lg bg-[#EEF4EF] px-2.5 py-1 text-[10px] font-extrabold text-[#3E7754]">
             {sp.status}
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">
             #{sp.code}
            </span>
           </div>
           <h4 className="mt-3 text-base font-extrabold">{sp.name}</h4>
           <p className="mt-1 text-xs text-slate-400">
            Currency: <strong>{sp.cur}</strong> · Total Spend: <strong>{sp.spend}</strong>
           </p>
           <div className="mt-4 flex items-center justify-between border-t border-slate-200/50 pt-3">
            <span className="font-mono text-xs font-extrabold text-emerald-500">
             {sp.net}
            </span>
            <span className="text-xs font-bold text-[#3E7754]">Open Room →</span>
           </div>
          </div>
         ))}
        </div>
       )}
      </div>
     </div>
    </RevealOnScroll>
   </section>

   {/* =================================================================== */}
   {/* SECTION 4: COMPLETE 12-FEATURE BENTO GRID                           */}
   {/* =================================================================== */}
   <section id="features" className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6">
    <RevealOnScroll className="text-center">
     <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
      All Main, Unique &amp; Important Features
     </span>
     <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
      Everything we built for effortless shared living
     </h2>
     <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
      Unlike generic bill splitters, Sharebills combines a real-time multi-currency ledger,
      monthly flat rent automation, in-chat dispute resolution, and direct UPI deep-links.
     </p>
    </RevealOnScroll>

    <div className="feature-carousel-wrap mx-auto mt-10 max-w-5xl">
     <div className="feature-carousel-stage">
      {landingFeatures.map((feat, index) => {
       const Icon = feat.icon;
       const offset = (index - activeFeatureIndex + landingFeatures.length) % landingFeatures.length;
       const relativeOffset = offset > landingFeatures.length / 2 ? offset - landingFeatures.length : offset;
       const visible = Math.abs(relativeOffset) <= 1;
       return (
        <article
         key={feat.title}
         aria-hidden={!visible}
         className={`feature-carousel-card ${visible ? 'is-visible' : ''} ${
          relativeOffset === 0 ? 'is-active' : relativeOffset < 0 ? 'is-previous' : 'is-next'
         }`}
         style={{ '--feature-offset': relativeOffset }}
        >
         <div className="feature-carousel-card-content">
          <div className="flex items-center justify-between gap-3">
           <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${feat.color}`}>
            <Icon size={26} />
           </span>
           <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#356447]">
            {feat.badge}
           </span>
          </div>
          <div className="mt-7">
           <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3E7754]">
            Feature {String(index + 1).padStart(2, '0')} / {String(landingFeatures.length).padStart(2, '0')}
           </p>
           <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {feat.title}
           </h3>
           <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            {feat.desc}
           </p>
          </div>
         </div>
        </article>
       );
      })}
     </div>
     <div className="mt-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-1.5" aria-label="Choose feature">
       {landingFeatures.map((feat, index) => (
        <button
         key={feat.title}
         type="button"
         onClick={() => setActiveFeatureIndex(index)}
         aria-label={`Show feature ${index + 1}: ${feat.title}`}
         aria-current={activeFeatureIndex === index ? 'true' : undefined}
         className={`h-1.5 rounded-full transition-all duration-300 ${
          activeFeatureIndex === index ? 'w-8 bg-[#3E7754]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
         }`}
        />
       ))}
      </div>
      <div className="flex items-center gap-2">
       <button
        type="button"
        onClick={() => setIsFeatureCarouselPaused((paused) => !paused)}
        aria-pressed={isFeatureCarouselPaused}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-[#EEF4EF]"
       >
        {isFeatureCarouselPaused ? <Play size={14} /> : <Pause size={14} />}
        <span>{isFeatureCarouselPaused ? 'Play' : 'Pause'}</span>
       </button>
       <button
        type="button"
        onClick={() => setActiveFeatureIndex((index) => (index - 1 + landingFeatures.length) % landingFeatures.length)}
        aria-label="Previous feature"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-[#EEF4EF]"
       >
        <ChevronDown size={16} className="rotate-90" />
       </button>
       <button
        type="button"
        onClick={() => setActiveFeatureIndex((index) => (index + 1) % landingFeatures.length)}
        aria-label="Next feature"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3E7754] text-white shadow-sm transition-colors hover:bg-[#2C503A]"
       >
        <ChevronDown size={16} className="-rotate-90" />
       </button>
      </div>
     </div>
    </div>
   </section>

   {/* =================================================================== */}
   {/* SECTION 5: INTERACTIVE SMART DEBT SIMPLIFIER & CUSTOM SPLIT DEMO    */}
   {/* =================================================================== */}
   <section
    id="smart-split"
    className="relative z-10 overflow-hidden border-y border-white/80 bg-white/40 px-4 py-20 sm:px-6"
   >
    <div className="mx-auto grid max-w-[1340px] items-center gap-12 lg:grid-cols-12">
     {/* Left Interactive Story */}
     <RevealOnScroll className="lg:col-span-5">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-[#326b4a] shadow-xs">
       <Sparkles size={14} className="text-emerald-500" />
       Greedy Graph Debt Simplification
      </span>

      <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl leading-[1.1]">
       Turn 12 messy IOUs into{' '}
       <span className="text-[#3E7754]">2 instant UPI transfers.</span>
      </h2>

      <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
       Sharebills continuously computes net balances across every bill, custom split, and
       partial settlement—so your flat settles the entire month with the minimum possible
       transfers.
      </p>

      {/* Interactive Equal vs Custom Split Mini-Preview */}
      <div className="mt-6 rounded-3xl border border-white/90 bg-white/85 p-4 shadow-md backdrop-blur-xl">
       <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-900">
         Try Split Mode: Dinner Bill (₹1,200)
        </span>
        <div className="flex rounded-xl bg-slate-100 p-1 text-[11px] font-bold">
         <button
          type="button"
          onClick={() => setSplitDemoMode('equal')}
          className={`rounded-lg px-2.5 py-1 transition-all ${
           splitDemoMode === 'equal'
            ? 'bg-[#3E7754] text-white shadow-2xs'
            : 'text-slate-600'
          }`}
         >
          Equal Split
         </button>
         <button
          type="button"
          onClick={() => setSplitDemoMode('custom')}
          className={`rounded-lg px-2.5 py-1 transition-all ${
           splitDemoMode === 'custom'
            ? 'bg-[#3E7754] text-white shadow-2xs'
            : 'text-slate-600'
          }`}
         >
          Custom Shares
         </button>
        </div>
       </div>

       <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {(splitDemoMode === 'equal'
         ? [
           { name: 'Taranveer', amt: '₹400.00', note: 'Equal 1/3' },
           { name: 'Sushant', amt: '₹400.00', note: 'Equal 1/3' },
           { name: 'Tanmay', amt: '₹400.00', note: 'Equal 1/3' },
          ]
         : [
           { name: 'Taranveer', amt: '₹550.00', note: 'Main + Drink' },
           { name: 'Sushant', amt: '₹650.00', note: 'Combo Meal' },
           { name: 'Tanmay', amt: '₹0.00', note: 'Excluded (Away)' },
          ]
        ).map((m) => (
         <div
          key={m.name}
          className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2.5"
         >
          <p className="text-[11px] font-bold text-slate-800">{m.name}</p>
          <p className="mt-0.5 font-mono text-sm font-extrabold text-[#3E7754]">
           {m.amt}
          </p>
          <p className="text-[9px] font-semibold text-slate-400">{m.note}</p>
         </div>
        ))}
       </div>
      </div>
     </RevealOnScroll>

     {/* Right Interactive Simplifier Comparison Card */}
     <RevealOnScroll delay={200} className="lg:col-span-7">
      <div className="rounded-[32px] border border-white/90 bg-white/85 p-6 shadow-xl backdrop-blur-2xl sm:p-8">
       <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
         <h3 className="text-lg font-extrabold text-slate-900">
          Interactive Settlement Engine
         </h3>
         <p className="text-xs text-slate-500">
          Same 14 room bills · Compare Pairwise vs. Smart Optimized
         </p>
        </div>

        <div className="flex rounded-2xl bg-slate-100 p-1">
         <button
          type="button"
          onClick={() => setSimplifyMode('smart')}
          className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all ${
           simplifyMode === 'smart'
            ? 'bg-[#3E7754] text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
          }`}
         >
          Smart Optimized (2 Transfers)
         </button>
         <button
          type="button"
          onClick={() => setSimplifyMode('raw')}
          className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all ${
           simplifyMode === 'raw'
            ? 'bg-rose-600 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
          }`}
         >
          Pairwise Raw (6 Transfers)
         </button>
        </div>
       </div>

       {simplifyMode === 'smart' ? (
        <div className="mt-5 space-y-3">
         <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs font-bold text-emerald-900">
          <span>✓ Minimized from 6 back-and-forth payments down to 2 transfers</span>
          <span className="font-mono">67% fewer txns</span>
         </div>
         {[
          {
           from: 'Tanmay Sharma',
           to: 'Taranveer Singh',
           amt: '₹2,150.00',
           upi: 'taran@okhdfcbank',
          },
          {
           from: 'Aarav Verma',
           to: 'Sushant Monga',
           amt: '₹1,300.00',
           upi: 'sushant@okicici',
          },
         ].map((item) => (
          <div
           key={item.from}
           className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
          >
           <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4EF] font-extrabold text-[#3E7754]">
             {item.from.charAt(0)}
            </span>
            <div>
             <p className="text-sm font-extrabold text-slate-900">
              {item.from} <span className="text-[#3E7754]">→</span> {item.to}
             </p>
             <p className="font-mono text-[11px] text-slate-500">
              Direct GPay UPI: {item.upi}
             </p>
            </div>
           </div>
           <div className="flex items-center gap-2.5">
            <span className="font-mono text-base font-extrabold text-emerald-600">
             {item.amt}
            </span>
            <button
             type="button"
             onClick={triggerGetStarted}
             className="rounded-xl bg-[#3E7754] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#356447]"
            >
             Pay via GPay
            </button>
           </div>
          </div>
         ))}
        </div>
       ) : (
        <div className="mt-5 space-y-2">
         <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-800">
          Unoptimized Pairwise Matrix: Roommates have to send 6 separate payments
         </div>
         <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
           'Tanmay → Taranveer: ₹1,400',
           'Taranveer → Sushant: ₹550',
           'Aarav → Taranveer: ₹1,300',
           'Tanmay → Sushant: ₹750',
           'Sushant → Aarav: ₹300',
           'Aarav → Tanmay: ₹300',
          ].map((raw) => (
           <div
            key={raw}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs font-bold text-slate-600"
           >
            {raw}
           </div>
          ))}
         </div>
        </div>
       )}
      </div>
     </RevealOnScroll>
    </div>
   </section>

   {/* =================================================================== */}
   {/* SECTION 6: HOW IT WORKS (4-STEP WORKFLOW)                           */}
   {/* =================================================================== */}
   <section id="how-it-works" className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6">
    <RevealOnScroll className="text-center">
     <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
      Zero Setup Friction
     </span>
     <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
      Get your flat sorted in under 60 seconds
     </h2>
    </RevealOnScroll>

    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
     {[
      {
       step: '01',
       icon: QrCode,
       title: 'Create Space & Scan QR',
       desc: 'Pick your room currency (INR, USD, EUR, etc.) and let flatmates join via the live camera QR scanner or 6-digit invite code.',
      },
      {
       step: '02',
       icon: Home,
       title: 'Set Monthly Rent & Bills',
       desc: 'Add monthly flat rent for automatic daily reminders, and log daily groceries, WiFi, or food orders with equal or custom splits.',
      },
      {
       step: '03',
       icon: MessageSquare,
       title: 'Chat & Resolve Disputes',
       desc: 'Discuss bills with GIFs, stickers, and media attachments—or long-press any expense to raise and resolve a dispute in chat.',
      },
      {
       step: '04',
       icon: CheckCircle2,
       title: 'Settle via GPay & Export',
       desc: 'Clear minimized dues in one tap with Google Pay / UPI deep-links and export monthly CSV or printable PDF statements anytime.',
      },
     ].map(({ step, icon: Icon, title, desc }, index) => (
      <RevealOnScroll key={step} delay={index * 100}>
       <article className="group h-full rounded-3xl border border-white/90 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#BDD2C1] hover:bg-white hover:shadow-xl">
        <div className="flex items-center justify-between">
         <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3E7754] text-white shadow-sm">
          <Icon size={18} />
         </span>
         <span className="font-mono text-xs font-extrabold text-[#3E7754]">
          STEP {step}
         </span>
        </div>
        <h3 className="mt-4 text-base font-extrabold text-slate-900">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">{desc}</p>
       </article>
      </RevealOnScroll>
     ))}
    </div>
   </section>

   {/* =================================================================== */}
   {/* SECTION 7: DOWNLOAD PWA & ANDROID NATIVE                            */}
   {/* =================================================================== */}
   <section id="download-section" className="relative z-10 mx-auto max-w-[1340px] px-4 py-10 sm:px-6">
    <RevealOnScroll className="rounded-[32px] border border-white/90 bg-gradient-to-br from-[#173F2D] via-[#23533A] to-[#14291D] p-6 text-white shadow-2xl sm:p-10">
     <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
       <img
        src={sharebillsIcon}
        alt="Sharebills App Icon"
        className="h-20 w-20 flex-shrink-0 rounded-3xl border-2 border-white/20 object-cover shadow-xl"
       />
       <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
         <ShieldCheck size={13} /> Native Android + Installable PWA
        </div>
        <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
         Install Sharebills on your Home Screen
        </h2>
        <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-white/80 sm:text-sm">
         Get instant background push notifications for bills, rent reminders, and chat
         messages—plus full-screen gesture navigation and AMOLED dark mode on Android, iOS,
         Windows, and macOS.
        </p>
       </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
       <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-6 text-xs font-extrabold text-[#173F2D] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-emerald-50 sm:text-sm"
       >
        <Download size={16} />
        <span>Install Sharebills App</span>
       </button>

       <button
        type="button"
        onClick={triggerLogin}
        className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 text-xs font-bold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:text-sm"
       >
        <span>Open Web Login</span>
       </button>
      </div>
     </div>
    </RevealOnScroll>
   </section>

   {/* =================================================================== */}
   {/* SECTION 8: DEVELOPERS (PRESERVING EXACT LINKS & CREDITS)            */}
   {/* =================================================================== */}
   <section id="developers" className="relative z-10 overflow-hidden px-4 py-16 sm:px-6">
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#BDD2C1]/25 blur-3xl" />
    <div className="relative mx-auto max-w-[1120px]">
     <RevealOnScroll className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#BDD2C1] bg-white/80 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#356447] shadow-xs">
       <Sparkles size={12} />
       The people behind the product
      </span>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
       Meet the <span className="text-[#43855F]">builders.</span>
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
       Curious minds, practical ideas, and a shared mission to make everyday shared living
       effortless and transparent.
      </p>
     </RevealOnScroll>

     <div className="mt-10 grid gap-5 md:grid-cols-2">
      {[
       {
        name: 'Taranveer Singh',
        initials: 'TS',
        links: [
         { label: 'Portfolio', href: 'https://taranveer.in', icon: Globe },
         { label: 'GitHub', href: 'https://github.com/taranveer178', icon: CodeXml },
         {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/taranveer-singh-2445871b6/',
          icon: Link,
         },
         { label: 'Email', href: 'mailto:staranveer178@gmail.com', icon: Mail },
        ],
       },
       {
        name: 'Sushant Monga',
        initials: 'SM',
        links: [
         { label: 'Portfolio', href: 'https://sushantmonga.in', icon: Globe },
         { label: 'GitHub', href: 'https://github.com/Sushantmonga87', icon: CodeXml },
         {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/sushant-monga-8a757b227/',
          icon: Link,
         },
         { label: 'Email', href: 'mailto:sushantmonga87@gmail.com', icon: Mail },
        ],
       },
      ].map((developer, idx) => (
       <RevealOnScroll key={developer.name} delay={idx * 150}>
        <article className="group relative isolate overflow-hidden rounded-[28px] border border-white/90 bg-white/80 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#9AB99F] hover:shadow-xl">
         <div className="flex items-center gap-4">
          <div className="flex h-[4.25rem] w-[4.25rem] flex-shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#63B686] to-[#326b4a] text-lg font-black tracking-tight text-white shadow-lg shadow-[#326b4a]/20 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
           {developer.initials}
          </div>
          <div className="min-w-0">
           <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#43855F]">
            {idx === 0 ? 'Lead Developer' : 'Developer'}
           </p>
           <h3 className="mt-1 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-[1.7rem]">
            {developer.name}
           </h3>
          </div>
         </div>
         <div className="mt-6 flex flex-wrap gap-2">
          {developer.links.map(({ label, href, icon: Icon }) => (
           <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
            className="group/link inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 text-xs font-bold text-slate-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#63B686] hover:bg-[#eff8f2] hover:text-[#28583c] hover:shadow-sm"
           >
            <Icon size={14} />
            {label}
            <ArrowRight
             size={12}
             className="-translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-70"
            />
           </a>
          ))}
         </div>
        </article>
       </RevealOnScroll>
      ))}
     </div>
    </div>
   </section>

   {/* =================================================================== */}
   {/* SECTION 9: EXPANDED FAQ                                             */}
   {/* =================================================================== */}
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
       <RevealOnScroll key={item.q} delay={idx * 70}>
        <div className="rounded-2xl border border-white/90 bg-white/85 p-4 shadow-xs backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-md">
         <button
          type="button"
          onClick={() => setOpenFaq(isOpen ? -1 : idx)}
          className="flex w-full items-center justify-between gap-4 text-left outline-none"
         >
          <span className="text-sm font-extrabold text-slate-900">{item.q}</span>
          <ChevronDown
           size={18}
           className={`flex-shrink-0 text-slate-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-[#3E7754]' : ''
           }`}
          />
         </button>
         {isOpen && (
          <div className="mt-2.5 border-t border-slate-200/60 pt-2.5">
           <p className="text-xs leading-relaxed text-slate-600">{item.a}</p>
          </div>
         )}
        </div>
       </RevealOnScroll>
      );
     })}
    </div>
   </section>

   {/* =================================================================== */}
   {/* SECTION 10: FOOTER                                                  */}
   {/* =================================================================== */}
   <footer className="relative z-10 border-t border-[#2F6746] bg-[#173F2D] text-white">
    <div className="mx-auto max-w-[1340px] px-4 py-10 sm:px-6 sm:py-12">
     <div className="flex flex-col gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
       <img
        src={sharebillsIcon}
        alt="Sharebills"
        className="h-10 w-10 rounded-xl object-cover shadow-xs"
       />
       <div>
        <p className="text-sm font-extrabold tracking-tight text-white">Sharebills</p>
        <p className="mt-0.5 text-xs text-white/65">
         Shared expenses, rent tracking, live disputes &amp; UPI settlements.
        </p>
       </div>
      </div>
      <nav
       aria-label="Footer navigation"
       className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/70"
      >
       <button type="button" onClick={triggerLogin} className="transition-colors hover:text-white">
        Login
       </button>
       <button
        type="button"
        onClick={triggerGetStarted}
        className="transition-colors hover:text-white"
       >
        Sign up
       </button>
       <button
        type="button"
        onClick={handleInstallClick}
        className="transition-colors hover:text-white"
       >
        Download app
       </button>
      </nav>
     </div>
     <div className="flex flex-col gap-2 pt-5 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} Sharebills. All rights reserved.</p>
      <p>Made for better shared living.</p>
     </div>
    </div>
   </footer>

   {/* =================================================================== */}
   {/* FALLBACK INTERACTIVE MODAL FOR STANDALONE PREVIEW / INSTALL         */}
   {/* =================================================================== */}
   {previewModal && (
    <div
     className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
     onClick={() => setPreviewModal(null)}
    >
     <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-[28px] border border-white/90 bg-white p-6 text-slate-900 shadow-2xl"
     >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
       <div className="flex items-center gap-2.5">
        <img src={sharebillsIcon} alt="" className="h-9 w-9 rounded-xl object-cover" />
        <div>
         <h3 className="text-base font-extrabold">
          {previewModal === 'install'
           ? 'Install Sharebills PWA'
           : previewModal === 'login'
            ? 'Sign in to Sharebills'
            : 'Create your Sharebills Account'}
         </h3>
         <p className="text-xs text-slate-500">
          {previewModal === 'install'
           ? 'Add to Home Screen for instant push alerts'
           : 'Google One-Tap or Email & Password'}
         </p>
        </div>
       </div>
       <button
        type="button"
        onClick={() => setPreviewModal(null)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
       >
        <X size={16} />
       </button>
      </div>

      {previewModal === 'install' ? (
       <div className="mt-4 space-y-3 text-xs text-slate-600">
        <div className="rounded-2xl border border-[#BDD2C1] bg-[#EEF4EF]/70 p-3.5 text-[#2C503A]">
         <p className="font-extrabold">Android / Chrome / Desktop:</p>
         <p className="mt-1">
          Tap the browser menu (⋮) or address bar icon and choose{' '}
          <strong>“Install App”</strong> or <strong>“Add to Home Screen”</strong>.
         </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
         <p className="font-extrabold text-slate-900">iOS Safari:</p>
         <p className="mt-1">
          Tap the <strong>Share</strong> button at the bottom of Safari and select{' '}
          <strong>“Add to Home Screen”</strong>.
         </p>
        </div>
       </div>
      ) : (
       <div className="mt-4 space-y-3">
        <p className="text-xs leading-relaxed text-slate-600">
         In the full app (`App.jsx`), this button opens `AuthScreen` in{' '}
         <strong>{previewModal}</strong> mode with Google Sign-In and Email authentication.
        </p>
        <div className="rounded-2xl border border-[#BDD2C1] bg-[#EEF4EF]/60 p-3 text-xs font-semibold text-[#2C503A]">
         ✓ Props wired: <code>onLogin</code>, <code>onCreateAccount</code>,{' '}
         <code>onGetStarted</code>, <code>onInstallApp</code>
        </div>
       </div>
      )}

      <button
       type="button"
       onClick={() => setPreviewModal(null)}
       className="mt-5 w-full rounded-2xl bg-[#3E7754] py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#356447]"
      >
       Got it
      </button>
     </div>
    </div>
   )}
  </div>
 );
}