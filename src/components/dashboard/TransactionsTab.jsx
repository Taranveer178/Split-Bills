import { ChevronDown, ChevronRight, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export default function TransactionsTab({
  transactions,
  groups,
  user,
  users = [],
  getUserName,
  onOpenGroup,
  preview = false,
  onSeeAll,
  ledgerFilter = 'all',
  onLedgerFilterChange,
}) {
  const visibleTransactions = preview ? transactions.slice(0, 4) : transactions;

  return (
    <section>
      {!preview && (
        <div className="mb-4 flex items-center justify-between gap-2.5">
          <div className="page-heading flex min-w-0 items-center gap-2.5 rounded-full p-0 pr-4">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-blue-600 text-xs font-bold text-white shadow-sm">
              {user?.photoDataUrl ? (
                <img src={user.photoDataUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                (user?.username || 'U').charAt(0).toUpperCase()
              )}
            </span>
            <h2 className="truncate text-sm font-extrabold tracking-tight text-slate-900">
              Transactions
            </h2>
          </div>
          <div className="filter-segmented hidden items-center gap-0.5 rounded-full p-1 md:flex">
            {[
              { id: 'all', label: 'All' },
              { id: 'mine', label: 'Paid by Me' },
              { id: 'settlements', label: 'Settlements' },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => onLedgerFilterChange?.(filter.id)}
                aria-pressed={ledgerFilter === filter.id}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  ledgerFilter === filter.id
                    ? 'filter-segmented__active text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <label className="page-heading-controls relative flex h-10 flex-shrink-0 items-center gap-2 rounded-full pl-3 pr-2.5 text-xs font-semibold text-slate-700 md:hidden">
            <span className="pointer-events-none">{ledgerFilter === 'mine' ? 'Paid by Me' : ledgerFilter === 'settlements' ? 'Settlements' : 'All'}</span>
            <ChevronDown size={14} className="pointer-events-none text-slate-400" />
            <select
              aria-label="Filter transactions"
              value={ledgerFilter}
              onChange={(event) => onLedgerFilterChange?.(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            >
              <option value="all">All</option>
              <option value="mine">Paid by Me</option>
              <option value="settlements">Settlements</option>
            </select>
          </label>
        </div>
      )}
      {preview && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3.5">
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">
            Recent Ledger Activity
          </h2>
          {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="rounded-xl px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-50"
          >
            See all transactions
            <span aria-hidden="true"> →</span>
          </button>
          )}
        </div>
      )}

      {visibleTransactions.length === 0 ? (
        <div className="py-8 text-center">
          <Receipt size={22} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleTransactions.map((expense) => {
            const group = groups.find((item) => item.id === expense.groupId);
            const iPaid = expense.paidBy === user.id;
            const myShare = parseFloat(expense.splits?.[user.id]) || 0;
            const total = parseFloat(expense.totalAmount) || 0;
            const myImpact = iPaid ? total - myShare : -myShare;
            const currency = group?.currency;
            const splitNames = Object.entries(expense.splits || {})
              .filter(([, amount]) => parseFloat(amount) > 0)
              .map(([memberId]) => (
                users.find((member) => member.id === memberId)?.username ||
                (memberId === user.id ? user.username : getUserName(memberId)) ||
                'Roommate'
              ));

            return (
              <div
                key={expense.id}
                onClick={() => onOpenGroup(expense.groupId, 'expenses')}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/60 px-3.5 py-3 transition-all hover:bg-white/95"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                    <Receipt size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {expense.title}
                      </p>
                      <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        {group?.name || 'Room'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">
                        {iPaid ? 'You' : getUserName(expense.paidBy)}
                      </span>{' '}
                      paid {formatCurrency(total, currency)} via {expense.paymentMethod || 'UPI'} ·{' '}
                      {expense.date}
                    </p>
                    <p className="mt-0.5 max-w-[min(65vw,28rem)] truncate text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">Split: </span>
                      {splitNames.join(', ')}
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
                        ? `+${formatCurrency(myImpact, currency)}`
                        : myImpact < -0.01
                          ? `-${formatCurrency(Math.abs(myImpact), currency)}`
                          : formatCurrency(total, currency)}
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
  );
}
