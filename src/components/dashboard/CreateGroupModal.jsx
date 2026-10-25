import { useState } from 'react';
import { ArrowLeft, ImagePlus, X, Loader2 } from 'lucide-react';
import { generateInviteCode } from '../../utils/constants';
import { compressImageFile } from '../../utils/compressImage';
import { Button, Input } from '../common/UI';

export default function CreateGroupModal({ user, onSaveGroup, onBack, showToast }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const newGroup = {
      id: `grp_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      ...(imageDataUrl ? { imageDataUrl } : {}),
      inviteCode: generateInviteCode(),
      createdBy: user.id,
      members: [user.id],
      createdAt: new Date().toISOString(),
    };
    try {
      await onSaveGroup(newGroup);
      showToast('Group created successfully!');
      onBack();
    } catch (error) {
      showToast(error.message || 'Could not create group. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    try {
      setImageDataUrl(await compressImageFile(file));
    } catch (error) {
      showToast(error.message || 'Could not process this image.', 'error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
      onClick={() => !saving && onBack()}
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
              disabled={saving}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900">Create New Space</h1>
              <p className="text-xs text-slate-500">Set up a shared ledger for your flat or trip</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-5 space-y-4">
          <Input
            label="Space Name"
            placeholder="e.g. Flat 302, Goa Trip"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <Input
            label="Description (Optional)"
            placeholder="Monthly rent, groceries & utilities"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <span className="mb-2 block text-xs font-semibold text-slate-700">
              Space Icon (Optional)
            </span>
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-500">
                {imageDataUrl ? (
                  <img src={imageDataUrl} alt="Group preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus size={18} />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  <ImagePlus size={14} />
                  <span>{imageDataUrl ? 'Change image' : 'Upload image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                </label>

                {imageDataUrl && (
                  <button
                    type="button"
                    onClick={() => setImageDataUrl('')}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <X size={14} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onBack} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Creating…</span>
                </>
              ) : (
                <span>Create Space</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}