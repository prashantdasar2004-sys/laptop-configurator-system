import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Cpu, DollarSign, Tag, Layers, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ComponentModal = ({ isOpen, onClose, onSave, component = null }) => {
  const { showError } = useToast();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Processor',
    brand: '',
    baseCost: '',
    sellingPrice: '',
    stockQuantity: 10,
    wattage: 0,
    isAvailable: true,
    specifications: []
  });

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
    if (component) {
      const specsArray = component.specifications 
        ? Object.entries(component.specifications).map(([key, value]) => ({ key, value }))
        : [];

      setFormData({
        sku: component.sku || '',
        name: component.name || '',
        category: component.category || 'Processor',
        brand: component.brand || '',
        baseCost: component.baseCost || '',
        sellingPrice: component.sellingPrice || '',
        stockQuantity: component.stockQuantity || 10,
        wattage: component.wattage || 0,
        isAvailable: component.isAvailable !== undefined ? component.isAvailable : true,
        specifications: specsArray
      });
    } else {
      setFormData({
        sku: '',
        name: '',
        category: 'Processor',
        brand: '',
        baseCost: '',
        sellingPrice: '',
        stockQuantity: 10,
        wattage: 0,
        isAvailable: true,
        specifications: [{ key: 'Speed', value: '' }, { key: 'Cores', value: '' }]
      });
    }
  }, [component, isOpen]);

  if (!isOpen) return null;

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const handleRemoveSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.baseCost || !formData.sellingPrice) {
      showError('Please fill in all required fields (Name, SKU, Base Cost, Selling Price)');
      return;
    }

    const specsObj = {};
    formData.specifications.forEach((s) => {
      if (s.key && s.value) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    onSave({
      ...formData,
      baseCost: Number(formData.baseCost),
      sellingPrice: Number(formData.sellingPrice),
      stockQuantity: Number(formData.stockQuantity),
      wattage: Number(formData.wattage),
      specifications: specsObj
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {component ? 'Edit Laptop Component' : 'Add New Component'}
              </h3>
              <p className="text-xs text-slate-400">Define hardware component attributes & prices</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Component Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                SKU / Part Code *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. CPU-INTEL-13700H"
                disabled={!!component}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Component Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Intel Core i7-13700H 14-Core Processor"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Intel / Corsair"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Pricing & Margin Section */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4" />
              <span>Supplier & Retail Pricing</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Base Cost ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.baseCost}
                  onChange={(e) => setFormData({ ...formData, baseCost: e.target.value })}
                  placeholder="280.00"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Selling Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  placeholder="380.00"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            {formData.baseCost && formData.sellingPrice && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Gross Profit Margin:</span>
                <span className="font-bold text-emerald-400">
                  ${(Number(formData.sellingPrice) - Number(formData.baseCost)).toFixed(2)} (
                  {(((Number(formData.sellingPrice) - Number(formData.baseCost)) / Number(formData.baseCost)) * 100).toFixed(1)}%)
                </span>
              </div>
            )}
          </div>

          {/* Dynamic Key-Value Specifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Technical Specifications
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec Field</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    placeholder="Attribute (e.g. Cores / Speed)"
                    className="w-1/3 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g. 14 Cores / 5.0 GHz)"
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-lg shadow-cyan-600/30 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{component ? 'Save Changes' : 'Create Component'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
