import { useState } from 'react';
import { Card, Button, Input } from '../../components/ui/Common';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export function StudentReportWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    energy: 5, mood: 5, attendance: 100, confidence: 5,
    weeklyTopic: '',
    highlights: '',
    academicProgress: '',
    classExperience: '',
    events: '',
    upcomingEvents: '',
    challengesTags: [] as string[],
    challengesText: '',
    needsSupport: false,
    supportNeeded: '',
    reflection: '',
    goals: ''
  });

  // Example classes (In real app, fetch from /api/student/classes)
  const classes = [
    { id: '1', name: 'Frontend React' },
    { id: '2', name: 'Professional Skills' }
  ];

  const [classRatings, setClassRatings] = useState<Record<string, string>>({});
  
  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        challengesTags: JSON.stringify(formData.challengesTags),
        classRatings: Object.entries(classRatings).map(([classId, rating]) => ({ classId, rating }))
      };
      const res = await fetch('/api/reports', { credentials: "include", 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, status: 'SUBMITTED' })
      });
      if (!res.ok) throw new Error('Submission failed');
      toast.success('Report submitted successfully!');
      setTimeout(() => { window.location.href = '/student'; }, 1000);
    } catch(e) {
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const performanceLabels = ['EXCEEDING', 'MEETING', 'APPROACHING', 'BEGINNING'];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
         <h1 className="text-3xl font-black font-display tracking-tight text-[#0A0A0A]">Weekly Report</h1>
         <p className="text-[#6B7280] text-sm mt-1">Reflect on your progress and share updates with your coach.</p>
      </div>

      <div className="flex gap-2 mb-8">
         {[1,2,3,4,5,6].map(s => (
            <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-[#FF7A00]' : 'bg-[#E5E7EB]'}`} />
         ))}
      </div>

      <Card className="p-8 bg-white min-h-[400px]">
         <AnimatePresence mode="wait">
            {step === 1 && (
               <motion.div key="s1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-4">Check-In</h2>
                  <div className="space-y-4">
                     <div>
                        <label className="text-sm font-bold block mb-2">Energy this week (1-10)</label>
                        <input type="range" min="1" max="10" value={formData.energy} onChange={e => setFormData(f => ({...f, energy: Number(e.target.value)}))} className="w-full accent-[#FF7A00]" />
                        <div className="text-center font-bold text-[#FF7A00]">{formData.energy}</div>
                     </div>
                     <div>
                        <label className="text-sm font-bold block mb-2">Mood (1-10)</label>
                        <input type="range" min="1" max="10" value={formData.mood} onChange={e => setFormData(f => ({...f, mood: Number(e.target.value)}))} className="w-full accent-[#FF7A00]" />
                        <div className="text-center font-bold text-[#FF7A00]">{formData.mood}</div>
                     </div>
                     <Input label="What's the main thing you want to discuss with your coach this week?" value={formData.weeklyTopic} onChange={v => setFormData(f => ({...f, weeklyTopic: v}))} required />
                  </div>
                  <div className="flex justify-end pt-4"><Button onClick={handleNext}>Next Step</Button></div>
               </motion.div>
            )}

            {step === 2 && (
               <motion.div key="s2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-4">Classes Performance</h2>
                  <div className="space-y-8">
                     {classes.map(c => (
                        <div key={c.id} className="p-4 border rounded-xl">
                            <h3 className="font-bold mb-4">{c.name}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                               {performanceLabels.map(l => (
                                  <button 
                                    key={l} 
                                    onClick={() => setClassRatings(r => ({...r, [c.id]: l}))}
                                    className={`p-2 text-xs font-bold rounded-lg border-2 transition-all ${classRatings[c.id] === l ? 'border-[#FF7A00] bg-[#FFF4EB] text-[#FF7A00]' : 'border-transparent bg-[#F5F5F5] text-[#6B7280] hover:bg-[#E5E7EB]'}`}
                                  >
                                     {l}
                                  </button>
                               ))}
                            </div>
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={handleBack}>Back</Button>
                     <Button onClick={handleNext} disabled={Object.keys(classRatings).length !== classes.length}>Next Step</Button>
                  </div>
               </motion.div>
            )}
            
            {step === 3 && (
               <motion.div key="s3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-4">Progress & Events</h2>
                  <Input label="What did you work on or learn this week?" value={formData.academicProgress} onChange={v => setFormData(f => ({...f, academicProgress: v}))} />
                  <Input label="What important events happened this week?" value={formData.events} onChange={v => setFormData(f => ({...f, events: v}))} />
                  <Input label="What upcoming events, deadlines, or meetings should your coach know about?" value={formData.upcomingEvents} onChange={v => setFormData(f => ({...f, upcomingEvents: v}))} required />
                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={handleBack}>Back</Button>
                     <Button onClick={handleNext}>Next Step</Button>
                  </div>
               </motion.div>
            )}

            {step === 4 && (
               <motion.div key="s4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-4">Challenges</h2>
                  <div className="flex flex-wrap gap-2">
                     {['Academic', 'Personal', 'Health', 'Time Management', 'Financial', 'Technology'].map(tag => (
                        <button 
                          key={tag}
                          onClick={() => setFormData(f => ({
                             ...f, 
                             challengesTags: f.challengesTags.includes(tag) ? f.challengesTags.filter(t => t !== tag) : [...f.challengesTags, tag]
                          }))}
                          className={`px-4 py-2 rounded-full text-sm font-bold border ${formData.challengesTags.includes(tag) ? 'bg-[#16A34A] text-white border-[#16A34A]' : 'bg-white text-[#6B7280] hover:bg-[#F5F5F5]'}`}
                        >
                           {tag}
                        </button>
                     ))}
                  </div>
                  <Input label="Describe any specific challenges" value={formData.challengesText} onChange={v => setFormData(f => ({...f, challengesText: v}))} />
                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={handleBack}>Back</Button>
                     <Button onClick={handleNext}>Next Step</Button>
                  </div>
               </motion.div>
            )}

            {step === 5 && (
               <motion.div key="s5" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-4">Support</h2>
                  <div className="flex items-center gap-4 p-4 border rounded-xl">
                     <input type="checkbox" className="w-5 h-5 accent-[#FF7A00]" checked={formData.needsSupport} onChange={e => setFormData(f => ({...f, needsSupport: e.target.checked}))} />
                     <span className="font-bold">I need support from my coach or PM this week.</span>
                  </div>
                  {formData.needsSupport && (
                     <Input label="What kind of support do you need?" value={formData.supportNeeded} onChange={v => setFormData(f => ({...f, supportNeeded: v}))} required />
                  )}
                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={handleBack}>Back</Button>
                     <Button onClick={handleNext}>Next Step</Button>
                  </div>
               </motion.div>
            )}

            {step === 6 && (
               <motion.div key="s6" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-4">Goals & Reflection</h2>
                  <div className="space-y-4">
                    <div>
                       <label className="text-sm font-bold mb-2 block">Write your closing reflection in 3-5 sentences.</label>
                       <textarea className="w-full h-32 p-3 bg-[#F5F5F5] border border-[#E5E7EB] rounded-xl outline-none" value={formData.reflection} onChange={e => setFormData(f => ({...f, reflection: e.target.value}))} required />
                    </div>
                    <Input label="Goals for next week" value={formData.goals} onChange={v => setFormData(f => ({...f, goals: v}))} />
                  </div>
                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={handleBack}>Back</Button>
                     <Button onClick={() => {
                        if(window.confirm('Are you sure you want to submit this report? You cannot edit it after submission.')) {
                            handleSubmit();
                        }
                     }} disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</Button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </Card>
    </div>
  );
}
