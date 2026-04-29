import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ShieldCheck, Zap, History } from 'lucide-react';
import { MatchStatus } from '../types';

export default function LiveScore() {
  const { id } = useParams();
  const { user } = useAuth();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMatch = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setMatch({
          id: data.id,
          teamA: data.team_a,
          teamB: data.team_b,
          format: data.format,
          overs: data.overs,
          status: data.status,
          createdBy: data.created_by,
          score: data.score
        });
      }
      setLoading(false);
    };

    fetchMatch();

    const channel = supabase
      .channel(`match_${id}`)
      .on(
        'postgres_changes',
        { event: '*', table: 'matches', filter: `id=eq.${id}` },
        (payload) => {
          const m = payload.new as any;
          setMatch({
            id: m.id,
            teamA: m.team_a,
            teamB: m.team_b,
            format: m.format,
            overs: m.overs,
            status: m.status,
            createdBy: m.created_by,
            score: m.score
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  async function handleScoreUpdate(val: string) {
    if (!id || !liveScore) return;
    
    let { runs, wickets, overs, balls, recentBalls } = liveScore;
    
    if (val === 'W') {
      wickets += 1;
    } else if (val === 'WD') {
      runs += 1;
    } else {
      runs += parseInt(val);
      balls += 1;
    }

    if (balls >= 6) {
      overs += 1;
      balls = 0;
    }

    const updatedBalls = [...(recentBalls || []), val].slice(-20);

    const { error } = await supabase
      .from('matches')
      .update({
        score: {
          runs,
          wickets,
          overs,
          balls,
          recentBalls: updatedBalls
        },
        status: 'live'
      })
      .eq('id', id);

    if (error) console.error(error);
  }

  const endMatch = async () => {
    await supabase
      .from('matches')
      .update({ status: 'completed' as MatchStatus })
      .eq('id', id);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-mono uppercase tracking-widest animate-pulse bg-black text-white">Establishing Live Sync...</div>;
  if (!match) return <div className="p-12 text-center bg-black text-white h-screen">Match not found</div>;

  const isOrganizer = user?.id === match.created_by;
  const liveScore = match.score;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
       {/* High-Contrast sticky header */}
       <header className="px-6 py-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-3xl z-50">
          <Link to="/" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Main Arena</span>
          </Link>
          <div className="flex flex-col items-center">
             <span className="text-[9px] uppercase tracking-[0.4em] font-black text-orange-500 animate-pulse">LIVE BROADCAST</span>
             <span className="text-xs font-black uppercase tracking-widest mt-1 italic">{match.teamA} <span className="text-neutral-600 not-italic">vs</span> {match.teamB}</span>
          </div>
          <div className="w-16" />
       </header>

       <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
          {/* Brutalist Scoreboard */}
          <section className="bg-neutral-900 rounded-[3rem] p-12 border border-white/5 shadow-3xl relative overflow-hidden ring-1 ring-white/10">
             <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />
             
             <div className="flex flex-col items-center gap-10 relative z-10">
                <div className="flex items-center justify-center gap-8 w-full">
                   <div className={`flex flex-col items-center gap-6 flex-1 transition-all duration-700 ${match.teamA === liveScore?.battingTeam ? 'scale-110' : 'opacity-30 scale-90 blur-[1px]'}`}>
                      <div className={`w-32 h-32 rounded-[40px] border-8 flex items-center justify-center font-black text-5xl transition-all ${match.teamA === liveScore?.battingTeam ? 'bg-white border-white/20 text-black shadow-3xl shadow-white/20 rotate-3' : 'bg-neutral-800 border-white/5 text-neutral-500'}`}>
                         {match.teamA?.[0]}
                      </div>
                      <span className="text-xl font-black uppercase tracking-tighter text-center">{match.teamA}</span>
                   </div>

                   <div className="text-neutral-700 font-black italic text-2xl transform -skew-x-12 opacity-50">VS</div>

                   <div className={`flex flex-col items-center gap-6 flex-1 transition-all duration-700 ${match.teamB === liveScore?.battingTeam ? 'scale-110' : 'opacity-30 scale-90 blur-[1px]'}`}>
                      <div className={`w-32 h-32 rounded-[40px] border-8 flex items-center justify-center font-black text-5xl transition-all ${match.teamB === liveScore?.battingTeam ? 'bg-white border-white/20 text-black shadow-3xl shadow-white/20 -rotate-3' : 'bg-neutral-800 border-white/5 text-neutral-500'}`}>
                         {match.teamB?.[0]}
                      </div>
                      <span className="text-xl font-black uppercase tracking-tighter text-center">{match.teamB}</span>
                   </div>
                </div>

                <div className="flex flex-col items-center">
                   <div className="bg-white/5 rounded-3xl px-8 py-4 mb-8 border border-white/5 backdrop-blur-sm">
                      <span className="text-[10px] uppercase font-black tracking-[0.3em] text-neutral-400">Current Inning</span>
                   </div>
                   
                   <div className="flex flex-col items-center">
                      <motion.div 
                        key={liveScore?.runs}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-8xl md:text-9xl font-black tabular-nums tracking-tighter leading-none text-white drop-shadow-2xl"
                      >
                        {liveScore?.runs || 0}<span className="text-orange-500 font-light opacity-50">/</span>{liveScore?.wickets || 0}
                      </motion.div>
                      <div className="flex items-baseline gap-4 mt-8">
                         <span className="text-3xl font-black text-neutral-400 tracking-tight">{liveScore?.overs || 0}.{liveScore?.balls || 0}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Overs Completed</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-16 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-3">
                {liveScore?.recentBalls?.slice(-6).map((ball: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all border-2 ${
                      ball === 'W' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 
                      ball === '6' || ball === '4' ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/20' : 
                      'bg-white/5 border-white/5 text-neutral-400'
                    }`}
                  >
                    {ball}
                  </motion.div>
                ))}
             </div>
          </section>

          {/* Organizer Console */}
          <AnimatePresence>
            {isOrganizer && match.status !== 'completed' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-12 text-black shadow-3xl"
              >
                <div className="mb-10 text-center sm:text-left">
                   <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">Command Center</h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Real-time Score Protocol</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-10">
                   {[0, 1, 2, 3, 4, 6].map(run => (
                     <button key={run} onClick={() => handleScoreUpdate(run.toString())} className="py-8 bg-neutral-50 border-4 border-neutral-100 rounded-3xl font-black text-3xl hover:border-black transition-all active:scale-95">{run}</button>
                   ))}
                   <button onClick={() => handleScoreUpdate('WD')} className="py-8 bg-orange-50 border-4 border-orange-100 rounded-3xl font-black text-2xl text-orange-600 hover:border-orange-600 transition-all active:scale-95">WD</button>
                   <button onClick={() => handleScoreUpdate('W')} className="py-8 bg-black border-4 border-black rounded-3xl font-black text-2xl text-white hover:bg-neutral-800 transition-all active:scale-95">WKT</button>
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 py-5 bg-neutral-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-all">Undo</button>
                   <button onClick={endMatch} className="flex-1 py-5 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all">End Match</button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {!isOrganizer && match.status === 'upcoming' && (
             <div className="text-center p-24 bg-neutral-900 border border-white/5 rounded-[3rem]">
                <Zap size={48} className="text-neutral-700 mx-auto mb-8 animate-bounce" />
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Awaiting Signal</h3>
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto leading-loose">The broadcaster is initializing the live link. Updates will stream automatically.</p>
             </div>
          )}

          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-neutral-900 p-8 rounded-[2rem] border border-white/5">
               <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-4 block">Req Rate</span>
               <span className="text-3xl font-black italic text-orange-500 tracking-tighter">8.4</span>
            </div>
            <div className="bg-neutral-900 p-8 rounded-[2rem] border border-white/5">
               <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-4 block">Cur Rate</span>
               <span className="text-3xl font-black italic text-white tracking-tighter">7.1</span>
            </div>
          </section>
       </div>
    </div>
  );
}

function TeamScore({ name, target }: any) {
  return (
    <div className={`flex flex-col items-center gap-4 flex-1 transition-all ${target ? 'opacity-100 scale-110' : 'opacity-40 scale-100 grayscale'}`}>
       <div className={`w-24 h-24 rounded-[32px] border-4 flex items-center justify-center font-black text-4xl ${target ? 'bg-orange-600 border-orange-500/20 text-white shadow-2xl shadow-orange-500/30' : 'bg-neutral-800 border-white/5 text-neutral-500'}`}>
          {name?.[0]}
       </div>
       <span className="text-lg font-black uppercase tracking-tighter text-center">{name}</span>
    </div>
  );
}

function ScoreButton({ label, color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`py-6 rounded-2xl border-2 flex items-center justify-center font-black text-xl transition-all active:scale-95 ${color || 'bg-neutral-50 border-neutral-100 text-neutral-900 hover:border-neutral-200'}`}
    >
      {label}
    </button>
  );
}

function MiniStat({ label, value, unit }: any) {
  return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
       <span className="text-[10px] uppercase tracking-widest font-black text-neutral-500 mb-2 block">{label}</span>
       <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black italic tracking-tighter">{value}</span>
          <span className="text-[10px] font-bold text-neutral-600 uppercase">{unit}</span>
       </div>
    </div>
  );
}
