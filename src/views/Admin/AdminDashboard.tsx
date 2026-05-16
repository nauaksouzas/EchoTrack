import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Common';
import { motion } from 'motion/react';
import { Users, FileText, Activity, Bell } from 'lucide-react';

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/analytics', { credentials: "include" })
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <div className="animate-pulse flex space-x-4">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-display tracking-tight text-[#0A0A0A]">Admin Dashboard</h1>
        <p className="text-[#6B7280] text-sm mt-1">Executive Reporting Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#EFF6FF] text-[#2563EB] rounded-xl"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">Total Users</p>
                <p className="text-2xl font-black tracking-tight mt-1">{data.totalActiveUsers || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F0FDF4] text-[#16A34A] rounded-xl"><FileText className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">Submitted Reports</p>
                <p className="text-2xl font-black tracking-tight mt-1">{data.submittedReportsThisCycle || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FFF4EB] text-[#FF7A00] rounded-xl"><Activity className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">Submission Rate</p>
                <p className="text-2xl font-black tracking-tight mt-1">{data.submissionRate || 0}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FEF2F2] text-[#DC2626] rounded-xl"><Bell className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">Active Alerts</p>
                <p className="text-2xl font-black tracking-tight mt-1">{data.activeAlerts || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="p-6">
            <h3 className="font-bold text-sm text-[#0A0A0A] mb-4">Program Managers</h3>
            <p className="text-3xl font-black tracking-tight">{data.totalProgramManagers || 0}</p>
         </Card>
         <Card className="p-6">
            <h3 className="font-bold text-sm text-[#0A0A0A] mb-4">Pathways</h3>
            <p className="text-3xl font-black tracking-tight">{data.totalPathways || 0}</p>
         </Card>
         <Card className="p-6">
            <h3 className="font-bold text-sm text-[#0A0A0A] mb-4">Classes</h3>
            <p className="text-3xl font-black tracking-tight">{data.totalClasses || 0}</p>
         </Card>
      </div>
      
      <Card className="p-6">
         <h3 className="font-bold text-sm text-[#0A0A0A] border-b border-[#E5E7EB] pb-4 mb-4">Recent Activity</h3>
         <div className="space-y-4">
             {data.recentActivity && data.recentActivity.length > 0 ? data.recentActivity.map((log: any) => (
                 <div key={log.id} className="text-sm text-[#6B7280]">
                    <span className="font-medium text-gray-900">{log.action}</span> - {log.description}
                 </div>
             )) : (
                 <div className="text-sm text-[#6B7280]">No activity recorded yet.</div>
             )}
         </div>
      </Card>
    </div>
  );
}
