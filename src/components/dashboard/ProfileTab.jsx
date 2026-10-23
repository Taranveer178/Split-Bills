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
} from 'lucide-react';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { Button, Input } from '../common/UI';
import { requestNotificationPermission, triggerPushNotification } from '../../utils/notifications';

export default function ProfileTab({ user, onUpdateUser, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [upiId, setUpiId] = useState(user?.upiId || '');
  const [photoDataUrl, setPhotoDataUrl] = useState(user?.photoDataUrl || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [fallbackToast, setFallbackToast] = useState(false);
  const [testPushStatus, setTestPushStatus] = useState('');
  const [testingPush, setTestingPush] = useState(false);

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
        message: 'Push notifications are working correctly on RoomSplit!',
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
      const firebaseUser = auth.currentUser;
      if (password.trim() && password.length < 6) {
        throw new Error('New password must be at least 6 characters long.');
      }

      const firestoreUpdates = {};
      if (name.trim() && name.trim() !== user.username) {
        if (firebaseUser) await updateProfile(firebaseUser, { displayName: name.trim() });
        firestoreUpdates.username = name.trim();
      }
      if (upiId.trim() !== (user.upiId || '')) firestoreUpdates.upiId = upiId.trim();
      if (email.trim().toLowerCase() !== (user.email || '').toLowerCase()) {
        const nextEmail = email.trim().toLowerCase();
        if (firebaseUser && !firebaseUser.isAnonymous) await updateEmail(firebaseUser, nextEmail);
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

      if (password.trim()) {
        if (firebaseUser && !firebaseUser.isAnonymous) {
          await updatePassword(firebaseUser, password);
          if (typeof onUpdateUser === 'function') await onUpdateUser(user.id, { password: '' });
        } else if (typeof onUpdateUser === 'function') {
          await onUpdateUser(user.id, { password });
        }
        setPassword('');
      }

      if (typeof showToast === 'function') {
        showToast('Profile updated successfully!');
      } else {
        setFallbackToast(true);
        setTimeout(() => setFallbackToast(false), 3000);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.code === 'auth/requires-recent-login') {
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
      <div className="mb-5 flex items-center justify-between border-b border-slate-200/90 pb-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Account & Payment Preferences</p>
          <h1 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Profile Settings
          </h1>
        </div>
        {!isEditing && (
          <Button
            onClick={() => {
              setIsEditing(true);
              setLocalError('');
            }}
            className="h-9 px-4 text-xs"
          >
            Edit Profile
          </Button>
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
                    className="h-20 w-20 rounded-2xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">
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
                  className="h-16 w-16 rounded-xl object-cover border border-slate-200"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-900 text-xl font-bold text-white">
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
                <span>New Password</span>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Leave blank to keep existing password"
                minLength={6}
              />
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