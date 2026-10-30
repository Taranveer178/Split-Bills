import { Plus } from 'lucide-react';

export default function DashboardBalanceCard({
  netBalance,
  totalOwedToYou,
  totalYouOwe,
  monthLabel,
  monthlyShare,
  onAddBill,
  onMonthlyShareClick,
  dark = false,
}) {
  const netBalanceLabel = netBalance > 0.01
    ? 'To receive'
    : netBalance < -0.01
      ? 'To pay'
      : 'Settled';

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.16)] ${
        dark
          ? 'border-white/15 bg-zinc-900/95 text-white'
          : 'border-slate-200/80 bg-white text-slate-900'
      }`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Net Position
          </span>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className={`font-mono text-2xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
              {netBalance > 0.01
                ? `+₹${netBalance.toFixed(0)}`
                : netBalance < -0.01
                  ? `-₹${Math.abs(netBalance).toFixed(0)}`
                  : '₹0'}
            </span>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {netBalanceLabel}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddBill}
          className="inline-flex h-9 items-center gap-1.5 rounded-2xl border border-blue-700 bg-blue-700 px-3 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add Bill</span>
        </button>
      </div>

      <div className={`relative z-10 mt-3 grid grid-cols-3 divide-x rounded-2xl border p-2 text-center ${
        dark
          ? 'divide-white/10 border-white/10 bg-black/50'
          : 'divide-slate-200 border-slate-200/80 bg-slate-50/70'
      }`}>
        <div>
          <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>To Receive</p>
          <p className="mt-0.5 font-mono text-xs font-extrabold text-emerald-700">
            +₹{totalOwedToYou.toFixed(0)}
          </p>
        </div>
        <div>
          <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>To Pay</p>
          <p className="mt-0.5 font-mono text-xs font-extrabold text-rose-700">
            -₹{totalYouOwe.toFixed(0)}
          </p>
        </div>
        <button
          type="button"
          onClick={onMonthlyShareClick}
          className="text-center"
        >
          <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            {monthLabel} Share
          </p>
          <p className={`mt-0.5 font-mono text-xs font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
            ₹{monthlyShare.toFixed(0)}
          </p>
        </button>
      </div>
    </div>
  );
}
