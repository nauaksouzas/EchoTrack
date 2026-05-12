import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Trash2, 
  BarChart3, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  CheckCircle2,
  Clock,
  Database,
  AlertCircle
} from 'lucide-react';
import { Button, Card } from './ui/Common';
import { User, WeeklyReport, CustomQuestion } from '../types';
import { ReportViewer } from './ReportViewer';

interface CoachDashboardProps {
  user: User;
  students: User[];
  reports: WeeklyReport[];
  customQuestions: CustomQuestion[];
  onAddQuestion: (q: Partial<CustomQuestion>) => void;
  onDeleteQuestion: (id: string) => void;
}

export function CoachDashboard({ students, reports, customQuestions, onAddQuestion, onDeleteQuestion }: CoachDashboardProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'questions'>('students');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [syncStatus, setSyncStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(setSyncStatus)
      .catch(console.error);
  }, []);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(search.toLowerCase()) || 
    s.username.toLowerCase().includes(search.toLowerCase())
  );

  const addQuestion = () => {
    onAddQuestion({
      text: newQuestion,
      targetStudentIds: targetIds,
      active: true
    });
    setNewQuestion('');
    setTargetIds([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-8 border-b border-gray-50">
        <div className="flex gap-2 p-2 bg-gray-50 border border-gray-100 rounded-[2rem] w-fit shadow-inner">
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-10 py-3.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all transform ${activeTab === 'students' ? 'bg-black text-white shadow-xl scale-100' : 'text-gray-600 hover:text-black hover:bg-white hover:scale-[1.02]'}`}
          >
            <Users className="w-4 h-4 inline mr-2 opacity-60" /> Students
          </button>
          <button 
            onClick={() => setActiveTab('questions')}
            className={`px-10 py-3.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all transform ${activeTab === 'questions' ? 'bg-black text-white shadow-xl scale-100' : 'text-gray-600 hover:text-black hover:bg-white hover:scale-[1.02]'}`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2 opacity-60" /> Inquiries
          </button>
        </div>

        {syncStatus && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border-2 transition-all bg-gray-100 border-gray-200 text-gray-600`}>
            <Database className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="leading-none uppercase tracking-widest">Local Prototype Mode</span>
              <span className="text-[9px] opacity-60 font-medium">Testing Data Engine</span>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'students' ? (
          <motion.div 
            key="st" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredStudents.map((student) => {
              const studentReports = reports.filter(r => r.studentId === student.id);
              const submittedThisWeek = studentReports.some(r => {
                const today = new Date();
                const lastFri = new Date(today);
                lastFri.setDate(today.getDate() - (today.getDay() + 2) % 7);
                lastFri.setHours(2, 0, 0, 0);
                return new Date(r.submittedAt) > lastFri;
              });

              return (
                <Card 
                  key={student.id} 
                  className="group p-8 space-y-8 hover:shadow-2xl hover:shadow-black/5 transition-all cursor-pointer relative bg-white border-gray-100 rounded-[2.5rem]" 
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-black text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500 font-display italic">
                      {student.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-black text-black truncate tracking-tighter text-xl uppercase font-display italic">{student.fullName}</h4>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate">@{student.username}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Telemetry</span>
                       {submittedThisWeek ? (
                         <span className="text-black text-[10px] font-black flex items-center gap-2 uppercase tracking-tight">
                           <span className="w-2 h-2 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.3)] animate-pulse inline-block" />
                           Recorded
                         </span>
                       ) : (
                         <span className="text-gray-500 text-[10px] font-black flex items-center gap-2 uppercase tracking-tight">
                           <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />
                           Offline
                         </span>
                       )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] italic text-right italic">Node</span>
                       <span className="text-black font-black text-[10px] uppercase tracking-tighter bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{student.pathway}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="qs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
            <Card className="p-8 space-y-6 border-2 border-dashed border-blue-100 bg-blue-50/10">
              <div className="space-y-1">
                <h3 className="font-bold text-xl text-gray-900">Custom Engagement Question</h3>
                <p className="text-sm text-gray-500">Add a specific follow-up for your students' weekly reports.</p>
              </div>
              <textarea 
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 h-32 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-700 font-medium shadow-inner bg-white"
                placeholder="How are you managing your internship applications?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Students</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setTargetIds([])}
                    className={`px-5 py-2 rounded-xl text-xs font-black border-2 transition-all shadow-sm ${targetIds.length === 0 ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                  >
                    All Mentees
                  </button>
                  {students.map((s) => (
                    <button 
                      key={s.id}
                      onClick={() => {
                        const next = targetIds.includes(s.id) 
                          ? targetIds.filter(id => id !== s.id)
                          : [...targetIds, s.id];
                        setTargetIds(next);
                      }}
                      className={`px-5 py-2 rounded-xl text-xs font-black border-2 transition-all shadow-sm ${targetIds.includes(s.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                    >
                      {s.fullName.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={addQuestion} disabled={!newQuestion} className="w-full h-14 text-lg">
                <Plus className="w-5 h-5" /> Push Question
              </Button>
            </Card>

            <div className="space-y-4">
              <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest">Active Questions</h3>
              {customQuestions.length === 0 ? (
                <div className="p-12 text-center text-gray-400 italic">No custom questions added.</div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {customQuestions.map((q) => (
                    <Card key={q.id} className="p-6 flex items-center justify-between group hover:border-pink-200 transition-all">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-800 text-lg leading-tight group-hover:text-pink-600 transition-colors">{q.text}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 leading-none">
                            Target: {q.targetStudentIds?.length === 0 ? 'All Group' : `${q.targetStudentIds?.length} Individual`}
                          </span>
                          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md border border-green-100 leading-none">Active</span>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => onDeleteQuestion(q.id)} className="text-gray-400 hover:text-red-500 rounded-full w-12 h-12 p-0 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedStudent && (
        <ReportViewer 
          student={selectedStudent} 
          reports={reports} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
}
