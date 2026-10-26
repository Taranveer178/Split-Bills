import { useMemo, useState } from 'react';
import { Download, FileText, X } from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export default function TransactionExportModal({
  transactions,
  groups,
  users,
  user,
  getUserName,
  onClose,
}) {
  const [scope, setScope] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const todayDate = formatDate(now);
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);
    const ninetyDayStart = formatDate(ninetyDaysAgo);

    return transactions.filter((expense) => {
      const isSettlement = expense.isSettlement || expense.category === 'Settlement';
      if (scope === 'mine' && expense.paidBy !== user?.id) return false;
      if (scope === 'settlements' && !isSettlement) return false;
      if (dateRange === 'this-month' && (!expense.date || expense.date < monthStart || expense.date > todayDate)) {
        return false;
      }
      if (dateRange === 'last-90-days' && (!expense.date || expense.date < ninetyDayStart || expense.date > todayDate)) {
        return false;
      }
      return true;
    });
  }, [transactions, scope, dateRange, user?.id]);

  const rows = filteredTransactions.map((expense) => {
    const group = groups.find((item) => item.id === expense.groupId);
    const payer = expense.paidBy === user?.id
      ? user?.username || 'You'
      : users.find((member) => member.id === expense.paidBy)?.username || getUserName(expense.paidBy);
    return {
      date: expense.date || '',
      group: group?.name || 'Space',
      description: expense.title || expense.category || 'Expense',
      category: expense.category || 'Other',
      payer,
      paymentMethod: expense.paymentMethod || 'UPI',
      amount: Number.parseFloat(expense.totalAmount) || 0,
      currency: group?.currency || 'INR',
      settlement: expense.isSettlement || expense.category === 'Settlement' ? 'Yes' : 'No',
    };
  });

  const downloadCsv = () => {
    const headers = ['Date', 'Space', 'Description', 'Category', 'Paid by', 'Payment method', 'Amount', 'Currency', 'Settlement'];
    const csv = [headers, ...rows.map((row) => [
      row.date,
      row.group,
      row.description,
      row.category,
      row.payer,
      row.paymentMethod,
      row.amount.toFixed(2),
      row.currency,
      row.settlement,
    ])].map((line) => line.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `roomsplit-transactions-${today()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    const bodyRows = rows.map((row) => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.group)}</td><td>${escapeHtml(row.description)}</td><td>${escapeHtml(row.category)}</td><td>${escapeHtml(row.payer)}</td><td>${escapeHtml(row.paymentMethod)}</td><td>${escapeHtml(row.amount.toFixed(2))} ${escapeHtml(row.currency)}</td><td>${row.settlement}</td></tr>`).join('');
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html><head><title>SplitBills transactions</title><style>body{font:14px Arial,sans-serif;color:#172033;padding:28px}h1{font-size:22px;margin:0 0 6px}p{color:#64748b;margin:0 0 20px}table{width:100%;border-collapse:collapse}th,td{padding:9px 8px;border-bottom:1px solid #dbe2ea;text-align:left;font-size:11px}th{background:#eff6ff;color:#1e3a8a}tr{break-inside:avoid}@media print{body{padding:0}}</style></head><body><h1>SplitBills transactions</h1><p>${rows.length} transaction${rows.length === 1 ? '' : 's'} · Generated ${escapeHtml(today())}</p><table><thead><tr><th>Date</th><th>Space</th><th>Description</th><th>Category</th><th>Paid by</th><th>Method</th><th>Amount</th><th>Settlement</th></tr></thead><tbody>${bodyRows || '<tr><td colspan="8">No transactions in this selection.</td></tr>'}</tbody></table><script>window.addEventListener('load',()=>window.print());</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="app-modal-overlay fixed inset-0 z-[170] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="transaction-export-title" className="app-modal-surface relative z-[171] w-full max-w-md rounded-[24px] border p-5 shadow-2xl sm:p-6">
        <header className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600"><FileText size={18} /></span>
            <div>
              <h2 id="transaction-export-title" className="text-base font-bold text-slate-900">Export transactions</h2>
              <p className="text-xs text-slate-500">Choose which records to include</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close export dialog" className="popup-close-button flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600"><X size={17} /></button>
        </header>

        <div className="space-y-4">
          <fieldset>
            <legend className="mb-2 text-xs font-bold text-slate-700">Transactions</legend>
            <div className="transaction-export-scope grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
              {[['all', 'All'], ['mine', 'Paid by me'], ['settlements', 'Settlements']].map(([value, label]) => (
                <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(value)} className={`rounded-lg px-2 py-2 text-xs font-semibold ${scope === value ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}>{label}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-bold text-slate-700">Date range</legend>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800">
              <option value="all">All dates</option>
              <option value="this-month">This month</option>
              <option value="last-90-days">Last 90 days</option>
            </select>
          </fieldset>

          <p className="text-xs text-slate-500">{filteredTransactions.length} transaction{filteredTransactions.length === 1 ? '' : 's'} selected</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={downloadCsv} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download size={16} /> Export CSV</button>
            <button type="button" onClick={printPdf} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm hover:bg-blue-700"><FileText size={16} /> Save as PDF</button>
          </div>
        </div>
      </section>
    </div>
  );
}
