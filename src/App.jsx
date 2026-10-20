import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Loading from './components/Loading';
import { AuthProvider } from './context/AuthContext';
import { RequireAdmin } from './components/RouteGuards';

const Storefront = lazy(() => import('./pages/Storefront'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Admin panel (has its own sidebar layout — does NOT use Layout)
const AdminShell = lazy(() => import('./pages/admin/AdminShell'));

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading label="Loading page..." />}>
        <Routes>
          {/* ── Public store routes (wrapped with header/footer Layout) ── */}
          <Route
            path="/"
            element={
              <Layout>
                <Storefront />
              </Layout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Layout>
                <ProductDetail />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          {/* ── Admin routes (standalone sidebar layout, no header/footer) ── */}
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminShell />
              </RequireAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
