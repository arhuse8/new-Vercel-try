import React from 'react';
import { Trophy, Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Tournaments() {
  return (
    <div className="p-4 md:p-6 space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-slate-900 leading-none">TOURNAMENTS</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium tracking-tight mt-1">Discover leagues, cups, and regional championships.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-cricket-green/20" placeholder="Find tournament..." />
           </div>
           <Button variant="outline" size="sm" className="p-2"><Filter size={18} /></Button>
        </div>
      </header>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TournamentCard 
          title="Mumbai Premier League" 
          organizer="MCA Local" 
          teams="16" 
          prize="₹50,000" 
          status="Ongoing"
          color="from-orange-500 to-orange-600"
        />
        <TournamentCard 
          title="Bhopal T20 Cup" 
          organizer="Bhopal Cricket" 
          teams="12" 
          prize="₹25,000" 
          status="Registration Open"
          color="from-blue-500 to-blue-600"
        />
        <TournamentCard 
          title="Delhi Street Stars" 
          organizer="Local Pro" 
          teams="24" 
          prize="₹10,000" 
          status="Starts In 2 Days"
          color="from-cricket-green to-green-800"
        />
      </div>

      {/* Empty State / More */}
      <Card className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center" hover={false}>
         <Trophy size={40} className="mx-auto mb-4 text-slate-200" />
         <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Want to host your own?</h4>
         <p className="text-xs text-slate-400 mt-1 mb-6">Create fully automated tournaments with brackets and points tables.</p>
         <Link to="/dashboard">
           <Button variant="secondary" size="md">
             <Plus size={16} /> Start Hosting
           </Button>
         </Link>
      </Card>
    </div>
  );
}

function TournamentCard({ title, organizer, teams, prize, status, color }: any) {
  return (
    <Card className="flex flex-col">
      <div className={`h-24 bg-gradient-to-br ${color} p-5 flex flex-col justify-end`}>
         <div className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{organizer}</div>
         <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{title}</h3>
      </div>
      <CardContent className="flex flex-col gap-4 flex-1">
         <div className="grid grid-cols-2 gap-4">
            <div>
               <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Teams</div>
               <div className="text-sm font-bold text-slate-900">{teams} Squads</div>
            </div>
            <div>
               <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Prize</div>
               <div className="text-sm font-bold text-cricket-gold">{prize}</div>
            </div>
         </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{status}</span>
          <Button variant="ghost" size="sm" className="text-cricket-green">Details</Button>
      </CardFooter>
    </Card>
  );
}

