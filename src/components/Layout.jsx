import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Boxes, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const logout = () => {
    signOut();
    toast.success('Signed out successfully.');
    navigate('/');
  };
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
            <span className="rounded-xl bg-indigo-600 p-2 text-white"><Boxes size={20} /></span>
            <span>Product<span className="text-indigo-600">Hub</span></span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-semibold">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-900'}>Store</NavLink>
            {isAdmin && (
              <Link to="/admin" className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700">
                <ShieldCheck size={15} /> Admin
              </Link>
            )}
            {user ? (
              <>
                <span className="hidden items-center gap-1 text-slate-500 sm:flex"><ShieldCheck size={15}/>{user.name}</span>
                <button onClick={logout} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"><LogOut size={15}/> Logout</button>
              </>
            ) : (
              <Link to="/login" className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-700"><LogIn size={15}/> Sign in</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>

      {/* <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">ProductHub</footer> */}

    </div>
  );
}
