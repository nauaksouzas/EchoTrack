import React from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  PlusCircle, 
  Clock, 
  Sparkles,
  AlertCircle,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { Button, Card } from './ui/Common';
import { User, WeeklyReport } from '../types';
import { dataService } from '../services/dataService';

interface StudentDashboardProps {
  user: User;
  reports: WeeklyReport[];
  onNewReport: () => void;
}

export function StudentDashboard({ user, reports, onNewReport }: StudentDashboardProps) {
  const isWindowOpen = dataService.isReportWindowOpen();
  
  // Removed hasSubmittedThisWeek restriction for testing mode
  const hasSubmittedThisWeek = false; 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 font-sans selection:bg-black selection:text-white">
      <div className="lg:col-span-2 space-y-10">
        <Card className="p-12 bg-white text-black border-gray-200 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
            <GraduationCap className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Module / Weekly Audit</span>
              <h3 className="text-4xl font-black tracking-tighter font-display uppercase italic text-black">Weekly Status Report</h3>
              <p className="text-gray-600 text-sm font-medium tracking-tight max-w-sm leading-relaxed">System documentation required. Summarize your professional and academic velocity for the current cycle.</p>
              <div className="flex items-center gap-3 mt-6 bg-yellow-50 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-yellow-200 w-fit italic text-yellow-700">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  Testing Mode Active / Submissions Open Anytime
              </div>
            </div>
            <Button 
              onClick={onNewReport} 
              className={`h-16 bg-black text-white hover:bg-gray-800 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${hasSubmittedThisWeek ? 'opacity-40 grayscale' : ''} ${!isWindowOpen ? 'opacity-50' : ''}`}
            >
              <PlusCircle className="w-5 h-5 mr-3" />
              {hasSubmittedThisWeek ? 'Audit Transmitted' : 'Initiate Audit'}
            </Button>
          </div>
        </Card>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black flex items-center gap-4 text-black uppercase tracking-[0.4em]">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse inline-block" />
              Audit Log
            </h3>
          </div>
          {reports.length === 0 ? (
            <div className="p-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <FileText className="w-16 h-16 text-black mx-auto mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">No telemetry recorded</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <Card key={report.id} className="p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all cursor-pointer group bg-white border-gray-50 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 -mr-8 -mt-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-[10px] shadow-lg shadow-black/10">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-black italic">Audit Cycle Complete</p>
                        <p className="font-black text-black text-lg tracking-tighter font-display uppercase">{new Date(report.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-black truncate max-w-[150px] uppercase tracking-widest italic">{report.topicToDiscuss}</span>
                       <ChevronRight className="w-4 h-4 text-black group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-10">
        <Card className="p-8 border-gray-200 rounded-3xl bg-white shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all">
          <h3 className="font-black text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-3 text-black">
            <Clock className="w-4 h-4" />
            Next Deadline
          </h3>
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl group hover:bg-black hover:border-black transition-all">
            <p className="text-sm font-black text-red-600 uppercase tracking-widest group-hover:text-white transition-colors">Friday, 17:00</p>
            <p className="text-[10px] font-bold text-red-400 mt-2 tracking-tight group-hover:text-white/60 transition-colors uppercase italic">Mandatory status submission</p>
          </div>
        </Card>

        <Card className="p-8 border-gray-200 rounded-3xl bg-white shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all">
          <h3 className="font-black text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-3 text-black">
            <Sparkles className="w-4 h-4" />
            Class Allocs
          </h3>
          <div className="space-y-3">
            {(user.classes || []).map((cls: string) => (
              <div key={cls} className="flex items-center justify-between group p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200">
                <span className="text-[10px] font-black text-black uppercase tracking-tight truncate mr-4 group-hover:text-black transition-colors">{cls}</span>
                <div className="w-2 h-2 rounded-full bg-black/20 group-hover:bg-black transition-colors" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-black !bg-black !text-white rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-12 h-12" />
            </div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.4em] mb-4 text-white/90">Authentication</h3>
            <p className="text-white font-black tracking-tighter text-lg font-display italic">V1.0.4-BETA</p>
            <p className="text-white/90 text-[9px] font-bold mt-2 uppercase tracking-widest">Protocol Secured</p>
        </Card>
      </div>
    </div>
  );
}

function HistoryIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
