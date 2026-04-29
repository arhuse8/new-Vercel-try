import React from 'react';
import { User, Shield, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export default function PlayersTeams() {
  return (
    <div className="p-4 md:p-6 space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-slate-900 leading-none">LOCAL LEGENDS</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium tracking-tight mt-1">Meet the players and squads defining the local game.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-cricket-green/20" placeholder="Search profiles..." />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teams Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-slate-900">
              <Shield size={16} className="text-cricket-green" />
              <h2 className="text-lg font-black uppercase tracking-tight">Top Squads</h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TeamMiniCard name="Warriors XI" location="Bhopal" form="W W L W W" icon="🛡️" />
              <TeamMiniCard name="Thunder CC" location="Lucknow" form="L W W W L" icon="⚡" />
              <TeamMiniCard name="Rising Stars" location="Indore" form="W W W W W" icon="⭐" />
              <TeamMiniCard name="Kanpur Knights" location="Kanpur" form="W L W L W" icon="⚔️" />
           </div>
        </div>

        {/* Players Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-slate-900">
              <User size={16} className="text-cricket-gold" />
              <h2 className="text-lg font-black uppercase tracking-tight">Trending Players</h2>
           </div>
           <div className="space-y-3">
              <PlayerListRow name="Rohit S." role="Batsman" avg="44.2" sr="156.4" />
              <PlayerListRow name="Ishan V." role="Bowler" avg="12.1" sr="8.4" />
              <PlayerListRow name="Aman K." role="All-Rounder" avg="32.5" sr="142.1" />
              <PlayerListRow name="Siddharth M." role="Wicket Keeper" avg="28.9" sr="128.5" />
           </div>
        </div>
      </div>
    </div>
  );
}

function TeamMiniCard({ name, location, form, icon }: any) {
  return (
    <Card className="hover:border-cricket-green transition-colors group">
       <CardContent>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg text-xl group-hover:scale-110 transition-transform">{icon}</div>
             <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{name}</h4>
                <p className="text-[10px] text-slate-400 font-medium">{location}</p>
             </div>
          </div>
          <div className="flex items-center justify-between">
             <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Form:</div>
             <div className="flex gap-1">
                {form.split(' ').map((f: string, i: number) => (
                   <span key={i} className={`w-3 h-3 rounded-[2px] transition-all flex items-center justify-center text-[7px] font-bold text-white shadow-inner ${f === 'W' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {f}
                   </span>
                ))}
             </div>
          </div>
       </CardContent>
    </Card>
  );
}

function PlayerListRow({ name, role, avg, sr }: any) {
  return (
    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-100 shadow-none">
       <CardContent className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} />
             </div>
             <div>
                <h4 className="text-xs font-bold text-slate-900">{name}</h4>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{role}</p>
             </div>
          </div>
          <div className="flex gap-4 pr-2">
             <div className="text-right">
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">AVG</div>
                <div className="text-[10px] font-bold text-slate-900">{avg}</div>
             </div>
             <div className="text-right">
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">S/R</div>
                <div className="text-[10px] font-bold text-slate-900">{sr}</div>
             </div>
          </div>
       </CardContent>
    </Card>
  );
}

