import React from 'react';
import { Link } from 'react-router-dom';
import { Station } from '../../types';
import { MapPin, Battery, Clock, DollarSign, Star } from 'lucide-react';

interface StationCardProps {
  station: Station;
}

const StationCard: React.FC<StationCardProps> = ({ station }) => {
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Busy':
        return 'bg-amber-100 text-amber-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get a visual representation of capacity
  const getCapacityDisplay = () => {
    const capacityPercentage = (station.currentUsers / station.maxCapacity) * 100;
    
    return (
      <div className="mt-1">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              capacityPercentage < 50 
                ? 'bg-green-500' 
                : capacityPercentage < 85 
                  ? 'bg-amber-500' 
                  : 'bg-red-500'
            }`}
            style={{ width: `${capacityPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {station.currentUsers} / {station.maxCapacity} in use
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="h-40 overflow-hidden">
        <img 
          src={station.photos[0]} 
          alt={station.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{station.name}</h3>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(station.status)}`}>
            {station.status}
          </span>
        </div>
        
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          <span className="truncate">{station.address}</span>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-gray-700">
            <Battery className="h-4 w-4 text-gray-500 mr-1" />
            <span>{station.connectorTypes.join(', ')}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
            <span>${station.pricePerKwh.toFixed(2)}/kWh</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span>{station.openingHours}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{station.averageRating.toFixed(1)} ({station.totalReviews})</span>
          </div>
        </div>
        
        {getCapacityDisplay()}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {station.amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {station.amenities.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                +{station.amenities.length - 3}
              </span>
            )}
          </div>
          
          <Link 
            to={`/stations/${station.id}`}
            className="text-sm font-medium text-blue-500 hover:text-blue-700"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StationCard;