import { Menu, Settings2, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onNavigate: (section: number) => void;
  activeSection: number;
  darkMode?: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}

const navLinks = [
  { label: 'Dashboard', id: 3 },
  { label: 'Meals', id: 5 },
  { label: 'Shopping', id: 6 },
  { label: 'Profile', id: 7 }
];

export default function Navbar({ onNavigate, activeSection, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card sticky top-0 z-40 w-full border border-white/60 bg-white/70 px-5 py-4 shadow-soft"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-white/80 xl:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 text-text" />
          </button>
          <div className="hidden h-12 w-12 items-center justify-center rounded-3xl bg-primary text-white shadow-glow sm:flex font-bold">
            NA
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primaryDark">NutriAI</p>
            <h1 className="text-base font-semibold text-text hidden sm:block">Personalized Nutrition Hub</h1>
          </div>
        </div>

        {/* Nav links — desktop */}
        <div className="hidden items-center gap-2 rounded-3xl bg-white/80 px-3 py-2 shadow-sm shadow-primary/10 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigate(link.id)}
              className={`rounded-2xl px-4 py-2 text-sm transition ${
                activeSection === link.id
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-text/70 hover:text-primaryDark'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(8)}
            className="rounded-2xl border border-primary/20 bg-white/90 p-2 text-text transition hover:border-primary hover:text-primaryDark sm:px-4 sm:py-2"
          >
            <Settings2 className="h-4 w-4 sm:mr-2 inline-block" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primaryDark text-white shadow-soft">
            <UserCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
