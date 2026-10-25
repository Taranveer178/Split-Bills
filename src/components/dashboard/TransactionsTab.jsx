import { ChevronRight, Receipt } from 'lucide-react';

export default function TransactionsTab({
  transactions,
  groups,
  user,
  getUserName,
  onOpenGroup,
  preview = false,
  onSeeAll,
}) {
  const visibleTransactions = preview ? transactions.slice(0, 4) : transactions;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3.5">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">
            {preview ? 'Recent Ledger Activity' : 'Transactions'}
          </h2>
          <p className="text-xs text-slate-500">
            {preview
              ? 'Latest bills and settlements across all your rooms'
              : 'Bills and settlements across all your spaces'}
          </p>
        </div>
        {preview && (
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
                      paid ₹{total.toFixed(2)} via {expense.paymentMethod || 'UPI'} ·{' '}
                      {expense.date}
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
  );
}
