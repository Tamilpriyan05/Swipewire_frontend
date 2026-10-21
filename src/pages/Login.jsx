import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import api, { getErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import BrandIcon from '../components/BrandIcon';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: async (payload) => (await api.post('/auth/login', payload)).data.data,
    onSuccess: (data) => {
      signIn(data);
      toast.success('Welcome back!');
      navigate(location.state?.from || (data.user.role === 'admin' ? '/admin' : '/'), { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const submit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-card transition-all">
      <div className="grid md:grid-cols-12">
        {/* Left Visual Brand Panel (5 cols on md/lg) */}
        <div className="relative hidden md:flex md:col-span-5 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 p-8 lg:p-10 text-white">
          <div className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-violet-500/20 blur-2xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 font-bold tracking-tight text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md">
                <BrandIcon size={20} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tight">
                Swipe<span className="text-indigo-400">Wire</span>
              </span>
            </Link>

            <div className="mt-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <Sparkles size={12} className="text-amber-400" /> Secure Member Portal
              </span>
              <h1 className="mt-4 text-2xl lg:text-3xl font-black tracking-tight text-white">
                Access your store inventory.
              </h1>
              <p className="mt-3 text-xs lg:text-sm leading-relaxed text-indigo-100/80">
                Log in with your verified credentials to browse, manage, or audit product specifications in real-time.
              </p>
            </div>
          </div>

          {/* <div className="relative z-10 space-y-2.5 border-t border-indigo-900/60 pt-6 text-xs text-indigo-200/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
              <span>Full Real-Time Inventory Control</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
              <span>Instant SKU & Image Synchronization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
              <span>Encrypted JWT Session Security</span>
            </div>
          </div> */}
        </div>

        {/* Right Form Area (7 cols on md/lg) */}
        <div className="md:col-span-7 p-6 sm:p-10 lg:p-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50">
              <LogIn size={22} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Secure Sign In
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Enter your email and password to access your account.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-lg disabled:opacity-60"
            >
              {mutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register link */}
          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
