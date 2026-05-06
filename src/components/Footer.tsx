import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/60 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-accent">AtlasBrief</div>
          <p className="mt-3 text-sm leading-7 text-navy-muted">
            Premium destination intelligence for travelers, remote workers, and business teams who need local context before wheels down.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-navy-muted">
          <Link to="/dashboard" className="hover:text-navy">Dashboard</Link>
          <Link to="/destinations" className="hover:text-navy">Destinations</Link>
          <Link to="/pricing" className="hover:text-navy">Pricing</Link>
          <Link to="/about" className="hover:text-navy">About</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;