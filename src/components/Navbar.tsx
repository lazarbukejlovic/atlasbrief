import { ChevronDown, Menu, Plane, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const primaryNavItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/compare', label: 'Compare' },
  { to: '/alerts', label: 'Alerts' },
];

const secondaryNavItems = [
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/stay-planner', label: 'Stay Planner' },
  { to: '/saved', label: 'Saved Briefs' },
  { to: '/profile', label: 'Traveler Profile' },
  { to: '/reports', label: 'Reports' },
  { to: '/partners', label: 'Partners' },
  { to: '/pro', label: 'Pro Preview' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
];

const mobileNavItems = [...primaryNavItems, ...secondaryNavItems];

interface NavbarProps {
  savedCount: number;
}

const isRouteActive = (pathname: string, route: string) => {
  if (route === '/') {
    return pathname === '/';
  }

  return pathname === route || pathname.startsWith(`${route}/`);
};

const Navbar = ({ savedCount }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { isAuthenticated, signOut, currentPlan } = useAuth();
  const location = useLocation();
  const isPaidPlan = currentPlan === 'Plus' || currentPlan === 'Pro';

  const moreIsActive = useMemo(
    () => secondaryNavItems.some((item) => isRouteActive(location.pathname, item.to)),
    [location.pathname]
  );

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

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

        <nav className="hidden items-center gap-2 xl:flex">
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-navy shadow-soft'
                    : 'text-navy-muted hover:bg-white/70 hover:text-navy'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((current) => !current)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                moreIsActive || moreOpen
                  ? 'bg-white text-navy shadow-soft'
                  : 'text-navy-muted hover:bg-white/70 hover:text-navy'
              }`}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
            >
              More
              <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/95 p-2 shadow-card backdrop-blur-xl">
                <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-muted">
                  More destinations tools
                </div>
                <div className="flex flex-col gap-1">
                  {secondaryNavItems.map((item) => {
                    const isActive = isRouteActive(location.pathname, item.to);

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? 'bg-sky-soft text-navy shadow-soft'
                            : 'text-navy-muted hover:bg-ivory hover:text-navy'
                        }`}
                      >
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </nav>

        <div className="hidden flex-nowrap items-center gap-3 xl:flex">
          <Link to="/saved" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-sky-accent/15 bg-white px-5 py-0 text-sm font-semibold text-navy shadow-soft">
            Saved {savedCount > 0 ? `(${savedCount})` : ''}
          </Link>
          {isPaidPlan ? (
            <Link to="/account" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-navy px-5 py-0 text-sm font-semibold text-white shadow-soft transition hover:bg-navy-light">
              Billing
            </Link>
          ) : (
            <Link to="/pricing" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-navy px-5 py-0 text-sm font-semibold text-white shadow-soft transition hover:bg-navy-light">
              Upgrade
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/account" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-sky-accent/15 bg-white px-5 py-0 text-sm font-semibold text-navy shadow-soft">
                Account
              </Link>
              <button type="button" onClick={() => void signOut()} className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/80 bg-white/85 px-5 py-0 text-sm font-semibold text-navy shadow-soft transition hover:bg-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/80 bg-white/85 px-5 py-0 text-sm font-semibold text-navy shadow-soft transition hover:bg-white">
                Login
              </Link>
              <Link to="/signup" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-sky-accent px-5 py-0 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-accent/90">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white text-navy shadow-soft xl:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/70 bg-white/90 px-4 py-4 shadow-card xl:hidden">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-3 shadow-soft">
              <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-muted">
                Navigation
              </div>
              <div className="flex flex-col gap-1">
                {mobileNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? 'bg-sky-soft text-navy shadow-soft' : 'text-navy-muted hover:bg-ivory hover:text-navy'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-3 shadow-soft">
              <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-muted">
                Account actions
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to="/saved"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-sky-accent/15 bg-white px-4 py-3 text-sm font-semibold text-navy shadow-soft"
                >
                  Saved {savedCount > 0 ? `(${savedCount})` : ''}
                </Link>

                {isPaidPlan ? (
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-sky-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-accent/90"
                  >
                    Manage Billing
                  </Link>
                ) : (
                  <Link
                    to="/pricing"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-sky-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-accent/90"
                  >
                    Upgrade
                  </Link>
                )}

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl border border-white/70 bg-white px-4 py-3 text-sm font-medium text-navy shadow-soft"
                    >
                      Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        void signOut();
                        setOpen(false);
                      }}
                      className="rounded-2xl border border-white/70 bg-white px-4 py-3 text-left text-sm font-medium text-navy shadow-soft transition hover:bg-ivory"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl border border-white/70 bg-white px-4 py-3 text-sm font-medium text-navy shadow-soft"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl border border-white/70 bg-white px-4 py-3 text-sm font-medium text-navy shadow-soft"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;