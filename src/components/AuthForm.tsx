import { FormEvent, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const { signInWithPassword, signUpWithPassword, authMessage, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect') || '/dashboard';
  }, [location.search]);

  const selectedPlan = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('plan');
  }, [location.search]);

  const title = mode === 'login' ? 'Create your readiness workspace' : 'Save trip briefs across devices';
  const subtitle =
    mode === 'login'
      ? 'Sign in to track what changed before you book.'
      : 'Your account will power saved briefs, alerts, and subscription access.';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const result =
      mode === 'login'
        ? await signInWithPassword(email, password)
        : await signUpWithPassword(email, password);

    if (result) {
      setError(result);
      setSubmitting(false);
      return;
    }

    if (mode === 'signup') {
      setSuccess('Account created. Check your email if confirmation is required, then log in.');
      setSubmitting(false);
      return;
    }

    navigate(redirect);
  };

  return (
    <section className="mx-auto w-full max-w-xl glass-card rounded-[2rem] p-8 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">
        {mode === 'login' ? 'Login' : 'Sign up'}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-navy md:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-7 text-navy-muted">{subtitle}</p>

      {selectedPlan ? (
        <div className="mt-4 rounded-2xl border border-sand/30 bg-white/75 px-4 py-3 text-sm text-navy-muted">
          Selected plan: <span className="font-semibold text-navy">{selectedPlan.toUpperCase()}</span>. Plan assignment is currently simulated and defaults to Free.
        </div>
      ) : null}

      {!isConfigured && authMessage ? (
        <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {authMessage}
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-navy shadow-soft outline-none focus:border-sky-accent/50"
            placeholder="you@atlasbrief.com"
            disabled={!isConfigured || submitting}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-navy shadow-soft outline-none focus:border-sky-accent/50"
            placeholder="At least 8 characters"
            disabled={!isConfigured || submitting}
          />
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {success ? <p className="text-sm text-success">{success}</p> : null}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!isConfigured || submitting}
        >
          {submitting
            ? 'Please wait...'
            : mode === 'login'
            ? 'Login to workspace'
            : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-sm text-navy-muted">
        {mode === 'login' ? (
          <>
            New to AtlasBrief?{' '}
            <Link className="font-semibold text-sky-accent" to="/signup">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link className="font-semibold text-sky-accent" to="/login">
              Login
            </Link>
          </>
        )}
      </p>
    </section>
  );
};

export default AuthForm;
