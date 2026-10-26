export const Card = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`liquid-glass rounded-2xl overflow-hidden ${
      onClick ? 'cursor-pointer active:scale-[0.985] transition-all duration-200' : ''
    } ${className}`}
  >
    {children}
  </div>
);

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseStyle =
    'px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';
  const variants = {
    primary:
      'bg-gradient-to-b from-[#00802A] to-[#006622] text-white hover:from-[#009933] hover:to-[#00802A] shadow-md shadow-green-800/25 border border-white/20',
    accent:
      'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:from-emerald-500 hover:to-emerald-700 shadow-md shadow-emerald-600/25 border border-white/20',
    secondary:
      'bg-white/80 backdrop-blur-xl text-slate-700 hover:bg-white border border-white/80 shadow-sm',
    danger:
      'bg-rose-50/90 backdrop-blur-md text-rose-600 hover:bg-rose-100 border border-rose-200/80 shadow-sm',
    outline:
      'border border-white/80 bg-white/60 backdrop-blur-xl text-slate-700 hover:bg-white/90 shadow-sm',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className="mb-3.5 last:mb-0">
    {label && (
      <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-tight">
        {label}
      </label>
    )}
    <input
      className={`w-full px-3.5 py-2.5 text-sm border rounded-2xl focus:ring-2 focus:ring-[#00802A]/20 focus:border-[#00802A] outline-none transition-all bg-white/80 backdrop-blur-md text-slate-900 placeholder:text-slate-400 shadow-inner ${
        error ? 'border-rose-300 bg-rose-50/60' : 'border-slate-200/90 hover:border-slate-300'
      } ${className}`}
      {...props}
    />
    {error && <p className="text-rose-600 text-xs mt-1 font-medium">{error}</p>}
  </div>
);

export const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all rounded-2xl ${
      isActive
        ? 'text-green-600 font-bold bg-green-500/10'
        : 'text-slate-500 hover:text-slate-900'
    }`}
  >
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    <span className="text-[11px] lg:text-sm">{label}</span>
  </button>
);