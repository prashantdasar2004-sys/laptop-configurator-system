import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, FileText, Cpu, CheckCircle2, Clock, PlusCircle, 
  TrendingUp, ArrowRight, ShieldCheck, PieChart, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardAnalytics();
      setData(res);
    } catch (err) {
      showError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center space-x-3 text-cyan-400">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-semibold text-sm">Loading Pricing Dashboard...</span>
      </div>
    );
  }

  const { summary, categoryDistribution = [], recentQuotations = [] } = data || {};

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner / Greeting */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Laptop Pricing Operating System</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Sales Executive Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Automated component configuration, margin calculation, and historical pricing preservation engine.
            </p>
          </div>

          <Link
            to="/builder"
            className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-600/30 group shrink-0"
          >
            <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Launch Laptop Builder</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue Quoted</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">${summary?.totalPipelineValue?.toLocaleString()}</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>${summary?.totalMarginProfit?.toLocaleString()} Margin Profit ({summary?.avgMarginPercentage}%)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Saved Quotes</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{summary?.totalQuotations}</div>
            <div className="text-xs text-slate-400 mt-1">
              <span className="text-emerald-400 font-bold">{summary?.approvedQuotes} Approved</span> • {summary?.pendingQuotes} Pending
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Components</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{summary?.totalComponents}</div>
            <div className="text-xs text-slate-400 mt-1">Across 8 Hardware Categories</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historical Price Status</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-400">100% Protected</div>
            <div className="text-xs text-slate-400 mt-1">Old quotes preserved on price changes</div>
          </div>
        </div>

      </div>

      {/* Main Grid: Category Distribution & Recent Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Quotations */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-white">Recent Customer Quotations</h3>
              <p className="text-xs text-slate-400">Latest laptop configurations generated by sales team</p>
            </div>
            <Link to="/quotations" className="text-xs text-cyan-400 font-bold hover:underline">
              View All Quotes →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Quote Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Config Name</th>
                  <th className="p-3">Total ($)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentQuotations.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-cyan-400">{q.quoteNumber}</td>
                    <td className="p-3 font-medium text-white">{q.customerName}</td>
                    <td className="p-3 text-slate-300">{q.configName}</td>
                    <td className="p-3 font-bold text-slate-100">${q.pricingSummary?.finalTotal?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        q.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        q.status === 'Quoted' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/quotations/${q._id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 font-semibold transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Component Category Hardware Stats */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Hardware Catalog Overview</span>
            </h3>
            <p className="text-xs text-slate-400">Available components per category</p>
          </div>

          <div className="space-y-3">
            {categoryDistribution.map((cat) => (
              <div key={cat._id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-200 block">{cat._id}</span>
                  <span className="text-[10px] text-slate-400">Avg Selling Price: ${Math.round(cat.avgSellingPrice)}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/50">
                  {cat.count} items
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
