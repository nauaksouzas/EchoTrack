import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Common';
import { Copy, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export function ProgramManagers() {
  const [pms, setPms] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchPms = async () => {
    const res = await fetch('/api/admin/invite', { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setPms(data);
    }
  };

  useEffect(() => {
    fetchPms();
  }, []);

  const handleInvite = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/admin/invite', { credentials: "include", 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role: 'PROGRAM_MANAGER' })
    });
    if (res.ok) {
      toast.success('Program Manager invited!');
      setName('');
      setEmail('');
      fetchPms();
    } else {
      const err = await res.json();
      toast.error(err.error || 'Failed to invite');
    }
  };

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/setup-account?token=${token}`);
    toast.success('Setup link copied to clipboard');
  };

  const handleDeactivate = async (id: string) => {
    const res = await fetch(`/api/admin/invite?id=${id}`, { credentials: "include",  method: 'DELETE' });
    if (res.ok) {
      toast.success('User deactivated');
      fetchPms();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">Program Managers</h1>
            <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">Directory & Invites</p>
         </div>
      </div>

      <div className="flex gap-6">
        <div className="w-1/3">
           <Card className="p-6 bg-white sticky top-24">
             <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                 <Building2 className="w-4 h-4 text-[#FF7A00]" /> Add Program Manager
             </h2>
             <form onSubmit={handleInvite} className="space-y-4">
                <Input label="Full Name" value={name} onChange={setName} required />
                <Input label="Email Address" type="email" value={email} onChange={setEmail} required />
                <Button type="submit" className="w-full">Send Invite</Button>
             </form>
           </Card>
        </div>
        
        <div className="flex-1 space-y-4">
           {pms.map(pm => (
             <Card key={pm.id} className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#FFF4EB] text-[#FF7A00] flex items-center justify-center font-bold text-lg">
                   {pm.name[0]}
                 </div>
                 <div>
                   <p className="font-bold text-[#0A0A0A]">{pm.name}</p>
                   <p className="text-xs text-[#6B7280]">{pm.email}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-4">
                 {pm.accountStatus === 'INVITED' && (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-orange-50 text-orange-600 border border-orange-200">Invited</span>
                 )}
                 {pm.accountStatus === 'ACTIVE' && (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Active</span>
                 )}
                 {pm.accountStatus === 'DEACTIVATED' && (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-red-50 text-red-600 border border-red-200">Deactivated</span>
                 )}
                 
                 <div className="flex gap-2">
                   {pm.accountStatus === 'INVITED' && pm.inviteToken && (
                     <Button variant="outline" onClick={() => copyLink(pm.inviteToken)} className="h-8 px-3 text-xs">
                       <Copy className="w-3 h-3 mr-2" /> Link
                     </Button>
                   )}
                   {pm.accountStatus !== 'DEACTIVATED' && (
                     <Button variant="outline" onClick={() => handleDeactivate(pm.id)} className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent">
                        <Trash2 className="w-3 h-3" />
                     </Button>
                   )}
                 </div>
               </div>
             </Card>
           ))}
           {pms.length === 0 && (
             <div className="p-12 text-center border-2 border-dashed border-[#E5E7EB] rounded-2xl text-[#6B7280] font-medium text-sm">
               No program managers found. Invite one to get started.
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
