import React from 'react';
import { Play, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { Match } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function LiveMatches() {
  const { matches, loading } = useMatches();

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  return (
    <div className="p-4 md:p-6 space-y-8 pb-24">
      <header>
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-slate-900 leading-none">MATCH CENTER</h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium tracking-tight mt-1">Real-time action from every local ground.</p>
      </header>

      {/* Live Now Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-red-600">
           <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Now</span>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
          </div>
        ) : liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} isLive />
            ))}
          </div>
        ) : (
          <Card className="bg-white p-12 text-center grayscale opacity-50" hover={false}>
             <Play size={32} className="mx-auto mb-3 text-slate-300" />
             <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No matches live right now</p>
          </Card>
        )}
      </section>

      {/* Upcoming Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-slate-500">
           <Calendar size={14} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Coming Up</span>
        </div>
        
        {upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-xs font-medium text-slate-400 italic">No scheduled matches found.</div>
        )}
      </section>
    </div>
  );
}

function MatchCard({ match, isLive }: any) {
  return (
    <Card className={`flex flex-col justify-between h-full ${isLive ? 'border-red-100 shadow-lg shadow-red-500/5' : ''}`}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded leading-none">
            {match.format || 'T20'} • {match.overs || 20} Overs
          </span>
          {isLive && <span className="text-[8px] font-black text-red-600 uppercase tracking-widest animate-pulse">Live</span>}
        </div>

        <div className="flex items-center justify-between gap-2 py-2">
           <div className="text-center flex-1">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-2 font-black text-slate-300 text-xs uppercase">{match.teamA?.[0]}</div>
              <div className="text-[11px] font-bold uppercase tracking-tight text-slate-900 truncate">{match.teamA}</div>
           </div>
           <div className="text-[10px] font-black text-cricket-gold px-3">VS</div>
           <div className="text-center flex-1">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-2 font-black text-slate-300 text-xs uppercase">{match.teamB?.[0]}</div>
              <div className="text-[11px] font-bold uppercase tracking-tight text-slate-900 truncate">{match.teamB}</div>
           </div>
        </div>

        <Link to={isLive ? `/live/${match.id}` : `/match/${match.id}`}>
          <Button 
            className="w-full" 
            variant={isLive ? 'primary' : 'ghost'} 
            size="sm"
          >
            {isLive ? 'View Board' : 'Pre-Match'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}


