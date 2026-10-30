import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pin,
  Bell,
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
  UserPlus,
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
  showcaseScreens = null,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Interactive preview states
  const [heroPhoneTab, setHeroPhoneTab] = useState('overview');
  const [heroDarkPreview, setHeroDarkPreview] = useState(false);
  const [activeHeroDisputeIndex, setActiveHeroDisputeIndex] = useState(0);
  const heroDisputePointerStart = useRef(null);
  const heroDisputeTouchStart = useRef(null);
  const heroDisputeWasSwiped = useRef(false);
  const [heroDisputeInteractionAt, setHeroDisputeInteractionAt] = useState(0);
  const [activePreviewTab, setActivePreviewTab] = useState('command');
  const [desktopDarkPreview, setDesktopDarkPreview] = useState(false);
  const [simplifyMode, setSimplifyMode] = useState('smart');
  const [splitDemoMode, setSplitDemoMode] = useState('equal');
  const [openFaq, setOpenFaq] = useState(0);
  const [previewModal, setPreviewModal] = useState(null);

  // States used inside the 6 interactive carousel screens
  const [disputeDemoStatus, setDisputeDemoStatus] = useState('open');
  const [rentDemoPaid, setRentDemoPaid] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [exportScopeDemo, setExportScopeDemo] = useState('all');
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter state for redesigned features
  const [featureCategory, setFeatureCategory] = useState('all');

  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
  };
  const sym = currencySymbols[selectedCurrency] || '₹';

  // Fast dispute rotation in Hero screen (2400ms)
  useEffect(() => {
    if (heroPhoneTab !== 'overview' || heroPreviewDisputes.length < 2) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveHeroDisputeIndex((index) => (index + 1) % heroPreviewDisputes.length);
    }, 2400);
    return () => window.clearInterval(intervalId);
  }, [heroPhoneTab, heroDisputeInteractionAt]);

  const navigateHeroDisputeBySwipe = (startX, startY, endX, endY) => {
    const deltaX = startX - endX;
    const deltaY = startY - endY;
    if (Math.abs(deltaX) < 36 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    heroDisputeWasSwiped.current = true;
    setHeroDisputeInteractionAt(Date.now());
    setActiveHeroDisputeIndex((index) =>
      (index + (deltaX > 0 ? 1 : -1) + heroPreviewDisputes.length) % heroPreviewDisputes.length
    );
    window.setTimeout(() => {
      heroDisputeWasSwiped.current = false;
    }, 500);
  };

  const handleHeroDisputeTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    heroDisputeTouchStart.current = { x: touch.clientX, y: touch.clientY };
    heroDisputeWasSwiped.current = false;
  };

  const handleHeroDisputeTouchEnd = (event) => {
    const start = heroDisputeTouchStart.current;
    const touch = event.changedTouches[0];
    heroDisputeTouchStart.current = null;
    if (!start || !touch) return;
    navigateHeroDisputeBySwipe(start.x, start.y, touch.clientX, touch.clientY);
  };

  const handleHeroDisputePointerDown = (event) => {
    if (event.pointerType === 'touch' || event.pointerType === 'mouse') return;
    heroDisputePointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    heroDisputeWasSwiped.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleHeroDisputePointerUp = (event) => {
    if (event.pointerType === 'mouse') return;
    const start = heroDisputePointerStart.current;
    heroDisputePointerStart.current = null;
    if (!start || start.pointerId !== event.pointerId) return;
    navigateHeroDisputeBySwipe(start.x, start.y, event.clientX, event.clientY);
  };

  const handleHeroDisputeMouseDown = (event) => {
    if (event.button !== 0) return;
    heroDisputePointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: null,
    };
    heroDisputeWasSwiped.current = false;
  };

  const handleHeroDisputeMouseUp = (event) => {
    const start = heroDisputePointerStart.current;
    heroDisputePointerStart.current = null;
    if (!start || start.pointerId !== null) return;
    navigateHeroDisputeBySwipe(start.x, start.y, event.clientX, event.clientY);
  };

  // ===================================================================
  // 3D CIRCULAR CAROUSEL STATES & HANDLERS (2600ms ROTATION)
  // ===================================================================
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopyDemoCode = () => {
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText('FLT402');
      }
    } catch {
      // Fallback
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const mobileSlides = [
    {
      id: 'disputes',
      tag: '1. In-Chat Expense Disputes',
      title: 'Flag & Fix Wrong Bills Without Friction',
      shortTitle: 'Disputes',
      desc: 'Long-press any bill to raise a dispute with a note. Sharebills posts an interactive card in room chat so the payer can edit or solve it.',
      icon: AlertTriangle,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      customImage: showcaseScreens?.[0] || null,
      renderScreen: () => (
        <div className="rounded-[24px] bg-[#F3F7F3] p-3.5 space-y-2.5 text-left">
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
      ),
    },
    {
      id: 'rent',
      tag: '2. Monthly Flat Rent Tracker',
      title: 'Dedicated Monthly Rent Ledger',
      shortTitle: 'Rent Tracker',
      desc: 'Splits flat rent down to the exact cent across members, tracks individual Paid vs. Unpaid status, and sends automated daily reminders.',
      icon: Home,
      badgeColor: 'bg-[#EEF4EF] text-[#356447] border-[#BDD2C1]',
      customImage: showcaseScreens?.[1] || null,
      renderScreen: () => (
        <div className="rounded-[24px] bg-white p-3.5 space-y-2.5 text-left">
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
      ),
    },
    {
      id: 'chat',
      tag: '3. Rich Media, GIF & Reply Chat',
      title: 'WhatsApp-Grade Chat Inside Every Room',
      shortTitle: 'Rich Chat',
      desc: 'Reply to messages, react with emojis, share GIFs, stickers, photos, videos, and PDFs, and preview links right next to the ledger.',
      icon: MessageSquare,
      badgeColor: 'bg-[#EEF4EF] text-[#356447] border-[#BDD2C1]',
      customImage: showcaseScreens?.[2] || null,
      renderScreen: () => (
        <div className="rounded-[24px] bg-[#F3F7F3] p-3.5 space-y-2 text-left">
          <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-white bg-white/95 px-3 py-1 text-xs shadow-md">
            {['❤️', '👍', '😂', '😮', '😢', '🙏'].map((emoji) => (
              <span key={emoji} className="cursor-pointer transition-transform hover:scale-125">
                {emoji}
              </span>
            ))}
          </div>

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

          <div className="ml-auto max-w-[86%] rounded-2xl bg-[#3E7754] p-2.5 text-[10px] text-white shadow-xs">
            <div className="mb-1 rounded border-l-2 border-white bg-white/15 px-2 py-0.5 text-[9px]">
              <span className="font-bold">Sushant:</span> Booked our riverside camp!
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>Awesome! Uploading petrol receipt PDF 🧾</span>
              <CheckCheck size={12} className="text-emerald-200" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-600">
            <span>😊 Emoji</span>
            <span className="rounded bg-[#EEF4EF] px-1.5 py-0.5 text-[#3E7754]">
              GIPHY GIFs
            </span>
            <span>🐼 Stickers</span>
            <span>📎 Media</span>
          </div>
        </div>
      ),
    },
    {
      id: 'payments',
      tag: '4. 1-Tap GPay UPI & Breakdown',
      title: 'Deep-Linked Google Pay & UPI Intents',
      shortTitle: 'GPay & UPI',
      desc: 'Launch Google Pay or UPI apps with your flatmate’s VPA and exact settlement amount pre-filled, or record custom partial payments.',
      icon: Zap,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      customImage: showcaseScreens?.[3] || null,
      renderScreen: () => (
        <div className="rounded-[24px] bg-[#F3F7F3] p-3.5 space-y-2.5 text-left">
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

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-2.5">
            <p className="text-[10px] font-extrabold text-emerald-950">
              Custom Quick Pay &amp; Confirmations
            </p>
            <p className="mt-0.5 text-[9px] text-emerald-800">
              Record partial payments or confirm received settlements with instant push alerts.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'spaces',
      tag: '5. Camera QR Scan & 6 Currencies',
      title: 'Instant QR Onboarding & Global Currencies',
      shortTitle: 'QR & Currencies',
      desc: 'Point your camera at a room QR code or share 6-character codes. Set spaces in INR (₹), USD ($), EUR (€), GBP (£), CAD, or AUD.',
      icon: QrCode,
      badgeColor: 'bg-[#EEF4EF] text-[#356447] border-[#BDD2C1]',
      customImage: showcaseScreens?.[4] || null,
      renderScreen: () => (
        <div className="rounded-[24px] bg-white p-3.5 space-y-2.5 text-left">
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

          <div className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-950 p-3.5 text-white">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 bg-white/10">
              <ScanLine size={34} className="text-emerald-400 animate-pulse" />
            </div>
            <p className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-emerald-300">
              <Camera size={11} /> Point camera at roommate’s QR code
            </p>
          </div>

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
      ),
    },
    {
      id: 'exports',
      tag: '6. CSV & Printable PDF Exports',
      title: 'One-Click CSV & PDF Ledger Statements',
      shortTitle: 'Exports',
      desc: 'Download clean, audit-ready spreadsheets or printable PDF statements filtered by payer, settlement type, and date window.',
      icon: FileDown,
      badgeColor: 'bg-[#EEF4EF] text-[#356447] border-[#BDD2C1]',
      customImage: showcaseScreens?.[5] || null,
      renderScreen: () => (
        <div className="rounded-[24px] bg-white p-3.5 space-y-2.5 text-left">
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
      ),
    },
  ];

  const handleNextCarousel = useCallback(() => {
    setActiveCarouselIndex((prev) => (prev + 1) % mobileSlides.length);
  }, [mobileSlides.length]);

  const handlePrevCarousel = useCallback(() => {
    setActiveCarouselIndex((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length);
  }, [mobileSlides.length]);

  // Faster 2600ms slide transition
  useEffect(() => {
    if (isCarouselHovered) return undefined;
    const interval = setInterval(() => {
      handleNextCarousel();
    }, 2600);
    return () => clearInterval(interval);
  }, [isCarouselHovered, handleNextCarousel]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handleNextCarousel();
      } else {
        handlePrevCarousel();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevCarousel();
      if (e.key === 'ArrowRight') handleNextCarousel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevCarousel, handleNextCarousel]);

  const getSlideStyle = (index) => {
    const total = mobileSlides.length;
    let diff = (((index - activeCarouselIndex) % total) + total) % total;
    if (diff > total / 2) diff -= total;

    const absDiff = Math.abs(diff);

    const spacing = isMobile ? 135 : 240;
    const depth = isMobile ? 110 : 160;
    const angle = isMobile ? 22 : 28;

    const translateX = diff * spacing;
    const translateZ = -absDiff * depth - (absDiff > 1 ? 55 : 0);
    const rotateY = -diff * angle;
    const scale = Math.max(0.72, 1 - absDiff * 0.12);
    const opacity = absDiff > 2 ? 0 : Math.max(0, 1 - absDiff * 0.28);
    const zIndex = 30 - absDiff * 10;
    const pointerEvents = absDiff > 1 ? 'none' : 'auto';

    return {
      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex,
      opacity,
      pointerEvents,
    };
  };

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
    {
      category: 'rent-disputes',
      icon: AlertTriangle,
      badge: 'FIRST IN CLASS',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      title: 'In-Chat Expense Disputes',
      desc: 'Long-press any bill to flag discrepancies. Post interactive dispute cards right in group chat so payers can edit shares or mark it resolved in 1 tap.',
    },
    {
      category: 'rent-disputes',
      icon: Home,
      badge: 'AUTOMATED',
      color: 'bg-[#EEF4EF] text-[#3E7754] border-[#BDD2C1]',
      title: 'Monthly Flat Rent Tracker',
      desc: 'A dedicated ledger for monthly flat rent with automated daily reminders and transparent Paid vs. Unpaid badges for all flatmates.',
    },
    {
      category: 'chat-media',
      icon: MessageSquare,
      badge: 'UPGRADED',
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      title: 'Room Chat with Rich Media',
      desc: 'Discuss bills with threaded replies, emoji reactions, GIPHY GIFs, stickers, receipt photos, and document previews alongside the ledger.',
    },
    {
      category: 'core-splits',
      icon: Zap,
      badge: 'INDIA FIRST',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      title: '1-Tap GPay & UPI Payments',
      desc: 'Pre-filled UPI links launch Google Pay, PhonePe, or Paytm with the receiver’s UPI ID and exact rupee amount ready for instant settlement.',
    },
    {
      category: 'core-splits',
      icon: SlidersHorizontal,
      badge: 'FLEXIBLE',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      title: 'Equal & Custom Splits',
      desc: 'Split bills equally, exclude roommates who were out of town, or assign exact amounts and shares to individual room members.',
    },
    {
      category: 'global-exports',
      icon: QrCode,
      badge: 'INSTANT JOIN',
      color: 'bg-[#EEF4EF] text-[#356447] border-[#BDD2C1]',
      title: 'Camera QR Scan & 6-Char Code',
      desc: 'Onboard flatmates in 2 seconds with the built-in live camera QR scanner, downloadable QR card, or 6-digit space invite code.',
    },
    {
      category: 'global-exports',
      icon: FileDown,
      badge: 'AUDIT READY',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      title: 'CSV & Printable PDF Exports',
      desc: 'Download clean, printable statements or CSV spreadsheets filtered by payer, settlement type, and customizable date windows.',
    },
    {
      category: 'global-exports',
      icon: Globe,
      badge: 'MULTI-CURRENCY',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Six Global Currencies',
      desc: 'Configure spaces in INR (₹), USD ($), EUR (€), GBP (£), CAD (CA$), or AUD (A$) for home spaces or international vacations.',
    },
    {
      category: 'core-splits',
      icon: PieChart,
      badge: 'ANALYTICS',
      color: 'bg-[#EEF4EF] text-[#3E7754] border-[#BDD2C1]',
      title: 'Monthly Spending Breakdown',
      desc: 'Visual segment bars and category drilldowns comparing what you owe vs. what you paid across rent, food, groceries, and travel.',
    },
    {
      category: 'chat-media',
      icon: Layers,
      badge: 'ORGANIZATION',
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      title: 'Pin, Mute & Archive Spaces',
      desc: 'Keep active flats pinned at the top, mute noisy notification chatter, and archive finished trips without losing transaction history.',
    },
    {
      category: 'chat-media',
      icon: Moon,
      badge: 'MODERN UI',
      color: 'bg-slate-900 text-amber-300 border-slate-700',
      title: 'Liquid Glass & AMOLED Dark',
      desc: 'Seamlessly switch between an airy frosted liquid glass theme and true pitch-black AMOLED dark mode tailored for OLED mobile screens.',
    },
    {
      category: 'global-exports',
      icon: Smartphone,
      badge: 'CROSS-PLATFORM',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      title: 'Installable PWA & Push Alerts',
      desc: 'Install directly on iOS, Android, and Desktop with background Firebase push notifications and Google One-Tap sign in.',
    },
  ];

  const filteredFeatures =
    featureCategory === 'all'
      ? landingFeatures
      : landingFeatures.filter((f) => f.category === featureCategory);

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
                  ShareBills
                </span>
                <span className="rounded-full bg-[#EEF4EF] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#3E7754] border border-[#BDD2C1]">
                  v2.5
                </span>
              </div>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-[#3E7754]">
                Shared Ledger
              </span>
            </div>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {[
              { label: 'Mobile App', id: 'mobile-showcase' },
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
                { label: 'Mobile App', id: 'mobile-showcase' },
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
      {/* SECTION 1: HERO + SLIM IPHONE BEZEL WITH VISIBLE DYNAMIC ISLAND      */}
      {/* =================================================================== */}
      <section id="top" className="relative z-10 mx-auto max-w-[1340px] px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
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

          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <RevealOnScroll delay={300} className="relative w-full max-w-[370px]">
              {/* Screen Tab & Theme Switcher Bar */}
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

              {/* SLIM IPHONE FRAME (Accurate 4px border + Dynamic Island inside Screen) */}
              <div className="relative mx-auto rounded-[50px] border-[4px] border-slate-800/90 bg-slate-950 p-[6px] shadow-[0_25px_60px_-15px_rgba(20,41,29,0.35)] ring-1 ring-white/20 transition-all duration-300">
                {/* Screen Viewport */}
                <div
                  className={`hero-phone-screen relative flex h-[580px] flex-col gap-2.5 overflow-hidden rounded-[42px] px-3 pb-2.5 pt-2 transition-colors duration-300 ${
                    heroDarkPreview ? 'bg-black text-white' : 'bg-[#F4F7F3] text-slate-900'
                  }`}
                >
                  {/* Dynamic Island Inside Viewport */}
                  <div className="relative z-30 mx-auto flex h-[26px] w-[110px] items-center justify-between rounded-full bg-black px-2 shadow-sm ring-1 ring-white/10">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-900/80 ring-1 ring-slate-800/60" />
                    <div className="h-2 w-2 rounded-full bg-[#1c2c22]/90 ring-1 ring-emerald-500/30" />
                  </div>

                  {/* Header Bar */}
                  <div className="flex items-center justify-between gap-2 px-1 pt-1">
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

                  {heroPhoneTab === 'overview' && (
                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
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

                      {/* Rotating Mini Dispute (2400ms) */}
                      <div
                        onTouchStart={handleHeroDisputeTouchStart}
                        onTouchEnd={handleHeroDisputeTouchEnd}
                        onTouchCancel={() => {
                          heroDisputeTouchStart.current = null;
                        }}
                        onPointerDown={handleHeroDisputePointerDown}
                        onPointerUp={handleHeroDisputePointerUp}
                        onPointerCancel={() => {
                          heroDisputePointerStart.current = null;
                        }}
                        onMouseDown={handleHeroDisputeMouseDown}
                        onMouseUp={handleHeroDisputeMouseUp}
                        className={`overflow-hidden rounded-2xl border touch-pan-y select-none ${
                          heroDarkPreview
                            ? 'border-amber-500/40 bg-amber-950/30'
                            : 'border-amber-200 bg-amber-50/90'
                        }`}
                      >
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{ transform: `translateX(-${activeHeroDisputeIndex * 100}%)` }}
                        >
                          {heroPreviewDisputes.map((dispute) => (
                            <button
                              key={dispute.title}
                              type="button"
                              onClick={() => {
                                if (heroDisputeWasSwiped.current) {
                                  heroDisputeWasSwiped.current = false;
                                  return;
                                }
                                setHeroPhoneTab('chat');
                              }}
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

                      <div className="space-y-1.5">
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
                            net: 'Settled',
                            positive: null,
                            unread: 1,
                            pinned: false,
                          },
                        ].map((space) => (
                          <div
                            key={space.name}
                            className={`flex items-center justify-between rounded-2xl border px-3 py-2 shadow-xs ${
                              heroDarkPreview
                                ? 'border-white/15 bg-zinc-900/90'
                                : 'border-white/90 bg-white/90'
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#3E7754] text-xs font-bold text-white">
                                {space.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <p className="truncate text-[11px] font-bold">{space.name}</p>
                                  {space.pinned && <Pin size={9} className="text-[#3E7754]" />}
                                </div>
                                <p className="text-[9px] text-slate-400">{space.members}</p>
                              </div>
                            </div>
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
                        ))}
                      </div>
                    </div>
                  )}

                  {heroPhoneTab === 'chat' && (
                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                      <div
                        className={`flex items-center justify-between rounded-2xl border px-3 py-2 ${
                          heroDarkPreview ? 'border-white/15 bg-zinc-900' : 'border-white bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3E7754] text-[11px] font-bold text-white">
                            F
                          </span>
                          <div>
                            <p className="text-[11px] font-extrabold">Flat 402 · Mohali</p>
                            <p className="text-[9px] font-semibold text-emerald-500">
                              4 roommates online
                            </p>
                          </div>
                        </div>
                        <span className="rounded-lg bg-[#EEF4EF] px-2 py-0.5 text-[9px] font-bold text-[#3E7754]">
                          Live Chat
                        </span>
                      </div>

                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-2.5 text-slate-900 shadow-xs">
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-900">
                          <span className="flex items-center gap-1">
                            <AlertTriangle size={12} /> Expense dispute
                          </span>
                          <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[8px] uppercase">
                            Open
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] font-extrabold">WiFi + Fiber Bill · ₹1,800.00</p>
                        <p className="mt-1 rounded-lg bg-white/85 px-2 py-1 text-[10px] text-slate-700">
                          “I was in Delhi for 2 weeks, please adjust my share to ₹250.”
                        </p>
                      </div>

                      <div className="ml-auto max-w-[82%] rounded-2xl bg-[#3E7754] p-2.5 text-[10px] text-white shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span>Confirmed! Updated the WiFi split too.</span>
                          <CheckCheck size={12} className="text-emerald-200 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  )}

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
                      </div>
                    </div>
                  )}

                  {/* Bottom Navigation */}
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

                <div className="mx-auto mt-1 h-1 w-24 rounded-full bg-slate-500/40" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 2: 3D CIRCULAR CAROUSEL (FASTER 2600ms SLIDE SPEED)         */}
      {/* =================================================================== */}
      <section
        id="mobile-showcase"
        className="relative z-10 mx-auto max-w-[1360px] px-4 py-16 sm:px-6 overflow-hidden"
      >
        <RevealOnScroll className="text-center">
          <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF]/80 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
            Mobile-First Experience
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Designed like a native iOS & Android app
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            Swipe or explore the 3D mobile suite—from in-chat dispute resolution and monthly flat rent tracking
            to camera QR scanning, GPay deep-links, and audit-ready CSV/PDF statements.
          </p>
        </RevealOnScroll>

        {/* 3D PERSPECTIVE CAROUSEL STAGE */}
        <div
          className="relative mt-8 sm:mt-12 w-full select-none"
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Nav Buttons */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-40 -translate-y-1/2 flex items-center justify-between px-2 sm:px-6">
            <button
              type="button"
              onClick={handlePrevCarousel}
              aria-label="Previous Screen"
              className="pointer-events-auto flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-white/90 bg-white/85 text-slate-800 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#3E7754] active:scale-95"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={handleNextCarousel}
              aria-label="Next Screen"
              className="pointer-events-auto flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-white/90 bg-white/85 text-slate-800 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#3E7754] active:scale-95"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* 3D Preserved Perspective Container */}
          <div
            className="relative mx-auto h-[550px] sm:h-[620px] w-full max-w-[1100px]"
            style={{ perspective: '1300px' }}
            onClick={(event) => {
              if (window.innerWidth < 640 || event.target.closest('[data-carousel-slide], button')) return;
              const { left, right, width } = event.currentTarget.getBoundingClientRect();
              const sideWidth = Math.max(0, (width - 310) / 2);
              if (event.clientX < left + sideWidth) handlePrevCarousel();
              if (event.clientX > right - sideWidth) handleNextCarousel();
            }}
          >
            <div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {mobileSlides.map((slide, index) => {
                const style = getSlideStyle(index);
                const isActive = index === activeCarouselIndex;
                const Icon = slide.icon;

                return (
                  <div
                    key={slide.id}
                    data-carousel-slide={slide.id}
                    onClick={() => setActiveCarouselIndex(index)}
                    style={style}
                    className="absolute left-1/2 top-1/2 w-[280px] sm:w-[310px] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  >
                    {/* Floating Screen Header Pill */}
                    <div
                      className={`mx-auto mb-2.5 flex w-max items-center gap-1.5 rounded-full border px-3 py-1 shadow-md transition-all duration-500 ${
                        isActive
                          ? 'border-[#9AB99F] bg-white text-[#3E7754] scale-105'
                          : 'border-white/80 bg-white/70 text-slate-600 scale-95'
                      }`}
                    >
                      <Icon size={12} className={isActive ? 'text-[#3E7754]' : 'text-slate-400'} />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        {slide.tag}
                      </span>
                    </div>

                    {/* Hardware Bezel & Mockup Glass Shell */}
                    <div
                      className={`group relative overflow-hidden rounded-[44px] border-[9px] border-slate-900 bg-[#F3F7F3] p-2.5 transition-all duration-500 ${
                        isActive
                          ? 'shadow-[0_25px_60px_-15px_rgba(20,41,29,0.35)] ring-4 ring-[#63B686]/30'
                          : 'shadow-xl hover:shadow-2xl'
                      }`}
                    >
                      <div className="mx-auto mb-2 h-4 w-20 rounded-full bg-slate-900" />

                      <div className="relative min-h-[420px] sm:min-h-[460px] overflow-hidden rounded-[32px] bg-[#F3F7F3]">
                        {slide.customImage ? (
                          <img
                            src={slide.customImage}
                            alt={slide.title}
                            className="h-full w-full object-cover rounded-[32px]"
                          />
                        ) : (
                          slide.renderScreen()
                        )}

                        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-tr from-white/0 via-white/5 to-white/30" />
                      </div>

                      <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-slate-300" />

                      {!isActive && (
                        <div className="pointer-events-none absolute inset-0 rounded-[35px] bg-slate-900/10 backdrop-blur-[0.5px] transition-opacity duration-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Screen Summary Text */}
          <div className="mx-auto mt-6 max-w-xl text-center px-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${
                mobileSlides[activeCarouselIndex].badgeColor
              }`}
            >
              <Sparkles size={12} />
              {mobileSlides[activeCarouselIndex].tag}
            </span>
            <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 transition-all">
              {mobileSlides[activeCarouselIndex].title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 transition-all">
              {mobileSlides[activeCarouselIndex].desc}
            </p>
          </div>

          {/* Navigation Indicator Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 px-3">
            {mobileSlides.map((slide, idx) => {
              const isCurrent = idx === activeCarouselIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveCarouselIndex(idx)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-b from-[#3E7754] to-[#3E7754] text-white shadow-md shadow-[#3E7754]/25 scale-105'
                      : 'border border-white/80 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isCurrent ? 'bg-white animate-pulse' : 'bg-slate-300'
                    }`}
                  />
                  <span>{slide.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: DESKTOP COMMAND CENTER */}
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
          delay={150}
          className="mt-7 hidden overflow-hidden rounded-[32px] border border-white/90 bg-white/60 shadow-2xl shadow-[#14291D]/10 backdrop-blur-2xl xl:block"
        >
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

          <div
            className={`grid grid-cols-1 lg:grid-cols-12 transition-colors duration-300 ${
              desktopDarkPreview ? 'bg-black text-white' : 'bg-[#F3F7F3] text-slate-900'
            }`}
          >
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

            <div className="p-4 sm:p-6 lg:col-span-9 xl:col-span-10">
              <div
                className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl border p-4 shadow-sm ${
                  desktopDarkPreview
                    ? 'border-white/15 bg-zinc-900/90'
                    : 'border-white/90 bg-white/85'
                }`}
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#3E7754]">
                    Command Center · Oct 2026
                  </p>
                  <h3 className="text-lg font-extrabold sm:text-xl">
                    Good Evening, Taranveer
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
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
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* =================================================================== */}
      {/* SECTION 4: REDESIGNED BENTO SHOWCASE GRID                           */}
      {/* =================================================================== */}
      <section id="features" className="relative z-10 mx-auto max-w-[1340px] px-4 py-20 sm:px-6">
        <RevealOnScroll className="text-center">
          <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3E7754]">
            Comprehensive Suite
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Everything we built for effortless shared living
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            A unified financial ecosystem built from the ground up for flatmates, trips, and hostels—cutting out spreadsheets, circular payments, and awkward bill reminders.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All 12 Features' },
              { id: 'rent-disputes', label: 'Rent & Disputes' },
              { id: 'core-splits', label: 'UPI & Smart Splits' },
              { id: 'chat-media', label: 'Chat & Visuals' },
              { id: 'global-exports', label: 'Global & Exports' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFeatureCategory(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all duration-200 ${
                  featureCategory === tab.id
                    ? 'bg-[#3E7754] text-white shadow-md shadow-[#3E7754]/25 scale-105'
                    : 'border border-white/90 bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Bento Grid Layout */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(featureCategory === 'all' || featureCategory === 'rent-disputes') && (
            <RevealOnScroll
              delay={50}
              className="lg:col-span-2 group relative overflow-hidden rounded-[32px] border border-white/90 bg-gradient-to-br from-white via-white/95 to-amber-50/50 p-7 shadow-lg shadow-[#14291D]/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className="flex flex-col justify-between h-full gap-6 sm:flex-row">
                <div className="max-w-md">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600 shadow-sm">
                      <AlertTriangle size={22} />
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                      Flagship Feature
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    In-Chat Expense Disputes
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Never argue about wrong splits or unfair additions again. Long-press any bill to flag it with a reason. An interactive dispute widget automatically posts to your room chat so the payer can adjust portions or mark it solved.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="rounded-xl border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                      ⚡ Instant Push Alerts
                    </span>
                    <span className="rounded-xl border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                      💬 Group Chat Threaded
                    </span>
                    <span className="rounded-xl border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                      ✏️ 1-Click Payer Edit
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-[260px] flex-shrink-0 self-center rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-900">
                      <AlertTriangle size={12} /> Dispute Flagged
                    </span>
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[8px] font-bold uppercase text-amber-950">
                      Open
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-black text-slate-900">
                    Blinkit Essentials · ₹1,240
                  </p>
                  <p className="mt-1 text-[10px] text-slate-600 rounded-lg bg-white/80 p-1.5">
                    “Detergent was only for room 2.”
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    <span className="flex-1 text-center rounded-lg bg-amber-700 py-1 text-[9px] font-bold text-white shadow-2xs">
                      Update Bill
                    </span>
                    <span className="flex-1 text-center rounded-lg bg-emerald-600 py-1 text-[9px] font-bold text-white shadow-2xs">
                      Solve
                    </span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          )}

          {(featureCategory === 'all' || featureCategory === 'rent-disputes') && (
            <RevealOnScroll
              delay={100}
              className="group relative overflow-hidden rounded-[32px] border border-white/90 bg-gradient-to-br from-white via-white/95 to-emerald-50/40 p-7 shadow-lg shadow-[#14291D]/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#BDD2C1] bg-[#EEF4EF] text-[#3E7754] shadow-sm">
                  <Home size={22} />
                </span>
                <span className="rounded-full border border-[#BDD2C1] bg-[#EEF4EF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#356447]">
                  Automated
                </span>
              </div>
              <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900">
                Monthly Flat Rent Tracker
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Dedicated monthly rent ledger splitting total flat rent down to exact rupees across all flatmates with live paid timestamps and auto reminders.
              </p>
              <div className="mt-5 rounded-2xl border border-slate-100 bg-[#F3F7F3] p-3 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Oct 2026 Rent</span>
                  <span className="font-mono text-[#3E7754]">₹24,000</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>3 of 4 Flatmates Settled</span>
                  <span className="font-bold text-emerald-600">75% Paid</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[75%] bg-[#3E7754]" />
                </div>
              </div>
            </RevealOnScroll>
          )}

          {filteredFeatures
            .filter((f) => f.title !== 'In-Chat Expense Disputes' && f.title !== 'Monthly Flat Rent Tracker')
            .map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <RevealOnScroll key={feat.title} delay={idx * 60}>
                  <div className="group h-full rounded-[30px] border border-white/90 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:border-[#BDD2C1] hover:shadow-xl hover:shadow-[#3E7754]/10">
                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feat.color}`}
                      >
                        <Icon size={22} />
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-extrabold text-slate-900 transition-colors group-hover:text-[#3E7754]">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {feat.desc}
                    </p>
                  </div>
                </RevealOnScroll>
              );
            })}
        </div>
      </section>

      {/* SECTION 5: SMART DEBT SIMPLIFIER & SPLIT DEMO */}
      <section
        id="smart-split"
        className="relative z-10 overflow-hidden border-y border-white/80 bg-white/40 px-4 py-20 sm:px-6"
      >
        <div className="mx-auto grid max-w-[1340px] items-center gap-12 lg:grid-cols-12">
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

      {/* SECTION 6: HOW IT WORKS */}
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

      {/* SECTION 7: DOWNLOAD PWA */}
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

      {/* SECTION 8: DEVELOPERS */}
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

      {/* SECTION 10: FOOTER */}
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

      {/* FALLBACK MODAL */}
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