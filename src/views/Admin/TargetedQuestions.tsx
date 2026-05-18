import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Common';
import { safeFetch } from '../../lib/fetchUtils';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function TargetedQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const [question, setQuestion] = useState('');
  const [studentId, setStudentId] = useState('');

  const fetchData = async () => {
    try {
      const [qData, sData] = await Promise.all([
        safeFetch('/api/targeted-questions'),
        safeFetch('/api/admin/users')
      ]);
      setQuestions(qData);
      const activeStudents = sData.filter((u: any) => u.role === 'STUDENT' && u.accountStatus === 'ACTIVE');
      setStudents(activeStudents);
      if (activeStudents.length > 0 && !studentId) setStudentId(activeStudents[0].id);
    } catch (e: any) {
      console.error('Fetch Data Failed:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    if (!studentId) return toast.error('Student is required');
    try {
      await safeFetch('/api/targeted-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, studentId })
      });
      toast.success('Question added');
      setQuestion('');
      fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to add question');
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await safeFetch(`/api/targeted-questions?id=${id}`, { method: 'DELETE' });
      toast.success('Question deactivated');
      fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">Targeted Questions</h1>
          <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">Manage Custom Report Prompts</p>
        </div>
      </div>
      
      <div className="flex gap-6">
         <Card className="p-6 w-1/3 h-fit sticky top-24 border-[#E5E7EB]">
             <h2 className="font-bold text-sm mb-4">Add Question</h2>
             <form onSubmit={handleCreate} className="space-y-4">
                 <Input label="Question text" value={question} onChange={setQuestion} required />
                 <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Target Student</label>
                    <select className="w-full h-11 px-3 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:bg-white text-sm" value={studentId} onChange={e => setStudentId(e.target.value)} required>
                        <option value="">Select Student...</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>
                 <Button type="submit" className="w-full">Create Question</Button>
             </form>
         </Card>
      
         <div className="flex-1 space-y-4">
            {questions.map(q => (
                <Card key={q.id} className="p-5 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="w-full">
                        <p className="font-medium text-[#0A0A0A]">{q.question}</p>
                        <div className="flex justify-between w-full mt-3">
                           <span className="text-xs text-[#6B7280] font-medium">Targeted: {students.find(s => s.id === q.studentId)?.name || 'Unknown User'}</span>
                           <Button variant="outline" className="text-red-600 border-transparent hover:bg-red-50 p-1 px-3 h-auto" onClick={() => handleDeactivate(q.id)}>
                              <Trash2 className="w-3 h-3 mr-2" /> Disable
                           </Button>
                        </div>
                    </div>
                </Card>
            ))}
            {questions.length === 0 && (
                <Card className="p-12 text-center text-[#6B7280]">
                    <h3 className="font-medium text-gray-900 mb-1">No Questions Yet</h3>
                    <p className="text-sm">Create targeted questions to show on the weekly report.</p>
                </Card>
            )}
         </div>
      </div>
    </div>
  );
}
