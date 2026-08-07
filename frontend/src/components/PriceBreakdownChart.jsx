import React from 'react';
import { PieChart, DollarSign, Layers } from 'lucide-react';

export const PriceBreakdownChart = ({ components = [], subtotal = 0 }) => {
  if (!components || components.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
        <PieChart className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm font-medium">Select components to visualize price breakdown</p>
      </div>
    );
  }

  const categoryColors = {
    'Processor': 'bg-cyan-500 text-cyan-400 border-cyan-500/30',
    'RAM': 'bg-indigo-500 text-indigo-400 border-indigo-500/30',
    'Storage': 'bg-emerald-500 text-emerald-400 border-emerald-500/30',
    'Graphics Card': 'bg-purple-500 text-purple-400 border-purple-500/30',
    'Display': 'bg-amber-500 text-amber-400 border-amber-500/30',
    'Battery': 'bg-rose-500 text-rose-400 border-rose-500/30',
    'Keyboard': 'bg-sky-500 text-sky-400 border-sky-500/30',
    'Operating System': 'bg-teal-500 text-teal-400 border-teal-500/30'
  };

  const colorHexMap = {
    'Processor': '#06b6d4',
    'RAM': '#6366f1',
    'Storage': '#10b981',
    'Graphics Card': '#a855f7',
    'Display': '#f59e0b',
    'Battery': '#f43f5e',
    'Keyboard': '#38bdf8',
    'Operating System': '#14b8a6'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Category Price Breakdown</span>
        </h4>
        <span className="text-xs font-bold text-slate-300">${subtotal.toLocaleString()} Subtotal</span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner border border-slate-800">
        {components.map((comp, idx) => {
          const price = comp.sellingPrice || comp.sellingPriceAtQuote || 0;
          const pct = subtotal > 0 ? (price / subtotal) * 100 : 0;
          const category = comp.category;
          const color = colorHexMap[category] || '#94a3b8';

          return (
            <div
              key={idx}
              style={{ width: `${pct}%`, backgroundColor: color }}
              className="h-full transition-all duration-500 hover:brightness-125 relative group"
              title={`${comp.name}: $${price} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Itemized Legend & Share List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {components.map((comp, idx) => {
          const price = comp.sellingPrice || comp.sellingPriceAtQuote || 0;
          const pct = subtotal > 0 ? (price / subtotal) * 100 : 0;
          const categoryClass = categoryColors[comp.category] || 'bg-slate-500 text-slate-400';

          return (
            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
              <div className="flex items-center space-x-2.5 truncate max-w-[70%]">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${categoryClass.split(' ')[0]}`} />
                <div className="truncate">
                  <span className="font-semibold text-slate-200 block truncate">{comp.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">{comp.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-200">${price}</div>
                <div className="text-[10px] text-cyan-400 font-semibold">{pct.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
