import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Trophy, ChevronLeft, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { MatchService } from '../services/matchService';
import { Match } from '../types';

export default function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatch() {
      if (!id) return;
      const data = await MatchService.getMatch(id);
      if (data) {
        setMatch(data);
      }
      setLoading(false);
    }
    fetchMatch();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-mono animate-pulse">Loading Match Info...</div>;
  if (!match) return <div className="p-12 text-center h-screen flex items-center justify-center text-neutral-400 font-black uppercase tracking-widest">Match Not Found</div>;

  const dateValue = match.createdAt ? (typeof match.createdAt === 'string' ? new Date(match.createdAt) : match.createdAt) : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors mb-12">
        <ChevronLeft size={16} /> All Matches
      </Link>

      <div className="bg-white rounded-[40px] border border-black/5 p-12 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-50 blur-3xl rounded-full translate-x-12 -translate-y-12" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-12">
            <span className="px-4 py-2 bg-neutral-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{match.format}</span>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600">
               <MapPin size={14} /> Ground 04, Bhopal
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
             <div className="flex flex-col items-center gap-6 flex-1">
                <div className="w-24 h-24 bg-neutral-100 rounded-[32px] flex items-center justify-center font-black text-4xl text-neutral-400">
                   {match.teamA?.[0]}
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-center">{match.teamA}</h2>
             </div>
             
             <div className="text-4xl font-black italic text-neutral-200 tracking-tight transform -skew-x-12">VS</div>

             <div className="flex flex-col items-center gap-6 flex-1">
                <div className="w-24 h-24 bg-neutral-100 rounded-[32px] flex items-center justify-center font-black text-4xl text-neutral-400">
                   {match.teamB?.[0]}
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-center">{match.teamB}</h2>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-black/5">
             <div className="flex items-center gap-3">
                <Calendar className="text-orange-600" size={20} />
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Date</span>
                   <span className="text-xs font-bold">{dateValue ? format(dateValue, 'MMMM dd, yyyy') : 'Loading...'}</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Clock className="text-orange-600" size={20} />
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Time</span>
                   <span className="text-xs font-bold">{dateValue ? format(dateValue, 'hh:mm a') : 'TBA'}</span>
                </div>
             </div>
             <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                <Users className="text-orange-600" size={20} />
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Overs</span>
                   <span className="text-xs font-bold">{match.overs} Overs Match</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
         <Link to={`/live/${match.id}`} className="flex-1 bg-orange-600 text-white p-6 rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:bg-orange-700 transition-all shadow-xl shadow-orange-500/20 group">
            Go to Match Center <Trophy size={20} className="group-hover:rotate-12 transition-transform" />
         </Link>
         <button className="flex-1 bg-white border border-black/5 p-6 rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:bg-neutral-50 transition-all shadow-sm">
            Share Match Link
         </button>
      </div>

      <div className="mt-24 space-y-12">
         <h3 className="text-2xl font-black uppercase tracking-tighter border-b border-black/5 pb-6">About this Match</h3>
         <div className="prose prose-neutral max-w-none text-neutral-500 font-medium">
            <p>
              This {match.format} encounter between {match.teamA} and {match.teamB} is expected to be a high-stakes local thriller. 
              The match will be played under standard ICC T20 rules with {match.overs} overs per side.
            </p>
            <p>
              Stay tuned to the LIVE score center for ball-by-ball updates, commentary, and real-time statistics. 
              Organized by our verified platform member via Apna Cricket.
            </p>
         </div>
      </div>
    </div>
  );
}
