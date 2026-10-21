import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Receipt,
  Trash2,
  Check,
  AlertCircle,
  X,
  Calendar,
  CreditCard,
  User,
  Users,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  SlidersHorizontal,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Zap,
  IndianRupee,
} from 'lucide-react';
import { Button } from '../common/UI';

const getCategoryMeta = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('dinner') || cat.includes('snack') || cat.includes('grocer')) {
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      icon: <Utensils size={16} />,
    };
  }
  if (cat.includes('travel') || cat.includes('petrol') || cat.includes('fuel') || cat.includes('cab')) {
    return {
      bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
      icon: <Car size={16} />,
    };
  }
  if (cat.includes('rent') || cat.includes('wifi') || cat.includes('bill') || cat.includes('electricity')) {
    return {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <Home size={16} />,
    };
  }
  if (cat.includes('shop') || cat.includes('cloth') || cat.includes('mart')) {
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      icon: <ShoppingBag size={16} />,
    };
  }
  return {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <Zap size={16} />,
  };
};

export default function ExpensesTab({
  expenses,
  currentUser,
  users = [],
  getUserName,
  onDeleteExpense,
  showToast,
}) {
  const [payerFilter, setPayerFilter] = useState('ALL');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [detailExpense, setDetailExpense] = useState(null);

  const uniquePayers = Array.from(new Set(expenses.map((e) => e.paidBy).filter(Boolean)));

  const filtered = expenses.filter((exp) => {
    if (payerFilter === 'ALL') return true;
    return exp.paidBy === payerFilter;
  });

  const canDeleteExpense = (exp) => {
    return exp.paidBy === currentUser.id || exp.createdBy === currentUser.id;
  };

  const toggleSelectMode = () => {
    if (isSelectMode) {
      setSelectedIds([]);
      setIsSelectMode(false);
    } else {
      setIsSelectMode(true);
    }
  };

  const handleCardClick = (exp) => {
    if (isSelectMode) {
      if (!canDeleteExpense(exp)) {
        showToast('Only the payer or creator can delete this bill.', 'error');
        return;
      }
      setSelectedIds((prev) =>
        prev.includes(exp.id) ? prev.filter((id) => id !== exp.id) : [...prev, exp.id]
      );
    } else {
      setDetailExpense(exp);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      for (const id of selectedIds) {
        await onDeleteExpense(id);
      }
      showToast(`Removed ${selectedIds.length} expense(s)`);
      setSelectedIds([]);
      setIsSelectMode(false);
      setShowConfirmModal(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete selected expenses', 'error');
    }
  };

  const getParticipantsList = (exp) => {
    if (!exp.splits) return [];
    return Object.keys(exp.splits).filter((id) => parseFloat(exp.splits[id]) > 0);
  };

  const getExpenseTitle = (exp) => {
    if (exp.category !== 'Settlement') return exp.title;

    const fromId = exp.settlementFrom || exp.paidBy;
    const toId =
      exp.settlementTo ||
      Object.entries(exp.splits || {}).find(
        ([memberId, amount]) => memberId !== fromId && parseFloat(amount) > 0
      )?.[0];
    if (!fromId || !toId) return exp.title;

    const prefix = exp.settlementTitlePrefix || exp.title?.split(':')[0] || 'Settlement';
    const fromName = fromId === currentUser.id ? 'You' : getUserName(fromId);
    const toName = toId === currentUser.id ? 'You' : getUserName(toId);
    return `${prefix}: ${fromName} → ${toName}`;
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Filter and Select Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs flex-1 scrollbar-hide">
          <button
            type="button"
            onClick={() => setPayerFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex-shrink-0 text-xs ${
              payerFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({expenses.length})
          </button>

          {uniquePayers.map((payerId) => {
            const isMe = payerId === currentUser.id;
            const name = isMe ? 'You' : getUserName(payerId);
            const payer = users.find((member) => member.id === payerId);
            const isSelected = payerFilter === payerId;

            return (
              <button
                key={payerId}
                type="button"
                onClick={() => setPayerFilter(payerId)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all flex-shrink-0 text-xs border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-4 h-4 overflow-hidden rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {payer?.photoDataUrl ? (
                    <img src={payer.photoDataUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </span>
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={toggleSelectMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex-shrink-0 ${
            isSelectMode
              ? 'bg-slate-900 border-slate-900 text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Select multiple expenses"
        >
          {isSelectMode ? (
            <>
              <X size={13} />
              <span>Done</span>
            </>
          ) : (
            <>
              <SlidersHorizontal size={13} />
              <span>Select</span>
            </>
          )}
        </button>
      </div>

      {/* Expenses Feed */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white px-6 py-12 text-center shadow-xs">
          <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Receipt size={20} />
          </div>
          <h2 className="text-sm font-bold text-slate-900">No transactions recorded</h2>
          <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
            {payerFilter !== 'ALL'
              ? 'No bills match this roommate filter.'
              : 'Add a shared bill to start tracking balances.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          {filtered.map((exp) => {
            const iPaid = exp.paidBy === currentUser.id;
            const hasAccess = canDeleteExpense(exp);
            const isSelected = selectedIds.includes(exp.id);
            const myShare = exp.splits ? exp.splits[currentUser.id] : 0;
            const participants = getParticipantsList(exp);
            const catMeta = getCategoryMeta(exp.category);

            let statusAmount = null;
            let isPositive = false;
            let isInvolved = false;

            if (iPaid) {
              const totalOthersOwe =
                parseFloat(exp.totalAmount) - (myShare ? parseFloat(myShare) : 0);
              if (totalOthersOwe > 0) {
                statusAmount = `+₹${totalOthersOwe.toFixed(2)}`;
                isPositive = true;
                isInvolved = true;
              } else {
                statusAmount = `₹${parseFloat(exp.totalAmount).toFixed(2)}`;
              }
            } else if (myShare && parseFloat(myShare) > 0) {
              statusAmount = `-₹${parseFloat(myShare).toFixed(2)}`;
              isPositive = false;
              isInvolved = true;
            }

            return (
              <div
                key={exp.id}
                onClick={() => handleCardClick(exp)}
                className={`group flex items-center justify-between gap-3 p-3.5 sm:p-4 transition-colors cursor-pointer ${
                  isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${catMeta.bg}`}
                  >
                    {catMeta.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {getExpenseTitle(exp)}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {exp.paymentMethod || 'UPI'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">
                        {iPaid ? 'You' : getUserName(exp.paidBy)}
                      </span>{' '}
                      paid{' '}
                      <span className="font-bold text-slate-900 font-mono">
                        ₹{parseFloat(exp.totalAmount).toFixed(2)}
                      </span>{' '}
                      · {participants.length} split
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="text-right">
                    {statusAmount ? (
                      <div
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
                          isInvolved
                            ? isPositive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                              : 'bg-rose-50 text-rose-600 border border-rose-200/80'
                            : 'text-slate-500 bg-slate-100'
                        }`}
                      >
                        {isInvolved &&
                          (isPositive ? (
                            <ArrowUpRight size={12} className="text-emerald-600" />
                          ) : (
                            <ArrowDownLeft size={12} className="text-rose-600" />
                          ))}
                        <span>{statusAmount}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">Not involved</span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5">{exp.date}</div>
                  </div>

                  {isSelectMode ? (
                    hasAccess ? (
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center opacity-40">
                        <span className="text-[10px] text-slate-400">✕</span>
                      </div>
                    )
                  ) : (
                    <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expense Details Modal */}
      {detailExpense &&
        createPortal(
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setDetailExpense(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-5 bg-white border border-slate-200 shadow-xl"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                      getCategoryMeta(detailExpense.category).bg
                    }`}
                  >
                    {getCategoryMeta(detailExpense.category).icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">
                      {getExpenseTitle(detailExpense)}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {detailExpense.category || 'General'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailExpense(null)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-3.5 text-center mb-3.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Bill
                </span>
                <div className="text-2xl font-bold font-mono flex items-center justify-center gap-0.5 mt-0.5">
                  <IndianRupee size={18} />
                  <span>{parseFloat(detailExpense.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3.5 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <div className="text-slate-400 font-medium flex items-center gap-1 mb-0.5 text-[11px]">
                    <User size={12} />
                    <span>Paid By</span>
                  </div>
                  <div className="font-bold text-slate-900 truncate">
                    {detailExpense.paidBy === currentUser.id
                      ? 'You'
                      : getUserName(detailExpense.paidBy)}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <div className="text-slate-400 font-medium flex items-center gap-1 mb-0.5 text-[11px]">
                    <CreditCard size={12} />
                    <span>Method</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    {detailExpense.paymentMethod || 'UPI'}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <div className="text-slate-400 font-medium flex items-center gap-1 mb-0.5 text-[11px]">
                    <Calendar size={12} />
                    <span>Date</span>
                  </div>
                  <div className="font-bold text-slate-900">{detailExpense.date}</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <div className="text-slate-400 font-medium flex items-center gap-1 mb-0.5 text-[11px]">
                    <Users size={12} />
                    <span>Split</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    {getParticipantsList(detailExpense).length} members
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Member Shares
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-hide">
                  {Object.entries(detailExpense.splits || {}).map(([memberId, shareAmount]) => {
                    const numShare = parseFloat(shareAmount);
                    if (numShare <= 0) return null;
                    const isUser = memberId === currentUser.id;
                    return (
                      <div
                        key={memberId}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 text-xs"
                      >
                        <span className="font-semibold text-slate-800">
                          {isUser ? 'You' : getUserName(memberId)}
                        </span>
                        <span className="font-bold font-mono text-slate-900">
                          ₹{numShare.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={() => setDetailExpense(null)}
                className="w-full py-2 text-xs"
              >
                Close
              </Button>
            </div>
          </div>,
          document.body
        )}

      {/* Selection Bar */}
      {isSelectMode && selectedIds.length > 0 && (
        <div className="fixed bottom-16 left-4 right-4 max-w-sm mx-auto z-40">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between">
            <span className="text-xs font-semibold">{selectedIds.length} selected</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 font-semibold"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-xl border border-slate-200 text-center">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 border border-rose-200">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Delete {selectedIds.length} bill(s)?
              </h3>
              <p className="text-slate-500 text-xs mb-4">
                This will recalculate balances for all group members.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmModal(false)}
                  className="py-2 text-xs"
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete} className="py-2 text-xs">
                  Delete
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}