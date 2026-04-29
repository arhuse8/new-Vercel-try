import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { 
  PlusCircle, 
  List, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { useMatches } from '../hooks/useMatches';
import { MatchService } from '../services/matchService';

export default function UserDashboard() {
  const { profile } = useAuth();
  const isOrganizer = profile?.role === 'organizer' || profile?.role === 'dev' || profile?.role === 'admin';

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-slate-900 leading-none">WORKSPACE</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium tracking-tight mt-1">Access your personal cricket analytics and management tools.</p>
        </div>
        {isOrganizer && (
          <Link 
            to="/dashboard/create-match" 
            className="bg-cricket-green text-white rounded-lg px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-center gap-2 hover:bg-green-800 transition-all font-bold uppercase text-[10px] md:text-[12px] tracking-tight shadow-lg shadow-green-900/20 active:scale-95"
          >
            <PlusCircle size={18} /> New Match
          </Link>
        )}
      </header>

      <main>
        <Routes>
          <Route index element={<Overview isOrganizer={isOrganizer} />} />
          <Route path="matches" element={<MatchesList />} />
          <Route path="create-match" element={<CreateMatch />} />
          <Route path="*" element={<div className="p-12 text-center text-slate-400 font-mono uppercase tracking-widest text-xs">Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
}

function Overview({ isOrganizer }: any) {
  const { matches } = useMatches();
  const { profile } = useAuth();
  
  const myMatches = matches.filter(m => m.createdBy === profile?.id);
  const liveMatchesCount = myMatches.filter(m => m.status === 'live').length;
  
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <StatsCard label="My Live Games" value={liveMatchesCount.toString()} sub="Active Scoring" color="bg-orange-500" />
         <StatsCard label="Total Matches" value={myMatches.length.toString()} sub="Created by you" color="bg-blue-600" />
         <StatsCard label="Pro Rank" value="BRONZE" sub="Scorer Level" color="bg-cricket-green" />
      </div>

      <div className="bg-white rounded-[2rem] p-12 border border-slate-100 text-center flex flex-col items-center justify-center min-h-[350px] shadow-2xl shadow-slate-200/40 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-40 h-40 bg-slate-50 blur-[80px] rounded-full -translate-x-20 -translate-y-20" />
         <div className="relative">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-8 mx-auto ring-8 ring-slate-50/50">
               <List size={40} />
            </div>
            {myMatches.length > 0 ? (
              <div className="space-y-6">
                <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-3">Matches Found</h4>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest max-w-xs mb-10 mx-auto leading-relaxed">You have {myMatches.length} matches in your record. Head over to matches list to manage them.</p>
                <Link to="/dashboard/matches" className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cricket-green transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10">Manage Matches</Link>
              </div>
            ) : (
              <div className="space-y-6">
                <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-3">No activity recorded yet</h4>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest max-w-xs mb-10 mx-auto leading-relaxed">Your professional workspace is ready. Start by creating a match or managing team rosters.</p>
                {isOrganizer && (
                  <Link to="/dashboard/create-match" className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cricket-green transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10">Setup Pro Match</Link>
                )}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, sub, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 relative overflow-hidden group hover:scale-[1.02] transition-all">
       <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-12 -translate-y-12 group-hover:bg-slate-100 transition-colors" />
       <div className="relative z-10">
         <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 mb-6 block">{label}</span>
         <div className="flex items-end justify-between">
            <span className="text-5xl font-black tracking-tighter text-slate-900 leading-none">{value}</span>
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl shadow-${color}/30 transform group-hover:rotate-12 transition-transform`}>
               <ChevronRight size={24} />
            </div>
         </div>
         <span className="text-[9px] font-black text-slate-400 mt-6 block uppercase tracking-widest">{sub}</span>
       </div>
    </div>
  );
}

function MatchesList() {
  const { profile } = useAuth();
  const { matches } = useMatches();
  
  const myMatches = matches.filter(m => m.createdBy === profile?.id);

  return (
    <div className="space-y-6 md:space-y-8">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900">My Matches</h2>
          <Link to="/dashboard/create-match" className="p-2 bg-cricket-green text-white rounded-lg hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20 active:scale-95">
            <Plus size={20} />
          </Link>
       </div>

       <div className="grid gap-3 md:gap-4">
          {myMatches.map(match => (
            <div key={match.id} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
               <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                  <div className="text-xs md:text-sm font-black uppercase tracking-tighter flex items-center gap-2 md:gap-3 text-slate-900">
                    <span>{match.teamA}</span>
                    <span className="text-slate-300 italic text-xs">vs</span>
                    <span>{match.teamB}</span>
                  </div>
                  <span className={`text-[8px] md:text-[9px] uppercase font-black px-2 py-0.5 rounded leading-none ${match.status === 'live' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                    {match.status}
                  </span>
               </div>
               <Link to={`/live/${match.id}`} className="w-full sm:w-auto text-center px-4 md:px-5 py-2 bg-slate-900 text-white rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg active:scale-95">
                  Open Scoreboard
               </Link>
            </div>
          ))}
          {myMatches.length === 0 && <div className="p-12 text-center text-slate-400 font-mono uppercase tracking-widest text-xs">No matches created</div>}
       </div>
    </div>
  );
}

function CreateMatch() {
  const { profile } = useAuth();
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [overs, setOvers] = useState(20);
  const [format, setFormat] = useState('T20');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      setError('Profile not loaded. Please try logging in again.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const createPromise = MatchService.createMatch({
        teamA,
        teamB,
        overs,
        format,
        createdBy: profile.id
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out. Check your "matches" table exists and RLS policies allow inserts.')), 15000)
      );

      const createdMatchId = await Promise.race([createPromise, timeoutPromise]) as string;
      navigate(`/live/${createdMatchId}`);
    } catch (err: any) {
      console.error("Match creation error:", err);
      setError(err?.message || 'Failed to create match. Unknown error.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4">
       <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cricket-green/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
          
          <div className="relative">
            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-2">Match Setup</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cricket-green">Alpha Session Config v4.2</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-8">
              {error && (
                <div className="bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 flex items-start gap-4">
                  <div className="shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs">⚠️</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-red-700">Creation Error</p>
                    <p className="text-xs font-bold leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="col-span-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3 block">Team A (Home)</label>
                      <input required value={teamA} onChange={e => setTeamA(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-4 focus:ring-cricket-green/10 focus:bg-white transition-all outline-none" placeholder="Titans XI" />
                   </div>
                   <div className="col-span-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3 block">Team B (Away)</label>
                      <input required value={teamB} onChange={e => setTeamB(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-4 focus:ring-cricket-green/10 focus:bg-white transition-all outline-none" placeholder="Strikers CC" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3 block">Format</label>
                    <select value={format} onChange={e => setFormat(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-4 focus:ring-cricket-green/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                      <option>T20</option>
                      <option>ODI</option>
                      <option>T10</option>
                      <option>Test</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3 block">Max Overs</label>
                    <input type="number" required value={overs} onChange={e => setOvers(Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-4 focus:ring-cricket-green/10 focus:bg-white transition-all outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-cricket-green transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-black/10 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       <span>Initializing...</span>
                    </div>
                  ) : (
                    <>
                      <span>Start Match Session</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </button>
                <p className="text-[9px] text-center text-slate-400 mt-6 font-bold uppercase tracking-widest leading-loose">
                  Clicking start will initialize a new match instance.<br/>
                  Ensure teams are correctly named for public scoreboards.
                </p>
              </div>
            </form>
          </div>
       </div>
    </div>
  );
}


