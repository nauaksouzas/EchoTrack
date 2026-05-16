import { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Common';
import { toast } from 'sonner';

export function AllReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [filterMode, setFilterMode] = useState<string>('ALL');

  const fetchReports = () => {
    fetch('/api/admin/reports', { credentials: "include" })
      .then(res => res.json())
      .then(data => setReports(data));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReview = async (id: string, currentStatus: string) => {
     if (currentStatus === 'REVIEWED') return;
     try {
       const res = await fetch(`/api/reports/${id}/review`, { method: 'PATCH', credentials: "include" });
       if (res.ok) {
           toast.success('Marked as reviewed');
           fetchReports();
       } else {
           toast.error('Failed to update status');
       }
     } catch(e) {
       toast.error('Error updating status');
     }
  };

  const visibleReports = filterMode === 'ALL' ? reports : reports.filter(r => r.status === filterMode);

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
         <div>
            <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">All Reports</h1>
            <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">Cross-Pathways Repository</p>
         </div>
         <div className="flex gap-2 bg-[#F5F5F5] p-1 rounded-lg">
            <button onClick={() => setFilterMode('ALL')} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${filterMode === 'ALL' ? 'bg-white shadow text-[#0A0A0A]' : 'text-[#6B7280]'}`}>All</button>
            <button onClick={() => setFilterMode('SUBMITTED')} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${filterMode === 'SUBMITTED' ? 'bg-white shadow text-[#0A0A0A]' : 'text-[#6B7280]'}`}>Needs Review</button>
            <button onClick={() => setFilterMode('REVIEWED')} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${filterMode === 'REVIEWED' ? 'bg-white shadow text-[#0A0A0A]' : 'text-[#6B7280]'}`}>Reviewed</button>
         </div>
       </div>
       
       <div className="space-y-4">
          {visibleReports.map((r: any) => (
            <Card key={r.id} className="p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
               <div>
                  <p className="font-bold text-[#0A0A0A]">{r.student?.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-[#6B7280]">{new Date(r.submittedAt).toLocaleDateString()}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${r.status === 'REVIEWED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {r.status}
                      </span>
                      <p className="text-xs text-[#6B7280] ml-2">Cycle: {r.cycle?.name}</p>
                  </div>
               </div>
               <div className="flex gap-2">
                 {r.status !== 'REVIEWED' && (
                    <Button variant="outline" className="text-xs px-3 h-8 bg-green-50 text-green-700 border-green-200 hover:bg-green-100" onClick={() => handleReview(r.id, r.status)}>Mark Reviewed</Button>
                 )}
                 <Button variant="outline" className="text-xs px-3 h-8" onClick={() => window.location.href = `/api/reports/export-pdf?id=${r.id}`}>PDF</Button>
                 <Button variant="outline" className="text-xs px-3 h-8" onClick={() => window.location.href = `/api/reports/export-docx?id=${r.id}`}>DOCX</Button>
               </div>
            </Card>
          ))}
          {visibleReports.length === 0 && <p className="text-sm text-[#6B7280]">No reports match your selected filter.</p>}
       </div>
    </div>
  );
}
