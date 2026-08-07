import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, CheckCircle2, AlertCircle, Save, Percent, DollarSign, 
  RotateCcw, ShieldCheck, PieChart as ChartIcon, FileText, ArrowRight, User, Mail, Phone
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { PriceBreakdownChart } from '../components/PriceBreakdownChart';

export const ConfiguratorPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected component per category
  // Categories: Processor, RAM, Storage, Graphics Card, Display, Battery, Keyboard, Operating System
  const [selections, setSelections] = useState({});
  const [configName, setConfigName] = useState('Custom Pro Laptop Workstation');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(10);

  // Save Modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = [
    'Processor',
    'RAM',
    'Storage',
    'Graphics Card',
    'Display',
    'Battery',
    'Keyboard',
    'Operating System'
  ];

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      setLoading(true);
      const data = await api.getComponents({ availableOnly: 'true' });
      setComponents(data);

      // Auto-select first item of each category for initial default configuration
      const initialMap = {};
      categories.forEach((cat) => {
        const match = data.find((c) => c.category === cat);
        if (match) initialMap[cat] = match;
      });
      setSelections(initialMap);
    } catch (err) {
      showError('Failed to load components for builder');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectComponent = (category, component) => {
    setSelections((prev) => ({
      ...prev,
      [category]: component
    }));
  };

  // Selected list
  const selectedList = Object.values(selections).filter(Boolean);

  // Financial Calculations
  const subtotalCost = selectedList.reduce((sum, item) => sum + (item.baseCost || 0), 0);
  const subtotalSelling = selectedList.reduce((sum, item) => sum + (item.sellingPrice || 0), 0);
  const discountAmount = Math.round((subtotalSelling * (Number(discountPercentage) / 100)) * 100) / 100;
  const discountedSelling = subtotalSelling - discountAmount;
  const taxAmount = Math.round((discountedSelling * (Number(taxPercentage) / 100)) * 100) / 100;
  const finalTotal = Math.round((discountedSelling + taxAmount) * 100) / 100;
  const marginProfit = Math.round((discountedSelling - subtotalCost) * 100) / 100;
  const marginPercentage = subtotalCost > 0 ? Math.round(((discountedSelling - subtotalCost) / subtotalCost * 100) * 10) / 10 : 0;

  const handleSaveQuotation = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      showError('Customer name and email are required to generate quotation');
      return;
    }

    try {
      setSaving(true);
      const componentIds = selectedList.map((c) => c._id);
      const res = await api.createQuotation({
        configName,
        customerName,
        customerEmail,
        customerPhone,
        componentIds,
        discountPercentage: Number(discountPercentage),
        taxPercentage: Number(taxPercentage),
        notes,
        createdByName: 'Sales Executive'
      });

      showSuccess(`Quotation ${res.quoteNumber} created & price snapshot preserved!`);
      setIsSaveModalOpen(false);
      navigate(`/quotations/${res._id}`);
    } catch (err) {
      showError(err.message || 'Failed to save quotation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center space-x-3 text-cyan-400">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-semibold text-sm">Initializing Laptop Builder Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Laptop className="w-6 h-6 text-cyan-400" />
            <span>Interactive Laptop Builder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Select component hardware to generate automated quotations with live margin profit & price breakdown
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelections({})}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Selections</span>
          </button>
          
          <button
            onClick={() => setIsSaveModalOpen(true)}
            disabled={selectedList.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save & Export Quotation</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Component Selector (Left) vs Sticky Price Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Category Step-by-Step Selector */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Configuration Title Input */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Configuration Name / Model Title
            </label>
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-base focus:outline-none focus:border-cyan-500"
              placeholder="e.g. Apex Studio Workstation Laptop X17"
            />
          </div>

          {/* Categories Accordions / Cards */}
          {categories.map((cat) => {
            const catComponents = components.filter((c) => c.category === cat);
            const activeSel = selections[cat];

            return (
              <div key={cat} className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">{cat}</h3>
                  </div>
                  {activeSel ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{activeSel.name} (${activeSel.sellingPrice})</span>
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>No component selected</span>
                    </span>
                  )}
                </div>

                {/* Grid of Available Options in Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catComponents.map((comp) => {
                    const isSelected = activeSel && activeSel._id === comp._id;
                    const specs = comp.specifications ? Object.entries(comp.specifications) : [];

                    return (
                      <div
                        key={comp._id || comp.sku}
                        onClick={() => handleSelectComponent(cat, comp)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white text-xs leading-snug">{comp.name}</span>
                            <input
                              type="radio"
                              name={`cat-${cat}`}
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-cyan-500 w-4 h-4 shrink-0 ml-2"
                            />
                          </div>

                          {/* Quick spec pills */}
                          {specs.length > 0 && (
                            <div className="text-[10px] text-slate-400 space-x-1.5 mt-1">
                              {specs.slice(0, 2).map(([k, v]) => (
                                <span key={k} className="inline-block px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60 text-xs">
                          <span className="text-slate-400 font-mono text-[10px]">{comp.sku}</span>
                          <span className="font-extrabold text-cyan-400">${comp.sellingPrice}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>

        {/* Right Column: STICKY Live Price & Breakdown Summary Panel */}
        <div className="lg:sticky lg:top-20 space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                <span>Live Quote Calculator</span>
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Auto Calculated
              </span>
            </div>

            {/* Subtotal & Profit Margin Callout */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Hardware Components Subtotal:</span>
                <span className="font-bold text-slate-200">${subtotalSelling.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Supplier Base Cost (Internal):</span>
                <span className="font-mono text-slate-400">${subtotalCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-emerald-400 font-semibold">
                <span>Net Profit Margin:</span>
                <span>+${marginProfit.toLocaleString()} ({marginPercentage}%)</span>
              </div>
            </div>

            {/* Discount & Tax Adjustment Sliders/Inputs */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Special Customer Discount (%)</span>
                  <span className="text-cyan-400">{discountPercentage}% (-${discountAmount})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Sales Tax Rate (%)</span>
                  <span className="text-slate-400">{taxPercentage}% (+${taxAmount})</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* GRAND TOTAL BIG BADGE */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-950/80 to-blue-950/80 border border-cyan-500/30 text-center space-y-1 shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Final Quotation Total</span>
              <div className="text-3xl font-black text-white tracking-tight">${finalTotal.toLocaleString()}</div>
              <p className="text-[10px] text-slate-400">Includes {selectedList.length} hardware components + tax</p>
            </div>

            {/* Component-Wise Cost Breakdown Component */}
            <div className="pt-2">
              <PriceBreakdownChart components={selectedList} subtotal={subtotalSelling} />
            </div>

            {/* Save CTA */}
            <button
              onClick={() => setIsSaveModalOpen(true)}
              disabled={selectedList.length === 0}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Customer Quotation</span>
            </button>

          </div>

        </div>

      </div>

      {/* Save Quotation Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Save & Lock Quotation</h3>
              <button onClick={() => setIsSaveModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveQuotation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Customer / Organization Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Acme Innovations Corp"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Customer Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="procurement@acme.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Sales Notes / Special Instructions
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Includes 3-year warranty extension..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  Saving creates an immutable snapshot of all selected component prices (${finalTotal}). Future catalog price updates will not change this quotation.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-2"
                >
                  {saving ? 'Generating Quote...' : 'Confirm & Save Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
