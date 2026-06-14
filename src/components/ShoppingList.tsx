import { motion } from 'framer-motion';
import { Minus, Plus, CheckCircle2 } from 'lucide-react';

export interface ShoppingItem { name: string; checked: boolean; qty: number; unit: string; }
export interface ShoppingCategory { title: string; aisle: string; items: ShoppingItem[]; }

interface ShoppingListProps {
  categories: ShoppingCategory[];
  onChange: (cats: ShoppingCategory[]) => void;
}

const aisleColors: Record<string, string> = {
  'Produce': 'bg-green-100 text-green-700',
  'Dairy & Proteins': 'bg-blue-100 text-blue-700',
  'Dry Goods': 'bg-amber-100 text-amber-700',
};

export default function ShoppingList({ categories, onChange }: ShoppingListProps) {
  const toggleItem = (catIdx: number, itemIdx: number) => {
    const next = categories.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      items: cat.items.map((item, ii) => ii !== itemIdx ? item : { ...item, checked: !item.checked })
    });
    onChange(next);
  };

  const adjustQty = (catIdx: number, itemIdx: number, delta: number) => {
    const next = categories.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      items: cat.items.map((item, ii) => ii !== itemIdx ? item : { ...item, qty: Math.max(1, item.qty + delta) })
    });
    onChange(next);
  };

  // Group by aisle
  const aisleMap: Record<string, { catIdx: number; cat: ShoppingCategory }[]> = {};
  categories.forEach((cat, catIdx) => {
    const aisle = cat.aisle || 'Other';
    if (!aisleMap[aisle]) aisleMap[aisle] = [];
    aisleMap[aisle].push({ catIdx, cat });
  });

  const totalItems = categories.flatMap(c => c.items).length;
  const checkedItems = categories.flatMap(c => c.items).filter(i => i.checked).length;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-text">{checkedItems}/{totalItems} items</p>
          <p className="text-xs text-text/60">{Math.round((checkedItems / totalItems) * 100)}% done</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-primary/10">
          <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${(checkedItems / totalItems) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {/* Aisle sections */}
      {Object.entries(aisleMap).map(([aisle, cats]) => (
        <div key={aisle}>
          <div className="flex items-center gap-3 mb-3 px-1">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${aisleColors[aisle] || 'bg-gray-100 text-gray-600'}`}>{aisle}</span>
            <div className="flex-1 h-px bg-primary/10" />
          </div>
          {cats.map(({ catIdx, cat }) => (
            <motion.div key={cat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl border border-white/70 p-5 shadow-soft mb-4">
              <h3 className="text-base font-semibold text-text mb-4">{cat.title}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {cat.items.map((item, itemIdx) => (
                  <div key={item.name}
                    className={`flex items-center gap-3 rounded-3xl border px-4 py-3 transition
                      ${item.checked ? 'border-primary/30 bg-primary/5' : 'border-primary/10 bg-white/80'}`}>
                    <button onClick={() => toggleItem(catIdx, itemIdx)}
                      className={`flex-shrink-0 h-5 w-5 rounded-full border-2 transition flex items-center justify-center
                        ${item.checked ? 'border-primary bg-primary' : 'border-primary/30 bg-white'}`}>
                      {item.checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.checked ? 'line-through text-text/40' : 'text-text/80'}`}>{item.name}</span>
                    {/* Qty editor */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => adjustQty(catIdx, itemIdx, -1)}
                        className="h-6 w-6 rounded-full bg-white border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-semibold text-text w-8 text-center">{item.qty}{item.unit}</span>
                      <button onClick={() => adjustQty(catIdx, itemIdx, 1)}
                        className="h-6 w-6 rounded-full bg-white border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
