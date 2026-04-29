export function Footer() {
  return (
    <footer className="min-h-[32px] h-auto py-2 md:h-8 bg-slate-200 border-t border-slate-300 flex flex-col md:flex-row items-center px-4 md:px-6 text-[9px] md:text-[11px] text-slate-500 justify-between shrink-0 gap-2">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></div>
          <span className="font-semibold uppercase tracking-wider">API Status: Operational</span>
        </div>
        <span className="text-slate-400">|</span>
        <span className="font-medium">Build: v4.1.0-stable</span>
      </div>
      <div className="flex items-center gap-2 md:gap-4 text-center">
        <span>© 2026 APNA CRICKET PLATFORM</span>
        <span className="hidden md:inline text-slate-400">•</span>
        <span>MADE FOR INDIA</span>
        <span className="hidden md:inline text-slate-400">•</span>
        <span className="font-bold flex items-center gap-1 text-slate-700">
           PRIVATE ADMIN ACCESS
        </span>
      </div>
    </footer>
  );
}
