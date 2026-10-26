import { useState } from 'react';
import { CalendarDays, Check, CircleDollarSign, Home, LoaderCircle } from 'lucide-react';
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
  showToast,
  compact = false,
}) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [amount, setAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  const rent = rentRecords.find(
    (record) => record.groupId === group.id && record.month === selectedMonth
  );
  const myShare = Number(rent?.shares?.[currentUser.id]) || 0;
  const myPayment = rent?.payments?.[currentUser.id];

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

  return (
    <section className={`rounded-2xl border border-slate-200/90 bg-white shadow-xs ${compact ? 'p-4' : 'p-4 sm:p-5'}`}>
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-sm font-bold text-slate-900">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Home size={16} />
          </span>
          <span>Monthly rent</span>
        </h2>
        <label className="flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700">
          <CalendarDays size={14} className="flex-shrink-0 text-slate-500" />
          <span className="sr-only">Rent month</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="w-[116px] min-w-0 bg-transparent text-xs outline-none"
          />
        </label>
      </header>

      {rent ? (
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Total rent · {formatMonth(rent.month)}</p>
              <p className="mt-0.5 font-mono text-xl font-bold text-slate-900">
                {formatCurrency(rent.totalAmount, rent.currency)}
              </p>
            </div>
            <p className="max-w-[12rem] text-right text-[11px] leading-relaxed text-slate-500">
              Separate from shared expense balances
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
        </div>
      ) : (
        <form onSubmit={handleCreateRent}>
          <p className="mb-3 text-xs leading-relaxed text-slate-500">
            Add this month’s rent. It will be split evenly and tracked separately from expenses.
          </p>
          <label className="mb-3 block text-xs font-semibold text-slate-700">
            Total rent amount
            <input
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="mt-1.5 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-mono text-slate-900 outline-none focus:border-blue-500"
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? <LoaderCircle size={15} className="animate-spin" /> : <Home size={15} />}
            Add rent and split
          </button>
        </form>
      )}
    </section>
  );
}
