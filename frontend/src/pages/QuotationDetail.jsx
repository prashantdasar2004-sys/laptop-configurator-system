import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, ShieldCheck, Printer, ArrowLeft, CheckCircle2, 
  TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle, Cpu, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { PriceBreakdownChart } from '../components/PriceBreakdownChart';

export const QuotationDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.getQuotationById(id);
      setData(res);
      setStatus(res.quotation?.status || 'Quoted');
    } catch (err) {
      showError('Failed to load quotation detail');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.updateQuotationStatus(id, newStatus);
      setStatus(newStatus);
      showSuccess(`Quotation status updated to ${newStatus}`);
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center space-x-3 text-cyan-400">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-semibold text-sm">Verifying Historical Quotation Data...</span>
      </div>
    );
  }

  if (!data || !data.quotation) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-white">Quotation Not Found</h3>
        <Link to="/quotations" className="text-cyan-400 text-xs font-bold hover:underline mt-2 inline-block">
          ← Back to Quotations
        </Link>
      </div>
    );
  }

  const { quotation, comparisonDetails = [], totalCatalogPriceDelta = 0 } = data;
  const pSummary = quotation.pricingSummary || {};

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Action Bar (No-Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        
        <Link
          to="/quotations"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Saved Quotations</span>
        </Link>

        <div className="flex items-center space-x-3">
          
          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs font-bold focus:outline-none focus:border-cyan-500"
          >
            <option value="Quoted">Status: Quoted</option>
            <option value="Approved">Status: Approved</option>
            <option value="Rejected">Status: Rejected</option>
            <option value="Fulfilled">Status: Fulfilled</option>
          </select>

          {/* Print / Export Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Invoice / PDF</span>
          </button>

        </div>
      </div>

      {/* Historical Price Snapshot Verification Callout (No-Print) */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center space-x-2">
              <span>Historical Price Preservation Active</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-800">
                PRICE LOCKED
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Component prices in this quotation are locked snapshots saved at quote creation ({new Date(quotation.createdAt).toLocaleString()}).
            </p>
          </div>
        </div>

        {totalCatalogPriceDelta !== 0 && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0 font-medium">
            <span className="text-slate-400 block">Current Catalog Price Delta:</span>
            {totalCatalogPriceDelta > 0 ? (
              <span className="text-rose-400 font-bold flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Catalog price increased by +${totalCatalogPriceDelta.toFixed(2)}</span>
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Catalog price decreased by -${Math.abs(totalCatalogPriceDelta).toFixed(2)}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Printable Quotation Document Container */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8 print:p-0 print:border-none print:shadow-none bg-slate-900/90">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-xl tracking-tight">
              <span>OmniConfig Electronics Retailer</span>
            </div>
            <p className="text-xs text-slate-400">Official Computer Systems Quotation Document</p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xl font-mono font-extrabold text-white">{quotation.quoteNumber}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Date Issued: {new Date(quotation.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-1">
              <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold ${
                status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}>
                Status: {status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & System Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 uppercase tracking-wider font-bold block mb-1">Customer Information</span>
            <div className="font-bold text-white text-sm">{quotation.customerName}</div>
            <div className="text-slate-300">{quotation.customerEmail}</div>
            {quotation.customerPhone && <div className="text-slate-400">{quotation.customerPhone}</div>}
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider font-bold block mb-1">Configuration Overview</span>
            <div className="font-bold text-white text-sm">{quotation.configName}</div>
            <div className="text-slate-300">Prepared By: {quotation.createdByName || 'Sales Executive'}</div>
            <div className="text-slate-400">Valid Until: {new Date(quotation.validUntil).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Itemized Component Snapshot Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Configured Component Breakdown</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Component & Specifications</th>
                  <th className="p-3.5 font-mono">SKU Code</th>
                  <th className="p-3.5 text-right">Quote Price ($)</th>
                  <th className="p-3.5 text-right no-print">Current Catalog ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {comparisonDetails.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-bold text-cyan-400 uppercase text-[10px]">
                      {comp.category}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{comp.name}</div>
                      {comp.specifications && (
                        <div className="text-[10px] text-slate-400 mt-0.5 space-x-2">
                          {Object.entries(comp.specifications).map(([k, v]) => (
                            <span key={k}>{k}: {v} • </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{comp.sku}</td>
                    <td className="p-3.5 font-extrabold text-white text-right">
                      ${comp.sellingPriceAtQuote}
                    </td>
                    <td className="p-3.5 text-right no-print font-mono text-slate-400">
                      ${comp.currentSellingPrice}
                      {comp.priceDifference !== 0 && (
                        <span className={`block text-[10px] font-bold ${comp.priceDifference > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          ({comp.priceDifference > 0 ? `+$${comp.priceDifference}` : `-$${Math.abs(comp.priceDifference)}`})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Calculation Summary Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          
          <div className="no-print">
            <PriceBreakdownChart components={quotation.components} subtotal={pSummary.componentsSubtotalSelling} />
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Hardware Subtotal:</span>
              <span className="font-bold text-slate-200">${pSummary.componentsSubtotalSelling?.toLocaleString()}</span>
            </div>

            {pSummary.discountAmount > 0 && (
              <div className="flex items-center justify-between text-xs text-cyan-400">
                <span>Applied Discount ({pSummary.discountPercentage}%):</span>
                <span>-${pSummary.discountAmount?.toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sales Tax ({pSummary.taxPercentage}%):</span>
              <span>+${pSummary.taxAmount?.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-base pt-3 border-t border-slate-800 text-white font-extrabold">
              <span>Final Total Quoted Price:</span>
              <span className="text-cyan-400 text-2xl font-black">${pSummary.finalTotal?.toLocaleString()}</span>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 text-right no-print">
              Internal Profit Margin: <span className="text-emerald-400 font-bold">${pSummary.marginAmount} ({pSummary.marginPercentage}%)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
