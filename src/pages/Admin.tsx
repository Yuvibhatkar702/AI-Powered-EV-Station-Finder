import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StationManagement from '../components/admin/StationManagement';
import { ShieldAlert } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (isAuthenticated && !user?.isAdmin) {
      navigate('/');
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || (isAuthenticated && !user?.isAdmin)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. Please log in with an admin account.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage EV charging stations and view platform statistics
        </p>
      </div>

      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-500 text-2xl font-bold">{6}</div>
              <div className="text-blue-700 text-sm">Total Stations</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-500 text-2xl font-bold">{10}</div>
              <div className="text-green-700 text-sm">Total Reviews</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-amber-500 text-2xl font-bold">4.2</div>
              <div className="text-amber-700 text-sm">Avg. Station Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <StationManagement />
        </div>
      </div>
    </div>
  );
};

export default Admin;