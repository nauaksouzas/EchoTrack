import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Common';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Pathways() {
  const [pathways, setPathways] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchPathways = async () => {
    const res = await fetch('/api/admin/pathways', { credentials: 'include' });
    if (res.ok) {
      setPathways(await res.json());
    }
  };

  useEffect(() => {
    fetchPathways();
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/admin/pathways', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description })
    });
    if (res.ok) {
      toast.success('Pathway created');
      setName('');
      setDescription('');
      fetchPathways();
    } else {
      toast.error('Failed to create');
    }
  };

  const handleDeactivate = async (id: string, activeCount: number) => {
    if (activeCount > 0) {
        toast.error('Cannot deactivate pathway with active students');
        return;
    }
    const res = await fetch(`/api/admin/pathways?id=${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
        toast.success('Pathway deactivated');
        fetchPathways();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">Pathways</h1>
          <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">Manage Educational Tracks</p>
        </div>
      </div>
      
      <div className="flex gap-6">
         <Card className="p-6 w-1/3 h-fit sticky top-24 border-[#E5E7EB]">
             <h2 className="font-bold text-sm mb-4">Add Pathway</h2>
             <form onSubmit={handleCreate} className="space-y-4">
                 <Input label="Name" value={name} onChange={setName} required />
                 <Input label="Description" value={description} onChange={setDescription} />
                 <Button type="submit" className="w-full">Create</Button>
             </form>
         </Card>
      
         <div className="flex-1 space-y-4">
            {pathways.map(p => (
                <Card key={p.id} className="p-5 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div>
                        <h3 className="font-bold text-[#0A0A0A]">{p.name}</h3>
                        <p className="text-xs text-[#6B7280] mt-1">{p.description}</p>
                        <div className="flex gap-4 mt-3 text-xs font-medium text-[#6B7280]">
                            <span>Students: {p.studentsCount}</span>
                            <span>Classes: {p.classesCount}</span>
                        </div>
                    </div>
                    <div>
                       <Button variant="outline" className="text-red-600 border-transparent hover:bg-red-50" onClick={() => handleDeactivate(p.id, p.studentsCount)}>
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                </Card>
            ))}
            {pathways.length === 0 && (
                <Card className="p-12 text-center text-[#6B7280]">
                    <h3 className="font-medium text-gray-900 mb-1">No Pathways Yet</h3>
                    <p className="text-sm">Use the form to create your first pathway.</p>
                </Card>
            )}
         </div>
      </div>
    </div>
  );
}
