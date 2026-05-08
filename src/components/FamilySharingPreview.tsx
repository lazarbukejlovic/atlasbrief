import { Plus, Users } from 'lucide-react';
import ComingSoonBadge from './ComingSoonBadge';

const mockMembers = [
  { name: 'Alex', status: 'Ready', passport: 'Valid', insurance: 'Review in 2 weeks' },
  { name: 'Sam', status: 'Review', passport: 'Reminder due', insurance: 'Missing placeholder' },
  { name: 'Mia', status: 'Ready', passport: 'Valid', insurance: 'Valid placeholder' },
];

const FamilySharingPreview = () => (
  <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Family Sharing Preview</div>
        <h2 className="mt-2 text-2xl font-semibold text-navy">Shared readiness workspace mock</h2>
      </div>
      <ComingSoonBadge label="Preview only" />
    </div>

    <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-white/70 bg-white/85 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
          <Users className="h-4 w-4 text-sky-accent" />
          Trip members
        </div>

        <div className="space-y-2">
          {mockMembers.map((member) => (
            <div key={member.name} className="rounded-xl border border-white/70 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy">{member.name}</p>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${member.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                  {member.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-navy-muted">Passport reminder placeholder: {member.passport}</p>
              <p className="mt-1 text-xs text-navy-muted">Insurance reminder placeholder: {member.insurance}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Shared checklist progress</p>
          <p className="mt-2 text-2xl font-semibold text-navy">18 / 24</p>
          <p className="mt-1 text-sm text-navy-muted">Cross-member readiness checklist items completed.</p>
        </div>

        <button
          type="button"
          disabled
          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-navy-muted/80"
        >
          <Plus className="h-4 w-4" />
          Invite family member (coming soon)
        </button>
      </div>
    </div>
  </section>
);

export default FamilySharingPreview;