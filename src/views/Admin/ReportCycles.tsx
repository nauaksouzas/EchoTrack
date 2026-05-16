import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Common';
import { Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

export function ReportCycles() {
  const [cycles, setCycles] = useState<any[]>([]);
  const [pathways, setPathways] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pathwayId, setPathwayId] = useState('');

  const fetchData = async () => {
    const [cRes, pRes] = await Promise.all([
      fetch('/api/admin/cycles', { credentials: 'include' }),
      fetch('/api/admin/pathways', { credentials: 'include' })
    ]);
    if (cRes.ok && pRes.ok) {
        setCycles(await cRes.json());
        setPathways(await pRes.json());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/admin/cycles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, startDate, endDate, status: 'OPEN', pathwayId: pathwayId || null })
    });
    if (res.ok) {
      toast.success('Cycle created');
      setName('');
      setStartDate('');
      setEndDate('');
      fetchData();
    } else {
      const err = await res.json();
      toast.error(err.error || 'Failed to create');
    }
  };

  const handleToggle = async (id: string, status: string) => {
    const newStatus = status === 'OPEN' ? 'CLOSED' : 'OPEN';
    const res = await fetch(`/api/admin/cycles/${id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
        toast.success(`Cycle ${newStatus.toLowerCase()}`);
        fetchData();
    } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">Report Cycles</h1>
          <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">Manage Submission Windows</p>
        </div>
      </div>
      
      <div className="flex gap-6">
         <Card className="p-6 w-1/3 h-fit sticky top-24 border-[#E5E7EB]">
             <h2 className="font-bold text-sm mb-4">Add Open Cycle</h2>
             <form onSubmit={handleCreate} className="space-y-4">
                 <Input label="Cycle Name (e.g. Week 1)" value={name} onChange={setName} required />
                 <Input type="date" label="Start Date" value={startDate} onChange={setStartDate} required />
                 <Input type="date" label="End Date" value={endDate} onChange={setEndDate} required />
                 <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Scope</label>
                    <select className="w-full h-11 px-3 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:bg-white text-sm" value={pathwayId} onChange={e => setPathwayId(e.target.value)}>
                        <option value="">Global (All Pathways)</option>
                        {pathways.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>
                 <Button type="submit" className="w-full">Create & Open</Button>
             </form>
         </Card>
      
         <div className="flex-1 space-y-4">
            {cycles.map(c => (
                <Card key={c.id} className={`p-5 flex justify-between items-center transition-shadow border-l-4 ${c.status === 'OPEN' ? 'border-l-emerald-500 hover:shadow-md' : 'border-l-gray-300'}`}>
                    <div>
                        <div className="flex items-center gap-3">
                           <h3 className="font-bold text-[#0A0A0A]">{c.name}</h3>
                           <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${c.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                               {c.status}
                           </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1">
                            {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs font-medium text-[#6B7280]">
                            <span>Scope: {c.pathway?.name || 'Global'}</span>
                            <span>Reports: {c.reportsCount}</span>
                        </div>
                    </div>
                    <div>
                       <Button variant={c.status === 'OPEN' ? 'outline' : 'primary'} className={`text-xs h-9 px-4 ${c.status === 'OPEN' ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : ''}`} onClick={() => handleToggle(c.id, c.status)}>
                          {c.status === 'OPEN' ? <><PowerOff className="w-3 h-3 mr-2" /> Close Cycle</> : <><Power className="w-3 h-3 mr-2" /> Reopen</>}
                       </Button>
                    </div>
                </Card>
            ))}
            {cycles.length === 0 && (
                <Card className="p-12 text-center text-[#6B7280]">
                    <h3 className="font-medium text-gray-900 mb-1">No Cycles Yet</h3>
                    <p className="text-sm">Create an OPEN cycle to start collecting reports.</p>
                </Card>
            )}
         </div>
      </div>
    </div>
  );
}
