import { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Common';
import { useAuth } from '../../hooks/useAuth';
import { Users, AlertTriangle, FileText } from 'lucide-react';

export function PMDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>({ students: [], alerts: [] });

  useEffect(() => {
    fetch('/api/pm/dashboard', { credentials: "include" })
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-display tracking-tight text-[#0A0A0A]">Program Manager</h1>
        <p className="text-[#6B7280] text-sm mt-1">Manage your active students and respond to critical alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EFF6FF] text-[#2563EB] rounded-xl flex items-center justify-center">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">My Students</p>
                 <p className="text-2xl font-black">{data.students.length}</p>
              </div>
           </div>
        </Card>
        
        <Card className="p-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FEF2F2] text-[#DC2626] rounded-xl flex items-center justify-center">
                 <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">Active Alerts</p>
                 <p className="text-2xl font-black">{data.alerts.length}</p>
              </div>
           </div>
        </Card>

        <Card className="p-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFF4EB] text-[#FF7A00] rounded-xl flex items-center justify-center">
                 <FileText className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">Pending Reports</p>
                 <p className="text-2xl font-black">{data.students.filter((s:any) => s.reports?.length > 0).length}</p>
              </div>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
           <h2 className="text-xl font-bold border-b pb-4 mb-4">Critical Alerts</h2>
           {data.alerts.length === 0 ? (
             <p className="text-sm text-[#6B7280]">No active alerts.</p>
           ) : (
             <div className="space-y-4">
               {data.alerts.map((a: any) => (
                 <div key={a.id} className="p-4 rounded-xl border border-red-200 bg-red-50 flex justify-between items-start">
                   <div>
                      <p className="font-bold text-red-700">{a.student.name}</p>
                      <p className="text-sm text-red-600">{a.description}</p>
                   </div>
                   <Button variant="outline" className="border-red-200 text-red-700 bg-white hover:bg-red-100">Review</Button>
                 </div>
               ))}
             </div>
           )}
        </Card>

        <Card className="p-6">
           <h2 className="text-xl font-bold border-b pb-4 mb-4">Student Directory</h2>
           <div className="space-y-3">
              {data.students.map((s: any) => (
                <div key={s.id} className="p-4 border border-[#E5E7EB] rounded-xl bg-white hover:border-[#D1D5DB] transition-all flex justify-between items-center">
                   <div>
                      <p className="font-bold">{s.name}</p>
                      <p className="text-xs text-[#6B7280]">{s.email}</p>
                   </div>
                   <Button variant="outline">View Profile</Button>
                </div>
              ))}
              {data.students.length === 0 && <p className="text-sm text-[#6B7280]">No students assigned yet.</p>}
           </div>
        </Card>
      </div>
    </div>
  );
}
