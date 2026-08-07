import React, { useState, useEffect } from 'react';
import { 
  Cpu, Search, Plus, Edit2, TrendingUp, Trash2, History, 
  CheckCircle2, AlertTriangle, Layers, Filter, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ComponentModal } from '../components/ComponentModal';
import { PriceUpdateModal } from '../components/PriceUpdateModal';

export const ComponentsPage = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceUpdateComp, setPriceUpdateComp] = useState(null);

  const { showSuccess, showError } = useToast();

  const categories = [
    'All',
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
    fetchComponents();
  }, [selectedCategory, searchTerm]);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const data = await api.getComponents(params);
      setComponents(data);
    } catch (err) {
      showError('Failed to fetch components');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateComponent = async (componentData) => {
    try {
      if (editingComp) {
        await api.updateComponent(editingComp._id, componentData);
        showSuccess('Component updated successfully!');
      } else {
        await api.createComponent(componentData);
        showSuccess('New component added to catalog!');
      }
      setIsCompModalOpen(false);
      setEditingComp(null);
      fetchComponents();
    } catch (err) {
      showError(err.message || 'Operation failed');
    }
  };

  const handlePriceUpdate = async (id, priceData) => {
    try {
      await api.updateComponentPrice(id, priceData);
      showSuccess('Component price updated & history logged!');
      setIsPriceModalOpen(false);
      setPriceUpdateComp(null);
      fetchComponents();
    } catch (err) {
      showError(err.message || 'Price update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this component from catalog?')) return;
    try {
      await api.deleteComponent(id);
      showSuccess('Component deleted');
      fetchComponents();
    } catch (err) {
      showError(err.message || 'Failed to delete component');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>Laptop Component Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain master pricing, stock availability, and specs for configurable laptop parts
          </p>
        </div>

        <button
          onClick={() => { setEditingComp(null); setIsCompModalOpen(true); }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Component</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by component name, SKU code (e.g. CPU-INTEL), or brand..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid / Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Fetching hardware component catalog...</span>
        </div>
      ) : components.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <Layers className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No Components Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting search term or category filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {components.map((comp) => {
            const margin = comp.sellingPrice - comp.baseCost;
            const marginPct = comp.baseCost > 0 ? ((margin / comp.baseCost) * 100).toFixed(1) : 0;
            const specs = comp.specifications ? Object.entries(comp.specifications) : [];

            return (
              <div
                key={comp._id || comp.sku}
                className="glass-panel rounded-2xl border border-slate-800 p-5 flex flex-col justify-between glass-panel-hover"
              >
                <div>
                  
                  {/* Category & Stock Pill */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                      {comp.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">SKU: {comp.sku}</span>
                  </div>

                  {/* Component Title */}
                  <h3 className="font-bold text-white text-base leading-snug mb-1">
                    {comp.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium mb-3">Brand: {comp.brand || 'Generic'}</div>

                  {/* Specifications Badges */}
                  {specs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {specs.slice(0, 4).map(([k, v]) => (
                        <span key={k} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                          <strong className="text-slate-400">{k}:</strong> {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pricing Breakdown Card */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Supplier Base Cost:</span>
                      <span className="font-semibold text-slate-300">${comp.baseCost}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Retail Selling Price:</span>
                      <span className="font-bold text-cyan-400 text-sm">${comp.sellingPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 text-emerald-400 font-medium">
                      <span>Margin Profit:</span>
                      <span>+${margin.toFixed(2)} ({marginPct}%)</span>
                    </div>
                  </div>

                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => { setPriceUpdateComp({ ...comp, _id: comp._id || comp.sku }); setIsPriceModalOpen(true); }}
                    className="flex items-center space-x-1 text-xs font-semibold text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/40 hover:bg-amber-950/60 transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Update Price</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => { setEditingComp({ ...comp, _id: comp._id || comp.sku }); setIsCompModalOpen(true); }}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Edit Component Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comp._id || comp.sku)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                      title="Delete Component"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Component Edit/Create Modal */}
      <ComponentModal
        isOpen={isCompModalOpen}
        onClose={() => setIsCompModalOpen(false)}
        onSave={handleCreateOrUpdateComponent}
        component={editingComp}
      />

      {/* Price Update Modal */}
      <PriceUpdateModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        component={priceUpdateComp}
        onUpdatePrice={handlePriceUpdate}
      />

    </div>
  );
};
