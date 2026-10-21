import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import roomsplitIcon from '../../assets/roomsplit-icon.webp';
import { Button } from '../common/UI';
import { auth } from '../../firebase';

export default function AuthScreen({ users = [], onLoadUsers, onSaveUser, onLogin }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mobileIdentifierRef = useRef(null);
  const desktopIdentifierRef = useRef(null);

  useEffect(() => {
    if (isSheetOpen) {
      const timer = setTimeout(() => {
        if (mobileIdentifierRef.current) {
          mobileIdentifierRef.current.focus();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, isLogin]);

  useEffect(() => {
    if (window.innerWidth >= 768 && desktopIdentifierRef.current) {
      desktopIdentifierRef.current.focus();
    }
  }, []);

  const handleOpenSheet = (mode) => {
    setIsLogin(mode === 'login');
    setIsForgotPassword(false);
    setError('');
    setNotice('');
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setError('');
    setNotice('');
  };

  const getAuthErrorMessage = (authError) => {
    switch (authError.code) {
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/user-disabled':
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Invalid email/username or password.';
      case 'auth/email-already-in-use':
        return 'An account already uses this email. Please sign in.';
      case 'auth/weak-password':
        return 'Choose a password with at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a little and try again.';
      default:
        return 'Could not complete the request. Please try again.';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);
    const cleanIdentifier = identifier.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    try {
      const authUsers = isForgotPassword ? users : await onLoadUsers();

      if (!auth) {
        if (isForgotPassword) {
          throw new Error('Password reset is unavailable without a Firebase connection.');
        }
        if (isLogin) {
          const localUser = authUsers.find(
            (item) =>
              item.email?.toLowerCase() === cleanIdentifier.toLowerCase() ||
              item.username?.toLowerCase() === cleanIdentifier.toLowerCase()
          );
          if (!localUser || localUser.password !== password) {
            setError('Invalid email/username or password.');
            return;
          }
          onLogin(localUser.id);
          return;
        }
        if (cleanUsername.length < 3) {
          setError('Username must be at least 3 characters.');
          return;
        }
        if (!cleanEmail) {
          setError('Email is required to create an account.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        if (
          authUsers.some(
            (item) =>
              item.username?.toLowerCase() === cleanUsername.toLowerCase() ||
              item.email?.toLowerCase() === cleanEmail
          )
        ) {
          setError('An account already uses this username or email. Please sign in.');
          return;
        }
        const localUser = {
          id: `usr_${Date.now()}`,
          username: cleanUsername,
          email: cleanEmail,
          password,
          createdAt: new Date().toISOString(),
        };
        await onSaveUser(localUser);
        onLogin(localUser.id);
        return;
      }

      if (isForgotPassword) {
        if (!cleanIdentifier.includes('@')) {
          setError('Enter the email address for your account.');
          return;
        }
        await sendPasswordResetEmail(auth, cleanIdentifier.toLowerCase());
        setIsForgotPassword(false);
        setIsLogin(true);
        setIdentifier(cleanIdentifier);
        setNotice('If an account uses this email, a password reset link is on its way.');
        return;
      }

      if (isLogin) {
        const matchedUser = authUsers.find(
          (item) =>
            item.email?.toLowerCase() === cleanIdentifier.toLowerCase() ||
            item.username?.toLowerCase() === cleanIdentifier.toLowerCase()
        );
        if (!matchedUser) {
          const legacyUser = authUsers.find(
            (item) => item.username?.toLowerCase() === cleanIdentifier.toLowerCase()
          );
          if (!legacyUser || legacyUser.password !== password) {
            setError('Invalid email/username or password.');
            return;
          }
          onLogin(legacyUser.id);
          return;
        }

        const userEmail = matchedUser.email?.toLowerCase();
        if (!userEmail) {
          if (matchedUser.password !== password) {
            setError('Invalid email/username or password.');
            return;
          }
          onLogin(matchedUser.id);
          return;
        }

        if (matchedUser.password === password && password.length < 6) {
          onLogin(matchedUser.id);
          return;
        }

        if (matchedUser.password === password) {
          try {
            await createUserWithEmailAndPassword(auth, userEmail, password);
            await onSaveUser({ ...matchedUser, password: '' });
            onLogin(matchedUser.id);
            return;
          } catch (migrationError) {
            if (migrationError.code !== 'auth/email-already-in-use') throw migrationError;
          }
        }

        await signInWithEmailAndPassword(auth, userEmail, password);
        if (matchedUser.password) await onSaveUser({ ...matchedUser, password: '' });
        onLogin(matchedUser.id);
        return;
      }

      if (cleanUsername.length < 3) {
        setError('Username must be at least 3 characters.');
        return;
      }
      if (!cleanEmail) {
        setError('Email is required to create an account.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (authUsers.some((item) => item.username?.toLowerCase() === cleanUsername.toLowerCase())) {
        setError('Username already taken. Please sign in.');
        return;
      }
      if (authUsers.some((item) => item.email?.toLowerCase() === cleanEmail)) {
        setError('An account already uses this email. Please sign in.');
        return;
      }

      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const newUser = {
        id: credential.user.uid,
        username: cleanUsername,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
      };
      try {
        await onSaveUser(newUser);
      } catch (saveError) {
        await deleteUser(credential.user);
        await signInAnonymously(auth);
        throw saveError;
      }
      onLogin(newUser.id);
    } catch (authError) {
      console.error('Authentication request failed:', authError);
      setError(authError.code ? getAuthErrorMessage(authError) : authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAuthForm = (inputRef, idPrefix) => (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-medium flex items-start gap-2 border border-rose-200">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700"
        >
          {notice}
        </p>
      )}

      {isLogin || isForgotPassword ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-identifier`} className="text-xs font-semibold text-slate-700">
            {isForgotPassword ? 'Email address' : 'Email or username'}
          </label>
          <input
            id={`${idPrefix}-identifier`}
            ref={inputRef}
            type={isForgotPassword ? 'email' : 'text'}
            placeholder={isForgotPassword ? 'you@example.com' : 'you@example.com or username'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete={isForgotPassword ? 'email' : 'username'}
            enterKeyHint="next"
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
            required
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-username`} className="text-xs font-semibold text-slate-700">
              Username
            </label>
            <input
              id={`${idPrefix}-username`}
              ref={inputRef}
              type="text"
              placeholder="e.g. taran"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              enterKeyHint="next"
              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-email`} className="text-xs font-semibold text-slate-700">
              Email
            </label>
            <input
              id={`${idPrefix}-email`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="email"
              enterKeyHint="next"
              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              required
            />
          </div>
        </>
      )}

      {!isForgotPassword && (
        <div className="flex flex-col gap-1.5 relative">
          <div className="flex items-center justify-between">
            <label htmlFor={`${idPrefix}-password`} className="text-xs font-semibold text-slate-700">
              Password
            </label>
            {isLogin && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError('');
                  setNotice('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id={`${idPrefix}-password`}
              type={showPassword ? 'text' : 'password'}
              placeholder={isLogin ? 'Your password' : 'At least 6 characters'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              enterKeyHint="done"
              minLength={!isLogin && !isForgotPassword ? 6 : undefined}
              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
            </button>
          </div>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-1 h-11 text-sm">
        {isSubmitting
          ? 'Please wait...'
          : isForgotPassword
            ? 'Send reset link'
            : isLogin
              ? 'Sign in'
              : 'Create account'}
      </Button>

      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={() => {
            if (isForgotPassword) {
              setIsForgotPassword(false);
            } else {
              setIsLogin(!isLogin);
            }
            setError('');
            setNotice('');
          }}
          className="text-slate-500 font-medium text-xs inline-flex items-center gap-1.5 hover:text-slate-800"
        >
          {isForgotPassword
            ? 'Remember your password?'
            : isLogin
              ? "Don't have an account?"
              : 'Already have an account?'}
          <span className="text-slate-900 font-bold hover:underline">
            {isForgotPassword ? 'Sign in' : isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-[100dvh] w-full bg-[#F8FAFC] font-sans flex items-center justify-center md:p-6 relative overflow-hidden">
      {/* MOBILE LAYOUT */}
      <div className="md:hidden fixed inset-0 flex flex-col w-full h-full overflow-hidden bg-slate-900">
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-start justify-center px-6 text-left">
            <div className="w-14 h-14 bg-white rounded-2xl p-2 shadow-sm mb-5 flex items-center justify-center">
              <img src={roomsplitIcon} alt="RoomSplit Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Shared Expense Ledger
            </span>
            <h1 className="mt-2 text-3xl font-bold text-white tracking-tight leading-tight">
              Split bills. Stay balanced.
            </h1>
            <p className="text-slate-400 mt-2.5 text-sm leading-relaxed max-w-xs">
              Track shared apartment expenses, UPI reimbursements, and roommate balances without clutter.
            </p>
          </div>

          <div className="bg-white w-full rounded-t-2xl pt-6 pb-8 px-6 flex flex-col gap-3">
            <Button onClick={() => handleOpenSheet('login')} className="w-full h-11 text-sm">
              Sign in to RoomSplit
            </Button>
            <div className="text-center mt-1">
              <span className="text-slate-500 text-xs">New to RoomSplit? </span>
              <button
                type="button"
                onClick={() => handleOpenSheet('signup')}
                className="text-slate-900 font-bold text-xs hover:underline"
              >
                Create an account
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Up Sheet */}
        <div
          className={`fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-200 ease-out ${
            isSheetOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-white">
            <button
              type="button"
              onClick={closeSheet}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Back to sign in options"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="ml-2 text-base font-bold text-slate-900">
              {isForgotPassword
                ? 'Reset password'
                : isLogin
                  ? 'Sign in'
                  : 'Create account'}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
            <form onSubmit={handleSubmit} className="w-full">
              {renderAuthForm(mobileIdentifierRef, 'mobile')}
            </form>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex w-full max-w-[920px] min-h-[540px] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="w-[45%] bg-slate-900 p-10 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex items-center justify-center">
                <img src={roomsplitIcon} alt="RoomSplit Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-bold tracking-tight">RoomSplit</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight mb-3">
              Clear shared accounting for modern households.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Log bills in seconds, split equally or custom, and settle dues directly via UPI.
            </p>

            <ul className="mt-8 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span>Smart debt simplification across roommates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span>Direct UPI settlement & QR room invites</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span>Monthly category analytics & real-time room chat</span>
              </li>
            </ul>
          </div>

          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} RoomSplit</p>
        </div>

        <div className="w-[55%] bg-white p-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isForgotPassword ? 'Reset password' : isLogin ? 'Sign in' : 'Create account'}
              </h2>
              <p className="text-slate-500 mt-1 text-xs">
                {isForgotPassword
                  ? 'We’ll email you a password reset link.'
                  : isLogin
                    ? 'Enter your credentials to access your spaces.'
                    : 'Set up your account in seconds.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
              {renderAuthForm(desktopIdentifierRef, 'desktop')}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}