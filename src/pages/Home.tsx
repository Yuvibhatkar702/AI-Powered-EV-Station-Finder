import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapView from '../components/map/MapView';
import { useStations } from '../context/StationContext';
import { useAuth } from '../context/AuthContext';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import { Zap, Map, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const { stations, getRecommendedStations } = useStations();
  const { isAuthenticated, user } = useAuth();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [recommendedStations, setRecommendedStations] = useState<any[]>([]);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          
          // Get recommendations based on user location
          const recommendations = getRecommendedStations(userPos.lat, userPos.lng);
          setRecommendedStations(recommendations);
        },
        (error) => {
          // Provide more detailed error information
          let errorMessage = 'Unknown error occurred while getting location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied by the user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          console.error('Error getting location:', errorMessage, error);
          
          // Default to LA if location is not available
          const defaultPos = { lat: 34.0522, lng: -118.2437 };
          setUserLocation(defaultPos);
          
          // Get recommendations based on default location
          const recommendations = getRecommendedStations(defaultPos.lat, defaultPos.lng);
          setRecommendedStations(recommendations);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, [getRecommendedStations]);

  return (
    <div className="flex flex-col h-screen">
      {/* Welcome banner for new/non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Welcome to EV Finder</h1>
                <p className="mt-1 text-blue-100">
                  Find the perfect charging station for your electric vehicle
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-block px-4 py-2 bg-white text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0">
        {/* Map view (takes up 3/4 of the screen on desktop) */}
        <div className="md:col-span-2 lg:col-span-3 h-full min-h-[300px]">
          <MapView />
        </div>

        {/* Sidebar with recommendations */}
        <div className="bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recommended Stations</h2>
              <Link
                to="/stations"
                className="text-sm font-medium text-blue-500 hover:text-blue-700 flex items-center"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* User greeting if authenticated */}
            {isAuthenticated && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-blue-700">
                  Welcome back, <span className="font-medium">{user?.name}</span>!
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Here are your personalized station recommendations.
                </p>
              </div>
            )}

            {/* Station recommendations */}
            <div className="space-y-4">
              {recommendedStations.length > 0 ? (
                recommendedStations.map((station) => (
                  <RecommendationCard
                    key={station.id}
                    station={station}
                    userLat={userLocation?.lat}
                    userLng={userLocation?.lng}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Zap className="h-12 w-12 text-gray-300 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We couldn't find any stations to recommend at this time.
                  </p>
                  <Link
                    to="/stations"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Browse All Stations
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;