import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  MoreVertical,
  Flag
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    organizers: 0,
    matches: 0,
    reports: 4 // Mock
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        setRecentUsers(data);
      }
    };

    fetchRecentUsers();

    // Subscribe to changes
    const channel = supabase
      .channel('admin_users')
      .on('postgres_changes' as any, { event: '*', table: 'profiles' }, () => {
        fetchRecentUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <div className="flex items-center gap-2 text-yellow-600 mb-2 font-black uppercase tracking-[0.2em] text-[10px]">
              <ShieldAlert size={14} /> Admin Authority
           </div>
           <h2 className="text-4xl font-black uppercase tracking-tighter">Platform Mastery</h2>
           <p className="text-neutral-500 font-medium">Verify content, manage reports, and scale the Indian local cricket ecosystem.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                placeholder="Search players or matches..." 
                className="pl-12 pr-6 py-3 bg-white rounded-full border border-black/5 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-orange-600/20"
              />
           </div>
        </div>
      </header>

      {/* Analytics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Reach" value="1.2M" sub="+12% this month" icon={TrendingUp} color="text-green-600" />
        <StatCard label="Live Streams" value="84" sub="Active right now" icon={TrendingUp} color="text-red-600" />
        <StatCard label="Open Reports" value="12" sub="Flagged matches" icon={Flag} color="text-yellow-600" />
        <StatCard label="Cloud Status" value="Stable" sub="API Latency 42ms" icon={CheckCircle} color="text-blue-600" />
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Management */}
        <section className="lg:col-span-2 bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tighter">Recent Registrations</h3>
              <button className="text-[10px] uppercase tracking-widest font-black text-neutral-400 hover:text-orange-600">View All Users</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-neutral-50 border-b border-black/5">
                    <tr>
                       <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-neutral-400">User</th>
                       <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-neutral-400">Mobile</th>
                       <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-neutral-400">Role</th>
                       <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-neutral-400 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-black/5">
                    {recentUsers.map(user => (
                      <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                         <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-xs font-black uppercase text-neutral-500">
                                  {user.name?.[0]}
                               </div>
                               <span className="text-sm font-bold">{user.name}</span>
                            </div>
                         </td>
                         <td className="px-8 py-4 text-xs font-mono text-neutral-400">{user.mobile}</td>
                         <td className="px-8 py-4">
                            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${user.role === 'organizer' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                               {user.role}
                            </span>
                         </td>
                         <td className="px-8 py-4 text-right">
                            <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors">
                               <MoreVertical size={16} />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

        {/* Alerts & Critical Tasks */}
        <section className="space-y-6">
           <div className="bg-orange-600 text-white p-8 rounded-[40px] shadow-xl shadow-orange-500/20">
              <h4 className="text-xl font-black uppercase tracking-tighter mb-4">Pending Verifications</h4>
              <p className="text-sm font-medium text-orange-100 mb-8 leading-relaxed">
                 8 organizers are waiting for ID verification to host premium tournaments.
              </p>
              <button className="w-full bg-white text-orange-600 rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] hover:bg-orange-50 transition-all">
                 Launch Verification Tool
              </button>
           </div>

           <div className="bg-neutral-900 text-white p-8 rounded-[40px] border border-white/5">
              <div className="flex items-center gap-2 text-red-500 mb-4 font-black uppercase tracking-widest text-[10px]">
                 <AlertTriangle size={14} /> Critical Abuse Alerts
              </div>
              <div className="space-y-4">
                 <AbuseItem author="Ankit_99" reason="Spam Score Updates" match="Match #827" />
                 <AbuseItem author="Coach_V" reason="Copyright Content" match="Tournament #12" />
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
       <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] uppercase tracking-widest font-black text-neutral-400">{label}</span>
          <Icon className={color} size={20} />
       </div>
       <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tighter">{value}</span>
          <span className={`text-[10px] font-bold ${color}`}>{sub}</span>
       </div>
    </div>
  );
}

function AbuseItem({ author, reason, match }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
       <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-black uppercase tracking-tight">{author}</span>
          <span className="text-[9px] font-bold text-neutral-500 uppercase">{match}</span>
       </div>
       <p className="text-[10px] font-medium text-neutral-400">{reason}</p>
    </div>
  );
}
