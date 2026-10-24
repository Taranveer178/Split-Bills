import {
  Archive,
  ArchiveRestore,
  Bell,
  BellOff,
  Check,
  Copy,
  MessageSquare,
  Pin,
  PinOff,
  Plus,
  Users,
} from 'lucide-react';

export default function DesktopSpacesTab({
  groups,
  activeCount,
  pinnedCount,
  archivedCount,
  spaceFilter,
  onSpaceFilterChange,
  groupMetrics,
  users,
  user,
  pinnedGroupIds,
  archivedGroupIds,
  mutedGroupIds,
  onOpenGroup,
  onUpdateGroupPreference,
  onQuickAdd,
  onCopyInvite,
  copiedCodeId,
}) {
  return (
    <section className="liquid-glass w-full rounded-3xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3.5">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-extrabold tracking-tight text-slate-900">
            Shared Spaces
          </h1>
          <span className="rounded-lg border border-blue-200/60 bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
            {groups.length}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-2xl bg-slate-200/60 p-1">
          {[
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'pinned', label: `Pinned (${pinnedCount})` },
            { id: 'archived', label: `Archived (${archivedCount})` },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onSpaceFilterChange(filter.id)}
              className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                spaceFilter === filter.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/40 px-6 py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Users size={22} />
          </div>
          <p className="text-sm font-bold text-slate-800">
            {spaceFilter === 'archived'
              ? 'No archived spaces'
              : spaceFilter === 'pinned'
                ? 'No pinned spaces yet'
                : 'No active spaces found'}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            Create a new room or join an existing flat using a 6-digit invite code.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {groups.map((group) => {
            const metrics = groupMetrics.byGroup[group.id] || {
              myNet: 0,
              roomSpend: 0,
              billCount: 0,
              latestExpense: null,
            };
            const isPinned = pinnedGroupIds.includes(group.id);
            const isMuted = mutedGroupIds.includes(group.id);
            const isArchived = archivedGroupIds.includes(group.id);

            return (
              <article
                key={group.id}
                onClick={() => onOpenGroup(group.id)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpenGroup(group.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className="liquid-glass-interactive group flex min-w-0 cursor-pointer flex-col justify-between rounded-2xl p-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-base font-extrabold text-white shadow-sm">
                        {group.imageDataUrl ? (
                          <img src={group.imageDataUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          group.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h2 className="truncate text-sm font-extrabold text-slate-900 transition-colors group-hover:text-blue-600">
                            {group.name}
                          </h2>
                          {isPinned && <Pin size={12} className="flex-shrink-0 text-blue-600" />}
                          {isMuted && <BellOff size={12} className="flex-shrink-0 text-amber-500" />}
                        </div>
                        <p className="truncate text-xs text-slate-500">
                          {group.description || `${group.members?.length || 1} members`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-xl border px-2.5 py-1 font-mono text-xs font-extrabold ${
                        metrics.myNet > 0.01
                          ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-700'
                          : metrics.myNet < -0.01
                            ? 'border-rose-200/80 bg-rose-50/90 text-rose-700'
                            : 'border-slate-200/60 bg-slate-100/80 text-slate-600'
                      }`}
                    >
                      {metrics.myNet > 0.01
                        ? `+₹${metrics.myNet.toFixed(2)}`
                        : metrics.myNet < -0.01
                          ? `-₹${Math.abs(metrics.myNet).toFixed(2)}`
                          : 'Settled'}
                    </span>
                  </div>

                  <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Room Spend
                      </span>
                      <span className="font-mono font-extrabold text-slate-800">
                        ₹{metrics.roomSpend.toFixed(2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Latest Bill
                      </span>
                      <span className="block truncate font-semibold text-slate-700">
                        {metrics.latestExpense?.title || 'No bills yet'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-200/50 pt-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {(group.members || []).slice(0, 4).map((memberId) => {
                        const member = users.find((candidate) => candidate.id === memberId);
                        const label = memberId === user.id
                          ? user.username
                          : member?.username || 'M';
                        return (
                          <span
                            key={memberId}
                            title={label}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[10px] font-extrabold text-blue-700"
                          >
                            {(label || 'M').charAt(0).toUpperCase()}
                          </span>
                        );
                      })}
                    </div>
                    {group.inviteCode && (
                      <button
                        type="button"
                        onClick={(event) => onCopyInvite(event, group)}
                        title="Copy invite code"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white/80 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600 hover:bg-white"
                      >
                        {copiedCodeId === group.id ? (
                          <Check size={10} className="text-emerald-600" />
                        ) : (
                          <Copy size={10} />
                        )}
                        <span>{group.inviteCode}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onQuickAdd(group.id);
                      }}
                      title="Quick add bill to this space"
                      className="inline-flex h-7 items-center gap-1 rounded-xl bg-gradient-to-b from-blue-600 to-indigo-600 px-2.5 text-[11px] font-bold text-white shadow-sm hover:opacity-95"
                    >
                      <Plus size={12} />
                      <span>Bill</span>
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenGroup(group.id, 'chat');
                      }}
                      title="Open group chat"
                      aria-label={`Open ${group.name} chat`}
                      className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-blue-600"
                    >
                      <MessageSquare size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onUpdateGroupPreference(group.id, 'mutedGroupIds', !isMuted);
                      }}
                      aria-label={isMuted ? `Unmute ${group.name}` : `Mute ${group.name}`}
                      className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                        isMuted ? 'bg-amber-50 text-amber-700' : 'text-slate-400 hover:bg-white'
                      }`}
                    >
                      {isMuted ? <BellOff size={14} /> : <Bell size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onUpdateGroupPreference(group.id, 'pinnedGroupIds', !isPinned);
                      }}
                      aria-label={isPinned ? `Unpin ${group.name}` : `Pin ${group.name}`}
                      className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                        isPinned ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-white'
                      }`}
                    >
                      {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onUpdateGroupPreference(group.id, 'archivedGroupIds', !isArchived);
                      }}
                      aria-label={isArchived ? `Restore ${group.name}` : `Archive ${group.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:bg-white"
                    >
                      {isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
