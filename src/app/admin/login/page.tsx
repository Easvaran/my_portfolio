'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, Loader2, AlertCircle, Mail, Key, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot' | 'otp' | 'reset'>('login');
  
  // Forgot Password States
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth && auth !== 'undefined' && auth !== null) {
      // Basic check, the real check happens in API
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('admin_auth', data.password);
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Connection error. Please check your database.');
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Verification code sent to your email.');
        setTimeout(() => {
          setSuccess('');
          setView('otp');
        }, 1500);
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Failed to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }
    setView('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          setSuccess('');
          setView('login');
          setPassword('');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Failed to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Site</span>
        </Link>

        <div className="p-8 md:p-10 rounded-[40px] bg-card border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/50">
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col items-center mb-10 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner shadow-primary/20">
                    <Lock size={36} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-white mb-3">Admin Portal</h1>
                  <p className="text-muted-foreground font-medium">Authentication required to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Admin Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full pl-12 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white font-bold"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Security Key
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white font-mono text-xl tracking-widest placeholder:text-white/10 placeholder:tracking-normal"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => setView('forgot')}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span>Authorize Access</span>
                        <Lock size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col items-center mb-10 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 shadow-inner">
                    <Mail size={36} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-white mb-3">Reset Password</h1>
                  <p className="text-muted-foreground font-medium">Enter your admin email to receive a code</p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-white text-lg font-bold"
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold flex items-center gap-3">
                      <CheckCircle2 size={16} />
                      {success}
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Send Verification Code</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
                    >
                      Return to Login
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {view === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col items-center mb-10 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 shadow-inner">
                    <Key size={36} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-white mb-3">Verify OTP</h1>
                  <p className="text-muted-foreground font-medium text-sm">Enter the 6-digit code sent to <br/><span className="text-white font-bold">{email}</span></p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-white text-center text-4xl font-black tracking-[0.5em] placeholder:tracking-normal placeholder:opacity-10"
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3"
                    >
                      Verify Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
                    >
                      Resend Email
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {view === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col items-center mb-10 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 shadow-inner">
                    <ShieldCheck size={36} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-white mb-3">New Password</h1>
                  <p className="text-muted-foreground font-medium">Create a new secure key for your account</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      New Security Key
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-white font-mono text-xl tracking-widest"
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold flex items-center gap-3">
                      <CheckCircle2 size={16} />
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-green-500/25 flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Update Password</span>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-30">
              Protected Environment &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
