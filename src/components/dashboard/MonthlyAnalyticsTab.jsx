import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  Receipt,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Zap,
  HelpCircle,
  X,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';

const CATEGORY_META = {
  Food: {
    color: 'bg-amber-500',
    softBg: 'bg-amber-50 border-amber-200/80 text-amber-700',
    icon: <Utensils size={14} />,
  },
  Travel: {
    color: 'bg-sky-500',
    softBg: 'bg-sky-50 border-sky-200/80 text-sky-700',
    icon: <Car size={14} />,
  },
  Rent: {
    color: 'bg-slate-800',
    softBg: 'bg-slate-100 border-slate-200 text-slate-700',
    icon: <Home size={14} />,
  },
  Utilities: {
    color: 'bg-blue-500',
    softBg: 'bg-blue-50 border-blue-200/80 text-blue-700',
    icon: <Zap size={14} />,
  },
  Shopping: {
    color: 'bg-emerald-600',
    softBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-700',
    icon: <ShoppingBag size={14} />,
  },
  Other: {
    color: 'bg-slate-400',
    softBg: 'bg-slate-50 border-slate-200 text-slate-600',
    icon: <HelpCircle size={14} />,
  },
};

const getCategoryMeta = (name = 'Other') => CATEGORY_META[name] || CATEGORY_META.Other;

