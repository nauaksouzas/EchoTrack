import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Common';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Classes() {
  const [classes, setClasses] = useState<any[]>([]);
  const [pathways, setPathways] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [pathwayId, setPathwayId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [schedule, setSchedule] = useState('');

  const fetchData = async () => {
    const [cRes, pRes, iRes] = await Promise.all([
      fetch('/api/admin/classes', { credentials: 'include' }),
      fetch('/api/admin/pathways', { credentials: 'include' }),
      fetch('/api/admin/instructors', { credentials: 'include' })
    ]);
    if (cRes.ok && pRes.ok && iRes.ok) {
      setClasses(await cRes.json());
      const pData = await pRes.json();
      setPathways(pData);
      setInstructors(await iRes.json());
      if (pData.length > 0 && !pathwayId) setPathwayId(pData[0].id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    if (!pathwayId) return toast.error('Pathway is required');
    
    const res = await fetch('/api/admin/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, pathwayId, instructorId: instructorId || null, schedule })
    });
    if (res.ok) {
      toast.success('Class created');
      setName('');
      setSchedule('');
      setInstructorId('');
      fetchData();
    } else {
      toast.error('Failed to create class');
    }
  };

  const handleDeactivate = async (id: string) => {
    const res = await fetch(`/api/admin/classes?id=${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
        toast.success('Class deactivated');
        fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">Classes</h1>
          <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">Manage Class Roster</p>
        </div>
      </div>
      
      {pathways.length === 0 ? (
          <Card className="p-12 text-center text-[#6B7280]">
            <h3 className="font-medium text-gray-900 mb-1">No Classes Found</h3>
            <p className="text-sm">Please create a Pathway before creating a Class.</p>
          </Card>
      ) : (
          <div className="flex gap-6">
             <Card className="p-6 w-1/3 h-fit sticky top-24 border-[#E5E7EB]">
                 <h2 className="font-bold text-sm mb-4">Add Class</h2>
                 <form onSubmit={handleCreate} className="space-y-4">
                     <Input label="Name" value={name} onChange={setName} required />
                     <div>
                        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Pathway</label>
                        <select className="w-full h-11 px-3 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:bg-white text-sm" value={pathwayId} onChange={e => setPathwayId(e.target.value)} required>
                            {pathways.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Instructor (Optional)</label>
                        <select className="w-full h-11 px-3 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:bg-white text-sm" value={instructorId} onChange={e => setInstructorId(e.target.value)}>
                            <option value="">Unassigned</option>
                            {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                     </div>
                     <Input label="Schedule (e.g. Mon/Wed 10am)" value={schedule} onChange={setSchedule} />
                     <Button type="submit" className="w-full">Create</Button>
                 </form>
             </Card>
          
             <div className="flex-1 space-y-4">
                {classes.map(c => (
                    <Card key={c.id} className="p-5 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="font-bold text-[#0A0A0A]">{c.name}</h3>
                            <p className="text-xs text-[#6B7280] mt-1">{c.pathway?.name}</p>
                            <div className="flex gap-4 mt-3 text-xs font-medium text-[#6B7280]">
                                <span>Instructor: {c.instructor?.name || 'Unassigned'}</span>
                                {c.schedule && <span>Schedule: {c.schedule}</span>}
                            </div>
                        </div>
                        <div>
                           <Button variant="outline" className="text-red-600 border-transparent hover:bg-red-50" onClick={() => handleDeactivate(c.id)}>
                              <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                    </Card>
                ))}
                {classes.length === 0 && (
                    <Card className="p-12 text-center text-[#6B7280]">
                        <h3 className="font-medium text-gray-900 mb-1">No Classes Yet</h3>
                        <p className="text-sm">Use the form to create your first class.</p>
                    </Card>
                )}
             </div>
          </div>
      )}
    </div>
  );
}
