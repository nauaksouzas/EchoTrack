import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Common';
import { useAuth } from '../../hooks/useAuth';
import { Users, FileText, Target, BookOpen } from 'lucide-react';

export function InstructorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>({ classes: [], ratings: [] });

  useEffect(() => {
    fetch('/api/instructor/dashboard', { credentials: "include" })
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-display tracking-tight text-[#0A0A0A]">Instructor Dashboard</h1>
        <p className="text-[#6B7280] text-sm mt-1">Monitor your classes and class ratings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EFF6FF] text-[#2563EB] rounded-xl flex items-center justify-center">
                 <BookOpen className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">My Classes</p>
                 <p className="text-2xl font-black">{data.classes.length}</p>
              </div>
           </div>
        </Card>
        
        <Card className="p-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F0FDF4] text-[#16A34A] rounded-xl flex items-center justify-center">
                 <FileText className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs text-[#6B7280] uppercase tracking-widest font-bold">Total Ratings</p>
                 <p className="text-2xl font-black">{data.ratings.length}</p>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
