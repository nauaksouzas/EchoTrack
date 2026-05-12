import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, User as UserIcon, Map, BookOpen, Check } from 'lucide-react';
import { Button, Card, Input, Select } from './ui/Common';
import { PATHWAYS } from '../constants';
import { User } from '../types';

export function SignUpForm({ allUsers, onBack, onSubmit }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    programManagerId: '',
    coachId: '',
    pathway: '',
    instructors: [] as string[],
    classes: [] as string[]
  });

  const availablePMs = useMemo(() => allUsers.filter((u: User) => u.role === 'pm').map((u: User) => ({ id: u.id, name: u.fullName })), [allUsers]);
  const availableCoaches = useMemo(() => allUsers.filter((u: User) => u.role === 'coach').map((u: User) => ({ id: u.id, name: u.fullName })), [allUsers]);

  const selectedPathway = PATHWAYS.find(p => p.id === formData.pathway);
  
  const availableInstructors = selectedPathway?.instructors || [];
  const availableClasses = useMemo(() => {
    return availableInstructors
      .filter(i => formData.instructors.includes(i.name))
      .flatMap(i => i.classes);
  }, [formData.instructors, availableInstructors]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto min-h-screen flex flex-col justify-center p-8 font-sans selection:bg-black selection:text-white">
      <div className="mb-12 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-black transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${step >= i ? 'bg-black' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="mb-10 text-center">
            <h2 className="text-6xl font-black text-black tracking-tighter leading-none mb-4 italic font-display uppercase">
                {step === 1 ? 'IDENTITY' : step === 2 ? 'NODE' : 'ACADEMY'}
            </h2>
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">
                Allocation Phase {step} / Core Logic
            </p>
      </div>

      <Card className="p-10 border-gray-200 shadow-2xl shadow-black/5 rounded-3xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
              <Input 
                label="Legal Full Name" 
                placeholder="Ex: Alex Rivera" 
                className="h-14 bg-gray-50/50 border-gray-200 px-5 rounded-xl font-bold text-black placeholder-gray-500"
                labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                value={formData.fullName} 
                onChange={(v: string) => setFormData({...formData, fullName: v})} 
              />
              <Input 
                label="Official YUU Email" 
                placeholder="alex.rivera@yearup.org" 
                className="h-14 bg-gray-50/50 border-gray-200 px-5 rounded-xl font-bold text-black placeholder-gray-500"
                labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                value={formData.email} 
                onChange={(v: string) => setFormData({...formData, email: v})} 
              />
              <Button className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl font-black text-xs uppercase tracking-widest gap-3" onClick={nextStep} disabled={!formData.fullName || !formData.email}>
                Identity Verified <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
              <Select 
                label="Assigned Program Manager" 
                placeholder="Select PM Node" 
                options={availablePMs} 
                className="h-14 bg-gray-50/50 border-gray-200 rounded-xl text-black"
                labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                value={formData.programManagerId} 
                onChange={(v: string) => setFormData({...formData, programManagerId: v})} 
              />
              <Select 
                label="Primary Student Coach" 
                placeholder="Select Coach Node" 
                options={availableCoaches} 
                className="h-14 bg-gray-50/50 border-gray-200 rounded-xl text-black"
                labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                value={formData.coachId} 
                onChange={(v: string) => setFormData({...formData, coachId: v})} 
              />
              <Select 
                label="Learning Pathway" 
                options={PATHWAYS} 
                className="h-14 bg-gray-50/50 border-gray-200 rounded-xl text-black"
                labelClassName="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2"
                value={formData.pathway} 
                onChange={(v: string) => setFormData({...formData, pathway: v})} 
              />
              <div className="flex gap-4 pt-4">
                <Button variant="ghost" className="flex-1 h-16 font-black uppercase tracking-widest text-[10px] text-gray-600 border border-transparent hover:border-gray-200" onClick={prevStep}>Back</Button>
                <Button className="flex-[2] h-16 bg-black text-white hover:bg-gray-800 rounded-2xl font-black text-xs uppercase tracking-widest" onClick={nextStep} disabled={!formData.programManagerId || !formData.coachId || !formData.pathway}>Allocate Placement</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block px-1">Selected Faculty</label>
                <div className="grid grid-cols-1 gap-3">
                  {availableInstructors.map(inst => (
                    <button
                      key={inst.name}
                      onClick={() => {
                        const next = formData.instructors.includes(inst.name)
                          ? formData.instructors.filter(i => i !== inst.name)
                          : [...formData.instructors, inst.name];
                        setFormData({...formData, instructors: next});
                      }}
                      className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${formData.instructors.includes(inst.name) ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50/30 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-4">
                        <UserIcon className={`w-5 h-5 ${formData.instructors.includes(inst.name) ? 'text-white/80' : 'text-gray-500'}`} />
                        <span className="font-bold text-sm tracking-tight">{inst.name}</span>
                      </div>
                      {formData.instructors.includes(inst.name) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {formData.instructors.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block px-1">Class Allocations</label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-3 custom-scrollbar">
                    {availableClasses.map(cls => (
                      <button
                        key={cls}
                        onClick={() => {
                          const next = formData.classes.includes(cls)
                            ? formData.classes.filter(c => c !== cls)
                            : [...formData.classes, cls];
                          setFormData({...formData, classes: next});
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${formData.classes.includes(cls) ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50/30 hover:border-gray-300'}`}
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className={`w-4 h-4 ${formData.classes.includes(cls) ? 'text-white/80' : 'text-gray-500'}`} />
                          <span className="font-semibold text-xs tracking-tight">{cls}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <Button variant="ghost" className="flex-1 h-16 font-black uppercase tracking-widest text-[10px] text-gray-600 border border-transparent hover:border-gray-200" onClick={prevStep}>Back</Button>
                <Button className="flex-[2] h-16 bg-black text-white hover:bg-gray-800 rounded-2xl font-black text-xs uppercase tracking-widest" onClick={() => onSubmit(formData)} disabled={formData.classes.length === 0}>
                  Initialize Neural Data
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      
      <p className="text-center mt-12 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mx-auto">
        Your professional profile will be audited by the regional hub management.
      </p>
    </motion.div>
  );
}
