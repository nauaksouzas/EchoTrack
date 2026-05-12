/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LogOut, 
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, WeeklyReport, CustomQuestion, Group } from './types';
import { PATHWAYS } from './constants';
import { dataService } from './services/dataService';
import { Button } from './components/ui/Common';
import { SignUpForm } from './components/SignUpForm';
import { StaffPortal } from './components/StaffPortal';
import { StudentDashboard } from './components/StudentDashboard';
import { CoachDashboard } from './components/CoachDashboard';
import { PMDashboard } from './components/PMDashboard';
import { ReportForm } from './components/ReportForm';

type View = 'welcome' | 'signup' | 'dashboard' | 'report-form' | 'staff-portal';

export default function App() {
  const [view, setView] = useState<View>('welcome');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // App Data
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // Auth Listener (Local)
  useEffect(() => {
    // Check local session
    const loadSession = async () => {
      dataService.ensureSeedData();
      const sessionId = localStorage.getItem('currentUserId');
      if (sessionId) {
        const user = await dataService.getUser(sessionId);
        if (user) {
          setCurrentUser(user);
          setView('dashboard');
        } else {
          localStorage.removeItem('currentUserId');
        }
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!currentUser) return;

    let unsubReports: any;
    if (currentUser.role === 'student') {
      unsubReports = dataService.subscribeToReports(currentUser.id, setReports);
    } else {
      unsubReports = dataService.subscribeToAllReports(setReports);
    }

    const unsubQuestions = dataService.subscribeToQuestions(setQuestions);
    
    let unsubUsers: any;
    let unsubGroups: any;
    if (['pm', 'coach', 'instructor'].includes(currentUser.role)) {
      unsubUsers = dataService.subscribeToAllUsers(setAllUsers);
      unsubGroups = dataService.subscribeToGroups(setGroups);
    }

    return () => {
      unsubReports?.();
      unsubQuestions?.();
      unsubUsers?.();
      unsubGroups?.();
    };
  }, [currentUser]);

  // Handlers
  const handleStudentLogin = () => {
    // For local prototype, we will just go to the signup form directly 
    // where they can create a student identity or log in if they used the same email.
    setView('signup');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUserId');
    setCurrentUser(null);
    setView('welcome');
  };

  const onSignUpSubmit = async (formData: any) => {
    // Treat the email as the ID for simplicity in this prototype
    const authEmail = formData.email.toLowerCase().trim();
    const id = `student-${authEmail}`;
    
    // Check if user exists
    let user = await dataService.getUser(id);
    if (!user) {
      user = {
        id,
        fullName: formData.fullName,
        username: authEmail.split('@')[0],
        role: 'student',
        ...formData,
        email: authEmail,
        createdAt: new Date().toISOString()
      };
      await dataService.saveUser(user);
    }

    localStorage.setItem('currentUserId', user.id);
    setCurrentUser(user);
    setView('dashboard');
  };

  const onReportSubmit = async (reportData: any) => {
    if (!currentUser) return;
    await dataService.submitReport({
      studentId: currentUser.id,
      ...reportData,
      weekEnding: new Date().toISOString()
    });
    setView('dashboard');
  };

  const onAddGroup = async (name: string) => {
    if (!currentUser) return;
    await dataService.addGroup(name, currentUser.id);
  };

  const filteredQuestions = useMemo(() => {
    if (!currentUser) return [];
    return questions.filter(q => 
      q.targetStudentIds.length === 0 || q.targetStudentIds.includes(currentUser.id)
    );
  }, [questions, currentUser]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
          >
            <div className="w-24 h-24 bg-black rounded-[2rem] flex items-center justify-center mb-16 shadow-2xl shadow-black/20 rotate-3 transition-transform hover:rotate-0 duration-500">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            
            <div className="space-y-6 mb-24">
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-black leading-[0.85] font-display uppercase">
                UNITED<br/><span className="text-black bg-black px-4 inline-block transform -rotate-1 text-white">PIPELINE</span>
              </h1>
              <p className="text-[11px] font-black tracking-[0.6em] text-gray-400 uppercase">Phase 1 / Year Up United Digital Hub</p>
            </div>

            <div className="flex flex-col gap-5 w-full max-w-sm">
              <Button onClick={handleStudentLogin} className="w-full h-18 bg-black text-white hover:bg-gray-900 border-none rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Establish Student Feed
              </Button>
              
              <button 
                onClick={() => setView('staff-portal')}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-black transition-all flex items-center justify-center gap-3 group"
              >
                <ShieldCheck className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                Staff Protocols
              </button>
            </div>

            <div className="mt-32 pt-16 border-t border-gray-200 w-full max-w-lg flex items-center justify-between text-gray-500 px-6">
               <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Node Status</span>
                  <span className="text-black font-black text-[10px] uppercase tracking-tighter bg-gray-50 px-3 py-1 rounded-full border border-gray-200 italic">Connected</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Encryption</span>
                  <span className="text-black font-black text-[10px] uppercase tracking-tighter bg-gray-50 px-3 py-1 rounded-full border border-gray-200 italic">AES-256</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Environment</span>
                  <span className="text-black font-black text-[10px] uppercase tracking-tighter bg-gray-50 px-3 py-1 rounded-full border border-gray-200 italic">Testing</span>
               </div>
            </div>
            
            <p className="mt-8 text-xs text-black opacity-50 font-medium">Testing Mode: Local Auth only. Firebase removed.</p>
          </motion.div>
        )}

        {view === 'staff-portal' && (
          <StaffPortal 
            onBack={() => setView('welcome')} 
            onLoginSuccess={(user) => {
              localStorage.setItem('currentUserId', user.id);
              setCurrentUser(user);
              setView('dashboard');
            }} 
          />
        )}

        {view === 'signup' && (
          <SignUpForm key="signup" allUsers={allUsers} onBack={() => setView('welcome')} onSubmit={onSignUpSubmit} />
        )}

        {view === 'dashboard' && currentUser && (
          <div key="dashboard" className="max-w-6xl mx-auto p-6 md:p-14 space-y-16 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                    <h2 className="text-6xl font-black text-black tracking-tighter leading-none font-display uppercase italic">{currentUser.fullName.split(' ')[0]}</h2>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white px-4 py-1.5 bg-black rounded-full border border-black shadow-xl shadow-black/10">{currentUser.role}</span>
                </div>
                <div className="flex items-center gap-4">
                   <p className="text-gray-500 font-black text-[11px] uppercase tracking-[0.3em] font-display italic">{currentUser.pathway ? 
                     PATHWAYS.find(p => p.id === currentUser.pathway)?.name : 
                     'Administration'}</p>
                   <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                   <p className="text-gray-400 font-black text-[11px] uppercase tracking-[0.3em]">Neural Link Established</p>
                </div>
              </div>
              
              <Button onClick={handleLogout} variant="ghost" className="text-gray-500 hover:text-black px-6 h-12 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-gray-200">
                <LogOut className="w-4 h-4 mr-2" />
                Terminate
              </Button>
            </header>

            <main className="animate-in slide-in-from-bottom-4 duration-1000">
                {currentUser.role === 'student' && (
                  <StudentDashboard 
                    user={currentUser} 
                    reports={reports} 
                    onNewReport={() => setView('report-form')} 
                  />
                )}

                {(currentUser.role === 'coach' || currentUser.role === 'instructor') && (
                  <CoachDashboard 
                    user={currentUser} 
                    students={allUsers.filter(u => u.role === 'student')} 
                    reports={reports}
                    customQuestions={questions}
                    onAddQuestion={(q) => dataService.saveQuestion({ ...q, creatorId: currentUser.id } as any)}
                    onDeleteQuestion={(id) => dataService.deleteQuestion(id)}
                  />
                )}

                {currentUser.role === 'pm' && (
                   <PMDashboard 
                    user={currentUser}
                    allUsers={allUsers}
                    allReports={reports}
                    groups={groups}
                    onAddGroup={onAddGroup}
                    onUpdateGroup={(g) => dataService.updateGroup(g)}
                   />
                )}
            </main>
          </div>
        )}

        {view === 'report-form' && currentUser && (
          <ReportForm 
            user={currentUser} 
            questions={filteredQuestions}
            onCancel={() => setView('dashboard')} 
            onSubmit={onReportSubmit} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
