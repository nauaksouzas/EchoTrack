import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Settings, 
  Plus, 
  Users, 
  LayoutGrid, 
  ShieldCheck,
  UserPlus,
  Trash2,
  MoreVertical,
  Mail,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';
import { Button, Card, Input, Select } from './ui/Common';
import { User, WeeklyReport, Group, StaffInvitation } from '../types';
import { dataService } from '../services/dataService';

interface PMDashboardProps {
  user: User;
  allUsers: User[];
  allReports: WeeklyReport[];
  groups: Group[];
  onAddGroup: (name: string) => void;
  onUpdateGroup: (group: Group) => void;
}

export function PMDashboard({ user, allUsers, allReports, groups, onAddGroup, onUpdateGroup }: PMDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'staff'>('overview');
  const [newGroupName, setNewGroupName] = useState('');
  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteData, setInviteData] = useState({ fullName: '', email: '', role: 'coach', password: '' });

  const stats = {
    totalStudents: allUsers.filter(u => u.role === 'student').length,
    totalCoaches: allUsers.filter(u => u.role === 'coach').length,
    reportsThisWeek: allReports.filter(r => {
      const today = new Date();
      const lastFri = new Date(today);
      lastFri.setDate(today.getDate() - (today.getDay() + 2) % 7);
      lastFri.setHours(2, 0, 0, 0);
      return new Date(r.submittedAt) > lastFri;
    }).length
  };

  const handleInvite = async () => {
    if (!inviteData.email || !inviteData.fullName || !inviteData.password) return;
    
    const normalizedEmail = inviteData.email.toLowerCase().trim();
    
    // Check if email already exists
    if (allUsers.some(u => u.email === normalizedEmail)) {
        alert("Verification Error: Email already exists.");
        return;
    }

    // Create staff member directly for local auth prototype
    const newStaff: User = {
        id: `staff-${normalizedEmail}`,
        fullName: inviteData.fullName,
        email: normalizedEmail,
        username: normalizedEmail.split('@')[0],
        role: inviteData.role as 'coach' | 'pm' | 'instructor',
        password: inviteData.password,
        createdAt: new Date().toISOString()
    };
    
    await dataService.saveUser(newStaff);

    setIsInviting(false);
    setInviteData({ fullName: '', email: '', role: 'coach', password: '' });
  };

  return (
    <div className="space-y-12 font-sans selection:bg-black selection:text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex gap-2 p-2 bg-gray-50 border border-gray-200 rounded-[2.5rem] w-fit shadow-inner shadow-black/5">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-10 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all transform ${activeTab === 'overview' ? 'bg-black text-white shadow-2xl scale-100' : 'text-gray-600 hover:text-black hover:bg-white hover:scale-[1.02]'}`}
            >
                <BarChart3 className="w-4 h-4 mb-2 mx-auto" />
                Diagnostics
            </button>
            <button 
                onClick={() => setActiveTab('groups')}
                className={`px-10 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all transform ${activeTab === 'groups' ? 'bg-black text-white shadow-2xl scale-100' : 'text-gray-600 hover:text-black hover:bg-white hover:scale-[1.02]'}`}
            >
                <LayoutGrid className="w-4 h-4 mb-2 mx-auto" />
                Nodes
            </button>
            <button 
                onClick={() => setActiveTab('staff')}
                className={`px-10 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all transform ${activeTab === 'staff' ? 'bg-black text-white shadow-2xl scale-100' : 'text-gray-600 hover:text-black hover:bg-white hover:scale-[1.02]'}`}
            >
                <ShieldCheck className="w-4 h-4 mb-2 mx-auto" />
                Auth
            </button>
        </div>
        
        <div className="hidden md:flex flex-col items-end gap-2 text-right">
            <div className="flex items-center gap-3 text-[10px] font-black text-black uppercase tracking-[0.4em] italic">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Core Secure / {user.fullName}
            </div>
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-none">Administration Interface V4.1</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <Card className="p-12 border-none bg-black text-white shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 group-hover:scale-125 transition-all duration-1000 rotate-12">
                  <Users className="w-32 h-32" />
               </div>
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/70 mb-6">Aggregate / Students</p>
               <h3 className="text-8xl font-black tracking-tighter font-display italic leading-none">{stats.totalStudents}</h3>
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mt-6 flex items-center gap-2">
                 <div className="w-3 h-[1px] bg-white/40" />
                 Active Node Population
               </div>
            </Card>

            <Card className="p-12 border-gray-200 bg-white shadow-2xl shadow-black/5 relative group overflow-hidden rounded-[2.5rem]">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-all duration-1000 rotate-12">
                  <ShieldCheck className="w-32 h-32" />
               </div>
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6 font-display">Personnel / Faculty</p>
               <h3 className="text-8xl font-black tracking-tighter text-black font-display italic leading-none">{stats.totalCoaches}</h3>
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mt-6 flex items-center gap-2">
                 <div className="w-3 h-[1px] bg-gray-400" />
                 Authorized Personnel
               </div>
            </Card>

            <Card className="p-12 border-gray-200 bg-white shadow-2xl shadow-black/5 relative group overflow-hidden rounded-[2.5rem]">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-all duration-1000 rotate-12">
                  <BarChart3 className="w-32 h-32 text-black" />
               </div>
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6 font-display">Activity / Velocity</p>
               <h3 className="text-8xl font-black tracking-tighter text-black font-display italic leading-none">{stats.reportsThisWeek}</h3>
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mt-6 flex items-center gap-2">
                 <div className="w-3 h-[1px] bg-gray-400" />
                 Telemetry Current Cycle
               </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div key="gr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <Card className="p-10 border-gray-100 border-2 border-dashed bg-gray-50/50 rounded-3xl">
               <div className="flex flex-col md:flex-row items-end gap-10">
                 <div className="flex-1 space-y-2">
                   <Input 
                    label="Initialize New Node" 
                    placeholder="Enter Group Designation..." 
                    className="h-16 bg-white border-none shadow-sm rounded-2xl px-6 font-bold text-lg"
                    labelClassName="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
                    value={newGroupName} 
                    onChange={setNewGroupName} 
                   />
                 </div>
                 <Button 
                    onClick={() => { onAddGroup(newGroupName); setNewGroupName(''); }} 
                    disabled={!newGroupName} 
                    className="h-16 px-12 bg-black text-white hover:bg-gray-800 rounded-2xl font-black text-xs uppercase tracking-widest gap-3"
                 >
                    <Plus className="w-5 h-5" /> Initialize Group
                 </Button>
               </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groups.map(group => (
                <Card key={group.id} className="p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all bg-white border-gray-100 rounded-3xl group">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                       <h4 className="font-black text-2xl text-black tracking-tighter">{group.name}</h4>
                       <div className="inline-block px-2 py-1 bg-gray-200 rounded text-[8px] font-bold text-gray-600 uppercase tracking-widest">Node ID: {group.id.slice(0, 8)}</div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Coaches</span>
                            <p className="text-xl font-black text-black">{group.coachIds.length}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Students</span>
                            <p className="text-xl font-black text-black">{group.studentIds.length}</p>
                        </div>
                    </div>
                    
                    <Button variant="ghost" disabled className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-50 text-gray-400 bg-gray-50 cursor-not-allowed">
                        Configure Node (Coming Soon)
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'staff' && (
          <motion.div key="st" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
               <div>
                  <h3 className="text-4xl font-black text-black tracking-tighter">Personnel Control</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">Pilot Administration & Token Management</p>
               </div>
               <Button onClick={() => setIsInviting(true)} className="h-14 px-8 bg-black hover:bg-gray-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest gap-3 shadow-xl">
                  <UserPlus className="w-4 h-4" /> 
                  Authorize Faculty
               </Button>
            </div>

             {isInviting && (
               <Card className="p-10 bg-gray-50 border border-gray-200 rounded-3xl animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex flex-col gap-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Input 
                           label="Identity Display Name" 
                           placeholder="Ex: Jordan Miller" 
                           value={inviteData.fullName} 
                           onChange={(v) => setInviteData({...inviteData, fullName: v})} 
                           className="bg-white h-14 border border-gray-200 shadow-sm rounded-xl font-bold text-black placeholder-gray-400"
                           labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                        />
                        <Input 
                           label="Authorized Identification Email" 
                           placeholder="faculty.member@example.org" 
                           value={inviteData.email} 
                           onChange={(v) => setInviteData({...inviteData, email: v})} 
                           className="bg-white h-14 border border-gray-200 shadow-sm rounded-xl font-bold text-black placeholder-gray-400"
                           labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                        />
                        <Input 
                           label="Temporary Gateway Password" 
                           type="password"
                           placeholder="••••••••" 
                           value={inviteData.password} 
                           onChange={(v) => setInviteData({...inviteData, password: v})} 
                           className="bg-white h-14 border border-gray-200 shadow-sm rounded-xl font-bold text-black placeholder-gray-400"
                           labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                        />
                        <Select 
                           label="Functional Responsibility" 
                           options={[
                              { id: 'coach', name: 'Student Coach' },
                              { id: 'instructor', name: 'Academic Instructor' },
                              { id: 'pm', name: 'Program Manager' }
                           ]} 
                           value={inviteData.role} 
                           onChange={(v) => setInviteData({...inviteData, role: v})} 
                           className="bg-white h-14 border border-gray-200 shadow-sm rounded-xl font-bold text-black"
                           labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                        />
                     </div>
                     <div className="flex justify-end gap-4 mt-4">
                        <Button variant="ghost" onClick={() => setIsInviting(false)} className="h-14 px-8 font-black uppercase tracking-widest text-[10px] text-gray-500 hover:text-black">Cancel</Button>
                        <Button onClick={handleInvite} disabled={!inviteData.email || !inviteData.password || !inviteData.fullName} className="bg-black hover:bg-gray-800 h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl">Activate Token</Button>
                     </div>
                  </div>
               </Card>
            )}

            <div className="grid grid-cols-1">
               <div className="space-y-8">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-2">Active Personnel</h4>
                  <Card className="overflow-hidden shadow-sm border-gray-200 rounded-3xl bg-white">
                     <table className="w-full text-left">
                        <thead className="bg-gray-50 uppercase tracking-widest border-b border-gray-100">
                           <tr>
                              <th className="px-10 py-6 text-[9px] font-black text-gray-500">Professional Identity</th>
                              <th className="px-10 py-6 text-[9px] font-black text-gray-500">Role</th>
                              <th className="px-10 py-6 text-[9px] font-black text-gray-500 text-right">Identifier</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {allUsers.filter(u => u.role !== 'student').map(staff => (
                              <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-[10px]">
                                          {staff.fullName.split(' ').map(n => n[0]).join('')}
                                       </div>
                                       <span className="font-black text-black tracking-tight">{staff.fullName}</span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm bg-white text-gray-600 border-gray-200">
                                       {staff.role}
                                    </span>
                                 </td>
                                 <td className="px-10 py-8 text-[11px] font-bold text-gray-500 text-right font-mono">{staff.email}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </Card>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-16 pt-8 border-t border-gray-100 text-center flex flex-col items-center">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">United Pipeline System</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic mt-1">Administration Interface V4.1</p>
            <button className="mt-6 text-[9px] font-black uppercase text-red-500 hover:text-red-700 tracking-widest underline underline-offset-4 decoration-red-200 hover:decoration-red-500 transition-all font-sans" onClick={() => {
                if (window.confirm("Are you sure you want to completely reset all prototype data?")) {
                    dataService.resetPrototypeData();
                    window.location.reload();
                }
            }}>
                Reset Prototype Data
            </button>
      </div>
    </div>
  );
}
