import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Eye, EyeOff, ArrowLeft, CheckCircle2, Moon, Sun } from 'lucide-react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth';
import roomsplitIcon from '../../assets/roomsplit-icon.webp';
import { Button } from '../common/UI';
import { auth } from '../../firebase';

export default function AuthScreen({
  users = [],
  onLoadUsers,
  onSaveUser,
  onLogin,
  initialMode = null,
  onBackToLanding,
  theme = 'light',
  onThemeChange,
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(Boolean(initialMode));
  const [isLogin, setIsLogin] = useState(initialMode !== 'signup');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mobileIdentifierRef = useRef(null);
  const desktopIdentifierRef = useRef(null);
  const mobilePasswordRef = useRef(null);
  const desktopPasswordRef = useRef(null);

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
    if (mobilePasswordRef.current) mobilePasswordRef.current.value = '';
    if (desktopPasswordRef.current) desktopPasswordRef.current.value = '';
    setError('');
    setNotice('');
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    if (onBackToLanding) {
      onBackToLanding();
      return;
    }
    setIsSheetOpen(false);
    if (mobilePasswordRef.current) mobilePasswordRef.current.value = '';
    if (desktopPasswordRef.current) desktopPasswordRef.current.value = '';
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
      case 'auth/popup-blocked':
        return 'Google sign-in popup was blocked. Allow popups for this site and try again.';
      case 'auth/unauthorized-domain':
        return `Google sign-in is not enabled for ${window.location.hostname}. Add this host under Firebase Authentication > Settings > Authorized domains.`;
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled for this Firebase project. Enable Google in Firebase Authentication settings.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already uses this email with another sign-in method. Sign in with that method first.';
      case 'auth/credential-already-in-use':
        return 'This Google account is already linked to another SplitBills profile.';
      default:
        return 'Could not complete the request. Please try again.';
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      if (!auth) {
        throw new Error('Google sign-in is unavailable without a Firebase connection.');
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      let googleUser;
      if (Capacitor.getPlatform() === 'android') {
        const nativeResult = await FirebaseAuthentication.signInWithGoogle();
        const idToken = nativeResult.credential?.idToken;
        if (!idToken) {
          throw new Error('Google sign-in did not return an ID token. Please try again.');
        }
        const result = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
        googleUser = result.user;
      } else {
        const result = await signInWithPopup(auth, provider);
        googleUser = result.user;
      }
      const userEmail = googleUser.email?.trim().toLowerCase();
      if (!userEmail) throw new Error('Google did not provide an email address for this account.');
      const authUsers = await onLoadUsers();

      const existingUser = authUsers.find(
        (item) => item.email?.trim().toLowerCase() === userEmail
      );
      if (existingUser) {
        onLogin(existingUser.id);
        return;
      }

      const baseUsername =
        googleUser.displayName?.trim() || userEmail.split('@')[0] || 'Roommate';
      const usedUsernames = new Set(authUsers.map((item) => item.username?.toLowerCase()));
      let username = baseUsername;
      let suffix = 2;
      while (usedUsernames.has(username.toLowerCase())) {
        username = `${baseUsername} ${suffix}`;
        suffix += 1;
      }

      const newUser = {
        id: googleUser.uid,
        username,
        email: userEmail,
        photoDataUrl: googleUser.photoURL || '',
        createdAt: new Date().toISOString(),
      };
      await onSaveUser(newUser);

      onLogin(newUser.id);
    } catch (authError) {
      console.error('Google sign-in failed:', authError);
      if (authError.code === 'auth/popup-closed-by-user') return;
      setError(authError.code ? getAuthErrorMessage(authError) : authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const passwordInput = form.querySelector('[data-auth-password]');
    setError('');
    setNotice('');
    setIsSubmitting(true);
    const password = passwordInput?.value || '';
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
        setError('Account creation requires Firebase email verification. Please try again when connected.');
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
            const credential = await createUserWithEmailAndPassword(auth, userEmail, password);
            if (!credential.user.emailVerified) {
              await sendEmailVerification(credential.user);
            }
            await onSaveUser({ ...matchedUser, password: '' });
            if (!credential.user.emailVerified) {
              setNotice(`A verification link was sent to ${userEmail}. Verify your email before signing in.`);
              return;
            }
            onLogin(matchedUser.id);
            return;
          } catch (migrationError) {
            if (migrationError.code !== 'auth/email-already-in-use') throw migrationError;
          }
        }
        const credential = await signInWithEmailAndPassword(auth, userEmail, password);
        if (!credential.user.emailVerified) {
          await sendEmailVerification(credential.user);
          setNotice(`A verification link was sent to ${userEmail}. Verify your email before signing in.`);
          return;
        }
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
      await sendEmailVerification(credential.user);
      setNotice(`Account created. Check ${cleanEmail} for a verification link, then sign in.`);
      setIsLogin(true);
      setIdentifier(cleanEmail);
    } catch (authError) {
      console.error('Authentication request failed:', authError);
      setError(authError.code ? getAuthErrorMessage(authError) : authError.message);
    } finally {
      if (passwordInput) passwordInput.value = '';
      setIsSubmitting(false);
    }
  };

  const renderAuthForm = (inputRef, passwordRef, idPrefix) => (
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
              ref={passwordRef}
              data-auth-password
              type={showPassword ? 'text' : 'password'}
              placeholder={isLogin ? 'Your password' : 'At least 6 characters'}
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

      {!isForgotPassword && (
        <>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="h-[18px] w-[18px] flex-shrink-0"
            >
              <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44Z"
              />
              <path
                fill="#FBBC05"
                d="M12.8 27.8a12 12 0 0 1 0-7.6V15H5.9a20 20 0 0 0 0 18l6.9-5.2Z"
              />
              <path
                fill="#EA4335"
                d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.9 15l6.9 5.2C14.4 15.5 18.8 12 24 12Z"
              />
            </svg>
            Continue with Google
          </button>
        </>
      )}

      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={() => {
            if (isForgotPassword) {
              setIsForgotPassword(false);
            } else {
              setIsLogin(!isLogin);
            }
            if (mobilePasswordRef.current) mobilePasswordRef.current.value = '';
            if (desktopPasswordRef.current) desktopPasswordRef.current.value = '';
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
    <main className="auth-page-shell min-h-[100dvh] w-full font-sans flex items-center justify-center md:p-6 relative overflow-hidden">
      <button
        type="button"
        onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="fixed right-4 top-4 z-[60] hidden h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md backdrop-blur transition-colors hover:bg-white md:flex"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden fixed inset-0 flex flex-col w-full h-full overflow-hidden bg-blue-600">
        <div className="flex-1 flex flex-col justify-between">
          <div className="mobile-auth-hero relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-blue-600 px-7 pb-8 text-center">
            <div className="relative mb-6 flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.1)]">
              <img src={roomsplitIcon} alt="SplitBills logo" className="h-full w-full rounded-[18px] object-cover" />
            </div>
            <span className="relative rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              Room Split
            </span>
            <h1 className="relative mt-4 max-w-sm text-[32px] font-bold leading-[1.08] tracking-[-0.045em] text-white">
              Split bills. Stay balanced.
            </h1>
            <p className="relative mt-3 max-w-xs text-sm leading-relaxed text-blue-100">
              Track shared apartment expenses, UPI reimbursements, and roommate balances without clutter.
            </p>
          </div>

          <div className="mobile-auth-panel w-full rounded-t-[28px] border-t border-slate-200/80 bg-white px-6 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col gap-3">
            <Button onClick={() => handleOpenSheet('login')} className="w-full h-11 text-sm">
              Sign in to SplitBills
            </Button>
            <div className="text-center mt-1">
              <span className="text-slate-500 text-xs">New to SplitBills? </span>
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
            <button
              type="button"
              onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
            <form onSubmit={handleSubmit} className="w-full">
              {renderAuthForm(mobileIdentifierRef, mobilePasswordRef, 'mobile')}
            </form>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex w-full max-w-[920px] min-h-[540px] bg-white rounded-2xl border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
        <div className="w-[45%] border-r border-slate-200/80 bg-white p-10 flex flex-col justify-between text-slate-900">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 overflow-hidden bg-white rounded-xl p-1.5 flex items-center justify-center">
                <img src={roomsplitIcon} alt="SplitBills logo" className="h-full w-full rounded-lg object-cover" />
              </div>
              <span className="text-lg font-bold tracking-tight">SplitBills</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight mb-3">
              Clear shared accounting for modern households.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Log bills in seconds, split equally or custom, and settle dues directly via UPI.
            </p>

            <ul className="mt-8 space-y-2.5 text-xs text-slate-600">
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

          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} SplitBills</p>
        </div>

        <div className="w-[55%] bg-white p-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="mb-4 text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                ← Back to SplitBills
              </button>
            )}
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
              {renderAuthForm(desktopIdentifierRef, desktopPasswordRef, 'desktop')}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}