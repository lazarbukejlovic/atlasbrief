import { Menu, Plane, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/saved', label: 'Saved' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
];

interface NavbarProps {
  savedCount: number;
}

const Navbar = ({ savedCount }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-ivory/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-accent to-sand text-white shadow-card">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-accent">AtlasBrief</div>
            <div className="text-sm text-navy-muted">Know the country before you land.</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-navy shadow-soft'
                    : 'text-navy-muted hover:bg-white/70 hover:text-navy'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/saved" className="rounded-full border border-sky-accent/15 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft">
            Saved {savedCount > 0 ? `(${savedCount})` : ''}
          </Link>
          <Link to="/pricing" className="btn-primary px-5 py-2.5 text-sm">
            Upgrade
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/account" className="rounded-full border border-sky-accent/15 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft">
                Account
              </Link>
              <button type="button" onClick={() => void signOut()} className="rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white">
                Login
              </Link>
              <Link to="/signup" className="rounded-full bg-sky-accent px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-accent/90">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white text-navy shadow-soft lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/70 bg-white/90 px-4 py-4 shadow-card lg:hidden">
          <div className="flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-navy-muted"
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    void signOut();
                    setOpen(false);
                  }}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-navy-muted"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-navy-muted"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-navy-muted"
                >
                  Sign up
                </Link>
              </>
            )}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-sky-soft text-navy' : 'text-navy-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;