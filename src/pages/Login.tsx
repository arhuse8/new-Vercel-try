import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // If no @ in identifier, assume it's mobile and map to dummy email
      let email = identifier.trim();
      if (!email.includes('@')) {
        email = `${email.replace(/\s+/g, '')}@apnacricket.com`;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: pin
      });
      
      if (authError) throw authError;
      
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid Mobile/Email or PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-mono uppercase tracking-widest animate-pulse bg-slate-50">
        Loading Platform...
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-orange-500/20">
            <Smartphone size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900 mb-2">Welcome Back</h1>
          <p className="text-neutral-500 font-medium">Enter your credentials to access your cricket dashboard.</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-3 block">Mobile or Email</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                <input 
                  type="text"
                  required
                  placeholder="98765 43210 or your@email.com"
                  className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-orange-600/20 focus:bg-white transition-all outline-none"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-3 block">Security PIN</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                <input 
                  type="password"
                  required
                  maxLength={6}
                  placeholder="••••••"
                  className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold tracking-[0.5em] focus:ring-2 focus:ring-orange-600/20 focus:bg-white transition-all outline-none"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-3 border border-red-100"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-relaxed tracking-tight">{error}</p>
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-neutral-900 text-white rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-center">
          <p className="text-sm font-medium text-neutral-500">
            New to the platform? <Link to="/register" className="text-orange-600 font-bold hover:underline">Register your team</Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-neutral-400">
             <ShieldCheck size={14} />
             <span className="text-[10px] uppercase tracking-widest font-bold">256-bit Secure Encryption</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
