import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Common';
import { toast } from 'sonner';

export function Settings() {
  const [settings, setSettings] = useState<any>({});
  
  useEffect(() => {
    fetch('/api/admin/settings', { credentials: "include" })
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/admin/settings', { credentials: "include", 
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      toast.success('Settings saved successfully');
    } else {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">Settings</h1>
            <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">Application Configuration</p>
         </div>
       </div>

       <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
           <Card className="p-6 space-y-4">
             <h2 className="font-bold text-sm mb-4 border-b pb-2">Organization & Branding</h2>
             <Input 
               label="Organization Name" 
               value={settings.organizationName || ''} 
               onChange={v => setSettings({...settings, organizationName: v})}
             />
             <Input 
               label="Product Name" 
               value={settings.productName || ''} 
               onChange={v => setSettings({...settings, productName: v})}
             />
             <Input 
               label="Primary Color (Hex)" 
               value={settings.primaryColor || ''} 
               onChange={v => setSettings({...settings, primaryColor: v})}
             />
           </Card>

           <Card className="p-6 space-y-4">
             <h2 className="font-bold text-sm mb-4 border-b pb-2">Reporting Cycle</h2>
             <div>
                 <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Weekly Due Day</label>
                 <select className="w-full h-11 px-3 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB]" value={settings.weeklyDueDay || 5} onChange={e => setSettings({...settings, weeklyDueDay: parseInt(e.target.value)})}>
                    <option value={0}>Sunday</option>
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                 </select>
             </div>
             <Input 
               label="Weekly Due Hour (0-23)" 
               type="number"
               value={settings.weeklyDueHour || 17} 
               onChange={v => setSettings({...settings, weeklyDueHour: v})}
             />
             <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="autoClose" checked={settings.autoCloseCycles || false} onChange={e => setSettings({...settings, autoCloseCycles: e.target.checked})} />
                <label htmlFor="autoClose" className="text-sm font-medium">Auto-close cycles at due date</label>
             </div>
           </Card>

           <Card className="p-6 space-y-4">
             <h2 className="font-bold text-sm mb-4 border-b pb-2">Alert Thresholds</h2>
             <Input 
               label="Low Energy Trigger (Below X out of 10)" 
               type="number"
               value={settings.alertThresholdEnergy || 3} 
               onChange={v => setSettings({...settings, alertThresholdEnergy: v})}
             />
             <Input 
               label="Low Mood Trigger (Below X out of 10)" 
               type="number"
               value={settings.alertThresholdMood || 3} 
               onChange={v => setSettings({...settings, alertThresholdMood: v})}
             />
             <Input 
               label="Low Attendance Trigger (Below X%)" 
               type="number"
               value={settings.alertThresholdAttend || 70} 
               onChange={v => setSettings({...settings, alertThresholdAttend: v})}
             />
             <Input 
               label="Low Confidence Trigger (Below X out of 10)" 
               type="number"
               value={settings.alertThresholdConf || 3} 
               onChange={v => setSettings({...settings, alertThresholdConf: v})}
             />
           </Card>

           <Card className="p-6 space-y-4">
             <h2 className="font-bold text-sm mb-4 border-b pb-2">External Integrations</h2>
             <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="outlook" checked={settings.outlookEnabled || false} onChange={e => setSettings({...settings, outlookEnabled: e.target.checked})} />
                <label htmlFor="outlook" className="text-sm font-medium">Enable Microsoft Outlook Calendar Sync</label>
             </div>
             <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="bright" checked={settings.brightspaceEnabled || false} onChange={e => setSettings({...settings, brightspaceEnabled: e.target.checked})} />
                <label htmlFor="bright" className="text-sm font-medium">Enable Brightspace D2L LMS Sync</label>
             </div>
           </Card>

           <div className="md:col-span-2 pt-4">
             <Button type="submit" className="w-full md:w-auto">Save Global Settings</Button>
           </div>
       </form>
    </div>
  );
}
