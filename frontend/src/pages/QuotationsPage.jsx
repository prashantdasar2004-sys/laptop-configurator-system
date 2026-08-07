import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Search, Filter, ShieldCheck, ArrowUpRight, 
  Trash2, RefreshCw, Calendar, DollarSign, CheckCircle2, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const QuotationsPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { showSuccess, showError } = useToast();

  const statuses = ['All', 'Quoted', 'Approved', 'Rejected', 'Fulfilled', 'Draft'];

  useEffect(() => {
    fetchQuotations();
  }, [statusFilter, searchTerm]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await api.getQuotations(params);
      setQuotations(data);
    } catch (err) {
      showError('Failed to load saved quotations');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    fetchQuotations();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quotation record?')) return;
    try {
      await api.deleteQuotation(id);
      showSuccess('Quotation deleted');
      fetchQuotations();
    } catch (err) {
      showError(err.message || 'Failed to delete quotation');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Saved Laptop Quotations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and review historical laptop configurations with locked component price snapshots
          </p>
        </div>

        <Link
          to="/builder"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all shrink-0"
        >
          <span>Create New Quote</span>
        </Link>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Quote Number (e.g. QUO-2026), Customer Name, or Email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>Status: {st}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Price Range Filter Form */}
        <form onSubmit={handleApplyPriceFilter} className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Price Range ($):</span>
            </span>
            <input
              type="number"
              placeholder="Min Total $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-slate-500">-</span>
            <input
              type="number"
              placeholder="Max Total $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
            >
              Apply Filter
            </button>
          </div>

          <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Price Snapshot Integrity Verified</span>
          </div>
        </form>

      </div>

      {/* Quotations List Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Loading quotations list...</span>
        </div>
      ) : quotations.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No Quotations Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing filters or create a new quote using the builder</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Quote Number</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Laptop Config Title</th>
                  <th className="p-4">Components Count</th>
                  <th className="p-4">Final Total ($)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {quotations.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-800/40 transition-colors">
                    
                    <td className="p-4">
                      <Link to={`/quotations/${q._id}`} className="font-mono font-bold text-cyan-400 hover:underline">
                        {q.quoteNumber}
                      </Link>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white">{q.customerName}</div>
                      <div className="text-[11px] text-slate-400">{q.customerEmail}</div>
                    </td>

                    <td className="p-4 font-semibold text-slate-200">
                      {q.configName}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                        {q.components ? q.components.length : 0} Parts
                      </span>
                    </td>

                    <td className="p-4 font-extrabold text-white text-sm">
                      ${q.pricingSummary?.finalTotal?.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        q.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        q.status === 'Quoted' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {q.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/quotations/${q._id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                        title="Delete Quote"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
