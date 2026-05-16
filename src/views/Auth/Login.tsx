import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../../components/Logo';
import { Button, Input, Card } from '../../components/ui/Common';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 21 21" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#000" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.59-.7h.03c1.55.03 2.83.66 3.65 1.77-3.05 1.78-2.57 5.92.51 7.15-1.05 2.14-2.01 3.52-2.86 4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.36 2.37-1.84 4.32-3.74 4.25z"/>
  </svg>
);

export function Login() {
  const { login, loginWithProvider } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      navigate('/dashboard-redirect');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleProvider = async (provider: 'google' | 'microsoft' | 'apple') => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithProvider(provider);
      navigate('/dashboard-redirect');
    } catch (err: any) {
      if (err.status === 404 && err.email) {
        navigate(`/signup?email=${encodeURIComponent(err.email)}&name=${encodeURIComponent(err.name || '')}`);
        return;
      }
      setErrorMsg(err.message || `${provider} sign-in failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Left — form */}
      <div className="flex-1 flex justify-center items-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-4 shadow-sm">
              <Logo className="w-9 h-9" />
            </div>
            <h1 className="text-3xl font-black font-display tracking-tight text-[#0A0A0A]">EchoTrack</h1>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF7A00] mt-2">KSP Dominion Group</p>
          </div>

          <Card className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Sign in to your account</h2>
            <p className="text-sm text-gray-500 mb-6">Welcome back. Enter your credentials to continue.</p>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={(v: string) => setEmail(v)} />
              <Input label="Password" type="password" value={password} onChange={(v: string) => setPassword(v)} />
              <Button type="submit" disabled={loading} className="w-full h-12 text-base mt-2">
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 uppercase tracking-widest font-bold">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <button type="button" disabled={loading} onClick={() => handleProvider('google')}
                className="relative flex items-center justify-center w-full h-12 px-4 rounded-xl border border-gray-200 bg-white hover:border-[#FF7A00] hover:bg-orange-50/30 transition-colors disabled:opacity-50">
                <div className="absolute left-4"><GoogleIcon /></div>
                <span className="font-semibold text-sm text-gray-700">Continue with Google</span>
              </button>
              <button type="button" disabled={loading} onClick={() => handleProvider('microsoft')}
                className="relative flex items-center justify-center w-full h-12 px-4 rounded-xl border border-gray-200 bg-white hover:border-[#FF7A00] hover:bg-orange-50/30 transition-colors disabled:opacity-50">
                <div className="absolute left-4"><MicrosoftIcon /></div>
                <span className="font-semibold text-sm text-gray-700">Continue with Microsoft</span>
              </button>
              <button type="button" disabled={loading} onClick={() => handleProvider('apple')}
                className="relative flex items-center justify-center w-full h-12 px-4 rounded-xl border border-gray-200 bg-white hover:border-[#FF7A00] hover:bg-orange-50/30 transition-colors disabled:opacity-50">
                <div className="absolute left-4"><AppleIcon /></div>
                <span className="font-semibold text-sm text-gray-700">Continue with Apple</span>
              </button>
            </div>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-600">
            New student? <Link to="/signup" className="text-[#FF7A00] font-semibold hover:underline">Create your account</Link>
          </p>
          <p className="mt-8 text-center text-xs text-gray-400">Secured by KSP Dominion Group · AES-256 · Node Online</p>
        </div>
      </div>

      {/* Right — brand panel */}
      <div className="hidden lg:flex flex-1 bg-[#FF7A00] relative overflow-hidden items-center justify-center px-16">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-md text-white">
          <h2 className="text-5xl font-black font-display tracking-tight leading-[1.05] mb-6">Track student progress, intelligently.</h2>
          <p className="text-lg text-white/90 leading-relaxed font-medium">
            A modern weekly reporting and engagement platform built for structured student success.
          </p>
          <div className="mt-10 flex items-center gap-3 text-white/80 text-sm">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-semibold tracking-wide">Live · Secure · KSP Dominion Group</span>
          </div>
        </div>
      </div>
    </div>
  );
}
