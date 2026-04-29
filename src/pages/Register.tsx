import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Lock, ArrowRight, UserPlus, ShieldCheck, AlertCircle, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register() {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'viewer' | 'organizer'>('viewer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 6) {
      setError('PIN must be exactly 6 digits.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Use provided email or generate dummy one
      const finalEmail = email.trim() || `user.${mobile}@apnacricket.com`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: finalEmail,
        password: pin,
        options: {
          data: {
            full_name: name,
            mobile: mobile,
            role: role
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('Email signups are disabled')) {
          throw new Error('Email signups are disabled in Supabase. Please go to Authentication -> Providers -> Email and turn ON "Enable email signup".');
        }
        throw signUpError;
      }
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            name: name,
            email: finalEmail,
            role: role,
            mobile: mobile
          }]);
        
        if (profileError && profileError.code !== '23505') {
          console.error("Profile creation error:", profileError);
        }
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-orange-500/20">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900 mb-2">Join the League</h1>
          <p className="text-neutral-500 font-medium">Create your credentials and start scoring matches today.</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -translate-x-12 translate-y-12" />
          
          <form onSubmit={handleRegister} className="space-y-6 relative z-10">
            <div className="grid sm:grid-cols-2 gap-6 pb-2">
               <div className="col-span-full">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-3 block">Full Name / Display Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="Virat Kohli"
                    className="w-full bg-neutral-50 border-none rounded-2xl py-4 px-6 text-sm font-bold tracking-wide focus:ring-2 focus:ring-orange-600/20 focus:bg-white transition-all outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
               </div>

               <div>
                 <label className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-3 block">Mobile Number</label>
                 <div className="relative group">
                   <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                   <input 
                     type="tel"
                     required
                     placeholder="98765 43210"
                     className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold tracking-widest focus:ring-2 focus:ring-orange-600/20 focus:bg-white transition-all outline-none"
                     value={mobile}
                     onChange={(e) => setMobile(e.target.value)}
                   />
                 </div>
               </div>

               <div>
                 <label className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-3 block">6-Digit PIN</label>
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

               <div className="col-span-full">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-3 block">Email (Optional)</label>
                  <input 
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-neutral-50 border-none rounded-2xl py-4 px-6 text-sm font-bold tracking-wide focus:ring-2 focus:ring-orange-600/20 focus:bg-white transition-all outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-[8px] text-neutral-400 mt-2 font-bold uppercase tracking-widest pl-2">Leave blank to use mobile number as login</p>
               </div>
            </div>

            <div>
               <label className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400 mb-3 block">Account Type</label>
               <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('viewer')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'viewer' ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-neutral-100 bg-neutral-50 text-neutral-400 hover:border-neutral-200'}`}
                  >
                    <Smartphone size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Viewer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'organizer' ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-neutral-100 bg-neutral-50 text-neutral-400 hover:border-neutral-200'}`}
                  >
                    <Trophy size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Organizer</span>
                  </button>
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
              {loading ? 'Processing...' : 'Create Account'}
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-center">
          <p className="text-sm font-medium text-neutral-500">
            Already have an account? <Link to="/login" className="text-orange-600 font-bold hover:underline">Login with PIN</Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-neutral-400">
             <ShieldCheck size={14} />
             <span className="text-[10px] uppercase tracking-widest font-bold">Secure Registration Protocol</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
