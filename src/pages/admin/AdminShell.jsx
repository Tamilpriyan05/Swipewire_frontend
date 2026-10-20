/**
 * AdminShell — the full-screen admin layout with collapsible sidebar.
 * Routes inside:
 *   /admin           → Dashboard
 *   /admin/brands    → Brands
 *   /admin/categories→ Categories
 *   /admin/products  → Products
 */
import { useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Boxes,
  ChevronLeft,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Tag,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
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

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-indigo-700/40 px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Boxes size={20} className="text-white" />
        </span>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-sm font-black tracking-tight text-white">ProductHub</p>

          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${isActive
                ? 'bg-white text-indigo-700 shadow-md'
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-indigo-600' : 'text-indigo-200 group-hover:text-white'}`} />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 space-y-1 border-t border-indigo-700/40 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={16} className="shrink-0" />
          {!collapsed && <span>View Store</span>}
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-rose-500/20 hover:text-rose-300"
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 transition-all duration-300 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 ${collapsed ? 'w-16' : 'w-60'
          }`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute left-0 top-20 -translate-x-0 translate-x-[calc(var(--w)-12px)] flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md text-indigo-600 hover:bg-indigo-50"
          style={{ '--w': collapsed ? '64px' : '240px' }}
        >
          <ChevronLeft size={14} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* ── Mobile overlay sidebar ───────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>

              <p className="text-xs text-slate-400">{user?.name || user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 sm:block">
              {user?.role?.toUpperCase()}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
