import { AlertTriangle, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export default function ActiveDisputesPanel({
  disputes,
  groups,
  onOpenDispute,
  compact = false,
  inline = false,
}) {
  if (!disputes.length) return null;

  return (
    <section className={inline ? 'mb-3.5' : `rounded-2xl border border-amber-200/80 bg-amber-50/80 ${compact ? 'p-3.5' : 'p-4'}`}>
      {!inline && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-900">
            <AlertTriangle size={14} />
            Active disputes
          </h2>
          <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">
            {disputes.length}
          </span>
        </div>
      )}
      <div className={inline ? 'space-y-2.5' : 'space-y-1.5'}>
        {disputes.map((expense) => {
          const group = groups.find((item) => item.id === expense.groupId);
          return (
            <button
              key={expense.id}
              type="button"
              onClick={() => onOpenDispute?.(expense)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl text-left transition-all cursor-pointer shadow-sm ${
                inline
                  ? 'border border-amber-200/80 bg-amber-50/70 p-3 hover:bg-amber-50'
                  : 'gap-2 rounded-xl border border-amber-200/70 bg-white/80 px-3 py-2 hover:bg-white'
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-slate-900">
                  {expense.title || 'Expense'}
                </span>
                <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-500">
                  {group?.name || 'Group'}{expense.activeDisputeByName ? ` · raised by ${expense.activeDisputeByName}` : ''}
                </span>
              </span>
              <span className="flex flex-shrink-0 items-center gap-2">
                <span className="block font-mono text-xs font-bold text-slate-800">
                  {formatCurrency(expense.totalAmount, group?.currency)}
                </span>
                {inline ? (
                  <span className="inline-flex items-center gap-1 rounded-xl bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                    <AlertTriangle size={11} />
                    Dispute
                  </span>
                ) : (
                  <ChevronRight size={13} className="text-amber-700" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
