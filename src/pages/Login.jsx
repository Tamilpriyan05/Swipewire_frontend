import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import api, { getErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const submit = (e) => { e.preventDefault(); mutation.mutate({ email, password }); };

  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-slate-950 to-indigo-700 p-10 text-white md:flex"><div className="text-sm font-bold">ProductHub</div><div><h1 className="text-3xl font-black">Your catalogue.<br/>One place.</h1><p className="mt-3 text-sm leading-6 text-indigo-100">Sign in to manage your products or explore the catalogue.</p></div><p className="text-xs text-indigo-200">Full-stack developer assessment</p></div>
      <form onSubmit={submit} className="p-6 sm:p-10">
        <div className="mb-6 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-700"><LogIn size={22}/></div>
        <h2 className="text-2xl font-black">Welcome back</h2><p className="mt-2 text-sm text-slate-500">Enter your credentials to continue.</p>
        <label className="mt-6 block text-sm font-semibold">Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"/></label>
        <label className="mt-4 block text-sm font-semibold">Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"/></label>
        <button disabled={mutation.isPending} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700">{mutation.isPending ? 'Signing in...' : 'Sign in'}</button>
        <p className="mt-5 text-center text-sm text-slate-500">New here? <Link to="/register" className="font-bold text-indigo-700">Create an account</Link></p>
      </form>
    </div>
  );
}
