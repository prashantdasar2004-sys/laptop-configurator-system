import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Laptop, Lock, Mail, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('prashantdasar2004@gmail.com');
  const [password, setPassword] = useState('Pachhi@123');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      showSuccess('Authenticated successfully!');
      navigate('/');
    } catch (err) {
      showError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    try {
      setLoading(true);
      await demoLogin(role);
      showSuccess(`Signed in as Demo ${role === 'admin' ? 'Pricing Manager' : 'Sales Executive'}`);
      navigate('/');
    } catch (err) {
      showError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/20 mb-2">
            <Laptop className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to OmniConfig
          </h2>
          <p className="text-xs text-slate-400">
            Laptop Configuration & Pricing Management System
          </p>
        </div>

        {/* 1-Click Quick Demo Sign-In Buttons */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block text-center">
            Instant 1-Click Evaluator Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('sales_exec')}
              className="py-2.5 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-300 font-bold text-xs transition-colors"
            >
              Demo Sales Executive
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="py-2.5 px-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/50 text-indigo-300 font-bold text-xs transition-colors"
            >
              Demo Pricing Manager
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-500">Or Sign In With Password</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sales@retailer.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
