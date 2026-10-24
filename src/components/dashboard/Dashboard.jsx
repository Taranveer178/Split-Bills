import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  UserPlus,
  Users,
  Download,
  ChevronRight,
  Archive,
  ArchiveRestore,
  Pin,
  PinOff,
  Bell,
  BellOff,
  Search,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  PieChart,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  X,
  IndianRupee,
  MessageSquare,
} from 'lucide-react';
import roomsplitIcon from '../../assets/roomsplit-icon.webp';
import PrimaryNav from '../common/PrimaryNav';
import ActivityTab from './ActivityTab';
import MonthlyAnalyticsTab from './MonthlyAnalyticsTab';
import ProfileTabView from './ProfileTab';
import DesktopSpacesTab from './DesktopSpacesTab';
import { calculateSettlements } from '../../utils/settlement';
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';

export default function Dashboard({
  user,
  users = [],
  groups,
  notifications = [],
  expenses = [],
  onLogout,
  onOpenGroup,
  onCreateGroup,
  onJoinGroup,
  onSaveExpense,
  onSendNotification,
  onUpdateUser,
  onMarkNotificationsRead,
  onClearNotifications,
  onTabChange,
  initialTab = 'groups',
  showToast,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [spaceFilter, setSpaceFilter] = useState('active'); // 'active' | 'pinned' | 'archived'
  const [searchQuery, setSearchQuery] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState('all'); // 'all' | 'mine' | 'settlements'
  const [mobileSection, setMobileSection] = useState('spaces'); // 'spaces' | 'dues' | 'recent'
  const [showAllMobileSpaces, setShowAllMobileSpaces] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Quick Expense Modal State
  const [quickExpenseOpen, setQuickExpenseOpen] = useState(false);
  const [quickGroupId, setQuickGroupId] = useState('');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState('Food');
  const [quickMethod, setQuickMethod] = useState('UPI');
  const [savingQuick, setSavingQuick] = useState(false);

  const pinnedGroupIds = user?.pinnedGroupIds || [];
  const archivedGroupIds = user?.archivedGroupIds || [];
  const mutedGroupIds = user?.mutedGroupIds || [];

  const getUserName = (userId) => {
    if (userId === user?.id) return 'You';
    return users.find((u) => u.id === userId)?.username || 'Roommate';
  };

  const myGroups = useMemo(
    () => groups.filter((group) => group.members && group.members.includes(user.id)),
    [groups, user.id]
  );

  const groupMetrics = useMemo(() => {
    const map = {};
    let totalNetBalance = 0;
    let totalOwedToYou = 0;
    let totalYouOwe = 0;
    const allMySettlements = [];

    myGroups.forEach((group) => {
      const grpExpenses = expenses.filter((e) => e.groupId === group.id);
      const nonSettlements = grpExpenses.filter(
        (e) => !e.isSettlement && e.category !== 'Settlement'
      );
      const roomSpend = nonSettlements.reduce(
        (sum, e) => sum + (parseFloat(e.totalAmount) || 0),
        0
      );
      const { balances, settlements } = calculateSettlements(grpExpenses, group.members || []);
      const myNet = balances[user.id] || 0;

      if (!archivedGroupIds.includes(group.id)) {
        totalNetBalance += myNet;
        if (myNet > 0.01) totalOwedToYou += myNet;
        if (myNet < -0.01) totalYouOwe += Math.abs(myNet);
      }

      settlements.forEach((s) => {
        if (s.from === user.id || s.to === user.id) {
          allMySettlements.push({
            ...s,
            groupId: group.id,
            groupName: group.name,
          });
        }
      });

      const latestExpense = grpExpenses
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
        )[0];

      map[group.id] = {
        myNet,
        roomSpend,
        billCount: nonSettlements.length,
        latestExpense,
        settlements,
      };
    });

    return {
      byGroup: map,
      totalNetBalance: Math.round(totalNetBalance * 100) / 100,
      totalOwedToYou: Math.round(totalOwedToYou * 100) / 100,
      totalYouOwe: Math.round(totalYouOwe * 100) / 100,
      allMySettlements,
    };
  }, [myGroups, expenses, user.id, archivedGroupIds]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const myGroupIds = new Set(myGroups.map((g) => g.id));
    const monthExpenses = expenses.filter(
      (e) =>
        myGroupIds.has(e.groupId) &&
        !e.isSettlement &&
        e.category !== 'Settlement' &&
        (e.date?.startsWith(monthPrefix) || !e.date)
    );

    let myShare = 0;
    let iPaid = 0;
    const byCat = {};

    monthExpenses.forEach((e) => {
      const total = parseFloat(e.totalAmount) || 0;
      if (e.paidBy === user.id) iPaid += total;
      const share = parseFloat(e.splits?.[user.id]) || 0;
      if (share > 0) {
        myShare += share;
        const cat = e.category || 'Other';
        byCat[cat] = (byCat[cat] || 0) + share;
      }
    });

    const categories = Object.entries(byCat)
      .map(([name, amount]) => ({
        name,
        amount,
        pct: myShare > 0 ? Math.round((amount / myShare) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      monthLabel: now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      myShare,
      iPaid,
      billCount: monthExpenses.length,
      categories,
    };
  }, [expenses, myGroups, user.id]);

  const activeGroups = useMemo(
    () =>
      myGroups
        .filter((group) => !archivedGroupIds.includes(group.id))
        .sort(
          (first, second) =>
            Number(pinnedGroupIds.includes(second.id)) -
            Number(pinnedGroupIds.includes(first.id))
        ),
    [myGroups, archivedGroupIds, pinnedGroupIds]
  );

  const archivedGroups = useMemo(
    () => myGroups.filter((group) => archivedGroupIds.includes(group.id)),
    [myGroups, archivedGroupIds]
  );

  const pinnedGroups = useMemo(
    () => activeGroups.filter((group) => pinnedGroupIds.includes(group.id)),
    [activeGroups, pinnedGroupIds]
  );

  const visibleGroups = useMemo(() => {
    const base =
      spaceFilter === 'archived'
        ? archivedGroups
        : spaceFilter === 'pinned'
          ? pinnedGroups
          : activeGroups;
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (g) =>
        g.name?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q) ||
        g.inviteCode?.toLowerCase().includes(q)
    );
  }, [spaceFilter, archivedGroups, pinnedGroups, activeGroups, searchQuery]);

  const recentTransactions = useMemo(() => {
    const myGroupIds = new Set(myGroups.map((g) => g.id));
    let list = expenses
      .filter((e) => myGroupIds.has(e.groupId))
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
      );

    if (ledgerFilter === 'mine') {
      list = list.filter((e) => e.paidBy === user.id);
    } else if (ledgerFilter === 'settlements') {
      list = list.filter((e) => e.isSettlement || e.category === 'Settlement');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q)
      );
    }

    return list.slice(0, 8);
  }, [expenses, myGroups, ledgerFilter, user.id, searchQuery]);

  const unreadNotifications = notifications.filter((notification) => !notification.read);

  const updateGroupPreference = async (groupId, preference, enabled) => {
    const currentIds = user?.[preference] || [];
    const nextIds = enabled
      ? [...new Set([...currentIds, groupId])]
      : currentIds.filter((id) => id !== groupId);

    try {
      await onUpdateUser(user.id, { [preference]: nextIds });
    } catch {
      showToast?.('Could not update this group. Please try again.', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'notifications' && unreadNotifications.length) {
      onMarkNotificationsRead(unreadNotifications.map((notification) => notification.id));
    }
  }, [activeTab, notifications, unreadNotifications, onMarkNotificationsRead]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const handleCopyInvite = (event, group) => {
    event.stopPropagation();
    if (!group.inviteCode) return;
    try {
      navigator.clipboard?.writeText(group.inviteCode);
      setCopiedCodeId(group.id);
      showToast?.(`Invite code ${group.inviteCode} copied`);
      setTimeout(() => setCopiedCodeId(null), 1800);
    } catch {
      showToast?.('Could not copy code', 'error');
    }
  };

  const openQuickExpenseModal = (defaultGroupId = '') => {
    const targetId = defaultGroupId || activeGroups[0]?.id || myGroups[0]?.id || '';
    if (!targetId) {
      onCreateGroup();
      return;
    }
    setQuickGroupId(targetId);
    setQuickTitle('');
    setQuickAmount('');
    setQuickCategory('Food');
    setQuickMethod('UPI');
    setQuickExpenseOpen(true);
  };

  const handleSaveQuickExpense = async (event) => {
    event.preventDefault();
    const targetGroup = myGroups.find((g) => g.id === quickGroupId);
    const numAmount = parseFloat(quickAmount);
    if (!targetGroup || !quickTitle.trim() || Number.isNaN(numAmount) || numAmount <= 0) {
      showToast?.('Enter a valid description and amount.', 'error');
      return;
    }

    if (!onSaveExpense) {
      setQuickExpenseOpen(false);
      onOpenGroup(targetGroup.id, 'add');
      return;
    }

    setSavingQuick(true);
    try {
      const members = targetGroup.members?.length ? targetGroup.members : [user.id];
      const share = (numAmount / members.length).toFixed(2);
      const splits = {};
      members.forEach((mId) => {
        splits[mId] = share;
      });

      const now = new Date();
      const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

      const newExpense = {
        id: `exp_${Date.now()}`,
        groupId: targetGroup.id,
        title: quickTitle.trim(),
        totalAmount: numAmount.toFixed(2),
        paidBy: user.id,
        paymentMethod: quickMethod,
        category: quickCategory,
        date: today,
        splits,
        createdAt: new Date().toISOString(),
      };

      await onSaveExpense(newExpense);

      if (onSendNotification) {
        const others = members.filter((id) => id !== user.id);
        const notifs = others.map((memberId) => ({
          id: `notif_${Date.now()}_${memberId}`,
          recipientId: memberId,
          senderId: user.id,
          createdBy: user.id,
          createdByName: user.username || 'Roommate',
          groupId: targetGroup.id,
          type: 'EXPENSE_ADDED',
          message: `${user.username} added "${newExpense.title}" for ₹${newExpense.totalAmount} (Your share: ₹${share}).`,
          expenseId: newExpense.id,
          createdAt: new Date().toISOString(),
          read: false,
        }));
        if (notifs.length) onSendNotification(notifs).catch(() => {});
      }

      showToast?.(`Added "${newExpense.title}" to ${targetGroup.name}`);
      setQuickExpenseOpen(false);
    } catch {
      showToast?.('Could not save expense. Please try again.', 'error');
    } finally {
      setSavingQuick(false);
    }
  };

  const mobileSpacesToDisplay = showAllMobileSpaces
    ? visibleGroups
    : visibleGroups.slice(0, 4);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#EEF2F9] font-sans md:flex-row">
      {/* Soft Refractive Mesh Backdrop for Liquid Glass */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl" />
      </div>

      {/* --- NATIVE MOBILE APP TOP BAR (< md) --- */}
      <header className="relative z-30 flex h-14 flex-shrink-0 items-center justify-between border-b border-white/80 bg-white/75 px-4 backdrop-blur-2xl shadow-sm md:hidden">
        <button
          type="button"
          onClick={() => handleTabSwitch('groups')}
          aria-label="Go to RoomSplit home"
          className="flex items-center gap-2.5 text-left focus-visible:outline-none"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/90 bg-white p-1 shadow-sm">
            <img src={roomsplitIcon} alt="" className="h-full w-full object-contain" />
          </span>
          <div>
            <span className="block text-sm font-extrabold tracking-tight text-slate-900 leading-none">
              RoomSplit
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold text-blue-600 leading-none">
              Hi, {user.username}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onCreateGroup}
            title="New space"
            aria-label="Create space"
            className="liquid-glass-interactive flex h-9 items-center gap-1 rounded-xl px-2.5 text-xs font-bold text-slate-800"
          >
            <Plus size={14} className="text-blue-600" />
            <span>Space</span>
          </button>
          <button
            type="button"
            onClick={onJoinGroup}
            title="Join with code"
            aria-label="Join group"
            className="liquid-glass-interactive flex h-9 w-9 items-center justify-center rounded-xl text-slate-700"
          >
            <UserPlus size={15} />
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="relative z-10 min-w-0 flex-1 overscroll-y-contain overflow-y-auto pb-24 scrollbar-hide md:order-2 md:pb-8">
        {(activeTab === 'groups' || activeTab === 'spaces') && (
          <div className="mx-auto max-w-[1360px] p-3.5 sm:p-5 md:p-6 lg:p-8">
            {/* PWA Install Banner */}
            {activeTab === 'groups' && showInstallBanner && (
              <div className="liquid-glass mb-4 flex items-center justify-between rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Download size={17} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Install RoomSplit App</h3>
                    <p className="text-[11px] text-slate-500">Add to home screen for native full-screen experience.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  Install
                </button>
              </div>
            )}

            {/* ===================================================================== */}
            {/* NATIVE MOBILE APP DASHBOARD (< md): COMPACT, LIQUID GLASS, NOT LONG   */}
            {/* ===================================================================== */}
            <div
              className={`space-y-3.5 md:hidden ${
                activeTab === 'spaces' ? 'hidden' : ''
              }`}
            >
              {/* 1. Native Wallet Hero Card (Liquid Refractive Gradient Glass) */}
              <div className="relative overflow-hidden rounded-[26px] border border-white/30 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-4 text-white shadow-lg shadow-blue-600/20">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100/90">
                      Net Position
                    </span>
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-extrabold tracking-tight text-white">
                        {groupMetrics.totalNetBalance > 0.01
                          ? `+₹${groupMetrics.totalNetBalance.toFixed(0)}`
                          : groupMetrics.totalNetBalance < -0.01
                            ? `-₹${Math.abs(groupMetrics.totalNetBalance).toFixed(0)}`
                            : '₹0'}
                      </span>
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-blue-100 backdrop-blur-md">
                        {groupMetrics.totalNetBalance > 0.01
                          ? 'Owed to you'
                          : groupMetrics.totalNetBalance < -0.01
                            ? 'You owe'
                            : 'Settled'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openQuickExpenseModal()}
                    className="inline-flex h-9 items-center gap-1.5 rounded-2xl border border-white/30 bg-white/20 px-3 text-xs font-bold text-white backdrop-blur-md active:scale-95 transition-transform shadow-sm"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    <span>Add Bill</span>
                  </button>
                </div>

                {/* Inner Frosted Glass Pill Strip */}
                <div className="relative z-10 mt-3 grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/20 bg-white/10 p-2 text-center backdrop-blur-md">
                  <div>
                    <p className="text-[10px] font-medium text-blue-100/80">To Receive</p>
                    <p className="mt-0.5 font-mono text-xs font-extrabold text-emerald-300">
                      +₹{groupMetrics.totalOwedToYou.toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-blue-100/80">To Pay</p>
                    <p className="mt-0.5 font-mono text-xs font-extrabold text-rose-300">
                      -₹{groupMetrics.totalYouOwe.toFixed(0)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('monthly')}
                    className="text-center"
                  >
                    <p className="text-[10px] font-medium text-blue-100/80">
                      {monthlySummary.monthLabel.split(' ')[0]} Share
                    </p>
                    <p className="mt-0.5 font-mono text-xs font-extrabold text-white">
                      ₹{monthlySummary.myShare.toFixed(0)}
                    </p>
                  </button>
                </div>
              </div>

              {/* 2. Native iOS Segmented Glass Control */}
              <div className="flex items-center gap-2">
                <div className="liquid-glass grid flex-1 grid-cols-3 rounded-2xl p-1">
                  <button
                    type="button"
                    onClick={() => setMobileSection('spaces')}
                    className={`rounded-xl py-1.5 text-xs font-bold transition-all duration-200 ${
                      mobileSection === 'spaces'
                        ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Spaces ({activeGroups.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileSection('dues')}
                    className={`rounded-xl py-1.5 text-xs font-bold transition-all duration-200 ${
                      mobileSection === 'dues'
                        ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Dues ({groupMetrics.allMySettlements.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileSection('recent')}
                    className={`rounded-xl py-1.5 text-xs font-bold transition-all duration-200 ${
                      mobileSection === 'recent'
                        ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Recent ({recentTransactions.length})
                  </button>
                </div>

                {mobileSection === 'spaces' && archivedGroups.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSpaceFilter((curr) => (curr === 'archived' ? 'active' : 'archived'))
                    }
                    className={`liquid-glass-interactive flex h-9 items-center gap-1 rounded-2xl px-2.5 text-[11px] font-bold ${
                      spaceFilter === 'archived' ? 'text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    <Archive size={13} />
                    <span>{spaceFilter === 'archived' ? 'Active' : archivedGroups.length}</span>
                  </button>
                )}
              </div>

              {/* 3A. Mobile Section: Spaces (Compact Liquid Glass Cards, Max 4) */}
              {mobileSection === 'spaces' && (
                <div className="space-y-2">
                  {visibleGroups.length === 0 ? (
                    <div className="liquid-glass rounded-2xl px-4 py-8 text-center">
                      <p className="text-sm font-bold text-slate-800">
                        {spaceFilter === 'archived' ? 'No archived spaces' : 'No spaces yet'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Tap + Space above or Join with an invite code.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {mobileSpacesToDisplay.map((group) => {
                          const metrics = groupMetrics.byGroup[group.id] || {
                            myNet: 0,
                            roomSpend: 0,
                          };
                          const isPinned = pinnedGroupIds.includes(group.id);
                          const isMuted = mutedGroupIds.includes(group.id);
                          const isArchived = archivedGroupIds.includes(group.id);

                          return (
                            <div
                              key={group.id}
                              onClick={() => onOpenGroup(group.id)}
                              className="liquid-glass-interactive flex items-center justify-between gap-2.5 rounded-2xl p-3 cursor-pointer"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-extrabold text-white shadow-sm">
                                  {group.imageDataUrl ? (
                                    <img
                                      src={group.imageDataUrl}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    group.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h3 className="truncate text-sm font-bold text-slate-900">
                                      {group.name}
                                    </h3>
                                    {isPinned && (
                                      <Pin size={11} className="flex-shrink-0 text-blue-600" />
                                    )}
                                    {isMuted && (
                                      <BellOff size={11} className="flex-shrink-0 text-amber-500" />
                                    )}
                                  </div>
                                  <p className="truncate text-[11px] font-medium text-slate-500">
                                    {group.members.length} members · ₹{metrics.roomSpend.toFixed(0)} spent
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-shrink-0 items-center gap-1.5">
                                <span
                                  className={`rounded-xl px-2.5 py-1 font-mono text-xs font-extrabold border ${
                                    metrics.myNet > 0.01
                                      ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80'
                                      : metrics.myNet < -0.01
                                        ? 'bg-rose-50/90 text-rose-600 border-rose-200/80'
                                        : 'bg-slate-100/80 text-slate-600 border-slate-200/60'
                                  }`}
                                >
                                  {metrics.myNet > 0.01
                                    ? `+₹${metrics.myNet.toFixed(0)}`
                                    : metrics.myNet < -0.01
                                      ? `-₹${Math.abs(metrics.myNet).toFixed(0)}`
                                      : 'Settled'}
                                </span>

                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    updateGroupPreference(group.id, 'pinnedGroupIds', !isPinned);
                                  }}
                                  className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                                    isPinned ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
                                  }`}
                                  aria-label={isPinned ? `Unpin ${group.name}` : `Pin ${group.name}`}
                                >
                                  <Pin size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    updateGroupPreference(
                                      group.id,
                                      'archivedGroupIds',
                                      !isArchived
                                    );
                                  }}
                                  className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400"
                                  aria-label={
                                    isArchived ? `Restore ${group.name}` : `Archive ${group.name}`
                                  }
                                >
                                  {isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {visibleGroups.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setShowAllMobileSpaces((v) => !v)}
                          className="liquid-glass-interactive w-full rounded-2xl py-2 text-center text-xs font-bold text-blue-600"
                        >
                          {showAllMobileSpaces
                            ? 'Show fewer spaces'
                            : `View all ${visibleGroups.length} spaces`}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* 3B. Mobile Section: Dues */}
              {mobileSection === 'dues' && (
                <div className="space-y-2">
                  {groupMetrics.allMySettlements.length === 0 ? (
                    <div className="liquid-glass rounded-2xl px-4 py-8 text-center">
                      <CheckCircle2 size={24} className="mx-auto mb-1.5 text-emerald-600" />
                      <p className="text-xs font-bold text-slate-900">All balances settled</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        No pending dues across any of your spaces.
                      </p>
                    </div>
                  ) : (
                    groupMetrics.allMySettlements.slice(0, 5).map((item, idx) => {
                      const iOwe = item.from === user.id;
                      const otherName = getUserName(iOwe ? item.to : item.from);
                      return (
                        <div
                          key={`${item.groupId}-${idx}`}
                          onClick={() => onOpenGroup(item.groupId, 'balances')}
                          className="liquid-glass-interactive flex items-center justify-between gap-3 rounded-2xl p-3 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {iOwe ? `You owe ${otherName}` : `${otherName} owes you`}
                            </p>
                            <p className="truncate text-[11px] text-slate-500">{item.groupName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-xs font-extrabold ${
                                iOwe ? 'text-rose-600' : 'text-emerald-600'
                              }`}
                            >
                              {iOwe ? '-' : '+'}₹{item.amount.toFixed(0)}
                            </span>
                            <span className="rounded-xl bg-gradient-to-b from-blue-600 to-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                              Settle
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* 3C. Mobile Section: Recent Transactions */}
              {mobileSection === 'recent' && (
                <div className="space-y-2">
                  {recentTransactions.length === 0 ? (
                    <div className="liquid-glass rounded-2xl px-4 py-8 text-center">
                      <Receipt size={22} className="mx-auto mb-1.5 text-slate-400" />
                      <p className="text-xs font-bold text-slate-900">No recent bills</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Tap + in the bottom bar to log your first bill.
                      </p>
                    </div>
                  ) : (
                    recentTransactions.slice(0, 5).map((exp) => {
                      const grp = myGroups.find((g) => g.id === exp.groupId);
                      const iPaid = exp.paidBy === user.id;
                      return (
                        <div
                          key={exp.id}
                          onClick={() => onOpenGroup(exp.groupId, 'expenses')}
                          className="liquid-glass-interactive flex items-center justify-between gap-3 rounded-2xl p-3 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {exp.title}
                            </p>
                            <p className="truncate text-[11px] text-slate-500">
                              {grp?.name || 'Space'} · {iPaid ? 'You' : getUserName(exp.paidBy)} paid
                            </p>
                          </div>
                          <span className="font-mono text-xs font-extrabold text-slate-900">
                            ₹{(parseFloat(exp.totalAmount) || 0).toFixed(0)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* ===================================================================== */}
            {/* DESKTOP LIQUID GLASS COMMAND CENTER (md+): ALL FEATURES IN ONE VIEW   */}
            {/* ===================================================================== */}
            <div className="hidden md:block space-y-6">
              {/* 1. Desktop Top Command Bar */}
              <div
                className={`liquid-glass flex flex-col gap-4 rounded-3xl p-5 lg:flex-row lg:items-center lg:justify-between ${
                  activeTab === 'groups' ? '' : 'hidden'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                    <span>Command Center</span>
                    <span>·</span>
                    <span>
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
                    Welcome back, {user.username}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative w-56 lg:w-64">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter spaces or bills..."
                      className="h-10 w-full rounded-2xl border border-white/90 bg-white/80 pl-9 pr-7 text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-inner backdrop-blur-md focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {myGroups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => openQuickExpenseModal()}
                      className="inline-flex h-10 items-center gap-1.5 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-emerald-700 active:scale-95"
                    >
                      <Receipt size={14} />
                      <span>Quick Expense</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onJoinGroup}
                    className="liquid-glass-interactive inline-flex h-10 items-center gap-1.5 rounded-2xl px-4 text-xs font-bold text-slate-700"
                  >
                    <UserPlus size={14} className="text-blue-600" />
                    <span>Join with Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={onCreateGroup}
                    className="inline-flex h-10 items-center gap-1.5 rounded-2xl bg-gradient-to-b from-blue-600 to-indigo-600 px-4 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-600 active:scale-95"
                  >
                    <Plus size={15} />
                    <span>New Space</span>
                  </button>
                </div>
              </div>

              {/* 2. Desktop 4-Card Liquid Glass KPI Strip */}
              <div
                className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${
                  activeTab === 'groups' ? '' : 'hidden'
                }`}
              >
                <div className="liquid-glass rounded-3xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Net Position</span>
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
                        groupMetrics.totalNetBalance >= 0
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                          : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                      }`}
                    >
                      {groupMetrics.totalNetBalance >= 0 ? (
                        <ArrowDownLeft size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                    </span>
                  </div>
                  <p
                    className={`mt-2 font-mono text-2xl font-extrabold tracking-tight ${
                      groupMetrics.totalNetBalance > 0.01
                        ? 'text-emerald-600'
                        : groupMetrics.totalNetBalance < -0.01
                          ? 'text-rose-600'
                          : 'text-slate-900'
                    }`}
                  >
                    {groupMetrics.totalNetBalance > 0.01
                      ? `+₹${groupMetrics.totalNetBalance.toFixed(2)}`
                      : groupMetrics.totalNetBalance < -0.01
                        ? `-₹${Math.abs(groupMetrics.totalNetBalance).toFixed(2)}`
                        : '₹0.00'}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <span className="text-emerald-600">
                      +₹{groupMetrics.totalOwedToYou.toFixed(0)} owed
                    </span>
                    <span>·</span>
                    <span className="text-rose-600">
                      -₹{groupMetrics.totalYouOwe.toFixed(0)} due
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => handleTabSwitch('monthly')}
                  className="liquid-glass-interactive cursor-pointer rounded-3xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      {monthlySummary.monthLabel} Share
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <PieChart size={16} />
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-2xl font-extrabold tracking-tight text-slate-900">
                    ₹{monthlySummary.myShare.toFixed(2)}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-blue-600">
                    Across {monthlySummary.billCount} bill{monthlySummary.billCount === 1 ? '' : 's'} · Analytics →
                  </p>
                </div>

                <div className="liquid-glass rounded-3xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">You Paid Out</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Wallet size={16} />
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-2xl font-extrabold tracking-tight text-slate-900">
                    ₹{monthlySummary.iPaid.toFixed(2)}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-slate-500">
                    {activeGroups.length} active space{activeGroups.length === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="liquid-glass rounded-3xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Pending Settlements</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle2 size={16} />
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-2xl font-extrabold tracking-tight text-slate-900">
                    {groupMetrics.allMySettlements.length}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-slate-500">
                    {groupMetrics.allMySettlements.length === 0
                      ? 'Every room is settled'
                      : 'Active dues ready to settle'}
                  </p>
                </div>
              </div>
              {/* 3. Main 12-Column Desktop Bento Grid */}
              <div className="grid grid-cols-12 gap-6 items-start">
                {/* LEFT 8 COLUMNS: Spaces Directory + Recent Ledger */}
                <div
                  className={
                    activeTab === 'spaces'
                      ? 'col-span-12 space-y-6'
                      : 'col-span-12 xl:col-span-8 space-y-6'
                  }
                >
                  {/* SPACES DIRECTORY PANEL */}
                  <section
                    className={`liquid-glass rounded-3xl p-6 ${
                      activeTab === 'spaces' ? 'hidden' : ''
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3.5">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                          Shared Spaces
                        </h2>
                        <span className="rounded-lg bg-blue-50 border border-blue-200/60 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                          {visibleGroups.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 rounded-2xl bg-slate-200/60 p-1">
                        <button
                          type="button"
                          onClick={() => setSpaceFilter('active')}
                          className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                            spaceFilter === 'active'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Active ({activeGroups.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpaceFilter('pinned')}
                          className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                            spaceFilter === 'pinned'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Pinned ({pinnedGroups.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpaceFilter('archived')}
                          className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                            spaceFilter === 'archived'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Archived ({archivedGroups.length})
                        </button>
                      </div>
                    </div>

                    {visibleGroups.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/40 px-6 py-10 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Users size={22} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {spaceFilter === 'archived'
                            ? 'No archived spaces'
                            : spaceFilter === 'pinned'
                              ? 'No pinned spaces yet'
                              : 'No active spaces found'}
                        </p>
                        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                          Create a new room or join an existing flat using a 6-digit invite code.
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`grid gap-4 ${
                          activeTab === 'groups' ? 'grid-cols-1 gap-2' : 'grid-cols-2'
                        }`}
                      >
                        {visibleGroups.map((group) => {
                          const metrics = groupMetrics.byGroup[group.id] || {
                            myNet: 0,
                            roomSpend: 0,
                            billCount: 0,
                            latestExpense: null,
                          };
                          const isPinned = pinnedGroupIds.includes(group.id);
                          const isMuted = mutedGroupIds.includes(group.id);
                          const isArchived = archivedGroupIds.includes(group.id);

                          return (
                            <div
                              key={group.id}
                              onClick={() => onOpenGroup(group.id)}
                              className={`liquid-glass-interactive group rounded-2xl cursor-pointer ${
                                activeTab === 'groups'
                                  ? 'flex items-center gap-3 px-3 py-2.5'
                                  : 'flex flex-col justify-between p-4'
                              }`}
                            >
                              <div
                                className={`${
                                  activeTab === 'groups'
                                    ? 'flex min-w-0 flex-1 items-center'
                                    : ''
                                }`}
                              >
                                <div
                                  className={`flex justify-between gap-3 ${
                                    activeTab === 'groups'
                                      ? 'w-full items-center'
                                      : 'items-start'
                                  }`}
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <div
                                      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white shadow-sm ${
                                        activeTab === 'groups' ? 'h-10 w-10 text-sm' : 'h-11 w-11 text-base'
                                      }`}
                                    >
                                      {group.imageDataUrl ? (
                                        <img
                                          src={group.imageDataUrl}
                                          alt=""
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        group.name.charAt(0).toUpperCase()
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <h3 className="truncate text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                                          {group.name}
                                        </h3>
                                        {isPinned && (
                                          <Pin size={12} className="text-blue-600 flex-shrink-0" />
                                        )}
                                        {activeTab === 'groups' && isMuted && (
                                          <BellOff size={12} className="flex-shrink-0 text-amber-500" />
                                        )}
                                      </div>
                                      <p className="truncate text-[11px] font-medium text-slate-500">
                                        {activeTab === 'groups'
                                          ? `${group.members.length} members · ₹${metrics.roomSpend.toFixed(0)} spent`
                                          : group.description || `${group.members.length} members`}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-shrink-0 items-center gap-1.5">
                                    <span
                                      className={`rounded-xl px-2.5 py-1 font-mono text-xs font-extrabold border ${
                                        metrics.myNet > 0.01
                                          ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80'
                                          : metrics.myNet < -0.01
                                            ? 'bg-rose-50/90 text-rose-700 border-rose-200/80'
                                            : 'bg-slate-100/80 text-slate-600 border-slate-200/60'
                                      }`}
                                    >
                                      {metrics.myNet > 0.01
                                        ? `+₹${metrics.myNet.toFixed(activeTab === 'groups' ? 0 : 2)}`
                                        : metrics.myNet < -0.01
                                          ? `-₹${Math.abs(metrics.myNet).toFixed(activeTab === 'groups' ? 0 : 2)}`
                                          : 'Settled'}
                                    </span>
                                    {activeTab === 'groups' && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            updateGroupPreference(
                                              group.id,
                                              'pinnedGroupIds',
                                              !isPinned
                                            );
                                          }}
                                          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                                            isPinned
                                              ? 'bg-blue-50 text-blue-600'
                                              : 'text-slate-400 hover:bg-white'
                                          }`}
                                          aria-label={isPinned ? `Unpin ${group.name}` : `Pin ${group.name}`}
                                        >
                                          <Pin size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            updateGroupPreference(
                                              group.id,
                                              'archivedGroupIds',
                                              !isArchived
                                            );
                                          }}
                                          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-white"
                                          aria-label={
                                            isArchived ? `Restore ${group.name}` : `Archive ${group.name}`
                                          }
                                        >
                                          {isArchived ? (
                                            <ArchiveRestore size={14} />
                                          ) : (
                                            <Archive size={14} />
                                          )}
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className={`mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-white/60 border border-white/80 px-3 py-2 text-xs ${
                                    activeTab === 'spaces' ? '' : 'hidden'
                                  }`}
                                >
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                      Room Spend
                                    </span>
                                    <span className="font-mono font-extrabold text-slate-800">
                                      ₹{metrics.roomSpend.toFixed(2)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                      Latest Bill
                                    </span>
                                    <span className="truncate font-semibold text-slate-700 block">
                                      {metrics.latestExpense
                                        ? metrics.latestExpense.title
                                        : 'No bills yet'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div
                                className={`mt-3.5 flex items-center justify-between border-t border-slate-200/50 pt-3 ${
                                  activeTab === 'spaces' ? '' : 'hidden'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-1.5 overflow-hidden">
                                    {group.members.slice(0, 4).map((mId) => {
                                      const member = users.find((u) => u.id === mId);
                                      const label =
                                        mId === user.id
                                          ? user.username
                                          : member?.username || 'M';
                                      return (
                                        <span
                                          key={mId}
                                          title={label}
                                          className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[10px] font-extrabold text-blue-700"
                                        >
                                          {(label || 'M').charAt(0).toUpperCase()}
                                        </span>
                                      );
                                    })}
                                  </div>
                                  {group.inviteCode && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyInvite(e, group)}
                                      title="Copy invite code"
                                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white/80 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600 hover:bg-white"
                                    >
                                      {copiedCodeId === group.id ? (
                                        <Check size={10} className="text-emerald-600" />
                                      ) : (
                                        <Copy size={10} />
                                      )}
                                      <span>{group.inviteCode}</span>
                                    </button>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openQuickExpenseModal(group.id);
                                    }}
                                    title="Quick add bill to this space"
                                    className="inline-flex h-7 items-center gap-1 rounded-xl bg-gradient-to-b from-blue-600 to-indigo-600 px-2.5 text-[11px] font-bold text-white shadow-sm hover:opacity-95"
                                  >
                                    <Plus size={12} />
                                    <span>Bill</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenGroup(group.id, 'chat');
                                    }}
                                    title="Open group chat"
                                    className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-blue-600"
                                  >
                                    <MessageSquare size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      updateGroupPreference(
                                        group.id,
                                        'mutedGroupIds',
                                        !isMuted
                                      );
                                    }}
                                    className={`flex h-7 w-7 items-center justify-center rounded-xl transition-colors ${
                                      isMuted
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'text-slate-400 hover:bg-white hover:text-slate-700'
                                    }`}
                                    aria-label={isMuted ? `Unmute ${group.name}` : `Mute ${group.name}`}
                                  >
                                    {isMuted ? <BellOff size={14} /> : <Bell size={14} />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      updateGroupPreference(
                                        group.id,
                                        'pinnedGroupIds',
                                        !isPinned
                                      );
                                    }}
                                    className={`flex h-7 w-7 items-center justify-center rounded-xl transition-colors ${
                                      isPinned
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-400 hover:bg-white hover:text-slate-700'
                                    }`}
                                    aria-label={isPinned ? `Unpin ${group.name}` : `Pin ${group.name}`}
                                  >
                                    {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      updateGroupPreference(
                                        group.id,
                                        'archivedGroupIds',
                                        !isArchived
                                      );
                                    }}
                                    className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
                                    aria-label={
                                      isArchived ? `Restore ${group.name}` : `Archive ${group.name}`
                                    }
                                  >
                                    {isArchived ? (
                                      <ArchiveRestore size={14} />
                                    ) : (
                                      <Archive size={14} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {activeTab === 'spaces' && (
                    <DesktopSpacesTab
                      groups={visibleGroups}
                      activeCount={activeGroups.length}
                      pinnedCount={pinnedGroups.length}
                      archivedCount={archivedGroups.length}
                      spaceFilter={spaceFilter}
                      onSpaceFilterChange={setSpaceFilter}
                      groupMetrics={groupMetrics}
                      users={users}
                      user={user}
                      pinnedGroupIds={pinnedGroupIds}
                      archivedGroupIds={archivedGroupIds}
                      mutedGroupIds={mutedGroupIds}
                      onOpenGroup={onOpenGroup}
                      onUpdateGroupPreference={updateGroupPreference}
                      onQuickAdd={openQuickExpenseModal}
                      onCopyInvite={handleCopyInvite}
                      copiedCodeId={copiedCodeId}
                    />
                  )}

                  {/* RECENT TRANSACTIONS LEDGER PANEL */}
                  <section
                    className={`liquid-glass rounded-3xl p-6 ${
                      activeTab === 'groups' ? '' : 'hidden'
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3.5">
                      <div>
                        <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                          Recent Ledger Activity
                        </h2>
                        <p className="text-xs text-slate-500">
                          Latest bills and settlements across all your rooms
                        </p>
                      </div>

                      <div className="flex items-center gap-1 rounded-2xl bg-slate-200/60 p-1">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'mine', label: 'Paid by Me' },
                          { id: 'settlements', label: 'Settlements' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setLedgerFilter(tab.id)}
                            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                              ledgerFilter === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {recentTransactions.length === 0 ? (
                      <div className="py-8 text-center">
                        <Receipt size={22} className="mx-auto mb-2 text-slate-400" />
                        <p className="text-sm font-bold text-slate-700">No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recentTransactions.map((exp) => {
                          const grp = myGroups.find((g) => g.id === exp.groupId);
                          const iPaid = exp.paidBy === user.id;
                          const myShare = parseFloat(exp.splits?.[user.id]) || 0;
                          const total = parseFloat(exp.totalAmount) || 0;
                          const myImpact = iPaid ? total - myShare : -myShare;

                          return (
                            <div
                              key={exp.id}
                              onClick={() => onOpenGroup(exp.groupId, 'expenses')}
                              className="flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/60 px-3.5 py-3 hover:bg-white/95 transition-all cursor-pointer"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                  <Receipt size={16} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-bold text-slate-900">
                                      {exp.title}
                                    </p>
                                    <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                      {grp?.name || 'Room'}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-xs text-slate-500">
                                    <span className="font-semibold text-slate-700">
                                      {iPaid ? 'You' : getUserName(exp.paidBy)}
                                    </span>{' '}
                                    paid ₹{total.toFixed(2)} via {exp.paymentMethod || 'UPI'} ·{' '}
                                    {exp.date}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-shrink-0 items-center gap-3 text-right">
                                <div>
                                  <span
                                    className={`block font-mono text-xs font-extrabold ${
                                      myImpact > 0.01
                                        ? 'text-emerald-600'
                                        : myImpact < -0.01
                                          ? 'text-rose-600'
                                          : 'text-slate-500'
                                    }`}
                                  >
                                    {myImpact > 0.01
                                      ? `+₹${myImpact.toFixed(2)}`
                                      : myImpact < -0.01
                                        ? `-₹${Math.abs(myImpact).toFixed(2)}`
                                        : `₹${total.toFixed(2)}`}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {myImpact > 0.01
                                      ? 'you lent'
                                      : myImpact < -0.01
                                        ? 'your share'
                                        : 'settled'}
                                  </span>
                                </div>
                                <ChevronRight size={15} className="text-slate-300" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </div>

                {/* RIGHT 4 COLUMNS: Live Settlements + Monthly Breakdown + Activity + Profile */}
                <div
                  className={`col-span-12 xl:col-span-4 space-y-6 ${
                    activeTab === 'groups' ? '' : 'hidden'
                  }`}
                >
                  {/* WIDGET 1: WHO OWES WHO / QUICK SETTLE */}
                  <section className="liquid-glass rounded-3xl p-5">
                    <div className="mb-3.5 flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                          Balances & Settlements
                        </h3>
                        <p className="text-[11px] text-slate-500">Smart optimized dues across spaces</p>
                      </div>
                      <span className="rounded-lg bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                        {groupMetrics.allMySettlements.length}
                      </span>
                    </div>

                    {groupMetrics.allMySettlements.length === 0 ? (
                      <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/70 p-4 text-center">
                        <CheckCircle2 size={20} className="mx-auto mb-1 text-emerald-600" />
                        <p className="text-xs font-bold text-emerald-950">All Settled Up</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {groupMetrics.allMySettlements.slice(0, 5).map((s, idx) => {
                          const iOwe = s.from === user.id;
                          const counterparty = getUserName(iOwe ? s.to : s.from);
                          return (
                            <div
                              key={`${s.groupId}-${idx}`}
                              onClick={() => onOpenGroup(s.groupId, 'balances')}
                              className="flex items-center justify-between gap-3 rounded-2xl border border-white/90 bg-white/70 p-3 hover:bg-white transition-all cursor-pointer shadow-sm"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-slate-900">
                                  {iOwe ? `Pay ${counterparty}` : `Collect from ${counterparty}`}
                                </p>
                                <p className="truncate text-[11px] text-slate-500">
                                  in {s.groupName}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                  className={`font-mono text-xs font-extrabold ${
                                    iOwe ? 'text-rose-600' : 'text-emerald-600'
                                  }`}
                                >
                                  {iOwe ? '-' : '+'}₹{s.amount.toFixed(2)}
                                </span>
                                <span className="rounded-xl bg-gradient-to-b from-blue-600 to-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                                  Settle
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* WIDGET 2: MONTHLY SPENDING SNAPSHOT */}
                  <section className="liquid-glass rounded-3xl p-5">
                    <div className="mb-3.5 flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                          {monthlySummary.monthLabel} Breakdown
                        </h3>
                        <p className="text-[11px] text-slate-500">Your share by category</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('monthly')}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Full Report →
                      </button>
                    </div>

                    {monthlySummary.categories.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">
                        No category spend recorded this month.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {monthlySummary.categories.slice(0, 4).map((cat) => (
                          <div key={cat.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700">{cat.name}</span>
                              <span className="font-mono font-extrabold text-slate-900">
                                ₹{cat.amount.toFixed(0)}{' '}
                                <span className="text-[11px] font-normal text-slate-400">
                                  ({cat.pct}%)
                                </span>
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                style={{ width: `${Math.max(4, cat.pct)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>


                  {/* WIDGET 4: REIMBURSEMENT UPI HANDLE CARD */}
                  <section className="liquid-glass rounded-3xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                          <QrCode size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Your UPI ID
                          </p>
                          <p className="truncate font-mono text-xs font-extrabold text-slate-900">
                            {user.upiId || 'Not configured yet'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('profile')}
                        className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-white"
                      >
                        {user.upiId ? 'Edit' : 'Set UPI'}
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* OTHER TABS                     */}
        {/* ============================== */}
        {activeTab !== 'groups' && activeTab !== 'spaces' && (
          <div className="h-full">
            {activeTab === 'notifications' && (
              <ActivityTab
                notifications={notifications}
                user={user}
                onOpenGroup={onOpenGroup}
                onClearNotifications={onClearNotifications}
                showToast={showToast}
              />
            )}
            {activeTab === 'monthly' && (
              <MonthlyAnalyticsTab user={user} expenses={expenses} groups={groups} />
            )}
            {activeTab === 'profile' && (
              <ProfileTabView
                key={[user.id, user.username, user.email, user.upiId, user.photoDataUrl].join(':')}
                user={user}
                onUpdateUser={onUpdateUser}
                onLogout={onLogout}
                showToast={showToast}
              />
            )}
          </div>
        )}
      </main>

      {/* --- NATIVE BOTTOM SHEET / LIQUID GLASS QUICK EXPENSE MODAL --- */}
      {quickExpenseOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4 backdrop-blur-md"
          onClick={() => !savingQuick && setQuickExpenseOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border border-white/80 bg-white/90 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-300/80 sm:hidden" />
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Quick Log Expense</h3>
                <p className="text-xs text-slate-500">Split equally across all members of the selected space</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickExpenseOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickExpense} className="mt-4 space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Space</label>
                <select
                  value={quickGroupId}
                  onChange={(e) => setQuickGroupId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200/90 bg-white/80 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  {myGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.members?.length || 1} members)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Total Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="0.00"
                      value={quickAmount}
                      onChange={(e) => setQuickAmount(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200/90 bg-white/80 py-2.5 pl-8 pr-3 font-mono text-sm font-extrabold text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200/90 bg-white/80 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Groceries, Electricity, Dinner"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200/90 bg-white/80 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Method</label>
                  <select
                    value={quickMethod}
                    onChange={(e) => setQuickMethod(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200/90 bg-white/80 px-2.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const gId = quickGroupId;
                    setQuickExpenseOpen(false);
                    if (gId) onOpenGroup(gId, 'add');
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Custom split →
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickExpenseOpen(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingQuick}
                    className="rounded-2xl bg-gradient-to-b from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 disabled:opacity-50"
                  >
                    {savingQuick ? 'Saving…' : 'Save Bill'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- LIQUID GLASS NAVIGATION (Mobile Floating Dock + Desktop Left Sidebar) --- */}
      <PrimaryNav
        activeItem={activeTab}
        onNavigate={handleTabSwitch}
        onQuickAction={() => openQuickExpenseModal()}
        unreadCount={unreadNotifications.length}
        onLogout={onLogout}
        user={user}
      />
    </div>
  );
}