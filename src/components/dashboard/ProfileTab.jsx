import { useState } from 'react';
import {
  Lock,
  Mail,
  Trash2,
  UserCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  QrCode,
  KeyRound,
  Camera,
  Bell,
  LogOut,
  Edit2,
  Moon,
  Sun,
} from 'lucide-react';
import {
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../firebase';
import { Button, Input } from '../common/UI';
import { requestNotificationPermission, triggerPushNotification } from '../../utils/notifications';

export default function ProfileTab({
  user,
  onUpdateUser,
  onLogout,
  theme = 'light',
  onThemeChange,
  showToast,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [upiId, setUpiId] = useState(user?.upiId || '');
  const [photoDataUrl, setPhotoDataUrl] = useState(user?.photoDataUrl || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [fallbackToast, setFallbackToast] = useState(false);
  const [testPushStatus, setTestPushStatus] = useState('');
  const [testingPush, setTestingPush] = useState(false);
  const canViewPushDiagnostics =
    user?.email?.trim().toLowerCase() === 'staranveer178@gmail.com';

  const handleTestPush = async () => {
    setTestingPush(true);
    setTestPushStatus('Registering FCM Token...');
    try {
      const res = await requestNotificationPermission(user);
      if (!res?.success) {
        setTestPushStatus(`Error: ${res?.error || 'Failed to get permission or token'}`);
        return;
      }
      setTestPushStatus('Device registered. Sending test push...');
      await triggerPushNotification({
        senderId: user.id,
        recipientId: user.id,
        title: 'Test Push Notification',
        message: 'Push notifications are working correctly on SplitBills!',
        groupId: '',
      });
      setTestPushStatus('Success! Test push notification sent to your device.');
      if (typeof showToast === 'function') showToast('Test push notification sent!');
    } catch (err) {
      console.error('Test push failed:', err);
      setTestPushStatus(`Trigger Error: ${err.message}`);
    } finally {
      setTestingPush(false);
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError('Choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setLocalError('Choose an image smaller than 8 MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise((resolve, reject) => {
        const loadedImage = new Image();
        loadedImage.onload = () => resolve(loadedImage);
        loadedImage.onerror = () => reject(new Error('Could not load this image.'));
        loadedImage.src = objectUrl;
      });
      const scale = Math.min(1, 320 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not process this image.');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const compressedPhoto = canvas.toDataURL('image/jpeg', 0.75);
      if (compressedPhoto.length > 280_000) {
        throw new Error('This image is too large after compression. Choose another image.');
      }
      setPhotoDataUrl(compressedPhoto);
      setLocalError('');
    } catch (error) {
      setLocalError(error.message || 'Could not process this image.');
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      let firebaseUser = auth.currentUser;
      if (password.trim() && password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      const firestoreUpdates = {};
      let linkedLegacyAccount = false;
      const nextEmail = email.trim().toLowerCase();
      const emailChanged = nextEmail !== (user.email || '').toLowerCase();
      let emailVerificationSent = false;
      if (emailChanged && (!firebaseUser || firebaseUser.isAnonymous)) {
        if (!firebaseUser) {
          throw new Error('Email changes require a Firebase connection so the new address can be verified.');
        }
        if (!currentPassword.trim() && !password.trim()) {
          throw new Error('Add a password to this profile before changing its email so the new address can be verified.');
        }
      }
      if (firebaseUser?.isAnonymous && nextEmail && (currentPassword.trim() || password.trim())) {
        let linkedUser;
        if (currentPassword.trim()) {
          const existingCredential = await signInWithEmailAndPassword(auth, nextEmail, currentPassword);
          linkedUser = existingCredential.user;
          firebaseUser = linkedUser;
          if (password.trim() && password !== currentPassword) {
            await updatePassword(firebaseUser, password);
          }
        } else {
          try {
            const credential = EmailAuthProvider.credential(nextEmail, password);
            const linkedCredential = await linkWithCredential(firebaseUser, credential);
            linkedUser = linkedCredential.user;
            firebaseUser = linkedUser;
          } catch (error) {
            if (error.code === 'auth/email-already-in-use' || error.code === 'auth/credential-already-in-use') {
              throw new Error(
                'This email already has a Firebase account. Enter its current password above to link it, or use a different email.',
                { cause: error },
              );
            }
            throw error;
          }
        }
        if (!linkedUser.emailVerified) {
          await sendEmailVerification(linkedUser);
          emailVerificationSent = true;
        }
        firestoreUpdates.email = nextEmail;
        firestoreUpdates.password = '';
        linkedLegacyAccount = true;
      }
      if (firebaseUser && !firebaseUser.isAnonymous && !linkedLegacyAccount) {
        const needsReauthentication = Boolean(password.trim() || emailChanged);
        if (needsReauthentication) {
          if (!currentPassword.trim()) {
            throw new Error('Enter your current Firebase password to change your email or password.');
          }
          if (!firebaseUser.email) {
            throw new Error('This Firebase sign-in does not have an email/password credential.');
          }
          await reauthenticateWithCredential(
            firebaseUser,
            EmailAuthProvider.credential(firebaseUser.email, currentPassword),
          );
        }
      }
      if (name.trim() && name.trim() !== user.username) {
        if (firebaseUser) await updateProfile(firebaseUser, { displayName: name.trim() });
        firestoreUpdates.username = name.trim();
      }
      if (upiId.trim() !== (user.upiId || '')) firestoreUpdates.upiId = upiId.trim();
      if (!linkedLegacyAccount && emailChanged) {
        if (firebaseUser && !firebaseUser.isAnonymous) {
          await updateEmail(firebaseUser, nextEmail);
          await sendEmailVerification(firebaseUser);
          emailVerificationSent = true;
        }
        firestoreUpdates.email = nextEmail;
      }
      if (photoDataUrl !== (user.photoDataUrl || '')) firestoreUpdates.photoDataUrl = photoDataUrl;

      if (Object.keys(firestoreUpdates).length > 0) {
        if (typeof onUpdateUser === 'function') {
          await onUpdateUser(user.id, firestoreUpdates);
        } else {
          Object.assign(user, firestoreUpdates);
        }
      }

      if (password.trim() && !linkedLegacyAccount) {
        if (firebaseUser && !firebaseUser.isAnonymous) {
          await updatePassword(firebaseUser, password);
          if (typeof onUpdateUser === 'function') await onUpdateUser(user.id, { password: '' });
        } else if (typeof onUpdateUser === 'function') {
          await onUpdateUser(user.id, { password });
        }
      }
      setCurrentPassword('');
      setPassword('');

      if (typeof showToast === 'function') {
        showToast(linkedLegacyAccount
          ? (auth.currentUser?.emailVerified
            ? 'Profile linked to Firebase. Push notifications are ready.'
            : 'Profile linked. Verify your email to enable push notifications.')
          : emailVerificationSent
            ? `Verification email sent to ${nextEmail}. Confirm it to complete the email change.`
          : 'Profile updated successfully!');
      } else {
        setFallbackToast(true);
        setTimeout(() => setFallbackToast(false), 3000);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.code === 'auth/email-already-in-use' || error.code === 'auth/credential-already-in-use') {
        setLocalError('This email is already linked to Firebase. Enter its current Firebase password to link this SplitBills profile.');
      } else if (
        error.code === 'auth/invalid-credential'
        || error.code === 'auth/wrong-password'
        || error.code === 'auth/user-not-found'
      ) {
        setLocalError('The Firebase password is incorrect. Check it, or reset it from the sign-in screen.');
      } else if (error.code === 'auth/weak-password') {
        setLocalError('Choose a password with at least 6 characters to link this account.');
      } else if (error.code === 'auth/requires-recent-login') {
        setLocalError(
          'For security, please log out and log back in before changing your password or email.'
        );
      } else if (error.code === 'auth/invalid-email') {
        setLocalError('The email address is not valid.');
      } else {
        setLocalError(error.message || 'Failed to update profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => (user?.username || 'U').charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8 pb-20">
      <div className="mb-5 flex items-center justify-between gap-2.5">
        <div className="page-heading flex min-w-0 items-center gap-2.5 rounded-full p-0 pr-4">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-gradient-to-tr from-blue-600 to-blue-600 text-xs font-bold text-white shadow-sm">
            {photoDataUrl ? (
              <img src={photoDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              getInitials()
            )}
          </span>
          <h1 className="truncate text-sm font-extrabold tracking-tight text-slate-900">
            Profile Settings
          </h1>
        </div>
        {!isEditing && (
          <div className="page-heading-controls flex flex-shrink-0 items-center gap-1 rounded-full p-1.5">
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                aria-label="Sign out"
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-full text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
              >
                <LogOut size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setLocalError('');
              }}
              aria-label="Edit profile"
              title="Edit profile"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit2 size={16} />
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative inline-block">
                {photoDataUrl ? (
                  <img
                    src={photoDataUrl}
                    alt={`${user?.username || 'User'} profile`}
                    className="h-20 w-20 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white">
                    {getInitials()}
                  </div>
                )}
                <span
                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white"
                  title="Active"
                >
                  <CheckCircle2 size={11} />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-slate-900">{user?.username}</h2>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail size={14} className="text-slate-400" />
                  <span>{user?.email || 'No email set'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3.5 md:grid-cols-2">
              <div className="flex items-center gap-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700">
                  <QrCode size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Settlement UPI ID
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs font-bold text-slate-900">
                    {user?.upiId || (
                      <span className="font-sans font-normal italic text-slate-400">
                        Not configured
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700">
                  <KeyRound size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Password Security
                  </p>
                  <p className="mt-0.5 text-xs font-semibold tracking-widest text-slate-800">
                    ••••••••
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Dark mode</p>
                  <p className="text-[11px] text-slate-500">
                    {theme === 'dark' ? 'On' : 'Off'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label="Dark mode"
                onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
                className="ios-theme-switch"
              >
                <span
                  className="ios-theme-switch__thumb"
                />
              </button>
            </div>

            {canViewPushDiagnostics && (
              <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700">
                      <Bell size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Push Notification Diagnostics</p>
                      <p className="text-[11px] text-slate-500">
                        Verify FCM delivery & device permissions
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestPush}
                    disabled={testingPush}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {testingPush ? 'Testing...' : 'Test Push'}
                  </button>
                </div>
                {testPushStatus && (
                  <p
                    className={`rounded-lg p-2.5 font-mono text-xs break-all ${
                      testPushStatus.startsWith('Success')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : testPushStatus.startsWith('Error') ||
                            testPushStatus.startsWith('Trigger Error')
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {testPushStatus}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0" />
              <span>
                Your UPI handle is only visible to roommates inside your shared spaces.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {localError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-600">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>{localError}</p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 pb-5">
              {photoDataUrl ? (
                <img
                  src={photoDataUrl}
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
                  {getInitials()}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  <Camera size={14} />
                  <span>{photoDataUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>

                {photoDataUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl('')}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <UserCircle size={14} />
                  <span>Display Name</span>
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Mail size={14} />
                  <span>Email Address</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <QrCode size={14} />
                <span>UPI ID for Reimbursements</span>
              </label>
              <Input
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
                placeholder="e.g. username@okhdfcbank or 9876543210@paytm"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Lock size={14} />
                <span>{auth.currentUser?.isAnonymous ? 'Current Firebase Password' : 'Current Password'}</span>
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Required to link or change Firebase credentials"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Lock size={14} />
                <span>{auth.currentUser?.isAnonymous ? 'New Firebase Password' : 'New Password'}</span>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Leave blank to keep the current password"
                autoComplete="new-password"
                minLength={6}
              />
              {auth.currentUser?.isAnonymous && (
                <p className="mt-1.5 text-xs text-slate-500">
                  For an existing Firebase account, enter its current password above. To create a new linked account, enter a new password here.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setLocalError('');
                  setName(user?.username || '');
                  setEmail(user?.email || '');
                  setUpiId(user?.upiId || '');
                  setPhotoDataUrl(user?.photoDataUrl || '');
                  setCurrentPassword('');
                  setPassword('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {fallbackToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
            Profile updated!
          </div>
        </div>
      )}
    </div>
  );
}