import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trash2, Plus, ShieldCheck } from 'lucide-react';
import { Button, Card, Input } from './ui/Common';
import { User, WeeklyReport, CustomQuestion, Grade } from '../types';

interface ReportFormProps {
  user: User;
  questions: CustomQuestion[];
  onCancel: () => void;
  onSubmit: (report: Partial<WeeklyReport>) => void;
}

const GRADE_OPTIONS: Grade[] = ['Beginning', 'Developing', 'Approaching', 'Proficient', 'Exceeding'];

export function ReportForm({ user, questions, onCancel, onSubmit }: ReportFormProps) {
  const [formData, setFormData] = useState({
    topicToDiscuss: '',
    highlights: [''],
    grades: (user.classes || []).reduce((acc: any, cls: string) => ({ ...acc, [cls]: 'Proficient' }), {}),
    modulesLessons: '',
    feelingsClasses: '',
    feelingsInstructors: '',
    pastWeekEvents: '',
    upcomingEvents: '',
    closingReflection: '',
    customQuestionAnswers: {} as any
  });

  const addHighlight = () => {
    if (formData.highlights.length < 5) {
      setFormData({ ...formData, highlights: [...formData.highlights, ''] });
    }
  };

  const updateHighlight = (index: number, value: string) => {
    const next = [...formData.highlights];
    next[index] = value;
    setFormData({ ...formData, highlights: next });
  };

  const removeHighlight = (index: number) => {
    if (formData.highlights.length > 1) {
      setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = () => {
    const cleanedHighlights = formData.highlights.filter(h => h.trim() !== '');
    if (!formData.topicToDiscuss.trim()) {
      alert("System Error: Topic to discuss is required.");
      return;
    }
    if (!formData.closingReflection.trim()) {
      alert("System Error: Final Terminal Reflection is required.");
      return;
    }
    onSubmit({ ...formData, highlights: cleanedHighlights });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-12 flex items-center justify-between">
        <button onClick={onCancel} className="text-gray-600 hover:text-black transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Abort System Audit
        </button>
        <h2 className="text-4xl font-black text-black tracking-tighter leading-none font-display uppercase italic">Weekly Audit</h2>
        <div className="w-24 h-[1px] bg-gray-100 hidden md:block" /> 
      </div>

      <div className="space-y-8">
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-black font-black uppercase tracking-[0.4em] text-[10px]">
            <div className="h-1.5 w-1.5 rounded-full bg-black" />
            Greeting / Topic Selection
          </div>
          <Card className="p-8 border-gray-100 rounded-3xl shadow-sm">
            <Input 
              label="Primary discussion point for this session?" 
              placeholder="Ex: Time management, Career track, Technical roadblocks..." 
              value={formData.topicToDiscuss}
              onChange={(v: string) => setFormData({...formData, topicToDiscuss: v})}
              labelClassName="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2"
              className="h-14 bg-gray-50/50 border-gray-200 px-5 rounded-xl font-bold text-black placeholder-gray-500"
            />
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-black font-black uppercase tracking-[0.4em] text-[10px]">
             <div className="h-1.5 w-1.5 rounded-full bg-black" />
            Performance Highlights
          </div>
          <Card className="p-8 space-y-6 border-gray-100 rounded-3xl shadow-sm">
            {formData.highlights.map((h, i) => (
              <div key={i} className="flex gap-4">
                <Input 
                  className="flex-1 h-14 bg-gray-50/50 border-gray-200 px-5 rounded-xl font-bold text-black" 
                  placeholder={`High-velocity milestone #${i+1}`} 
                  value={h} 
                  onChange={(v: string) => updateHighlight(i, v)} 
                  labelClassName="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2"
                />
                <Button variant="ghost" onClick={() => removeHighlight(i)} className="px-4 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
            {formData.highlights.length < 5 && (
              <Button variant="ghost" className="w-full border-2 border-dashed border-gray-200 h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-black hover:border-black transition-all" onClick={addHighlight}>
                <Plus className="w-4 h-4 mr-2" /> Log Additional Milestone
              </Button>
            )}
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-black font-black uppercase tracking-[0.4em] text-[10px]">
             <div className="h-1.5 w-1.5 rounded-full bg-black" />
            Academic Node Status
          </div>
          <Card className="p-8 space-y-10 border-gray-100 rounded-3xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(user.classes || []).map((cls: string) => (
                <div key={cls} className="space-y-4">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest truncate block italic">{cls}</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADE_OPTIONS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({...formData, grades: {...formData.grades, [cls]: g}})}
                        className={`px-3 py-2 rounded-xl text-[9px] font-black transition-all border-2 uppercase tracking-tight ${formData.grades[cls] === g ? 'bg-black border-black text-white shadow-xl shadow-black/20' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50/50'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-gray-100" />
            <Input 
              label="Active Learning Modules (Current Chapter)" 
              placeholder="Identify the technical focus of this cycle" 
              value={formData.modulesLessons}
              onChange={(v: string) => setFormData({...formData, modulesLessons: v})}
              labelClassName="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2"
              className="h-14 bg-gray-50/50 border-gray-200 px-5 rounded-xl font-bold text-black placeholder-gray-500"
            />
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-black font-black uppercase tracking-[0.4em] text-[10px]">
             <div className="h-1.5 w-1.5 rounded-full bg-black" />
            Environment Reflection
          </div>
          <Card className="p-8 space-y-8 border-gray-100 rounded-3xl shadow-sm">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Atmosphere / Academic Velocity</label>
              <textarea 
                className="w-full px-6 py-5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none h-32 transition-all font-medium text-sm text-black placeholder:text-gray-500"
                placeholder="Detailed sentiment analysis regarding current coursework..."
                value={formData.feelingsClasses}
                onChange={(e) => setFormData({...formData, feelingsClasses: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Faculty Interaction Audit</label>
              <textarea 
                className="w-full px-6 py-5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none h-32 transition-all font-medium text-sm text-black placeholder:text-gray-500"
                placeholder="Observations and sentiment regarding instructor engagement..."
                value={formData.feelingsInstructors}
                onChange={(e) => setFormData({...formData, feelingsInstructors: e.target.value})}
              />
            </div>
          </Card>
        </section>

        {questions.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-black font-black uppercase tracking-[0.4em] text-[10px]">
               <div className="h-1.5 w-1.5 rounded-full bg-black" />
              Special Management Inquiries
            </div>
            <Card className="p-8 space-y-8 border-gray-100 rounded-3xl shadow-sm">
              {questions.map((q) => (
                <div key={q.id} className="space-y-3">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest italic">{q.text}</label>
                  <textarea 
                    className="w-full px-6 py-5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-black outline-none h-28 transition-all font-medium text-sm text-black placeholder:text-gray-500"
                    placeholder="Terminal response required..."
                    value={formData.customQuestionAnswers[q.id] || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      customQuestionAnswers: { ...formData.customQuestionAnswers, [q.id]: e.target.value } 
                    })}
                  />
                </div>
              ))}
            </Card>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-black font-black uppercase tracking-[0.4em] text-[10px]">
             <div className="h-1.5 w-1.5 rounded-full bg-black" />
            Audit Closure
          </div>
          <Card className="p-8 border-black bg-black text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-all duration-1000 rotate-12">
               <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
                <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">Final Terminal Reflection</label>
                <textarea 
                className="w-full px-6 py-5 rounded-2xl border border-white/20 bg-white/5 focus:bg-white/10 focus:border-white/40 outline-none h-40 transition-all text-white placeholder:text-white/50 font-medium"
                placeholder="Summarize the week's professional evolution (3-5 sentences)..."
                required
                value={formData.closingReflection}
                onChange={(e) => setFormData({...formData, closingReflection: e.target.value})}
                />
            </div>
          </Card>
        </section>

        <div className="pt-12 flex gap-6">
          <Button variant="ghost" className="flex-1 h-16 text-[11px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-100 hover:text-black border border-gray-200" onClick={onCancel}>Stash Progress</Button>
          <Button className="flex-[2] h-18 bg-black text-white hover:bg-gray-900 border-none rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={handleSubmit}>
            Transmit Telemetry
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
