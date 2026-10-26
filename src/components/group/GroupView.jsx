import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  Plus,
  Settings,
  Wallet,
  MessageSquare,
  Users,
  CheckCircle2,
  Copy,
  CircleDollarSign,
  X,
} from 'lucide-react';

import PrimaryNav from '../common/PrimaryNav';
import AddExpenseTab from './AddExpenseTab';
import BalancesTab from './BalancesTab';
import ExpensesTab from './ExpensesTab';
import MembersTab from './MembersTab';
import GroupRentPanel from './GroupRentPanel';
import ChatTab from './ChatTab';
import { calculateSettlements } from '../../utils/settlement';
import { formatCurrency } from '../../utils/currency';

export default function GroupView({
  group,
  initialTab = 'expenses',
  onGroupTabChange,
  onActiveChatChange,
  unreadChatCount = 0,
  onMarkChatNotificationsRead,
  groups = [],
  expenses,
  monthlyRents = [],
  onSaveExpense,
  onCreateRent,
  onMarkRentPaid,
  onDeleteRent,
  onDeleteExpense,
  onDeleteGroup,
  onUpdateGroup,
  onSendNotification,
  users,
  currentUser,
  onBack,
  onNavigateDashboard,
  dashboardTab = 'groups',
  showToast,
}) {
  const activeTab = initialTab;
  const [rentPopupOpen, setRentPopupOpen] = useState(false);

  const getUserName = (userId) => users.find((user) => user.id === userId)?.username || 'Unknown';
  const sortedExpenses = useMemo(
    () =>
      [...expenses].sort(
        (first, second) => new Date(second.createdAt) - new Date(first.createdAt)
      ),
    [expenses]
  );

  const { balances, settlements } = useMemo(
    () => calculateSettlements(expenses, group.members || []),
    [expenses, group.members]
  );
  const myBalance = balances[currentUser.id] || 0;
  const unpaidRent = useMemo(
    () => monthlyRents
      .filter((rent) => (
        rent.groupId === group.id &&
        Number(rent.shares?.[currentUser.id]) > 0 &&
        !rent.payments?.[currentUser.id]?.paid
      ))
      .sort((first, second) => second.month.localeCompare(first.month))[0] || null,
    [monthlyRents, group.id, currentUser.id]
  );
  const totalRoomSpend = useMemo(
    () =>
      expenses
        .filter((e) => !e.isSettlement && e.category !== 'Settlement')
        .reduce((sum, e) => sum + (parseFloat(e.totalAmount) || 0), 0),
    [expenses]
  );

  useEffect(() => {
    window.history.pushState({ tab: activeTab }, '');

    const handleHardwareBack = (e) => {
      e.preventDefault();
      if (activeTab !== 'expenses') {
        onGroupTabChange?.('expenses');
      } else {
        onBack();
      }
    };

    window.addEventListener('popstate', handleHardwareBack);
    return () => window.removeEventListener('popstate', handleHardwareBack);
  }, [activeTab, onBack, onGroupTabChange]);

  useEffect(() => {
    onActiveChatChange?.(activeTab === 'chat' ? group.id : null);
    return () => onActiveChatChange?.(null);
  }, [activeTab, group.id, onActiveChatChange]);

  useEffect(() => {
    if (activeTab === 'chat') onMarkChatNotificationsRead?.(group.id);
  }, [activeTab, group.id, onMarkChatNotificationsRead]);

  const handleTabSelect = (tab) => {
    onGroupTabChange?.(tab);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white font-sans md:flex-row">

      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* LIQUID GLASS HEADER */}
        <header className="group-view-header z-30 flex h-14 sm:h-16 flex-shrink-0 items-center justify-between border-b border-white/80 bg-white/75 px-3 sm:px-5 backdrop-blur-2xl shadow-sm">
          {/* Left: Back + Group Identity */}
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <button
              type="button"
              onClick={() => onNavigateDashboard(dashboardTab)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-white/80 hover:text-slate-900 flex-shrink-0 transition-colors"
              title="Back to Dashboard"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={19} />
            </button>

            <div
              onClick={() => handleTabSelect('expenses')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none"
              title="View Expenses"
            >
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-blue-600 text-sm font-extrabold text-white shadow-sm">
                {group.imageDataUrl ? (
                  <img src={group.imageDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  (group.name || 'G').charAt(0).toUpperCase()
                )}
              </span>

              <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-sm sm:text-base leading-tight font-extrabold text-slate-900 truncate tracking-tight">
                  {group.name}
                </h1>
                <p className="text-xs leading-tight font-semibold text-slate-500 mt-0.5 truncate">
                  {group.members.length} members · {formatCurrency(totalRoomSpend, group.currency, 0)} spent
                </p>
              </div>
            </div>
          </div>

          {/* Right: Segmented Liquid Glass Tabs + Quick Add */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="group-view-tabbar flex items-center gap-1 rounded-2xl bg-slate-200/70 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleTabSelect('balances')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'balances'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Balances"
              >
                <Wallet size={19} />
                <span className="hidden sm:inline">Balances</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSelect('chat')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={unreadChatCount > 0 && activeTab !== 'chat'
                  ? `Chat (${unreadChatCount} unread)`
                  : 'Chat'}
                aria-label={unreadChatCount > 0 && activeTab !== 'chat'
                  ? `Chat, ${unreadChatCount} unread messages`
                  : 'Chat'}
              >
                <span className="relative inline-flex">
                  <MessageSquare size={19} />
                  {unreadChatCount > 0 && activeTab !== 'chat' && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-600"
                    />
                  )}
                </span>
                <span className="hidden sm:inline">Chat</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSelect('members')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'members'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Room Settings"
              >
                <Settings size={19} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleTabSelect('add')}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-600 px-3.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:opacity-95"
            >
              <Plus size={14} />
              <span>Add Bill</span>
            </button>
          </div>
        </header>

        {/* MAIN VIEWPORT */}
        <main
          className={`relative min-w-0 min-h-0 flex-1 overscroll-y-contain ${
            activeTab === 'chat'
              ? 'flex flex-col overflow-hidden pb-0'
              : 'overflow-y-auto pb-20 scrollbar-hide'
          }`}
        >
          {(activeTab === 'expenses' || !activeTab) && (
            <div className="mx-auto max-w-[1320px] p-3.5 sm:p-6 lg:p-8">
              <div className="grid grid-cols-12 gap-6 items-start">
                {/* Main Expense Ledger */}
                <div className="col-span-12 xl:col-span-8">
                  <ExpensesTab
                    expenses={sortedExpenses}
                    currency={group.currency}
                    currentUser={currentUser}
                    users={users}
                    getUserName={getUserName}
                    onDeleteExpense={onDeleteExpense}
                    showToast={showToast}
                  />
                </div>

                {/* Desktop Side Panel: Live Room Balances & Quick Info */}
                <aside className="hidden xl:block xl:col-span-4 space-y-5">
                  <div className="liquid-glass rounded-3xl p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Your Room Position
                    </span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span
                        className={`font-mono text-2xl font-extrabold ${
                          myBalance > 0.01
                            ? 'text-emerald-600'
                            : myBalance < -0.01
                              ? 'text-rose-600'
                              : 'text-slate-900'
                        }`}
                      >
                        {myBalance > 0.01
                          ? `+${formatCurrency(myBalance, group.currency)}`
                          : myBalance < -0.01
                            ? `-${formatCurrency(Math.abs(myBalance), group.currency)}`
                            : formatCurrency(0, group.currency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTabSelect('balances')}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Settle up →
                      </button>
                    </div>

                    <div className="mt-4 border-t border-slate-200/60 pt-3.5">
                      <p className="mb-2 text-xs font-extrabold text-slate-800">Active Dues</p>
                      {settlements.length === 0 ? (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 size={14} />
                          <span>All roommates are settled</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {settlements.slice(0, 4).map((s, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleTabSelect('balances')}
                              className="flex items-center justify-between rounded-2xl bg-white/70 border border-white/80 px-3 py-2 text-xs cursor-pointer hover:bg-white"
                            >
                              <span className="font-semibold text-slate-700 truncate">
                                {s.from === currentUser.id ? 'You' : getUserName(s.from)} →{' '}
                                {s.to === currentUser.id ? 'You' : getUserName(s.to)}
                              </span>
                              <span className="font-mono font-extrabold text-slate-900">
                                {formatCurrency(s.amount, group.currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="liquid-glass rounded-3xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Users size={14} className="text-blue-600" />
                        <span>Members ({group.members.length})</span>
                      </h3>
                      {group.inviteCode && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(group.inviteCode);
                            showToast?.('Invite code copied');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/80 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700 hover:bg-white"
                        >
                          <Copy size={11} />
                          <span>{group.inviteCode}</span>
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {group.members.map((mId) => {
                        const mNet = balances[mId] || 0;
                        return (
                          <div
                            key={mId}
                            className="flex items-center justify-between text-xs py-1"
                          >
                            <span className="font-bold text-slate-800">
                              {mId === currentUser.id ? 'You' : getUserName(mId)}
                            </span>
                            <span
                              className={`font-mono font-extrabold ${
                                mNet > 0.01
                                  ? 'text-emerald-600'
                                  : mNet < -0.01
                                    ? 'text-rose-600'
                                    : 'text-slate-400'
                              }`}
                            >
                              {mNet > 0.01
                                ? `+${formatCurrency(mNet, group.currency, 0)}`
                                : mNet < -0.01
                                  ? `-${formatCurrency(Math.abs(mNet), group.currency, 0)}`
                                  : formatCurrency(0, group.currency, 0)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <GroupRentPanel
                    group={group}
                    rentRecords={monthlyRents}
                    currentUser={currentUser}
                    users={users}
                    onCreateRent={onCreateRent}
                    onMarkRentPaid={onMarkRentPaid}
                    onDeleteRent={onDeleteRent}
                    showToast={showToast}
                    compact
                  />
                </aside>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <AddExpenseTab
              key={group.members.join(':')}
              group={group}
              currentUser={currentUser}
              users={users}
              getUserName={getUserName}
              onSaveExpense={onSaveExpense}
              onSendNotification={onSendNotification}
              onSaved={() => handleTabSelect('expenses')}
              showToast={showToast}
            />
          )}

          {activeTab === 'balances' && (
            <BalancesTab
              expenses={expenses}
              group={group}
              currentUser={currentUser}
              getUserName={getUserName}
              users={users}
              onSaveExpense={onSaveExpense}
              onSendNotification={onSendNotification}
              showToast={showToast}
            />
          )}

          {activeTab === 'chat' && (
            <ChatTab
              group={group}
              groups={groups}
              currentUser={currentUser}
              users={users}
              onSendNotification={onSendNotification}
              showToast={showToast}
            />
          )}

          {activeTab === 'members' && (
            <MembersTab
              group={group}
              users={users}
              currentUser={currentUser}
              expenses={expenses}
              monthlyRents={monthlyRents}
              onCreateRent={onCreateRent}
              onMarkRentPaid={onMarkRentPaid}
              onDeleteRent={onDeleteRent}
              onUpdateGroup={onUpdateGroup}
              onDeleteGroup={onDeleteGroup}
              showToast={showToast}
            />
          )}
        </main>

        {/* Mobile Floating Liquid Glass Add Expense Button */}
        {(activeTab === 'expenses' || !activeTab) && (
          <>
            {unpaidRent && (
              <button
                type="button"
                onClick={() => setRentPopupOpen(true)}
                aria-label={`View unpaid rent for ${group.name}`}
                className="fixed bottom-5 left-5 z-30 flex h-12 items-center gap-1.5 rounded-2xl border border-amber-200 bg-amber-100 px-4 text-xs font-bold text-amber-800 shadow-lg shadow-amber-900/10 transition-transform active:scale-95 sm:hidden"
                title="Rent is due"
              >
                <CircleDollarSign size={17} />
                <span>Rent</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleTabSelect('add')}
              aria-label="Add expense"
              className="fixed bottom-5 right-5 z-30 flex h-12 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-600 px-4 text-xs font-bold text-white shadow-lg shadow-blue-600/30 border border-white/25 transition-transform active:scale-95 sm:hidden"
              title="Add Expense"
            >
              <Plus size={17} strokeWidth={2.5} />
              <span>Add Bill</span>
            </button>
          </>
        )}
      </div>

      {rentPopupOpen && unpaidRent &&
        createPortal(
          <div
            className="fixed inset-0 z-[155] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md"
            onClick={() => setRentPopupOpen(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="group-rent-popup-title"
              className="app-modal-surface w-full max-w-md rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="mb-3 flex items-center justify-between gap-3 px-1">
                <h2 id="group-rent-popup-title" className="text-base font-bold text-slate-900">
                  Rent details
                </h2>
                <button
                  type="button"
                  onClick={() => setRentPopupOpen(false)}
                  aria-label="Close rent details"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X size={17} />
                </button>
              </header>
              <GroupRentPanel
                key={unpaidRent.id}
                group={group}
                rentRecords={monthlyRents}
                currentUser={currentUser}
                users={users}
                onCreateRent={onCreateRent}
                onMarkRentPaid={onMarkRentPaid}
                onDeleteRent={onDeleteRent}
                showToast={showToast}
                initialMonth={unpaidRent.month}
                compact
              />
            </section>
          </div>,
          document.body
        )}

      <PrimaryNav
        activeItem={dashboardTab}
        onNavigate={onNavigateDashboard}
        user={currentUser}
        desktopOnly
      />
    </div>
  );
}