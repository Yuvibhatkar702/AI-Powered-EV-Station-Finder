import React, { useState, useEffect } from 'react';
import { useStations } from '../context/StationContext';
import StationCard from '../components/stations/StationCard';
import { Filter, Search, X } from 'lucide-react';

const StationList: React.FC = () => {
  const { filteredStations, filters, updateFilters } = useStations();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [displayedStations, setDisplayedStations] = useState(filteredStations);

  // Apply search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setDisplayedStations(filteredStations);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = filteredStations.filter(station => 
        station.name.toLowerCase().includes(lowerCaseSearch) ||
        station.address.toLowerCase().includes(lowerCaseSearch)
      );
      setDisplayedStations(filtered);
    }
  }, [searchTerm, filteredStations]);

  // Set local filters when global filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    updateFilters(localFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFiltersObj = {
      connectorTypes: [],
      minRating: 0,
      status: [],
      maxPrice: undefined,
      amenities: [],
    };
    setLocalFilters(resetFiltersObj);
    updateFilters(resetFiltersObj);
    setShowFilters(false);
  };

  const isFiltersActive = () => {
    return (
      localFilters.connectorTypes.length > 0 ||
      localFilters.minRating > 0 ||
      localFilters.status.length > 0 ||
      localFilters.maxPrice !== undefined ||
      localFilters.amenities.length > 0
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Charging Stations</h1>
        <div className="flex mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64 mr-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border ${
              isFiltersActive() 
                ? 'border-blue-500 text-blue-500'
                : 'border-gray-300 text-gray-700'
            } rounded-md text-sm font-medium hover:bg-gray-50`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {isFiltersActive() && (
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white shadow-md rounded-lg mb-6 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Connector Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Connector Types</h3>
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Minimum Rating: {localFilters.minRating}
              </h3>
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
            </div>

            {/* Maximum Price */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Maximum Price ($/kWh)</h3>
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
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
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Filter Badges */}
      {isFiltersActive() && (
        <div className="flex flex-wrap gap-2 mb-4">
          {localFilters.connectorTypes.map(type => (
            <span key={`conn-${type}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Connector: {type}
              <button 
                onClick={() => {
                  setLocalFilters({
                    ...localFilters,
                    connectorTypes: localFilters.connectorTypes.filter(t => t !== type),
                  });
                  updateFilters({
                    ...localFilters,
                    connectorTypes: localFilters.connectorTypes.filter(t => t !== type),
                  });
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          
          {localFilters.status.map(status => (
            <span key={`status-${status}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {status}
              <button 
                onClick={() => {
                  setLocalFilters({
                    ...localFilters,
                    status: localFilters.status.filter(s => s !== status),
                  });
                  updateFilters({
                    ...localFilters,
                    status: localFilters.status.filter(s => s !== status),
                  });
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          
          {localFilters.minRating > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Min Rating: {localFilters.minRating}
              <button 
                onClick={() => {
                  setLocalFilters({
                    ...localFilters,
                    minRating: 0,
                  });
                  updateFilters({
                    ...localFilters,
                    minRating: 0,
                  });
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {localFilters.maxPrice !== undefined && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Max Price: ${localFilters.maxPrice}/kWh
              <button 
                onClick={() => {
                  setLocalFilters({
                    ...localFilters,
                    maxPrice: undefined,
                  });
                  updateFilters({
                    ...localFilters,
                    maxPrice: undefined,
                  });
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {localFilters.amenities.map(amenity => (
            <span key={`amenity-${amenity}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Amenity: {amenity}
              <button 
                onClick={() => {
                  setLocalFilters({
                    ...localFilters,
                    amenities: localFilters.amenities.filter(a => a !== amenity),
                  });
                  updateFilters({
                    ...localFilters,
                    amenities: localFilters.amenities.filter(a => a !== amenity),
                  });
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Clear All
            <X className="h-3 w-3 ml-1" />
          </button>
        </div>
      )}

      {/* Stations Grid */}
      {displayedStations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedStations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? `No stations match your search for "${searchTerm}"`
              : 'No stations match your current filters'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              handleResetFilters();
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default StationList;