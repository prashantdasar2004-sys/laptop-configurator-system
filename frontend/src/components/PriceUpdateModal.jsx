import React, { useState } from 'react';
import { X, TrendingUp, History, ShieldAlert, Check } from 'lucide-react';

export const PriceUpdateModal = ({ isOpen, onClose, component, onUpdatePrice }) => {
  if (!isOpen || !component) return null;

  const [sellingPrice, setSellingPrice] = useState(component.sellingPrice || '');
  const [baseCost, setBaseCost] = useState(component.baseCost || '');
  const [reason, setReason] = useState('Supplier Tariff Update');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdatePrice(component._id, {
      sellingPrice: Number(sellingPrice),
      baseCost: Number(baseCost),
      reason,
      updatedBy: 'Pricing Manager'
    });
  };

  const oldSelling = component.sellingPrice || 0;
  const newSelling = Number(sellingPrice) || 0;
  const priceDelta = newSelling - oldSelling;
  const pctChange = oldSelling > 0 ? (priceDelta / oldSelling) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Update Component Price</h3>
              <p className="text-xs text-slate-400">Modify master catalog price & record audit trail</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Target Component</span>
              <span className="font-bold text-white text-sm">{component.name}</span>
            </div>
            <span className="font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/50">
              {component.sku}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                New Base Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={baseCost}
                onChange={(e) => setBaseCost(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                New Selling Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Price Change Impact Callout */}
          {priceDelta !== 0 && (
            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
              priceDelta > 0 
                ? 'bg-rose-950/40 border-rose-800/40 text-rose-300' 
                : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
            }`}>
              <span>Price Delta: {priceDelta > 0 ? `+$${priceDelta.toFixed(2)}` : `-$${Math.abs(priceDelta).toFixed(2)}`}</span>
              <span className="font-bold">{pctChange > 0 ? `+${pctChange.toFixed(1)}%` : `${pctChange.toFixed(1)}%`}</span>
            </div>
          )}

          {/* Historical Integrity Guarantee Notice */}
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/30 text-xs text-blue-300 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Historical Price Preservation Notice:</strong> Updating catalog price will update new quote calculations, but will <span className="underline font-bold">never</span> change existing saved quotations.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Reason for Price Adjustment
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="Supplier Tariff Update">Supplier Tariff Update</option>
              <option value="Inflationary Cost Change">Inflationary Cost Change</option>
              <option value="Quarterly Promotional Discount">Quarterly Promotional Discount</option>
              <option value="Inventory Clearance">Inventory Clearance</option>
            </select>
          </div>

          {/* Price History Timeline Preview */}
          {component.priceHistory && component.priceHistory.length > 0 && (
            <div className="pt-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <History className="w-3.5 h-3.5" />
                <span>Price Revision History</span>
              </h5>
              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {component.priceHistory.map((hist, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                    <span>{new Date(hist.updatedAt).toLocaleDateString()} - {hist.reason || 'Price Update'}</span>
                    <span className="font-mono text-slate-200 font-bold">${hist.sellingPrice}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-all shadow-lg shadow-amber-600/30 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply Price Update</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
