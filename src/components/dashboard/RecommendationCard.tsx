import React from 'react';
import { Station } from '../../types';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Battery, Clock, ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  station: Station;
  userLat?: number;
  userLng?: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  station,
  userLat = 34.0522,
  userLng = -118.2437
}) => {
  // Calculate distance using Haversine formula (simplified for demo)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const distance = calculateDistance(userLat, userLng, station.lat, station.lng);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
      <div className="flex items-center">
        <div className="w-1/3 h-full">
          <img 
            src={station.photos[0]} 
            alt={station.name} 
            className="w-full h-full object-cover"
            style={{ minHeight: '120px' }}
          />
        </div>
        <div className="w-2/3 p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{station.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              station.status === 'Available' 
                ? 'bg-green-100 text-green-800' 
                : station.status === 'Busy'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {station.status}
            </span>
          </div>
          
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{distance.toFixed(1)} km away</span>
          </div>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Battery className="h-4 w-4 mr-1" />
              <span>{station.connectorTypes.join(', ')}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{station.currentUsers}/{station.maxCapacity} in use</span>
            </div>
          </div>
          
          <Link 
            to={`/stations/${station.id}`}
            className="mt-3 inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-700"
          >
            View details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;