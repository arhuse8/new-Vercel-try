import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DevAdmin from './pages/DevAdmin';
import LiveScore from './pages/LiveScore';
import MatchDetails from './pages/MatchDetails';
import LiveMatches from './pages/LiveMatches';
import Tournaments from './pages/Tournaments';
import PlayersTeams from './pages/PlayersTeams';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LayoutDashboard, Play, Trophy, Users, Settings, Wrench, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const PrivateRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center font-mono uppercase tracking-widest animate-pulse">Loading Platform...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (role) {
    const isAdmin = profile?.role === 'admin';
    const isDev = profile?.role === 'dev';
    if (role === 'admin' && !isAdmin && !isDev) return <Navigate to="/" />;
    if (profile?.role !== role && !isDev) return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const Sidebar = () => {
  const { profile } = useAuth();
  return (
    <aside className="w-64 bg-white border-r border-slate-100 shrink-0 flex flex-col pt-8 overflow-y-auto hidden md:flex">
      <div className="px-6 mb-8">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Main Menu</div>
        <div className="h-0.5 w-8 bg-cricket-green rounded-full" />
      </div>

      <nav className="flex flex-col gap-1 px-3">
        <SidebarItem to="/" icon={<LayoutDashboard size={18} />} label="Overview" />
        <SidebarItem to="/live-matches" icon={<Play size={18} />} label="Live Games" />
        <SidebarItem to="/tournaments" icon={<Trophy size={18} />} label="Pro Leagues" />
        <SidebarItem to="/players-teams" icon={<Users size={18} />} label="Rosters" />
        
        {(profile?.role === 'admin' || profile?.role === 'dev') && (
          <>
            <div className="px-3 mt-8 mb-2">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Management</div>
            </div>
            <SidebarItem to="/admin" icon={<Settings size={18} />} label="Admin Panel" />
          </>
        )}
      </nav>
      
      {profile?.role === 'dev' && (
        <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100">
          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-4">Internal Systems</div>
          <Link to="/dev-control" className="flex items-center gap-3 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:text-cricket-green transition-colors">
            <Wrench size={14} /> Root Control
          </Link>
        </div>
      )}
    </aside>
  );
};

const SidebarItem = ({ to, icon, label }: any) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`px-4 py-3.5 rounded-2xl flex items-center gap-4 text-xs tracking-tight transition-all ${active ? 'bg-black text-white shadow-xl shadow-black/10 font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
    >
      <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}>{icon}</span>
      <span className="uppercase tracking-widest text-[10px] font-black">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-cricket-green rounded-full shadow-lg shadow-cricket-green/50" />}
    </Link>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="h-screen flex flex-col bg-slate-100 overflow-hidden selection:bg-cricket-green selection:text-white">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/live-matches" element={<LiveMatches />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/players-teams" element={<PlayersTeams />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/match/:id" element={<MatchDetails />} />
                <Route path="/live/:id" element={<LiveScore />} />
                
                <Route path="/dashboard/*" element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                } />

                <Route path="/admin/*" element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } />

                <Route path="/dev-control/*" element={
                  <PrivateRoute role="dev">
                    <DevAdmin />
                  </PrivateRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
