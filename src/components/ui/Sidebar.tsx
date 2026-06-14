import { BookOpen, LayoutDashboard, Receipt, ShoppingBag, User, Settings } from 'lucide-react';

interface SidebarProps {
  active: number;
  onSelect: (section: number) => void;
}

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 3 },
  { label: 'Meal Plan', icon: BookOpen, id: 5 },
  { label: 'Shopping List', icon: ShoppingBag, id: 6 },
  { label: 'Analytics', icon: Receipt, id: 4 },
  { label: 'Profile', icon: User, id: 7 },
  { label: 'Settings', icon: Settings, id: 8 }
];

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="glass-card hidden h-[calc(100vh-2rem)] min-h-[720px] w-72 flex-col gap-4 border border-white/60 bg-white/80 p-5 shadow-soft xl:flex">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-text/50">Workspace</p>
        <h2 className="mt-4 text-2xl font-semibold text-text">NutriAI</h2>
      </div>
      <nav className="mt-8 flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`group flex items-center gap-3 rounded-3xl px-4 py-3 text-left transition ${
                selected
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white/80 text-text hover:bg-accent/80 hover:text-primaryDark'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-3xl border border-primary/10 bg-primary/5 p-4 text-sm text-text/80">
        AI-powered meal plans tailored to goals, allergies, and budget.
      </div>
    </aside>
  );
}