export default function MonthlyAnalyticsTab({ user, expenses = [], groups = [] }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const userId = user?.id;

  const formattedMonthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handleMonthChange = (event) => {
    if (!event.target.value) return;
    const [selectedYear, selectedMonth] = event.target.value.split('-').map(Number);
    setCurrentDate(new Date(selectedYear, selectedMonth - 1, 1));
  };

  const monthlyExpenses = useMemo(() => {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return expenses.filter((exp) => exp.date && exp.date.startsWith(monthPrefix));
  }, [expenses, year, month]);

  const spendingExpenses = useMemo(
    () =>
      monthlyExpenses.filter(
        (expense) => !expense.isSettlement && expense.category !== 'Settlement'
      ),
    [monthlyExpenses]
  );

  const stats = useMemo(() => {
    let totalGroupSpent = 0;
    let yourShareTotal = 0;
    let youPaidTotal = 0;
    const categoryTotals = {};

    spendingExpenses.forEach((exp) => {
      const amount = parseFloat(exp.totalAmount) || 0;
      totalGroupSpent += amount;

      if (exp.paidBy === userId) {
        youPaidTotal += amount;
      }

      if (exp.splits && exp.splits[userId]) {
        yourShareTotal += parseFloat(exp.splits[userId]) || 0;
      }

      const cat = exp.category || 'Other';
      const personalShare = parseFloat(exp.splits?.[userId]) || 0;
      if (personalShare > 0) {
        categoryTotals[cat] = (categoryTotals[cat] || 0) + personalShare;
      }
    });

    const categoryList = Object.entries(categoryTotals)
      .map(([name, total]) => ({
        name,
        total,
        percentage: yourShareTotal > 0 ? ((total / yourShareTotal) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return { totalGroupSpent, yourShareTotal, youPaidTotal, categoryList };
  }, [spendingExpenses, userId]);

  const breakdownExpenses =
    selectedBreakdown?.type === 'paid'
      ? spendingExpenses.filter((expense) => expense.paidBy === userId)
      : selectedBreakdown?.type === 'share'
        ? spendingExpenses.filter((expense) => (parseFloat(expense.splits?.[userId]) || 0) > 0)
        : selectedBreakdown?.type === 'category'
          ? spendingExpenses.filter(
              (expense) =>
                (expense.category || 'Other') === selectedBreakdown.category &&
                (parseFloat(expense.splits?.[userId]) || 0) > 0
            )
          : spendingExpenses;

  const breakdownTotal = breakdownExpenses.reduce(
    (total, expense) =>
      total +
      (selectedBreakdown?.type === 'share' || selectedBreakdown?.type === 'category'
        ? parseFloat(expense.splits?.[userId]) || 0
        : parseFloat(expense.totalAmount) || 0),
    0
  );
  const netBalance = stats.youPaidTotal - stats.yourShareTotal;

  const openBreakdown = (type, title, category) => {
    setSelectedBreakdown({ type, title, category });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6 lg:p-8 pb-20">
      {/* Header & Month Switcher */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="page-heading flex min-w-0 items-center gap-2.5 rounded-full p-0 pr-4">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-gradient-to-tr from-blue-600 to-blue-600 text-xs font-bold text-white shadow-sm">
            {user?.photoDataUrl ? (
              <img src={user.photoDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              (user?.username || 'U').charAt(0).toUpperCase()
            )}
          </span>
          <h1 className="truncate text-sm font-extrabold tracking-tight text-slate-900">
            Monthly
          </h1>
        </div>

        <label className="page-heading-controls relative flex h-10 min-w-0 max-w-[58%] flex-shrink items-center gap-2 rounded-full px-3 text-xs font-semibold text-slate-700">
          <CalendarDays size={14} className="flex-shrink-0 text-blue-600" />
          <span className="truncate">{formattedMonthLabel}</span>
          <ChevronDown size={14} className="flex-shrink-0 text-slate-400" />
          <input
            type="month"
            aria-label="Choose report month"
            value={`${year}-${String(month + 1).padStart(2, '0')}`}
            onChange={handleMonthChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>

      {/* 3-Card Summary Row */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => openBreakdown('paid', 'You Paid Out')}
          className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 text-left shadow-xs transition-colors hover:border-slate-300"
          aria-label={`View expenses you paid, totaling ₹${stats.youPaidTotal.toFixed(2)}`}
        >
          <div>
            <p className="text-xs font-medium text-slate-500">Total I Paid</p>
            <p className="mt-1 font-mono text-xl font-bold text-slate-900">
              ₹{stats.youPaidTotal.toFixed(2)}
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <ArrowUpRight size={18} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => openBreakdown('share', 'My Share')}
          className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 text-left shadow-xs transition-colors hover:border-slate-300"
          aria-label={`View your expense shares, totaling ₹${stats.yourShareTotal.toFixed(2)}`}
        >
          <div>
            <p className="text-xs font-medium text-slate-500">My Share</p>
            <p className="mt-1 font-mono text-xl font-bold text-slate-900">
              ₹{stats.yourShareTotal.toFixed(2)}
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Receipt size={18} />
          </span>
        </button>

        <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {netBalance > 0
                ? 'Net to Receive'
                : netBalance < 0
                  ? 'Net to Pay'
                  : 'Monthly Net'}
            </p>
            <p
              className={`mt-1 font-mono text-xl font-bold ${
                netBalance > 0
                  ? 'text-emerald-600'
                  : netBalance < 0
                    ? 'text-rose-600'
                    : 'text-slate-900'
              }`}
            >
              {netBalance > 0 ? '+' : netBalance < 0 ? '-' : ''}₹{Math.abs(netBalance).toFixed(2)}
            </p>
          </div>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              netBalance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {netBalance >= 0 ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Spending by Category</h2>
          </div>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {spendingExpenses.length} bill{spendingExpenses.length === 1 ? '' : 's'}
          </span>
        </div>

        {stats.categoryList.length === 0 ? (
          <div className="py-10 text-center">
            <Receipt size={24} className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">No expenses logged</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Nothing recorded for {formattedMonthLabel}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.categoryList.map((cat) => {
              const meta = getCategoryMeta(cat.name);
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => openBreakdown('category', `${cat.name} Spending`, cat.name)}
                  className="w-full rounded-xl border border-transparent p-2.5 text-left transition-colors hover:border-slate-200 hover:bg-slate-50"
                  aria-label={`View ${cat.name} expenses, totaling ₹${cat.total.toFixed(2)}`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border ${meta.softBg}`}
                      >
                        {meta.icon}
                      </span>
                      <span className="font-semibold text-slate-900">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono">
                      <span className="text-[11px] text-slate-400">{cat.percentage}%</span>
                      <span className="font-bold text-slate-900">₹{cat.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${meta.color}`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedBreakdown &&
        createPortal(
          <div
            className="app-modal-overlay fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
            onClick={() => setSelectedBreakdown(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="spending-breakdown-title"
              className="app-modal-surface relative z-[121] flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3.5">
                <div className="min-w-0">
                  <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <CalendarDays size={13} /> {formattedMonthLabel}
                  </p>
                  <h3
                    id="spending-breakdown-title"
                    className="text-base font-bold text-slate-900"
                  >
                    {selectedBreakdown.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs font-semibold text-emerald-700">
                    ₹{breakdownTotal.toFixed(2)} · {breakdownExpenses.length} expense
                    {breakdownExpenses.length === 1 ? '' : 's'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBreakdown(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close spending details"
                >
                  <X size={16} />
                </button>
              </header>
              <div className="breakdown-scrollbar min-h-0 flex-1 overflow-y-auto pt-3">
                {breakdownExpenses.length === 0 ? (
                  <p className="px-4 py-8 text-center text-xs text-slate-500">
                    No matching expenses for this month.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {breakdownExpenses
                      .slice()
                      .sort((first, second) => (second.date || '').localeCompare(first.date || ''))
                      .map((expense) => {
                        const groupName =
                          groups.find((group) => group.id === expense.groupId)?.name || 'Group';
                        const payerName =
                          expense.paidBy === user?.id ? 'Paid by you' : 'Paid by member';
                        return (
                          <li
                            key={expense.id}
                            className="flex items-center justify-between gap-3 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-900">
                                {expense.title || expense.category || 'Expense'}
                              </p>
                              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                {groupName} · {expense.category || 'Other'} · {payerName}
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <span className="block font-mono text-xs font-bold text-slate-900">
                                ₹
                                {(selectedBreakdown.type === 'share' ||
                                selectedBreakdown.type === 'category'
                                  ? parseFloat(expense.splits?.[userId]) || 0
                                  : parseFloat(expense.totalAmount) || 0
                                ).toFixed(2)}
                              </span>
                              {(selectedBreakdown.type === 'share' ||
                                selectedBreakdown.type === 'category') && (
                                <span className="block text-[10px] text-slate-400">
                                  of ₹{(parseFloat(expense.totalAmount) || 0).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            </section>
          </div>,
          document.body
        )}
    </div>
  );
}