import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Laptop, Cpu, FileText, LayoutDashboard, LogOut, PlusCircle, RefreshCw, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSeed = async () => {
    try {
      await api.triggerSeed();
      showSuccess('Catalog refreshed & seeded with latest component prices!');
      window.location.reload();
    } catch (err) {
      showError('Failed to seed catalog');
    }
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/builder', label: 'Laptop Builder', icon: PlusCircle, highlight: true },
    { path: '/components', label: 'Components Catalog', icon: Cpu },
    { path: '/quotations', label: 'Saved Quotations', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 backdrop-blur-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Laptop className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  OmniConfig
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  Pricing OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none">Laptop Configuration Engine</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    link.highlight
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 shadow-sm'
                      : isActive
                      ? 'bg-slate-800 text-white shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? 'text-cyan-400' : isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSeed}
              title="Reset / Seed Demo Data"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-200">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                    {user.role === 'pricing_manager' ? 'Pricing Manager' : 'Sales Executive'}
                  </div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-md shadow-cyan-600/20"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
