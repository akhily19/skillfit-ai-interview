// src/components/shared/AdminRoute.jsx
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('skillfit_admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
