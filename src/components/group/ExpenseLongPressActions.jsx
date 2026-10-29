import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Eye, Send, Trash2, X } from 'lucide-react';

export default function ExpenseLongPressActions({
  children,
  expenseTitle,
  canDelete,
  canDispute,
  hasActiveDispute = false,
  canCancelDispute = false,
  enabled = true,
  onDelete,
  onRaiseDispute,
  onCancelDispute,
  onViewDispute,
  showToast,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [disputeMessage, setDisputeMessage] = useState('');
  const [composeDispute, setComposeDispute] = useState(false);
  const [isRaisingDispute, setIsRaisingDispute] = useState(false);
  const [isCancellingDispute, setIsCancellingDispute] = useState(false);
  const timerRef = useRef(null);
  const disputeMessageRef = useRef(null);
  const startPointRef = useRef(null);
  const suppressClickRef = useRef(false);

  const clearLongPress = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => () => clearLongPress(), []);

  const handlePointerDown = (event) => {
    const interactiveTarget = event.target.closest('button, a, input, select, textarea');
    const isActionItem = interactiveTarget === event.currentTarget.firstElementChild;
    if (!enabled || event.button !== 0 || (interactiveTarget && !isActionItem)) return;
    startPointRef.current = { x: event.clientX, y: event.clientY };
    timerRef.current = window.setTimeout(() => {
      suppressClickRef.current = true;
      setIsOpen(true);
    }, 500);
  };

  const handlePointerMove = (event) => {
    if (!startPointRef.current) return;
    if (Math.hypot(
      event.clientX - startPointRef.current.x,
      event.clientY - startPointRef.current.y,
    ) > 10) {
      clearLongPress();
      startPointRef.current = null;
    }
  };

  const handleContextMenu = (event) => {
    const interactiveTarget = event.target.closest('button, a, input, select, textarea');
    const isActionItem = interactiveTarget === event.currentTarget.firstElementChild;
    if (!enabled || (interactiveTarget && !isActionItem)) return;
    event.preventDefault();
    suppressClickRef.current = true;
    setIsOpen(true);
  };

  const handleClickCapture = (event) => {
    if (!suppressClickRef.current || event.target.closest('[data-expense-action-sheet]')) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const close = () => {
    setIsOpen(false);
    setConfirmDelete(false);
    setComposeDispute(false);
    setDisputeMessage('');
    setIsRaisingDispute(false);
    setIsCancellingDispute(false);
    suppressClickRef.current = false;
  };

  const deleteExpense = async () => {
    try {
      if (!onDelete) throw new Error('Deleting expenses is unavailable right now.');
      await onDelete();
      showToast?.('Expense deleted.');
      close();
    } catch (error) {
      console.error('Could not delete expense:', error);
      showToast?.(error.message || 'Could not delete this expense.', 'error');
    }
  };

  const raiseDispute = async () => {
    try {
      if (!onRaiseDispute) throw new Error('Raising disputes is unavailable right now.');
      setIsRaisingDispute(true);
      disputeMessageRef.current?.blur();
      await onRaiseDispute(disputeMessage.trim());
      showToast?.('Dispute raised in group chat.');
      close();
    } catch (error) {
      console.error('Could not raise expense dispute:', error);
      showToast?.(error.message || 'Could not raise this dispute.', 'error');
    } finally {
      setIsRaisingDispute(false);
    }
  };

  const cancelDispute = async () => {
    try {
      if (!onCancelDispute) throw new Error('Cancelling disputes is unavailable right now.');
      setIsCancellingDispute(true);
      await onCancelDispute();
      showToast?.('Dispute cancelled.');
      close();
    } catch (error) {
      console.error('Could not cancel expense dispute:', error);
      showToast?.(error.message || 'Could not cancel this dispute.', 'error');
    } finally {
      setIsCancellingDispute(false);
    }
  };

  return (
    <div
      className="relative block touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => {
        clearLongPress();
        startPointRef.current = null;
      }}
      onPointerCancel={() => {
        clearLongPress();
        startPointRef.current = null;
      }}
      onContextMenu={handleContextMenu}
      onClickCapture={handleClickCapture}
    >
      {children}
      {isOpen && createPortal(
        <div
          data-expense-action-sheet
          className="fixed inset-0 z-[160] flex items-end justify-center bg-slate-950/35 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center"
          onClick={close}
        >
          <div className="w-full max-w-sm" onClick={(event) => event.stopPropagation()}>
            <section
              role="dialog"
              aria-modal="true"
              aria-label={`Actions for ${expenseTitle}`}
              className="overflow-hidden rounded-[22px] border border-white/70 bg-white/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 border-b border-slate-200/80 px-4 py-2.5">
                <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-slate-500">
                  {expenseTitle}
                </p>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close expense actions"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-rose-700 bg-rose-600 text-white transition-colors hover:bg-rose-700"
                >
                  <X size={15} />
                </button>
              </div>
              {canDelete && !confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex min-h-14 w-full items-center gap-3 border-b border-slate-200/80 px-5 text-left text-sm font-semibold text-rose-600 active:bg-rose-50"
                >
                  <Trash2 size={18} />
                  Delete expense
                </button>
              )}
              {canDispute && !confirmDelete && (
                <button
                  type="button"
                  onClick={() => setComposeDispute(true)}
                  className={`flex min-h-14 w-full items-center gap-3 px-5 text-left text-sm font-semibold text-amber-700 active:bg-amber-50 ${
                    composeDispute ? 'border-b border-slate-200/80' : ''
                  }`}
                >
                  <AlertTriangle size={18} />
                  Raise dispute
                </button>
              )}
              {hasActiveDispute && !confirmDelete && (
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onViewDispute?.();
                  }}
                  className="flex min-h-14 w-full items-center gap-3 border-b border-slate-200/80 px-5 text-left text-sm font-semibold text-blue-700 active:bg-blue-50"
                >
                  <Eye size={18} />
                  View dispute
                </button>
              )}
              {canCancelDispute && !confirmDelete && (
                <button
                  type="button"
                  disabled={isCancellingDispute}
                  onClick={cancelDispute}
                  className="flex min-h-14 w-full items-center gap-3 border-b border-slate-200/80 px-5 text-left text-sm font-semibold text-rose-600 active:bg-rose-50 disabled:opacity-60"
                >
                  <X size={18} />
                  {isCancellingDispute ? 'Removing dispute…' : 'Remove dispute'}
                </button>
              )}
              {composeDispute && canDispute && !confirmDelete && (
                <form
                  className="space-y-2.5 p-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    raiseDispute();
                  }}
                >
                  <label htmlFor="expense-dispute-message" className="block text-xs font-semibold text-slate-700">
                    Add a message to explain your dispute
                  </label>
                  <textarea
                    id="expense-dispute-message"
                    ref={disputeMessageRef}
                    value={disputeMessage}
                    onChange={(event) => setDisputeMessage(event.target.value.slice(0, 500))}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter'
                        && !event.shiftKey
                        && !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        if (!isRaisingDispute) raiseDispute();
                      }
                    }}
                    placeholder="What should the group know?"
                    rows={3}
                    maxLength={500}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-400">{disputeMessage.length}/500</span>
                    <button
                      type="submit"
                      disabled={isRaisingDispute}
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-700 px-4 text-xs font-bold text-white transition-colors hover:bg-amber-800 disabled:cursor-wait disabled:opacity-60"
                    >
                      <Send size={14} />
                      {isRaisingDispute ? 'Sending…' : 'Send dispute'}
                    </button>
                  </div>
                </form>
              )}
              {confirmDelete && (
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-900">Delete this expense?</p>
                  <p className="mt-1 text-xs text-slate-500">This will update the group balances.</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="min-h-10 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={deleteExpense}
                      className="min-h-10 rounded-xl bg-rose-600 text-xs font-bold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              {!confirmDelete && !composeDispute && (
                <button
                  type="button"
                  onClick={close}
                  className="flex min-h-12 w-full items-center justify-center border-t border-slate-200/80 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </section>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
