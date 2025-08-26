import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';  
const AdminDashboard = () => {
  const { role } = useAuth();
  
  const auth = JSON.parse(localStorage.getItem('auth'));


  if (auth.role !== 'ROLE_ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin content */}
    </div>
  );
};

export default AdminDashboard