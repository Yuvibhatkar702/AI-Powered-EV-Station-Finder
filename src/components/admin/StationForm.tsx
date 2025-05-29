import React, { useState, useEffect } from 'react';
import { Station } from '../../types';
import { X, Plus } from 'lucide-react';

interface StationFormProps {
  station?: Station;
  onSubmit: (stationData: Omit<Station, 'id' | 'averageRating' | 'totalReviews'>) => void;
  onCancel: () => void;
}

const StationForm: React.FC<StationFormProps> = ({ station, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Station, 'id' | 'averageRating' | 'totalReviews'>>({
    name: '',
    address: '',
    lat: 34.0522,
    lng: -118.2437,
    connectorTypes: [],
    pricePerKwh: 0.35,
    status: 'Available',
    currentUsers: 0,
    maxCapacity: 4,
    amenities: [],
    openingHours: '24/7',
    photos: ['https://images.pexels.com/photos/9511554/pexels-photo-9511554.jpeg'],
  });

  const [connectorType, setConnectorType] = useState('');
  const [amenity, setAmenity] = useState('');

  // Populate form data if editing an existing station
  useEffect(() => {
    if (station) {
      // Omit id, averageRating, and totalReviews
      const { id, averageRating, totalReviews, ...rest } = station;
      setFormData(rest);
    }
  }, [station]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pricePerKwh' || name === 'lat' || name === 'lng' || name === 'currentUsers' || name === 'maxCapacity' 
        ? parseFloat(value) 
        : value,
    }));
  };

  const handleAddConnectorType = () => {
    if (connectorType && !formData.connectorTypes.includes(connectorType)) {
      setFormData((prev) => ({
        ...prev,
        connectorTypes: [...prev.connectorTypes, connectorType],
      }));
      setConnectorType('');
    }
  };

  const handleRemoveConnectorType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      connectorTypes: prev.connectorTypes.filter((t) => t !== type),
    }));
  };

  const handleAddAmenity = () => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
      setAmenity('');
    }
  };

  const handleRemoveAmenity = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== item),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {station ? 'Edit Station' : 'Add New Station'}
          </h3>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Station Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude*
                </label>
                <input
                  type="number"
                  id="lat"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  step="0.0001"
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude*
                </label>
                <input
                  type="number"
                  id="lng"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  step="0.0001"
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="pricePerKwh" className="block text-sm font-medium text-gray-700 mb-1">
                  Price per kWh ($)*
                </label>
                <input
                  type="number"
                  id="pricePerKwh"
                  name="pricePerKwh"
                  value={formData.pricePerKwh}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status*
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label htmlFor="currentUsers" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Users
                </label>
                <input
                  type="number"
                  id="currentUsers"
                  name="currentUsers"
                  value={formData.currentUsers}
                  onChange={handleChange}
                  min="0"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Capacity*
                </label>
                <input
                  type="number"
                  id="maxCapacity"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Hours*
                </label>
                <input
                  type="text"
                  id="openingHours"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleChange}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  id="photos"
                  name="photos"
                  value={formData.photos[0] || ''}
                  onChange={(e) => setFormData({ ...formData, photos: [e.target.value] })}
                  placeholder="https://example.com/image.jpg"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Enter a URL to a photo of the station</p>
              </div>
            </div>
          </div>

          {/* Connector Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Connector Types</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-grow">
                <select
                  value={connectorType}
                  onChange={(e) => setConnectorType(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a connector type</option>
                  <option value="CCS">CCS</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="Type 2">Type 2</option>
                  <option value="Tesla">Tesla</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddConnectorType}
                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.connectorTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => handleRemoveConnectorType(type)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {formData.connectorTypes.length === 0 && (
                <p className="text-xs text-gray-500">No connector types added yet</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-grow">
                <select
                  value={amenity}
                  onChange={(e) => setAmenity(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select an amenity</option>
                  <option value="Restroom">Restroom</option>
                  <option value="Cafe">Cafe</option>
                  <option value="WiFi">WiFi</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Parking">Parking</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddAmenity}
                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.amenities.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(item)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {formData.amenities.length === 0 && (
                <p className="text-xs text-gray-500">No amenities added yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {station ? 'Update Station' : 'Add Station'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StationForm;