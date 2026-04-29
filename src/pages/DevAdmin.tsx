import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Server, 
  Cpu, 
  Database, 
  Users, 
  Terminal, 
  Zap, 
  Radio, 
  HardDrive,
  RefreshCcw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function DevAdmin() {
  const [serverLoad, setServerLoad] = useState(12);
  const [activeUsers, setActiveUsers] = useState(1420);

  useEffect(() => {
    const interval = setInterval(() => {
      setServerLoad(prev => Math.max(8, Math.min(45, prev + (Math.random() * 6 - 3))));
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 pb-24">
       <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 mb-12 border-b border-green-500/20 pb-8">
          <div>
             <div className="flex items-center gap-3 text-xs mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="uppercase tracking-[0.4em] font-black">SYSTEM KERNEL ROOT ACCESS</span>
             </div>
             <h1 className="text-4xl text-white font-black uppercase tracking-tighter">DEV_CONTROL_v4.0</h1>
          </div>
          <div className="grid grid-cols-2 gap-8 text-[10px]">
             <div>
                <span className="block text-green-500/40 uppercase mb-1">Session Node</span>
                <span className="text-white font-black">AIS-NODE-PROD-01</span>
             </div>
             <div>
                <span className="block text-green-500/40 uppercase mb-1">Enc Level</span>
                <span className="text-white font-black">AES-256-GCM-RSA</span>
             </div>
          </div>
       </header>

       <main className="max-w-7xl mx-auto space-y-12">
          {/* Realtime Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <DevMetric icon={Cpu} label="CPU USAGE" value={`${serverLoad.toFixed(1)}%`} status="green" />
             <DevMetric icon={HardDrive} label="DB CAPACITY" value="2.4 / 10 GB" status="green" />
             <DevMetric icon={Users} label="SOCKET CLIENTS" value={activeUsers.toLocaleString()} status="green" />
             <DevMetric icon={Radio} label="STREAM LATENCY" value="24ms" status="green" />
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
             {/* Log Stream */}
             <div className="lg:col-span-2 bg-neutral-900/50 rounded-2xl border border-green-500/10 p-6 flex flex-col h-[500px]">
                <div className="flex items-center justify-between mb-4 border-b border-green-500/10 pb-4">
                   <div className="flex items-center gap-2">
                      <Terminal size={14} />
                      <span className="text-xs uppercase font-black">Live Error Logs</span>
                   </div>
                   <button className="text-[10px] uppercase font-black hover:text-white flex items-center gap-1 transition-colors">
                      <RefreshCcw size={10} /> Purge
                   </button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-2 text-[11px]">
                   <LogLine time="15:22:10" type="INFO" msg="GCP Node asia-southeast1-a initialized" />
                   <LogLine time="15:22:12" type="DB" msg="Firestore composite index batch applied" />
                   <LogLine time="15:22:15" type="AUTH" msg="User id:827 login via mobile + PIN successful" />
                   <LogLine time="15:23:01" type="WARN" msg="Socket pool reaching 80% utilization" />
                   <LogLine time="15:23:45" type="INFO" msg="Push update v1.2.0 successful" />
                   <LogLine time="15:24:00" type="INFO" msg="System heartbeat pulse received" />
                   <div className="animate-pulse">_</div>
                </div>
             </div>

             {/* Command Center */}
             <aside className="space-y-4">
                <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/20">
                   <h3 className="text-xs uppercase font-black mb-6 flex items-center gap-2">
                      <ShieldCheck size={14} /> Security Lockdown
                   </h3>
                   <div className="space-y-3">
                      <DevAction label="Flush Redis Cache" />
                      <DevAction label="Reset Live Match #ID" />
                      <DevAction label="Ban IP Segment" color="text-red-500 border-red-500/20" />
                      <DevAction label="Maintenance Mode" color="text-yellow-500 border-yellow-500/20" />
                   </div>
                </div>

                <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                   <h3 className="text-xs uppercase font-black mb-6 flex items-center gap-2 text-blue-500">
                      <Database size={14} /> DB Maintenance
                   </h3>
                   <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-[10px]">
                         <span>Snapshot Status</span>
                         <span className="text-white font-black uppercase">Active</span>
                      </div>
                      <div className="w-full h-1 bg-blue-500/20 rounded-full overflow-hidden">
                         <div className="w-[84%] h-full bg-blue-500" />
                      </div>
                      <button className="mt-4 py-3 bg-blue-500 text-black font-black uppercase text-[10px] rounded-lg">Backup Now</button>
                   </div>
                </div>
             </aside>
          </div>
       </main>
    </div>
  );
}

function DevMetric({ icon: Icon, label, value, status }: any) {
  return (
    <div className="bg-neutral-900/50 p-6 rounded-2xl border border-green-500/10 hover:border-green-500/30 transition-all group">
       <div className="flex items-center gap-2 text-[10px] font-black text-green-500/50 mb-3 group-hover:text-green-500 transition-colors">
          <Icon size={14} />
          <span>{label}</span>
       </div>
       <div className="text-2xl text-white font-black tabular-nums tracking-tighter italic">
          {value}
       </div>
    </div>
  );
}

function LogLine({ time, type, msg }: any) {
  const colors = {
    INFO: 'text-blue-400',
    WARN: 'text-yellow-400',
    DB: 'text-purple-400',
    AUTH: 'text-green-400'
  };
  return (
    <div className="flex gap-4 font-mono">
       <span className="text-neutral-600">[{time}]</span>
       <span className={`font-black w-12 ${colors[type as keyof typeof colors]}`}>[{type}]</span>
       <span className="text-neutral-300">{msg}</span>
    </div>
  );
}

function DevAction({ label, color }: any) {
  return (
    <button className={`w-full py-3 px-4 rounded-lg border text-[10px] font-black uppercase tracking-widest text-left hover:bg-white/5 transition-all ${color || 'text-green-500 border-green-500/20'}`}>
       {label}
    </button>
  );
}
