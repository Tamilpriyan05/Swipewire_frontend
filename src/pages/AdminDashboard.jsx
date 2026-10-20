/**
 * Legacy redirect — the AdminShell now handles /admin/* routing.
 * This file is kept for backward compatibility only.
 */
import { Navigate } from 'react-router-dom';
export default function AdminDashboard() {
  return <Navigate to="/admin" replace />;
}
