import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Activity, Zap, LayoutDashboard, Users, Play, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useMatches } from '../hooks/useMatches';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const StatCard = ({ label, value }: { label: string, value: string }) => (
  <Card className="flex-1 min-w-[140px] p-4" hover={false}>
    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
    <div className="text-lg font-bold text-slate-900 mt-1">{value}</div>
  </Card>
);

const ActionBox = ({ icon, title, to }: { icon: string, title: string, to: string }) => (
  <Link to={to}>
    <Card className="p-4 flex flex-col items-center justify-center gap-2 text-center text-slate-800 hover:border-cricket-green h-full">
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <h4 className="text-[11px] font-bold uppercase tracking-tight leading-tight">{title}</h4>
    </Card>
  </Link>
);

export default function Home() {
  const { profile } = useAuth();
  const { matches } = useMatches();
  
  const navigate = useNavigate();

  React.useEffect(() => {
    if (profile) {
      navigate('/dashboard', { replace: true });
    }
  }, [profile, navigate]);
  
  const liveMatch = matches.find(m => m.status === 'live');
  const isAdmin = profile?.role === 'admin' || profile?.role === 'dev';

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-hidden">
      {/* Mobile Welcome / Super Admin Stats */}
      {isAdmin ? (
        <section className="flex flex-wrap gap-3">
          <StatCard label="Active Viewers" value="4,289" />
          <StatCard label="Matches Today" value="15" />
          <StatCard label="DB Load" value="4.2%" />
          <StatCard label="Server Ping" value="24ms" />
        </section>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between md:hidden"
        >
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 leading-none">Namaste, {profile?.name || 'Cricketer'}</h1>
            <p className="text-[10px] uppercase font-bold text-cricket-green tracking-widest mt-1">Ready for the next match?</p>
          </div>
          <Zap size={24} className="text-cricket-gold fill-current" />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Match Hero */}
        <section className="lg:col-span-8 bg-gradient-to-br from-[#064e3b] to-[#065f46] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 border border-red-400/30 z-10">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE NOW
           </div>
           
           <div className="opacity-80 text-[10px] md:text-sm font-medium mb-2 uppercase tracking-wide">Featured Match Center</div>
           
           {liveMatch ? (
             <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-6 md:gap-0">
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold">{liveMatch.teamA}</h2>
                  <div className="text-4xl md:text-5xl font-black mt-1 tabular-nums">{liveMatch.score?.runs || 0}/{liveMatch.score?.wickets || 0}</div>
                  <div className="text-xs opacity-70 mt-1 uppercase tracking-widest">{liveMatch.overs || 20} Overs</div>
                </div>
                <div className="text-center group py-2">
                   <div className="font-black text-lg text-cricket-gold tracking-[0.2em] group-hover:scale-125 transition-transform">VS</div>
                </div>
                <div className="text-center md:text-right">
                  <h2 className="text-xl md:text-2xl font-bold">{liveMatch.teamB}</h2>
                  <div className="text-xs opacity-50 mt-1 uppercase tracking-widest">Format: {liveMatch.format}</div>
                </div>
             </div>
           ) : (
             <div className="text-center py-12 md:py-20 opacity-50">
               <Trophy size={48} className="mx-auto mb-4 opacity-20" />
               <div className="text-xl font-black uppercase tracking-widest italic leading-none">No matches currently live</div>
               <div className="text-[10px] uppercase font-bold tracking-widest mt-2">Check back during match hours</div>
             </div>
           )}

           <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 md:gap-8 overflow-hidden">
              <div className="text-[11px] whitespace-nowrap">
                <strong className="text-cricket-gold mr-2 uppercase tracking-tighter opacity-70">Platform:</strong> 
                <span className="font-mono">Live Sync Active</span>
              </div>
              {liveMatch && (
                <Link to={`/live/${liveMatch.id}`} className="ml-auto">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">Watch Live</Button>
                </Link>
              )}
           </div>
        </section>

        {/* Action Grid */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3 md:gap-4">
           <ActionBox to="/live-matches" icon="📺" title="Live Scores" />
           <ActionBox to="/tournaments" icon="🏆" title="Tournaments" />
           <ActionBox to="/dashboard/create-match" icon="⚔️" title="Single Match" />
           <ActionBox to="/players-teams" icon="👥" title="Players" />
        </div>
      </div>

      {/* Dev Console Aesthetic - Admin Only */}
      {isAdmin && (
        <section className="bg-[#18181b] rounded-xl border border-[#3f3f46] p-4 font-mono text-[10px] md:text-xs overflow-hidden flex flex-col gap-1 shadow-inner">
           <div className="flex justify-between border-b border-[#3f3f46] pb-2 mb-2 text-[#a1a1aa] font-bold">
              <span>DEV_CONTROL_v2.0 // REALTIME_FLOW</span>
              <span className="text-[#10b981]">STATUS: STABLE</span>
           </div>
           <div className="text-[#10b981] opacity-70 truncate">[21:44:02] REQUEST: Fetching live_scores... SUCCESS</div>
           <div className="text-[#10b981] opacity-70 truncate">[21:44:05] BROADCAST: Pushing update to sockets via Platform...</div>
           <div className="text-cricket-gold truncate">[21:44:10] SYSTEM: Cache Layer Hit (Cloud CDN) - 98% efficiency</div>
        </section>
      )}

      {/* Quick Access Mobile Nav (Floating on mobile) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-slate-900 text-white rounded-full px-6 py-3 shadow-2xl gap-8 z-50 border border-white/10 backdrop-blur-md">
         <Link to="/live-matches" className="flex flex-col items-center gap-1 opacity-100">
           <Activity size={18} className="text-cricket-green" />
           <span className="text-[8px] font-black uppercase tracking-widest">Live</span>
         </Link>
         <Link to="/dashboard" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
           <LayoutDashboard size={18} />
           <span className="text-[8px] font-black uppercase tracking-widest">Dash</span>
         </Link>
         <Link to="/tournaments" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
           <Trophy size={18} />
           <span className="text-[8px] font-black uppercase tracking-widest">Cups</span>
         </Link>
         <Link to="/players-teams" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
           <Users size={18} />
           <span className="text-[8px] font-black uppercase tracking-widest">Heroes</span>
         </Link>
      </div>
    </div>
  );
}



function MatchCard({ match }: any) {
  return (
    <Link to={`/live/${match.id}`} className="bg-white rounded-3xl border border-black/5 p-6 hover:shadow-xl transition-shadow group">
       <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">{match.format || 'T20'} • {match.overs} Overs</span>
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-600">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" /> Live
          </span>
       </div>
       <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col items-center gap-3 flex-1">
             <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center font-black text-2xl text-neutral-400">{match.teamA && match.teamA[0]}</div>
             <span className="text-xs font-black uppercase tracking-tighter text-center">{match.teamA || 'Team A'}</span>
          </div>
          <div className="px-4 text-neutral-200 font-black italic tracking-tighter text-2xl transform -skew-x-12">VS</div>
          <div className="flex flex-col items-center gap-3 flex-1">
             <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center font-black text-2xl text-neutral-400">{match.teamB && match.teamB[0]}</div>
             <span className="text-xs font-black uppercase tracking-tighter text-center">{match.teamB || 'Team B'}</span>
          </div>
       </div>
       <div className="pt-6 border-t border-black/5 flex justify-between items-center">
          <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Current Score</span>
             <span className="text-2xl font-black tabular-nums tracking-tighter">142/4 <span className="text-xs font-medium text-neutral-400 tracking-normal">(18.2)</span></span>
          </div>
          <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
             <Play size={20} className="ml-1" />
          </div>
       </div>
    </Link>
  );
}

function ScheduleRow({ teamA, teamB, time, label }: any) {
  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-black/5 group hover:border-orange-500/20 transition-all">
       <div className="flex items-center gap-4">
          <div className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
            <span>{teamA}</span>
            <span className="text-neutral-300 italic">vs</span>
            <span>{teamB}</span>
          </div>
          <span className="text-[9px] uppercase tracking-widest font-black bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">{label}</span>
       </div>
       <div className="text-right flex flex-col">
          <span className="text-xs font-black tabular-nums text-orange-600">{time}</span>
          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400">Local Time</span>
       </div>
    </div>
  );
}

function ResultRow({ teamA, scoreA, teamB, scoreB, result }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 group hover:border-blue-500/20 transition-all">
       <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter">
                <span className={result.includes(teamA) ? 'text-neutral-900' : 'text-neutral-400'}>{teamA}</span>
                <span className="text-neutral-900 font-mono tracking-normal">{scoreA}</span>
             </div>
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter">
                <span className={result.includes(teamB) ? 'text-neutral-900' : 'text-neutral-400'}>{teamB}</span>
                <span className="text-neutral-900 font-mono tracking-normal">{scoreB}</span>
             </div>
          </div>
          <ArrowRight className="text-neutral-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
       </div>
       <p className="text-[10px] uppercase font-bold tracking-widest text-green-600 italic">{result}</p>
    </div>
  );
}
