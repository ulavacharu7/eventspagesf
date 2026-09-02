'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowLeft, ArrowRight, ShieldCheck, Check, AlertCircle, Edit3 } from 'lucide-react';

function AuthContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'signup') setMode('signup');
    else if (qMode === 'login') setMode('login');
  }, [searchParams]);

  // Sign Up Multi-Step State
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [sentCode, setSentCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  // Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Messages
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Send Verification Email
  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');

      setSentCode(data.code);
      setSignupStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (enteredOtp.trim() !== sentCode.trim()) {
      setError('Invalid 6-digit code. Please check your email.');
      return;
    }

    setSignupStep(3);
  };

  // Complete Registration
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || email.split('@')[0], email, password })
      });
      const data = await res.json();

      const redirectUrl = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/';
      localStorage.setItem('student_forge_user', JSON.stringify(data.user));
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 800);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password - Step 1
  const handleSendForgotCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, checkUserExists: true })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');

      setSentCode(data.code);
      setForgotStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password - Step 2
  const handleVerifyForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (enteredOtp.trim() !== sentCode.trim()) {
      setError('Invalid 6-digit code. Please check your email.');
      return;
    }

    setForgotStep(3);
  };

  // Forgot Password - Step 3
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setSuccessMsg('Password reset successfully! Redirecting...');
      setTimeout(() => {
        setMode('login');
        setForgotStep(1);
        setError('');
        setSuccessMsg('');
        setPassword('');
        setConfirmPassword('');
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid credentials');

      const redirectUrl = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/';
      localStorage.setItem('student_forge_user', JSON.stringify(data.user));
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 800);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0d0d0f] text-white flex flex-col justify-center items-center px-4 py-12 antialiased font-tight select-none">
      
      {/* Top Left: Return Home */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors bg-[#18181c]/80 border border-white/10 hover:border-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* Auth Container Card */}
      <div className="w-full max-w-[390px] mx-auto z-10 relative flex flex-col gap-6">
        
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center p-1 transition-transform hover:scale-105">
            <img
              src="https://ik.imagekit.io/dypkhqxip/sf-events-svg?updatedAt=1787505496001"
              alt="Student Forge"
              className="h-9 w-auto object-contain opacity-90 hover:opacity-100"
              style={{ filter: 'brightness(0) invert(0.88)' }}
              draggable={false}
            />
          </Link>

          <div className="flex flex-col gap-1.5 mt-1">
            <h1 className="font-instrument-serif text-3xl sm:text-4xl text-white font-normal tracking-[-0.8px] leading-tight">
              {mode === 'login'
                ? 'Welcome Back'
                : mode === 'signup'
                ? (signupStep === 1
                  ? 'Create an Account'
                  : signupStep === 2
                  ? 'Verify Email'
                  : 'Set Password')
                : (forgotStep === 1
                  ? 'Reset Password'
                  : forgotStep === 2
                  ? 'Verify OTP'
                  : 'New Password')}
            </h1>

            <p className="font-tight text-xs text-white/50 font-normal leading-relaxed max-w-xs">
              {mode === 'login'
                ? 'Sign in to access your event dashboard and passes'
                : mode === 'signup'
                ? (signupStep === 1
                  ? 'Enter your email to receive a verification code'
                  : signupStep === 2
                  ? 'Enter the 6-digit code to verify your email'
                  : 'Set up your name and account password')
                : (forgotStep === 1
                  ? 'Enter your email to receive a recovery code'
                  : forgotStep === 2
                  ? 'Enter the 6-digit code to verify your identity'
                  : 'Enter and confirm your new password')}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#141417] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4">
          
          {/* Feedback Messages */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-[12px] text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[12px] text-xs text-emerald-300 flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-white/40 pl-1">Email Address</span>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between pl-1">
                  <span className="text-[11px] font-mono text-white/40">Password</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotStep(1);
                      setError('');
                      setSuccessMsg('');
                      setEnteredOtp('');
                      setPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-[11px] font-tight text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-11 w-full rounded-full bg-white text-zinc-950 font-tight font-semibold text-xs sm:text-sm transition-all hover:bg-zinc-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <>
              {signupStep === 1 && (
                <form onSubmit={handleSendVerificationCode} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-mono text-white/40 pl-1">Email Address</span>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="student@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 h-11 w-full rounded-full bg-white text-zinc-950 font-tight font-semibold text-xs sm:text-sm transition-all hover:bg-zinc-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Sending code...' : 'Continue with Email'}</span>
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}

              {signupStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  {/* Clean indication banner with email & edit link */}
                  <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Sent code to</span>
                        <span className="text-white font-medium truncate">{email}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="text-[11px] text-white/60 hover:text-white underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[11px] font-mono text-white/40 pl-1 text-center">Enter 6-Digit Code</span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        required
                        className="h-12 w-full rounded-full border border-white/10 bg-[#0d0d0f] text-center font-mono tracking-[0.4em] text-lg font-bold text-white placeholder-white/20 outline-none transition-all focus:border-white/30 focus:bg-[#111114]"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 h-11 w-full rounded-full bg-white text-zinc-950 font-tight font-semibold text-xs sm:text-sm transition-all hover:bg-zinc-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {signupStep === 3 && (
                <form onSubmit={handleCompleteRegistration} className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-mono text-white/40 pl-1">Full Name</span>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-mono text-white/40 pl-1">Password</span>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-mono text-white/40 pl-1">Confirm Password</span>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 h-11 w-full rounded-full bg-white text-zinc-950 font-tight font-semibold text-xs sm:text-sm transition-all hover:bg-zinc-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Creating...' : 'Complete Sign Up'}</span>
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <>
              {forgotStep === 1 && (
                <form onSubmit={handleSendForgotCode} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-mono text-white/40 pl-1">Account Email</span>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="student@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 h-11 w-full rounded-full bg-white text-zinc-950 font-tight font-semibold text-xs sm:text-sm transition-all hover:bg-zinc-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Sending code...' : 'Send Recovery Code'}</span>
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleVerifyForgotOtp} className="flex flex-col gap-4">
                  {/* Clean indication banner */}
                  <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Sent code to</span>
                        <span className="text-white font-medium truncate">{email}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="text-[11px] text-white/60 hover:text-white underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[11px] font-mono text-white/40 pl-1 text-center">Enter 6-Digit Code</span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        required
                        className="h-12 w-full rounded-full border border-white/10 bg-[#0d0d0f] text-center font-mono tracking-[0.4em] text-lg font-bold text-white placeholder-white/20 outline-none transition-all focus:border-white/30 focus:bg-[#111114]"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 h-11 w-full rounded-full bg-white text-zinc-950 font-tight font-semibold text-xs sm:text-sm transition-all hover:bg-zinc-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-mono text-white/40 pl-1">New Password</span>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-mono text-white/40 pl-1">Confirm New Password</span>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-11 w-full rounded-full border border-white/10 bg-[#0d0d0f] pl-10 pr-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30 focus:bg-[#111114] font-tight"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 h-11 w-full rounded-full bg-white text-zinc-950 font-tight font-semibold text-xs sm:text-sm transition-all hover:bg-zinc-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Switch links at bottom */}
          <div className="text-center pt-3 border-t border-white/5">
            {mode === 'login' ? (
              <p className="text-xs text-white/50 font-tight">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setSuccessMsg('');
                    setSignupStep(1);
                  }}
                  className="text-white underline hover:opacity-80 font-medium cursor-pointer ml-1"
                >
                  Sign up
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p className="text-xs text-white/50 font-tight">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-white underline hover:opacity-80 font-medium cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMsg('');
                  setForgotStep(1);
                }}
                className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                Back to Sign in
              </button>
            )}
          </div>

        </div>

      </div>

    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0f] text-white flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
