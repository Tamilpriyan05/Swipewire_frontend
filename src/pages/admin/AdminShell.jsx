/**
 * AdminShell — full-screen admin layout with responsive collapsible sidebar.
 * Routes:
 *   /admin           → Dashboard
 *   /admin/brands    → Brands
 *   /admin/categories→ Categories
 *   /admin/products  → Products
 */
import { useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Tag,
  Layers,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import BrandIcon from '../../components/BrandIcon';
import AdminDashboard from './AdminDashboard';
import AdminBrands from './AdminBrands';
import AdminCategories from './AdminCategories';
import AdminProducts from './AdminProducts';

const NAV = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/brands', end: false, icon: Tag, label: 'Brands' },
  { to: '/admin/categories', end: false, icon: Layers, label: 'Categories' },
  { to: '/admin/products', end: false, icon: Package, label: 'Products' },
];

export default function AdminShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    signOut();
    toast.success('Signed out.');
    navigate('/login');
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-indigo-700/40 px-4">
        <Link to="/admin" className="group flex items-center gap-3 overflow-hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-950/40 transition-transform duration-200 group-hover:scale-105">
            <BrandIcon size={20} className="text-white" />
          </span>
          {(!collapsed || isMobile) && (
            <div className="overflow-hidden text-left">
              <p className="truncate text-sm font-black tracking-tight text-white leading-tight">
                Nova<span className="text-indigo-300">Cart</span>
              </p>
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-indigo-200 leading-tight">
                Admin Console
              </p>
            </div>
          )}
        </Link>
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-indigo-200 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`shrink-0 ${
                    isActive ? 'text-indigo-600' : 'text-indigo-200 group-hover:text-white'
                  }`}
                />
                {(!collapsed || isMobile) && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Shortcuts */}
      <div className="shrink-0 space-y-1 border-t border-indigo-700/40 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={16} className="shrink-0" />
          {(!collapsed || isMobile) && <span className="truncate">View Store</span>}
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-rose-500/20 hover:text-rose-300"
        >
          <LogOut size={16} className="shrink-0" />
          {(!collapsed || isMobile) && <span className="truncate">Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside
        className={`relative hidden lg:flex flex-col shrink-0 transition-all duration-300 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <SidebarContent />

        {/* Seamless collapse toggle docked on border */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-md transition hover:bg-indigo-50"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={14}
            className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </aside>

      {/* ── Mobile overlay sidebar ───────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-64 max-w-[85vw] flex-col bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 shadow-2xl">
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* ── Main content area ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {user?.name || 'Administrator'}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user?.role && (
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold text-indigo-700">
                {user.role.toUpperCase()}
              </span>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
