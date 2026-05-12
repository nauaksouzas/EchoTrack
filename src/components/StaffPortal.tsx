import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Key, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Card, Input } from './ui/Common';
import { dataService } from '../services/dataService';
import { User } from '../types';

interface StaffPortalProps {
  onBack: () => void;
  onLoginSuccess: (user: User) => void;
}

export function StaffPortal({ onBack, onLoginSuccess }: StaffPortalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      let user = null;
      
      if (normalizedEmail === 'kcasiano@yearupunited.org') {
        user = await dataService.getUser(`pm-kayla`);
      } else {
        user = await dataService.getUser(`staff-${normalizedEmail}`);
      }

      if (user) {
        if (user.role !== 'pm' && user.role !== 'coach' && user.role !== 'instructor') {
            throw new Error("Access Denied: Not a registered staff member.");
        }
        if (user.password !== password) {
            throw new Error("Verification Failed: Invalid credentials.");
        }
        onLoginSuccess(user);
      } else {
        throw new Error("Clearance Required: No seat found for this handle.");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 selection:bg-black selection:text-white relative font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12"
      >
        <div className="space-y-6">
            <button onClick={onBack} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-black transition-all">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Return to Entrance
            </button>
            
            <div className="space-y-2">
                <h1 className="text-6xl font-black tracking-tighter text-black leading-none font-display uppercase italic scale-y-110 origin-left">
                    ACCESS
                </h1>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] italic bg-gray-50 px-3 py-1 w-fit border border-gray-200">United Infrastructure Node</p>
            </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <Input 
              label="Professional Handle" 
              placeholder="user.name@example.org" 
              className="border-gray-200 bg-gray-50/30 h-14 rounded-xl focus:border-black transition-all font-medium text-black placeholder-gray-400"
              labelClassName="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2"
              value={email}
              onChange={setEmail}
            />

            <Input 
              label="Secret Token (Password)" 
              type="password"
              placeholder="••••••••" 
              className="border-gray-200 bg-gray-50/30 h-14 rounded-xl focus:border-black transition-all font-medium text-black placeholder-gray-400"
              labelClassName="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2"
              value={password}
              onChange={setPassword}
            />
          </div>

          {error && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 p-5 rounded-2xl border border-red-200 leading-relaxed"
            >
                {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <Button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full h-16 bg-black text-white hover:bg-gray-900 border-none rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-black/10 transition-transform active:scale-[0.98]"
            >
                {loading ? 'Processing...' : 'Establish Access'}
            </Button>
          </div>
        </div>

        <div className="pt-20 flex flex-col items-center gap-4">
            <div className="w-8 h-[1px] bg-gray-200" />
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-[0.1em] text-center leading-relaxed max-w-[240px]">
                Authorized access only. Managed by Kayla Casiano.
            </p>
        </div>
      </motion.div>
    </div>
  );
}
