import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Archive, ArchiveRestore, Pin, PinOff, X } from 'lucide-react';

export default function SpaceLongPressActions({
  children,
  groupName,
  isPinned,
  isArchived,
  onTogglePin,
  onToggleArchive,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);
  const startPointRef = useRef(null);
  const suppressClickRef = useRef(false);

  const clearLongPress = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => () => clearLongPress(), []);

  const handlePointerDown = (event) => {
    if (event.button !== 0 || event.target.closest('button, a, input, select, textarea')) return;
    startPointRef.current = { x: event.clientX, y: event.clientY };
    timerRef.current = window.setTimeout(() => {
      suppressClickRef.current = true;
      setIsOpen(true);
    }, 500);
  };

  const handlePointerMove = (event) => {
    if (!startPointRef.current) return;
    const deltaX = event.clientX - startPointRef.current.x;
    const deltaY = event.clientY - startPointRef.current.y;
    if (Math.hypot(deltaX, deltaY) > 10) {
      clearLongPress();
      startPointRef.current = null;
    }
  };

  const handleClickCapture = (event) => {
    if (!suppressClickRef.current || event.target.closest('[data-space-action-sheet]')) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleContextMenu = (event) => {
    if (event.target.closest('button, a, input, select, textarea')) return;
    event.preventDefault();
    suppressClickRef.current = true;
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    suppressClickRef.current = false;
  };

  return (
    <div
      className="contents"
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
          data-space-action-sheet
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/30 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-[2px] md:items-center"
          onClick={close}
        >
          <div className="flex w-full max-w-md flex-col gap-2">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Actions for ${groupName}`}
              className="overflow-hidden rounded-[22px] border border-white/70 bg-white/95 shadow-2xl backdrop-blur-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="border-b border-slate-200/80 px-4 py-3 text-center">
                <p className="truncate text-xs font-semibold text-slate-500">{groupName}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onTogglePin();
                  close();
                }}
                className="flex min-h-14 w-full items-center gap-3 border-b border-slate-200/80 px-5 text-left text-sm font-semibold text-slate-800 active:bg-slate-100"
              >
                {isPinned ? <PinOff size={18} className="text-blue-600" /> : <Pin size={18} />}
                {isPinned ? 'Unpin Space' : 'Pin Space'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleArchive();
                  close();
                }}
                className="flex min-h-14 w-full items-center gap-3 px-5 text-left text-sm font-semibold text-slate-800 active:bg-slate-100"
              >
                {isArchived
                  ? <ArchiveRestore size={18} className="text-blue-600" />
                  : <Archive size={18} />}
                {isArchived ? 'Restore Space' : 'Archive Space'}
              </button>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-white/95 text-sm font-bold text-blue-600 shadow-xl"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}