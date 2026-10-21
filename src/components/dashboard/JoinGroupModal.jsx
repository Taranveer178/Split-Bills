import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Camera, KeyRound, ScanLine, X, Loader2 } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { Button } from '../common/UI';

const extractInviteCode = (value) => {
  try {
    const inviteUrl = new URL(value);
    const codeFromUrl = inviteUrl.searchParams.get('join') || inviteUrl.searchParams.get('invite');
    return (codeFromUrl || value).trim().toUpperCase();
  } catch {
    return value.trim().toUpperCase();
  }
};

export default function JoinGroupModal({
  user,
  groups,
  onUpdateGroup,
  initialCode = '',
  onBack,
  showToast,
}) {
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isScanning || !videoRef.current) return undefined;
    let isMounted = true;
    setIsCameraReady(false);
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        const scannedCode = extractInviteCode(typeof result === 'string' ? result : result.data);
        if (scannedCode.length < 3) {
          showToast('This QR code does not contain a valid invite.', 'error');
          return;
        }
        setCode(scannedCode);
        setIsScanning(false);
        showToast('Invite scanned. Tap Join Space to continue.');
      },
      { preferredCamera: 'environment' }
    );

    scanner.start().catch((error) => {
      if (isMounted) {
        setIsScanning(false);
        showToast(
          error.name === 'NotAllowedError'
            ? 'Allow camera access to scan a QR code.'
            : 'Could not start the camera scanner.',
          'error'
        );
      }
    });

    return () => {
      isMounted = false;
      scanner.stop();
      scanner.destroy();
    };
  }, [isScanning, showToast]);

  const handleJoin = async (event) => {
    event.preventDefault();
    const cleanCode = extractInviteCode(code);
    if (!cleanCode) return;
    const group = groups.find((item) => item.inviteCode === cleanCode);
    if (!group) {
      showToast('Invalid invite code.', 'error');
      return;
    }
    if (group.members.includes(user.id)) {
      showToast('You are already in this group.');
      onBack();
      return;
    }
    setIsJoining(true);
    try {
      await onUpdateGroup({ ...group, members: [...group.members, user.id] });
      showToast(`Joined ${group.name}!`);
      onBack();
    } catch {
      showToast('Could not join this group. Please try again.', 'error');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
      onClick={() => !isJoining && onBack()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              disabled={isJoining}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900">Join a Space</h1>
              <p className="text-xs text-slate-500">Enter a 6-character invite code or scan QR</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            disabled={isJoining}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleJoin} className="mt-5 space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <KeyRound size={20} />
            </div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Space Invite Code
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.25em] uppercase text-slate-900 placeholder:text-slate-300 focus:border-slate-900 focus:bg-white focus:outline-none"
              placeholder="SINGH1"
              maxLength={10}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck="false"
              required
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              disabled={code.trim().length < 3 || isJoining}
              className="w-full py-3"
            >
              {isJoining ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Joining…</span>
                </>
              ) : (
                <span>Join Space</span>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setIsScanning(true)}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ScanLine size={15} />
              <span>Scan QR Code</span>
            </button>
          </div>
        </form>
      </div>

      {isScanning &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
            onClick={() => setIsScanning(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="scan-group-invite-title"
              className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsScanning(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
                aria-label="Close QR scanner"
              >
                <X size={16} />
              </button>

              <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Camera size={18} />
              </div>

              <h2 id="scan-group-invite-title" className="text-base font-bold text-slate-900">
                Scan Space QR Code
              </h2>
              <p className="mb-3 mt-0.5 text-xs text-slate-500">
                Center the QR code inside the camera frame
              </p>

              <div className="relative overflow-hidden rounded-xl bg-slate-950">
                <video
                  ref={videoRef}
                  className="aspect-square w-full bg-slate-950 object-cover"
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  onPlaying={() => setIsCameraReady(true)}
                />

                {!isCameraReady && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 text-white"
                    role="status"
                  >
                    <Loader2 size={24} className="animate-spin text-emerald-400" />
                    <span className="text-xs font-medium text-slate-300">Starting camera…</span>
                  </div>
                )}
              </div>
            </section>
          </div>,
          document.body
        )}
    </div>
  );
}