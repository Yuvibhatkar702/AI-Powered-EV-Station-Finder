import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStations } from '../../context/StationContext';
import { Station } from '../../types';
import { Zap, MapPin, Filter, X } from 'lucide-react';

const MapView: React.FC = () => {
  const { stations, filteredStations, selectStation, filters, updateFilters } = useStations();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const navigate = useNavigate();

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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
          setUserLocation({ lat: 34.0522, lng: -118.2437 });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);

  // Set local filters when global filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // For demo purposes, we'll simulate a map with station markers
  const handleStationClick = (station: Station) => {
    selectStation(station);
    navigate(`/stations/${station.id}`);
  };

  // Apply filters when the apply button is clicked
  const applyFilters = () => {
    updateFilters(localFilters);
    setIsFilterOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    const resetFiltersObj = {
      connectorTypes: [],
      minRating: 0,
      status: [],
      maxPrice: undefined,
      amenities: [],
    };
    setLocalFilters(resetFiltersObj);
    updateFilters(resetFiltersObj);
    setIsFilterOpen(false);
  };

  // Helper function to get marker color based on status
  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Busy':
        return 'bg-amber-500';
      case 'Inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Map rendering - this would be replaced with a real map library
  // Here we're creating a simple visual representation
  return (
    <div className="relative h-full bg-gray-100">
      {/* Simulated map container */}
      <div className="relative w-full h-full bg-blue-50 overflow-hidden">
        {/* Map background - would be replaced with actual map */}
        <div className="absolute inset-0 p-4 z-0">
          <div className="h-full w-full bg-blue-50 rounded-lg shadow-inner border border-gray-300">
            {/* Grid lines to simulate a map */}
            <div className="h-full w-full relative overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-blue-200"
                  style={{ top: `${(i + 1) * 10}%` }}
                ></div>
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-blue-200"
                  style={{ left: `${(i + 1) * 10}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Station markers */}
        <div className="absolute inset-0 z-10">
          {filteredStations.map(station => (
            <button
              key={station.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${((station.lng + 118.3) / 0.2) * 100}%`,
                top: `${((34.08 - station.lat) / 0.08) * 100}%`,
              }}
              onClick={() => handleStationClick(station)}
            >
              <div className="relative">
                <div className={`h-6 w-6 rounded-full ${getMarkerColor(station.status)} text-white flex items-center justify-center shadow-md`}>
                  <Zap className="h-4 w-4" />
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
                    {station.name}
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* User location marker */}
          {userLocation && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((userLocation.lng + 118.3) / 0.2) * 100}%`,
                top: `${((34.08 - userLocation.lat) / 0.08) * 100}%`,
              }}
            >
              <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white shadow-md flex items-center justify-center animate-pulse">
                <MapPin className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="absolute top-4 right-4 z-20 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        <Filter className="h-5 w-5 text-gray-700" />
      </button>

      {/* Filter panel */}
      {isFilterOpen && (
        <div className="absolute top-0 right-0 z-30 h-full w-full md:w-80 bg-white shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Connector Types */}
              <div>
                <h4 className="font-medium mb-2">Connector Types</h4>
                <div className="space-y-2">
                  {['CCS', 'CHAdeMO', 'Type 2', 'Tesla'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                        checked={localFilters.connectorTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalFilters({
                              ...localFilters,
                              connectorTypes: [...localFilters.connectorTypes, type],
                            });
                          } else {
                            setLocalFilters({
                              ...localFilters,
                              connectorTypes: localFilters.connectorTypes.filter(t => t !== type),
                            });
                          }
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="space-y-2">
                  {['Available', 'Busy', 'Inactive'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                        checked={localFilters.status.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalFilters({
                              ...localFilters,
                              status: [...localFilters.status, status],
                            });
                          } else {
                            setLocalFilters({
                              ...localFilters,
                              status: localFilters.status.filter(s => s !== status),
                            });
                          }
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <h4 className="font-medium mb-2">Minimum Rating</h4>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={localFilters.minRating}
                  onChange={(e) => {
                    setLocalFilters({
                      ...localFilters,
                      minRating: parseFloat(e.target.value),
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-gray-700 mt-1">
                  {localFilters.minRating} stars or higher
                </div>
              </div>

              {/* Maximum Price */}
              <div>
                <h4 className="font-medium mb-2">Maximum Price ($/kWh)</h4>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setLocalFilters({
                      ...localFilters,
                      maxPrice: value,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any price"
                />
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-medium mb-2">Amenities</h4>
                <div className="space-y-2">
                  {['Restroom', 'Cafe', 'WiFi', 'Shopping', 'Restaurant', 'Parking'].map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                        checked={localFilters.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalFilters({
                              ...localFilters,
                              amenities: [...localFilters.amenities, amenity],
                            });
                          } else {
                            setLocalFilters({
                              ...localFilters,
                              amenities: localFilters.amenities.filter(a => a !== amenity),
                            });
                          }
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  onClick={resetFilters}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white p-3 rounded-md shadow-md">
        <h3 className="text-sm font-semibold mb-2">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-700">Available</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-xs text-gray-700">Busy</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-gray-700">Inactive</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-xs text-gray-700">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;