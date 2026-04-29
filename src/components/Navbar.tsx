import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Trophy, User, LogIn, Globe, Activity, LayoutDashboard, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3 group">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-black/10 transition-all group-hover:bg-cricket-green group-hover:shadow-cricket-green/20"
        >
          🏏
        </motion.div>
        <div className="flex flex-col -space-y-0.5">
          <span className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">APNA CRICKET</span>
          <span className="text-[8px] uppercase tracking-[0.3em] font-black text-cricket-green">Alpha v4.2</span>
        </div>
      </Link>

      <div className="flex items-center gap-2 md:gap-6">
        <nav className="hidden md:flex items-center gap-6 mr-6">
          <Link to="/live-matches" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Matches</Link>
          <Link to="/tournaments" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Leagues</Link>
        </nav>
        
        {user ? (
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard" 
              className="px-5 py-2.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cricket-green transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/5"
            >
              Dashboard
            </Link>
            
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-100">
               <button 
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                title="Sign Out"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Logout</span>
                  <LogIn size={18} className="rotate-180" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-full transition-all">Login</Link>
            <Link to="/register" className="px-6 py-2.5 bg-cricket-green text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cricket-green/20">Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
