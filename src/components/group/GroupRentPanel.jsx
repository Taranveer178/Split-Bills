import { useState } from 'react';
import { CalendarDays, Check, CircleDollarSign, Home, LoaderCircle, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const formatMonth = (month) => {
  if (!month) return '';
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

const formatMonthShort = (month) => {
  if (!month) return '';
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
};

const splitRent = (amount, memberIds) => {
  const totalCents = Math.round(amount * 100);
  const baseCents = Math.floor(totalCents / memberIds.length);
  const remainder = totalCents % memberIds.length;

  return Object.fromEntries(memberIds.map((memberId, index) => [
    memberId,
    ((baseCents + (index < remainder ? 1 : 0)) / 100).toFixed(2),
  ]));
};

export default function GroupRentPanel({
  group,
  rentRecords = [],
  currentUser,
  users = [],
  onCreateRent,
  onMarkRentPaid,
  onDeleteRent,
  showToast,
  compact = false,
  sidebar = false,
  initialMonth,
}) {
  const [selectedMonth, setSelectedMonth] = useState(() => initialMonth || getCurrentMonth());
  const [amount, setAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const rent = rentRecords.find(
    (record) => record.groupId === group.id && record.month === selectedMonth
  );
  const myShare = Number(rent?.shares?.[currentUser.id]) || 0;
  const myPayment = rent?.payments?.[currentUser.id];
  const isAdmin = group.createdBy === currentUser.id;

  const handleCreateRent = async (event) => {
    event.preventDefault();
    const totalAmount = Number.parseFloat(amount);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      showToast?.('Enter a valid rent amount.', 'error');
      return;
    }
    if (!group.members?.length) {
      showToast?.('Add members before creating a rent split.', 'error');
      return;
    }
    if (!onCreateRent) return;

    const memberIds = [...group.members];
    const now = new Date().toISOString();
    const rentId = `${group.id}__rent__${selectedMonth.replace('-', '')}`;
    const newRent = {
      id: rentId,
      groupId: group.id,
      month: selectedMonth,
      totalAmount: totalAmount.toFixed(2),
      currency: group.currency || 'INR',
      shares: splitRent(totalAmount, memberIds),
      payments: Object.fromEntries(memberIds.map((memberId) => [
        memberId,
        { paid: false, paidAt: null },
      ])),
      createdBy: currentUser.id,
      createdAt: now,
      updatedAt: now,
    };

    setIsSaving(true);
    try {
      await onCreateRent(newRent);
      setAmount('');
      showToast?.(`Rent for ${formatMonth(selectedMonth)} added.`);
    } catch (error) {
      showToast?.(error.message || 'Could not add rent.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!rent || myPayment?.paid || !onMarkRentPaid) return;
    setIsMarkingPaid(true);
    try {
      await onMarkRentPaid(rent.id, currentUser.id);
      showToast?.('Your rent share was marked as paid.');
    } catch (error) {
      showToast?.(error.message || 'Could not update rent payment.', 'error');
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const handleDeleteRent = async () => {
    if (!rent || !isAdmin || !onDeleteRent) return;
    setIsDeleting(true);
    try {
      await onDeleteRent(rent.id);
      setConfirmDelete(false);
      showToast?.(`Rent for ${formatMonth(rent.month)} deleted.`);
    } catch (error) {
      showToast?.(error.message || 'Could not delete rent.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className={`w-full min-w-0 rounded-2xl border border-slate-200/90 bg-white shadow-xs ${sidebar ? 'p-3' : compact ? 'p-4' : 'p-4 sm:p-5'}`}>
      <header className={`flex min-w-0 flex-wrap items-center justify-between gap-2 ${sidebar ? 'mb-2' : 'mb-4'}`}>
        <h2 className={`flex min-w-0 flex-1 items-center gap-2 font-bold text-slate-900 ${sidebar ? 'text-xs' : 'text-sm'}`}>
          <span className={`flex flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ${sidebar ? 'h-7 w-7' : 'h-8 w-8'}`}>
            <Home size={16} />
          </span>
          <span>Monthly rent</span>
        </h2>
        <label className="relative flex flex-shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700">
          <span>{formatMonthShort(selectedMonth)}</span>
          <CalendarDays size={14} className="flex-shrink-0 text-blue-600" />
          <input
            type="month"
            aria-label="Rent month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </header>

      {rent ? (
        sidebar ? (
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-[11px] font-medium text-slate-500">Total rent</span>
              <span className="font-mono text-sm font-bold text-slate-900">
                {formatCurrency(rent.totalAmount, rent.currency)}
              </span>
            </div>
            {myShare > 0 && (
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-medium text-slate-500">
                  Your share · {formatCurrency(myShare, rent.currency)}
                </span>
                {myPayment?.paid ? (
                  <span className="flex flex-shrink-0 items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <Check size={13} /> Paid
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkPaid}
                    disabled={isMarkingPaid}
                    className="flex-shrink-0 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                  >
                    {isMarkingPaid ? 'Saving…' : 'Mark paid'}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
        <div>
          <div className="border-b border-slate-100 pb-3">
            <p className="text-xs font-medium text-slate-500">Total rent</p>
            <p className="mt-0.5 font-mono text-xl font-bold text-slate-900">
              {formatCurrency(rent.totalAmount, rent.currency)}
            </p>
          </div>

          <div className="mt-2 divide-y divide-slate-100">
            {group.members.map((memberId) => {
              const member = users.find((item) => item.id === memberId);
              const payment = rent.payments?.[memberId];
              const isMe = memberId === currentUser.id;

              return (
                <div key={memberId} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0 truncate text-xs font-semibold text-slate-700">
                    {isMe ? 'You' : member?.username || 'Roommate'}
                  </span>
                  <span className="flex flex-shrink-0 items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {formatCurrency(rent.shares?.[memberId] || 0, rent.currency)}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${payment?.paid ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {payment?.paid ? <Check size={13} /> : <CircleDollarSign size={13} />}
                      {payment?.paid ? 'Paid' : 'Due'}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {myShare > 0 && !myPayment?.paid && (
            <button
              type="button"
              onClick={handleMarkPaid}
              disabled={isMarkingPaid}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
            >
              {isMarkingPaid ? <LoaderCircle size={15} className="animate-spin" /> : <Check size={15} />}
              Mark my share as paid
            </button>
          )}
          {myShare > 0 && myPayment?.paid && (
            <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2 text-xs font-semibold text-emerald-700">
              <Check size={14} /> Your share is marked paid
            </p>
          )}
          {isAdmin && onDeleteRent && (
            confirmDelete ? (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs font-semibold text-rose-800">
                  Delete this month’s rent and all payment statuses?
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    disabled={isDeleting}
                    className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-60"
                  >
                    <X size={14} /> Keep rent
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteRent}
                    disabled={isDeleting}
                    className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-rose-600 text-xs font-bold text-white disabled:opacity-60"
                  >
                    {isDeleting ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete rent
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                <Trash2 size={14} /> Delete rent
              </button>
            )
          )}
        </div>
        )
      ) : (
        <form onSubmit={handleCreateRent}>
          <label className={`${sidebar ? 'block' : 'mb-3 block'} text-xs font-semibold text-slate-700`}>
            {!sidebar && 'Total rent amount'}
            <input
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder={sidebar ? 'Total rent amount' : '0.00'}
              aria-label="Total rent amount"
              className={`${sidebar ? 'mb-2 h-9' : 'mt-1.5 h-11'} block w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-mono text-slate-900 outline-none focus:border-blue-500`}
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex ${sidebar ? 'h-9' : 'h-10'} w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60`}
          >
            {isSaving ? <LoaderCircle size={15} className="animate-spin" /> : <Home size={15} />}
            Add rent and split
          </button>
        </form>
      )}
    </section>
  );
}
