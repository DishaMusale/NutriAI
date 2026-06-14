import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  detail: string;
  icon?: ReactNode;
  accent?: string;
}

export default function DashboardCard({ title, value, detail, icon, accent }: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="glass-card rounded-3xl border border-white/70 p-6 shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-text/50">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-text">{value}</h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accent ?? 'bg-primary'} text-white`}>
          {icon}
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-text/70">{detail}</p>
    </motion.div>
  );
}
