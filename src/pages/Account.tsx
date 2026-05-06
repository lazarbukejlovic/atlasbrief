import { Mail, ShieldCheck } from 'lucide-react';
import AccountPlanCard from '../components/AccountPlanCard';
import { useAtlasBrief } from '../components/AppLayout';
import { useAuth } from '../hooks/useAuth';

const Account = () => {
  const { user, currentPlan, planDetails, signOut } = useAuth();
  const { savedIds } = useAtlasBrief();

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Account</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
          Your readiness workspace account
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
          Your account will power saved briefs, alerts, and subscription access.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-sky-accent" />
            <h2 className="text-lg font-semibold text-navy">Profile</h2>
          </div>
          <p className="mt-4 text-sm text-navy-muted">Email</p>
          <p className="text-lg font-semibold text-navy">{user?.email ?? 'Unknown user'}</p>
          <p className="mt-4 text-xs text-navy-muted">
            Save trip briefs across devices and track what changed before you book.
          </p>
        </div>

        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-sand" />
            <h2 className="text-lg font-semibold text-navy">Subscription access</h2>
          </div>
          <p className="mt-4 text-sm text-navy-muted">Status</p>
          <p className="text-lg font-semibold text-navy">Simulation mode (Free default)</p>
          <p className="mt-4 text-xs text-navy-muted">
            Stripe checkout and customer portal are planned for the next build phase.
          </p>
          <button type="button" onClick={() => void signOut()} className="btn-secondary mt-6 px-5 py-2.5 text-sm">
            Logout
          </button>
        </div>
      </section>

      <AccountPlanCard
        plan={currentPlan}
        savedCount={savedIds.length}
        savedLimit={planDetails.savedBriefLimit}
      />
    </div>
  );
};

export default Account;
