import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (payload) => (await api.post('/auth/register', payload)).data.data,
    onSuccess: (data) => { signIn(data); toast.success('Account created successfully.'); navigate('/'); },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); mutation.mutate(form); };

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
      <h1 className="text-2xl font-black">Create an account</h1><p className="mt-2 text-sm text-slate-500">New public accounts are assigned the customer role.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">Name<input name="name" minLength="2" required value={form.name} onChange={change} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-indigo-500"/></label>
        <label className="block text-sm font-semibold">Email<input name="email" type="email" required value={form.email} onChange={change} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-indigo-500"/></label>
        <label className="block text-sm font-semibold">Password<input name="password" type="password" minLength="8" required value={form.password} onChange={change} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-indigo-500"/><span className="mt-1 block text-xs font-normal text-slate-500">At least 8 characters.</span></label>
        <button disabled={mutation.isPending} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700">{mutation.isPending ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-bold text-indigo-700">Sign in</Link></p>
    </div>
  );
}
