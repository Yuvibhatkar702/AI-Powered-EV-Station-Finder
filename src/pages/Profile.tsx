import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStations } from '../context/StationContext';
import { User, Star, MapPin, Calendar, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { reviews } = useStations();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get user's reviews
  const userReviews = reviews.filter(review => review.userId === user?.id);

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-12">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-blue-100 mt-1">{user.email}</p>
            {user.isAdmin && (
              <span className="mt-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-800 text-white">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-sm text-gray-900">{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                <p className="mt-1 text-sm text-gray-900">{user.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {user.isAdmin ? 'Administrator' : 'Regular User'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Reviews */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Reviews</h2>
          
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => {
                const station = review.stationId;
                return (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="ml-1 text-gray-900 font-medium">{review.rating}/5</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>Station ID: {review.stationId}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(review.datePosted).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <button className="text-sm text-blue-500 hover:text-blue-700">
                        View Station
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Star className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't reviewed any charging stations yet.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/stations')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Stations
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;