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
  X,
  IndianRupee,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import roomsplitIcon from '../../assets/roomsplit-icon.webp';
import PrimaryNav from '../common/PrimaryNav';
import MonthlyAnalyticsTab from './MonthlyAnalyticsTab';
import ProfileTabView from './ProfileTab';
import DesktopSpacesTab from './DesktopSpacesTab';
import { calculateSettlements } from '../../utils/settlement';
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';

export default function Dashboard({
  user,
  users = [],
  groups = [],
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
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Activity Drawer / Notification Center Popup State
  const [isActivityOpen, setIsActivityOpen] = useState(false);

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

  // Scoped notifications for this user
  const userNotifications = useMemo(
    () =>
      notifications.filter(
        (n) => !n.recipientId || n.recipientId === user?.id
      ),
    [notifications, user?.id]
  );

  const unreadNotifications = useMemo(
    () => userNotifications.filter((n) => !n.read),
    [userNotifications]
  );

  const getUserName = (userId) => {
    if (userId === user?.id) return 'You';
    return users.find((u) => u.id === userId)?.username || 'Roommate';
  };

  const myGroups = useMemo(
    () => groups.filter((group) => group.members && group.members.includes(user?.id)),
    [groups, user?.id]
  );

  // Unread message & transaction count per space
  const unreadMessagesByGroup = useMemo(() => {
    const map = {};
    myGroups.forEach((group) => {
      let chatCount = 0;

      if (typeof group.unreadCount === 'number') {
        chatCount = group.unreadCount;
      } else if (typeof group.unreadMessages === 'number') {
        chatCount = group.unreadMessages;
      } else if (
        group.unreadCount &&
        typeof group.unreadCount === 'object' &&
        typeof group.unreadCount[user?.id] === 'number'
      ) {
        chatCount = group.unreadCount[user?.id];
      } else if (
        group.unreadBy &&
        typeof group.unreadBy === 'object' &&
        typeof group.unreadBy[user?.id] === 'number'
      ) {
        chatCount = group.unreadBy[user?.id];
      } else if (Array.isArray(group.messages)) {
        const lastReadTime =
          group.lastReadBy?.[user?.id] || user?.lastReadGroupChat?.[group.id] || 0;
        chatCount = group.messages.filter(
          (m) =>
            m.senderId &&
            m.senderId !== user?.id &&
            (!m.readBy || !m.readBy.includes(user?.id)) &&
            (!lastReadTime || new Date(m.createdAt || 0) > new Date(lastReadTime))
        ).length;
      }

      const groupUnreadNotifs = notifications.filter(
        (n) =>
          !n.read &&
          n.groupId === group.id &&
          (!n.recipientId || n.recipientId === user?.id)
      );

      const chatNotifs = groupUnreadNotifs.filter(
        (n) =>
          n.type === 'CHAT_MESSAGE' ||
          n.type === 'NEW_MESSAGE' ||
          n.type === 'MESSAGE' ||
          n.category === 'chat' ||
          /message|chat/i.test(n.type || '')
      ).length;

      const transactionNotifs = groupUnreadNotifs.filter(
        (n) =>
          n.type === 'EXPENSE_ADDED' ||
          n.type === 'BILL_ADDED' ||
          n.type === 'TRANSACTION' ||
          n.type === 'SETTLEMENT' ||
          n.category === 'expense' ||
          /expense|bill|transaction|settle/i.test(n.type || '')
      ).length;

      const effectiveChatCount = Math.max(chatCount, chatNotifs);
      map[group.id] = effectiveChatCount + transactionNotifs;
    });
    return map;
  }, [myGroups, notifications, user?.id, user?.lastReadGroupChat]);

  const totalUnreadSpacesCount = useMemo(
    () => Object.values(unreadMessagesByGroup).reduce((sum, c) => sum + (c || 0), 0),
    [unreadMessagesByGroup]
  );

  const handleOpenGroup = (groupId, subTab) => {
    if (onMarkNotificationsRead) {
      const groupUnread = notifications.filter(
        (n) =>
          !n.read &&
          n.groupId === groupId &&
          (!n.recipientId || n.recipientId === user?.id)
      );
      if (groupUnread.length > 0) {
        onMarkNotificationsRead(groupUnread.map((n) => n.id));
      }
    }
    onOpenGroup?.(groupId, subTab);
  };

  // Mark all notifications as read when the activity popup drawer opens
  useEffect(() => {
    if (isActivityOpen && unreadNotifications.length && onMarkNotificationsRead) {
      onMarkNotificationsRead(unreadNotifications.map((n) => n.id));
    }
  }, [isActivityOpen, unreadNotifications, onMarkNotificationsRead]);

  const handleClearAllActivity = () => {
    if (onClearNotifications) {
      onClearNotifications();
      showToast?.('All activity notifications cleared');
    }
  };

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
      const myNet = balances[user?.id] || 0;

      if (!archivedGroupIds.includes(group.id)) {
        totalNetBalance += myNet;
        if (myNet > 0.01) totalOwedToYou += myNet;
        if (myNet < -0.01) totalYouOwe += Math.abs(myNet);
      }

      settlements.forEach((s) => {
        if (s.from === user?.id || s.to === user?.id) {
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
        unreadCount: unreadMessagesByGroup[group.id] || 0,
      };
    });

    return {
      byGroup: map,
      totalNetBalance: Math.round(totalNetBalance * 100) / 100,
      totalOwedToYou: Math.round(totalOwedToYou * 100) / 100,
      totalYouOwe: Math.round(totalYouOwe * 100) / 100,
      allMySettlements,
    };
  }, [myGroups, expenses, user?.id, archivedGroupIds, unreadMessagesByGroup]);

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
      if (e.paidBy === user?.id) iPaid += total;
      const share = parseFloat(e.splits?.[user?.id]) || 0;
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
  }, [expenses, myGroups, user?.id]);

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
      list = list.filter((e) => e.paidBy === user?.id);
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

    return list;
  }, [expenses, myGroups, ledgerFilter, user?.id, searchQuery]);

  const updateGroupPreference = async (groupId, preference, enabled) => {
    const currentIds = user?.[preference] || [];
    const nextIds = enabled
      ? [...new Set([...currentIds, groupId])]
      : currentIds.filter((id) => id !== groupId);

    try {
      await onUpdateUser(user?.id, { [preference]: nextIds });
    } catch {
      showToast?.('Could not update this group. Please try again.', 'error');
    }
  };

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
    if (window.innerWidth < 768 && tab === 'transactions') return;
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
      handleOpenGroup(targetGroup.id, 'add');
      return;
    }

    setSavingQuick(true);
    try {
      const members = targetGroup.members?.length ? targetGroup.members : [user?.id];
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
        paidBy: user?.id,
        paymentMethod: quickMethod,
        category: quickCategory,
        date: today,
        splits,
        createdAt: new Date().toISOString(),
      };

      await onSaveExpense(newExpense);

      if (onSendNotification) {
        const others = members.filter((id) => id !== user?.id);
        const notifs = others.map((memberId) => ({
          id: `notif_${Date.now()}_${memberId}`,
          recipientId: memberId,
          senderId: user?.id,
          createdBy: user?.id,
          createdByName: user?.username || 'Roommate',
          groupId: targetGroup.id,
          type: 'EXPENSE_ADDED',
          message: `${user?.username} added "${newExpense.title}" for ₹${newExpense.totalAmount} (Your share: ₹${share}).`,
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
              Hi, {user?.username}
            </span>
          </div>
        </button>

        {/* Top Right Mobile Header: Join, Space, and Activity Popover Trigger */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onJoinGroup}
            title="Join space with code"
            aria-label="Join space with code"
            className="liquid-glass-interactive flex h-8 items-center gap-1 rounded-xl border border-blue-200/70 bg-white/90 px-2 text-[11px] font-semibold text-slate-700 shadow-sm active:scale-95 transition-transform"
          >
            <UserPlus size={13} className="text-blue-600" />
            <span>Join</span>
          </button>
          <button
            type="button"
            onClick={onCreateGroup}
            title="Create new space"
            aria-label="Create space"
            className="flex h-8 items-center gap-1 rounded-xl bg-gradient-to-b from-blue-600 to-indigo-600 px-2 text-[11px] font-semibold text-white shadow-sm shadow-blue-600/20 active:scale-95 transition-transform"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>Space</span>
          </button>
          <button
            type="button"
            onClick={() => setIsActivityOpen((prev) => !prev)}
            title="Activity notifications"
            aria-label="Activity notifications"
            className={`relative flex h-8 w-8 items-center justify-center rounded-xl border transition-all active:scale-95 ${
              isActivityOpen
                ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                : 'border-blue-200/70 bg-white/90 text-slate-700 shadow-sm'
            }`}
          >
            <Bell
              size={14}
              className={isActivityOpen ? 'fill-blue-600/20 text-blue-600' : 'text-slate-600'}
            />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-extrabold text-white leading-none shadow-sm animate-pulse">
                {unreadNotifications.length > 99 ? '99+' : unreadNotifications.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="relative z-10 min-w-0 flex-1 overscroll-y-contain overflow-y-auto pb-24 scrollbar-hide md:order-2 md:pb-8">
        {(activeTab === 'groups' || activeTab === 'spaces' || activeTab === 'transactions') && (
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
                    <p className="text-[11px] text-slate-500">
                      Add to home screen for native full-screen experience.
                    </p>
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
            {/* NATIVE MOBILE APP DASHBOARD (< md)                                    */}
            {/* ===================================================================== */}
            <div
              className={`space-y-3.5 md:hidden ${
                activeTab !== 'groups' ? 'hidden' : ''
              }`}
            >
              {/* 1. Native Wallet Hero Card */}
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
                    className={`relative flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-semibold transition-all duration-200 ${
                      mobileSection === 'spaces'
                        ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Spaces ({activeGroups.length})</span>
                    {totalUnreadSpacesCount > 0 && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-extrabold text-white leading-none">
                        {totalUnreadSpacesCount > 99 ? '99+' : totalUnreadSpacesCount}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileSection('dues')}
                    className={`rounded-xl py-1.5 text-xs font-semibold transition-all duration-200 ${
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
                    className={`rounded-xl py-1.5 text-xs font-semibold transition-all duration-200 ${
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
                    className={`liquid-glass-interactive flex h-9 items-center gap-1 rounded-2xl px-2.5 text-[11px] font-semibold ${
                      spaceFilter === 'archived' ? 'text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    <Archive size={13} />
                    <span>{spaceFilter === 'archived' ? 'Active' : archivedGroups.length}</span>
                  </button>
                )}
              </div>

              {/* 3A. Mobile Section: Spaces */}
              {mobileSection === 'spaces' && (
                <div className="space-y-2">
                  {visibleGroups.length === 0 ? (
                    <div className="liquid-glass rounded-2xl px-4 py-7 text-center">
                      <p className="text-sm font-bold text-slate-800">
                        {spaceFilter === 'archived' ? 'No archived spaces' : 'No spaces yet'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Create a new shared room or join an existing flat with a code.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {visibleGroups.map((group) => {
                        const metrics = groupMetrics.byGroup[group.id] || {
                          myNet: 0,
                          roomSpend: 0,
                          unreadCount: 0,
                        };
                        const unreadCount = unreadMessagesByGroup[group.id] || 0;
                        const isPinned = pinnedGroupIds.includes(group.id);
                        const isMuted = mutedGroupIds.includes(group.id);

                        return (
                          <div
                            key={group.id}
                            onClick={() => handleOpenGroup(group.id)}
                            className="liquid-glass-interactive flex items-center justify-between gap-2.5 rounded-2xl px-3.5 py-2.5 cursor-pointer shadow-sm"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
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
                                  <h3 className="truncate text-xs font-semibold text-slate-900">
                                    {group.name}
                                  </h3>
                                  {isPinned && (
                                    <Pin size={10} className="flex-shrink-0 text-blue-600" />
                                  )}
                                  {isMuted && (
                                    <BellOff size={10} className="flex-shrink-0 text-amber-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                  <span>{group.members.length} members</span>
                                  <span>·</span>
                                  <span>₹{metrics.roomSpend.toFixed(0)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-shrink-0 items-center gap-2">
                              {unreadCount > 0 && (
                                <span className="flex h-5 min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold text-white leading-none">
                                  {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                              )}

                              <span
                                className={`rounded-xl px-2 py-0.5 font-mono text-[11px] font-semibold border ${
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
                                className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                                  isPinned ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
                                }`}
                                aria-label={isPinned ? `Unpin ${group.name}` : `Pin ${group.name}`}
                              >
                                <Pin size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                      const iOwe = item.from === user?.id;
                      const otherName = getUserName(iOwe ? item.to : item.from);
                      return (
                        <div
                          key={`${item.groupId}-${idx}`}
                          onClick={() => handleOpenGroup(item.groupId, 'balances')}
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
                    recentTransactions.slice(0, 4).map((exp) => {
                      const grp = myGroups.find((g) => g.id === exp.groupId);
                      const iPaid = exp.paidBy === user?.id;
                      return (
                        <div
                          key={exp.id}
                          onClick={() => handleOpenGroup(exp.groupId, 'expenses')}
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

            {/* Desktop Spaces View */}
            {activeTab === 'spaces' && (
              <div className="md:hidden">
                <DesktopSpacesTab
                  groups={visibleGroups}
                  activeCount={activeGroups.length}
                  pinnedCount={pinnedGroups.length}
                  archivedCount={archivedGroups.length}
                  spaceFilter={spaceFilter}
                  onSpaceFilterChange={setSpaceFilter}
                  groupMetrics={groupMetrics}
                  unreadMessagesByGroup={unreadMessagesByGroup}
                  users={users}
                  user={user}
                  pinnedGroupIds={pinnedGroupIds}
                  archivedGroupIds={archivedGroupIds}
                  mutedGroupIds={mutedGroupIds}
                  onOpenGroup={handleOpenGroup}
                  onUpdateGroupPreference={updateGroupPreference}
                  onQuickAdd={openQuickExpenseModal}
                  onCopyInvite={handleCopyInvite}
                  copiedCodeId={copiedCodeId}
                />
              </div>
            )}

            {/* ===================================================================== */}
            {/* DESKTOP LIQUID GLASS COMMAND CENTER (md+)                             */}
            {/* ===================================================================== */}
            <div className="hidden md:block space-y-6">
              {/* 1. Desktop Top Command Bar with Activity on Top Right */}
              <div
                className={`liquid-glass flex flex-col gap-3 rounded-3xl p-4 lg:flex-row lg:items-center lg:justify-between lg:px-5 ${
                  activeTab === 'groups' ? '' : 'hidden'
                }`}
              >
                <div className="min-w-0">
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
                  <h1 className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-slate-900 xl:text-2xl">
                    Welcome back, {user?.username}
                  </h1>
                </div>

                <div className="flex flex-shrink-0 flex-nowrap items-center gap-2">
                  <div className="relative w-36 lg:w-40 xl:w-48">
                    <Search
                      size={14}
                      strokeWidth={2.5}
                      className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search spaces..."
                      className="relative z-0 h-9 w-full rounded-xl border border-slate-200/90 bg-white/90 pl-8 pr-6 text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {myGroups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => openQuickExpenseModal()}
                      className="inline-flex h-9 flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-3 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-emerald-700 active:scale-95"
                    >
                      <Receipt size={13} />
                      <span>Quick Expense</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onJoinGroup}
                    className="liquid-glass-interactive inline-flex h-9 flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-semibold text-slate-700"
                  >
                    <UserPlus size={13} className="text-blue-600" />
                    <span>Join with Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={onCreateGroup}
                    className="inline-flex h-9 flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-b from-blue-600 to-indigo-600 px-3.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-600 active:scale-95"
                  >
                    <Plus size={14} />
                    <span>New Space</span>
                  </button>

                  {/* Desktop Top-Right Activity Popover Button */}
                  <button
                    type="button"
                    onClick={() => setIsActivityOpen((prev) => !prev)}
                    title="Activity & Notifications"
                    aria-label="Activity & Notifications"
                    className={`relative inline-flex h-9 flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 text-xs font-semibold shadow-sm transition-all active:scale-95 ${
                      isActivityOpen
                        ? 'border-blue-400 bg-blue-50 text-blue-600'
                        : 'border-slate-200/90 bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    <Bell
                      size={14}
                      className={
                        isActivityOpen
                          ? 'fill-blue-600/20 text-blue-600'
                          : unreadNotifications.length > 0
                            ? 'text-blue-600'
                            : 'text-slate-500'
                      }
                    />
                    <span>Activity</span>
                    {unreadNotifications.length > 0 && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-extrabold text-white leading-none shadow-sm animate-pulse">
                        {unreadNotifications.length > 99 ? '99+' : unreadNotifications.length}
                      </span>
                    )}
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
                {/* LEFT 8 COLUMNS: Recent Ledger (and Spaces Tab on Desktop) */}
                <div
                  className={
                    activeTab === 'spaces' || activeTab === 'transactions'
                      ? 'col-span-12 space-y-6'
                      : 'col-span-12 xl:col-span-8 space-y-6'
                  }
                >
                  {activeTab === 'spaces' && (
                    <DesktopSpacesTab
                      groups={visibleGroups}
                      activeCount={activeGroups.length}
                      pinnedCount={pinnedGroups.length}
                      archivedCount={archivedGroups.length}
                      spaceFilter={spaceFilter}
                      onSpaceFilterChange={setSpaceFilter}
                      groupMetrics={groupMetrics}
                      unreadMessagesByGroup={unreadMessagesByGroup}
                      users={users}
                      user={user}
                      pinnedGroupIds={pinnedGroupIds}
                      archivedGroupIds={archivedGroupIds}
                      mutedGroupIds={mutedGroupIds}
                      onOpenGroup={handleOpenGroup}
                      onUpdateGroupPreference={updateGroupPreference}
                      onQuickAdd={openQuickExpenseModal}
                      onCopyInvite={handleCopyInvite}
                      copiedCodeId={copiedCodeId}
                    />
                  )}

                  {/* RECENT TRANSACTIONS LEDGER PANEL */}
                  <section
                    className={`liquid-glass rounded-3xl p-6 ${
                      activeTab === 'groups' || activeTab === 'transactions' ? '' : 'hidden'
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3.5">
                      <div>
                        <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                          {activeTab === 'transactions' ? 'Transactions' : 'Recent Ledger Activity'}
                        </h2>
                        <p className="text-xs text-slate-500">
                          {activeTab === 'transactions'
                            ? 'Bills and settlements across all your spaces'
                            : 'Latest bills and settlements across all your rooms'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeTab === 'groups' && (
                          <button
                            type="button"
                            onClick={() => handleTabSwitch('transactions')}
                            className="rounded-xl px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                          >
                            See all
                            <span aria-hidden="true"> →</span>
                          </button>
                        )}
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
                              className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
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
                    </div>

                    {recentTransactions.length === 0 ? (
                      <div className="py-8 text-center">
                        <Receipt size={22} className="mx-auto mb-2 text-slate-400" />
                        <p className="text-sm font-bold text-slate-700">No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(activeTab === 'groups'
                          ? recentTransactions.slice(0, 4)
                          : recentTransactions
                        ).map((exp) => {
                          const grp = myGroups.find((g) => g.id === exp.groupId);
                          const iPaid = exp.paidBy === user?.id;
                          const myShare = parseFloat(exp.splits?.[user?.id]) || 0;
                          const total = parseFloat(exp.totalAmount) || 0;
                          const myImpact = iPaid ? total - myShare : -myShare;

                          return (
                            <div
                              key={exp.id}
                              onClick={() => handleOpenGroup(exp.groupId, 'expenses')}
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

                {/* RIGHT 4 COLUMNS: Pinned Spaces + Live Settlements + Monthly Breakdown */}
                <div
                  className={`col-span-12 xl:col-span-4 space-y-6 ${
                    activeTab === 'groups' ? '' : 'hidden'
                  }`}
                >
                  {/* PINNED SPACES WIDGET (Desktop Right Column) */}
                  <section className="liquid-glass rounded-3xl p-5">
                    <div className="mb-3.5 flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                          Pinned Spaces
                        </h3>
                        <p className="text-[11px] text-slate-500">Quick access to your rooms</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {totalUnreadSpacesCount > 0 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                            {totalUnreadSpacesCount > 99 ? '99+' : totalUnreadSpacesCount} unread
                          </span>
                        )}
                        <span className="rounded-lg bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                          {pinnedGroups.length}
                        </span>
                      </div>
                    </div>

                    {pinnedGroups.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/40 px-4 py-8 text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Pin size={18} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          No pinned spaces
                        </p>
                        <p className="mx-auto mt-1 max-w-[200px] text-[10px] text-slate-500">
                          Pin spaces from the directory to see them here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2.5">
                        {pinnedGroups.map((group) => {
                          const unreadCount = unreadMessagesByGroup[group.id] || 0;

                          return (
                            <div
                              key={group.id}
                              onClick={() => handleOpenGroup(group.id)}
                              className="liquid-glass-interactive group flex items-center justify-between gap-3 rounded-2xl cursor-pointer px-3.5 py-3 shadow-sm"
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
                                  <div className="flex items-center gap-2">
                                    <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                      {group.name}
                                    </h3>
                                    {unreadCount > 0 && (
                                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-extrabold text-white leading-none">
                                        {unreadCount > 99 ? '99+' : unreadCount} new
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenGroup(group.id, 'chat');
                                }}
                                title="Open group chat"
                                className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                                  unreadCount > 0
                                    ? 'bg-rose-50 text-rose-600'
                                    : 'text-slate-400 hover:bg-white hover:text-blue-600'
                                }`}
                              >
                                <MessageSquare size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* BALANCES & SETTLEMENTS */}
                  <section className="liquid-glass rounded-3xl p-5">
                    <div className="mb-3.5 flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                          Balances & Settlements
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Smart optimized dues across spaces
                        </p>
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
                          const iOwe = s.from === user?.id;
                          const counterparty = getUserName(iOwe ? s.to : s.from);
                          return (
                            <div
                              key={`${s.groupId}-${idx}`}
                              onClick={() => handleOpenGroup(s.groupId, 'balances')}
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

                  {/* MONTHLY BREAKDOWN */}
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* OTHER TABS                     */}
        {/* ============================== */}
        {activeTab !== 'groups' &&
          activeTab !== 'spaces' &&
          activeTab !== 'transactions' && (
            <div className="h-full">
              {activeTab === 'monthly' && (
                <MonthlyAnalyticsTab user={user} expenses={expenses} groups={groups} />
              )}
              {activeTab === 'profile' && (
                <ProfileTabView
                  key={[user?.id, user?.username, user?.email, user?.upiId, user?.photoDataUrl].join(':')}
                  user={user}
                  onUpdateUser={onUpdateUser}
                  onLogout={onLogout}
                  showToast={showToast}
                />
              )}
            </div>
          )}
      </main>

      {/* --- NOTIFICATION CENTER / ACTIVITY RIGHT POPUP FLYOUT DRAWER --- */}
      {isActivityOpen && (
        <div
          className="fixed inset-0 z-[80] flex justify-end bg-slate-900/30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsActivityOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-sm sm:max-w-md flex-col border-l border-white/80 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl transition-transform animate-in slide-in-from-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Bell size={18} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                    Activity & Alerts
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {userNotifications.length} notification{userNotifications.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllActivity}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                  >
                    <Trash2 size={12} />
                    <span>Clear all</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsActivityOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notification Stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-hide">
              {userNotifications.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                    <CheckCircle2 size={26} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">You're all caught up!</h3>
                  <p className="mt-1 max-w-[220px] text-xs text-slate-500">
                    No new activity or dues notifications right now.
                  </p>
                </div>
              ) : (
                userNotifications.map((n) => {
                  const grp = myGroups.find((g) => g.id === n.groupId);
                  const isChat = /chat|message/i.test(n.type || n.category || '');
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.groupId) {
                          handleOpenGroup(n.groupId, isChat ? 'chat' : 'expenses');
                          setIsActivityOpen(false);
                        }
                      }}
                      className={`liquid-glass-interactive group relative flex items-start justify-between gap-3 rounded-2xl p-3 cursor-pointer border ${
                        !n.read ? 'border-blue-200/90 bg-blue-50/40' : 'border-slate-200/60 bg-white/80'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                          isChat ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isChat ? <MessageSquare size={13} /> : <Receipt size={13} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 leading-snug">
                            {n.message || 'New activity in your space'}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                            {grp && <span className="font-semibold text-blue-600">{grp.name}</span>}
                            {grp && <span>·</span>}
                            <span>
                              {n.createdAt
                                ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : 'Just now'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!n.read && (
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 ring-2 ring-white" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- QUICK EXPENSE MODAL --- */}
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
                <p className="text-xs text-slate-500">
                  Split equally across all members of the selected space
                </p>
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
                    if (gId) handleOpenGroup(gId, 'add');
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
        unreadSpacesCount={totalUnreadSpacesCount}
        onLogout={onLogout}
        user={user}
      />
    </div>
  );
}