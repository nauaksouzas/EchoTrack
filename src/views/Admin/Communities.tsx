import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Common';
import { safeFetch } from '../../lib/fetchUtils';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Communities() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [pms, setPms] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [programManagerId, setProgramManagerId] = useState('');

  const fetchData = async () => {
    try {
      const [cData, pmData] = await Promise.all([
        safeFetch('/api/admin/communities'),
        safeFetch('/api/admin/invite') // /api/admin/invite returns PMs
      ]);
      setCommunities(cData);
      // filter active PMs
      const activePMs = pmData.filter((p: any) => p.accountStatus === 'ACTIVE');
      setPms(activePMs);
      if (activePMs.length > 0 && !programManagerId) setProgramManagerId(activePMs[0].id);
    } catch (e: any) {
      console.error('Fetch Data Failed:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      await safeFetch('/api/admin/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, programManagerId: programManagerId || null })
      });
      toast.success('Community created');
      setName('');
      setDescription('');
      fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to create community');
    }
  };

  const handleDeactivate = async (id: string, activeCount: number) => {
    if (activeCount > 0) {
        toast.error('Cannot deactivate community with active students');
        return;
    }
    try {
      await safeFetch(`/api/admin/communities?id=${id}`, { method: 'DELETE' });
      toast.success('Community deactivated');
      fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">Communities</h1>
          <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">Manage Student Hubs</p>
        </div>
      </div>
      
      <div className="flex gap-6">
         <Card className="p-6 w-1/3 h-fit sticky top-24 border-[#E5E7EB]">
             <h2 className="font-bold text-sm mb-4">Add Community</h2>
             <form onSubmit={handleCreate} className="space-y-4">
                 <Input label="Name" value={name} onChange={setName} required />
                 <Input label="Description" value={description} onChange={setDescription} />
                 <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Program Manager (Optional)</label>
                    <select className="w-full h-11 px-3 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:bg-white text-sm" value={programManagerId} onChange={e => setProgramManagerId(e.target.value)}>
                        <option value="">Unassigned</option>
                        {pms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>
                 <Button type="submit" className="w-full">Create</Button>
             </form>
         </Card>
      
         <div className="flex-1 space-y-4">
            {communities.map(c => (
                <Card key={c.id} className="p-5 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div>
                        <h3 className="font-bold text-[#0A0A0A]">{c.name}</h3>
                        <p className="text-xs text-[#6B7280] mt-1">{c.description}</p>
                        <div className="flex gap-4 mt-3 text-xs font-medium text-[#6B7280]">
                            <span>PM: {c.programManager?.name || 'Unassigned'}</span>
                            <span>Students: {c.studentsCount}</span>
                        </div>
                    </div>
                    <div>
                       <Button variant="outline" className="text-red-600 border-transparent hover:bg-red-50" onClick={() => handleDeactivate(c.id, c.studentsCount)}>
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                </Card>
            ))}
            {communities.length === 0 && (
                <Card className="p-12 text-center text-[#6B7280]">
                    <h3 className="font-medium text-gray-900 mb-1">No Communities Yet</h3>
                    <p className="text-sm">Use the form to create your first community.</p>
                </Card>
            )}
         </div>
      </div>
    </div>
  );
}
