import { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Common';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock } from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/student/reports', { credentials: "include" })
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-display tracking-tight text-[#0A0A0A]">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-[#6B7280] text-sm mt-1">Here is your academic progress overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="p-6 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white">
            <h2 className="text-xl font-bold mb-2">Weekly Report</h2>
            <p className="text-sm text-gray-300 mb-6">It's time to submit your weekly progress report for your coach.</p>
            <Link to="/student/report">
               <Button className="bg-[#FF7A00] hover:bg-[#E66D00] border-transparent text-white w-full sm:w-auto">
                 Start Wizard
               </Button>
            </Link>
         </Card>
      </div>

      <h2 className="text-xl font-bold border-b pb-4 mt-8">Past Reports</h2>
      <div className="space-y-4">
         {reports.length === 0 ? (
           <p className="text-sm text-[#6B7280]">You haven't submitted any reports yet.</p>
         ) : (
           reports.map(r => (
             <Card key={r.id} className="p-5 flex justify-between items-center transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-[#F5F5F5] rounded-xl text-[#6B7280]">
                      <FileText className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-bold">{r.cycle?.name || 'Weekly Report'}</p>
                      <p className="text-xs text-[#6B7280]">Submitted on {new Date(r.submittedAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="text-xs px-3 h-8" onClick={() => window.location.href = `/api/reports/export-pdf?id=${r.id}`}>PDF</Button>
                  <Button variant="outline" className="text-xs px-3 h-8" onClick={() => window.location.href = `/api/reports/export-docx?id=${r.id}`}>DOCX</Button>
                </div>
             </Card>
           ))
         )}
      </div>
    </div>
  );
}
