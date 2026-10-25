import {
  LayoutGrid,
  IndianRupee,
  LogOut,
  Download,
  PieChart,
  Plus,
  User,
  Users,
} from 'lucide-react';
import roomsplitIcon from '../../assets/roomsplit-icon.webp';

const ITEMS = [
  { id: 'groups', label: 'Overview', mobileLabel: 'Overview', icon: LayoutGrid },
  { id: 'spaces', label: 'Spaces', mobileLabel: 'Spaces', icon: Users },
  { id: 'transactions', label: 'Transactions', mobileLabel: 'Transactions', icon: IndianRupee },
  { id: 'monthly', label: 'Analytics', mobileLabel: 'Monthly', icon: PieChart },
  { id: 'profile', label: 'Profile', mobileLabel: 'Profile', icon: User },
];

const MOBILE_ITEMS = ITEMS.filter(({ id }) => id !== 'spaces');

export default function PrimaryNav({
  activeItem,
  onNavigate,
  onQuickAction,
  onLogout,
  user,
  unreadSpacesCount = 0,
  onInstallApp,
  isAppInstalled = false,
  desktopOnly = false,
}) {
  return (
    <>
      {/* ===================================================================== */}
      {/* MOBILE NATIVE LIQUID GLASS DOCK (< md)                                */}
      {/* ===================================================================== */}
      {!desktopOnly && (
        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 pointer-events-none md:hidden"
        >
          <div className="liquid-nav-dock pointer-events-auto mx-auto flex h-16 w-full max-w-[25rem] items-center justify-between gap-1 rounded-[28px] p-1.5">
            {/* Left 2 items: Overview & Transactions */}
            {MOBILE_ITEMS.slice(0, 2).map(({ id, mobileLabel, icon: Icon }) => {
              const isActive = activeItem === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-label={mobileLabel}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative flex h-full flex-1 items-center justify-center rounded-[22px] text-slate-600 transition-all duration-200 active:scale-95"
                >
                  <span
                    className={`relative inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                        : 'hover:bg-white/60 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  <span className="sr-only">{mobileLabel}</span>
                </button>
              );
            })}

            {/* Center Quick-Add Action Button */}
            {onQuickAction && (
              <button
                type="button"
                onClick={onQuickAction}
                aria-label="Quick add bill"
                className="mx-0.5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-900 text-white shadow-lg shadow-slate-900/25 border border-white/30 transition-transform active:scale-90"
              >
                <Plus size={22} strokeWidth={2.75} />
              </button>
            )}

            {/* Right 2 items: Analytics & Profile */}
            {MOBILE_ITEMS.slice(2).map(({ id, mobileLabel, icon: Icon }) => {
              const isActive = activeItem === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-label={mobileLabel}
                  aria-current={isActive ? 'page' : undefined}
                    className="relative flex h-full flex-1 items-center justify-center rounded-[22px] text-slate-600 transition-all duration-200 active:scale-95"
                >
                    <span
                      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                          : 'hover:bg-white/60 hover:text-slate-900'
                      }`}
                    >
                      {id === 'profile' ? (
                        <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-[10px] font-extrabold text-white ring-2 ring-white/80">
                          {user?.photoDataUrl ? (
                            <img
                              src={user.photoDataUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (user?.username || 'U').charAt(0).toUpperCase()
                          )}
                        </span>
                      ) : (
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      )}
                    </span>
                    <span className="sr-only">{mobileLabel}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ===================================================================== */}
      {/* DESKTOP LIQUID GLASS SIDEBAR (md+)                                    */}
      {/* ===================================================================== */}
      <aside
        aria-label="Desktop navigation"
        className="hidden md:flex md:order-first md:h-full md:w-60 lg:w-64 md:flex-shrink-0 md:flex-col md:justify-between bg-white/75 backdrop-blur-2xl border-r border-white/80 shadow-[4px_0_24px_rgba(15,23,42,0.03)] px-4 py-6 z-30"
      >
        <div>
          {/* Brand Header */}
          <button
            type="button"
            onClick={() => onNavigate('groups')}
            aria-label="Go to RoomSplit home"
            className="flex w-full items-center gap-3 rounded-2xl px-2 py-1.5 text-left transition-opacity hover:opacity-90"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200/70">
              <img
                src={roomsplitIcon}
                alt="RoomSplit"
                className="h-full w-full scale-110 rounded-[14px] object-cover"
              />
            </span>
            <div>
              <span className="block text-base font-extrabold tracking-tight text-slate-900 leading-none">
                RoomSplit
              </span>
              <span className="mt-1 block text-[11px] font-semibold text-blue-600 leading-none">
                Shared Ledger
              </span>
            </div>
          </button>

          <div className="mt-7 mb-2 px-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Workspace
            </span>
          </div>

          {/* Desktop Navigation Items (Activity excluded) */}
          <div className="space-y-1.5">
            {ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeItem === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex h-11 w-full items-center gap-3 rounded-2xl px-3.5 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'text-slate-600 font-semibold hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}
                  />
                  <span>{label}</span>
                  {id === 'spaces' && unreadSpacesCount > 0 && (
                    <span
                      aria-label={`${unreadSpacesCount} unread items`}
                      className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-extrabold leading-none text-white shadow-sm"
                    >
                      {unreadSpacesCount > 99 ? '99+' : unreadSpacesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop User Footer Card */}
        <div className="space-y-2 border-t border-slate-200/60 pt-4">
          {!isAppInstalled && onInstallApp && (
            <button
              type="button"
              onClick={onInstallApp}
              className="flex w-full items-center gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:shadow-md active:translate-y-0"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Download size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-900">Install RoomSplit</span>
                <span className="mt-0.5 block text-[10px] text-slate-500">
                  Add the app to your device
                </span>
              </span>
            </button>
          )}
          {user && (
            <div
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-3 rounded-2xl bg-white/70 border border-white/90 p-2.5 shadow-sm hover:bg-white cursor-pointer transition-all"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                {user.photoDataUrl ? (
                  <img src={user.photoDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  (user.username || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{user.username}</p>
                <p className="truncate text-[11px] text-slate-500 font-mono">
                  {user.upiId || user.email || 'Set up UPI'}
                </p>
              </div>
            </div>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="flex h-10 w-full items-center gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50 px-3.5 text-xs font-bold text-rose-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 hover:shadow-md active:translate-y-0"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}