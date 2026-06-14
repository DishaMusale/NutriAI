import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MealCardProps {
  day: string;
  meals: { label: string; description: string }[];
}

export default function MealCard({ day, meals }: MealCardProps) {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl border border-white/70 p-5 shadow-soft"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left text-text"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-text/50">{day}</p>
          <h3 className="mt-2 text-xl font-semibold">Weekly meal plan</h3>
        </div>
        <ChevronDown className={`h-5 w-5 transition ${open ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {open && (
        <div className="mt-5 space-y-4">
          {meals.map((meal) => (
            <div key={meal.label} className="rounded-3xl border border-primary/10 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-primaryDark">{meal.label}</p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primaryDark">Fresh</span>
              </div>
              <p className="mt-2 text-sm text-text/70">{meal.description}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
