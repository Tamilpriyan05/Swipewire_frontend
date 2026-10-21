import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LogIn,
  LogOut,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  User as UserIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import BrandIcon from './BrandIcon';

export default function Layout({ children }) {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    signOut();
    toast.success('Signed out successfully.');
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
    

     
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
         
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-3 font-extrabold tracking-tight text-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
              <BrandIcon size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight leading-none text-slate-900">
                Swipe<span className="text-indigo-600">Wire</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-tight">
                Store & Catalogue
              </span>
            </div>
          </Link>

        
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-semibold">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              Browse Catalogue
            </NavLink>

            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-2 text-indigo-700 shadow-xs transition-all hover:bg-indigo-100"
              >
                <ShieldCheck size={16} className="text-indigo-600" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/90 bg-slate-50 px-3 py-1.5 shadow-2xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-black text-white shadow-xs">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/20"
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

         
          <div className="flex items-center gap-2 md:hidden">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200"
              >
                <ShieldCheck size={14} /> Admin
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-50 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <span
                className={`h-0.5 w-5 rounded-full bg-slate-800 transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'translate-y-2 rotate-45' : ''
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-slate-800 transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-slate-800 transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown Menu ── */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200/80 bg-white/95 px-4 py-5 shadow-xl backdrop-blur-xl md:hidden animate-fade-in">
            <div className="space-y-2">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span>Browse Catalogue</span>
                <ArrowRight size={16} />
              </NavLink>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm font-bold text-indigo-700"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={18} /> Admin Dashboard
                  </span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs"
                  >
                    <LogIn size={15} /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

 
      <footer className="mt-16 border-t border-slate-200/90 bg-white">
      
        <div className="border-b border-slate-100 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Swift Dispatch</h4>
                  <p className="mt-0.5 text-xs text-slate-500">Fast shipping across all regions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">100% Genuine</h4>
                  <p className="mt-0.5 text-xs text-slate-500">Verified manufacturer stock</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Easy Returns</h4>
                  <p className="mt-0.5 text-xs text-slate-500">Hassle-free 7-day inspection</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Headphones size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">24/7 Support</h4>
                  <p className="mt-0.5 text-xs text-slate-500">Dedicated assistance anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand column */}
            <div className="md:col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 font-black text-slate-900">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs">
                  <BrandIcon size={18} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tight">
                  Swipe<span className="text-indigo-600">Wire</span>
                </span>
              </Link>
              <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-slate-500">
                Next-generation product catalogue platform offering real-time stock availability, verified specifications, and curated tech essentials.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Inventory Systems Live & Operational</span>
              </div>
            </div>

            {/* Catalogue Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Catalogue</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">All Products</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Featured Electronics</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">New Arrivals</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">In-Stock Only</Link></li>
              </ul>
            </div>

            {/* Quick Access */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Account & Security</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                {user ? (
                  <>
                    <li className="font-medium text-slate-700">Signed in as {user.name}</li>
                    {isAdmin && (
                      <li><Link to="/admin" className="text-indigo-600 hover:underline">Admin Console</Link></li>
                    )}
                    <li><button onClick={logout} className="hover:text-rose-600 transition-colors">Logout</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link></li>
                    <li><Link to="/register" className="hover:text-indigo-600 transition-colors">Create Account</Link></li>
                  </>
                )}
             
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Legal</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                <li><span className="cursor-default hover:text-slate-700">Privacy Notice</span></li>
                <li><span className="cursor-default hover:text-slate-700">Terms of Service</span></li>
                <li><span className="cursor-default hover:text-slate-700">Catalogue Disclaimer</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} SwipeWire Product Catalogue. All rights reserved.</p>
            <div className="flex items-center gap-4">
            
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
