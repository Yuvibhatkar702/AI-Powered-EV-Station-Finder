import React, { useState } from 'react';
import { useStations } from '../../context/StationContext';
import { Station } from '../../types';
import { Plus, Edit, Trash2, MapPin, Battery, Users, DollarSign } from 'lucide-react';
import StationForm from './StationForm';

const StationManagement: React.FC = () => {
  const { stations, addStation, updateStation, deleteStation } = useStations();
  const [showForm, setShowForm] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingStation(undefined);
    setShowForm(true);
  };

  const handleEditClick = (station: Station) => {
    setEditingStation(station);
    setShowForm(true);
  };

  const handleDeleteClick = (stationId: string) => {
    setShowDeleteModal(stationId);
  };

  const handleConfirmDelete = () => {
    if (showDeleteModal) {
      deleteStation(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStation(undefined);
  };

  const handleStationSubmit = (stationData: Omit<Station, 'id' | 'averageRating' | 'totalReviews'>) => {
    if (editingStation) {
      updateStation({
        ...stationData,
        id: editingStation.id,
        averageRating: editingStation.averageRating,
        totalReviews: editingStation.totalReviews,
      });
    } else {
      addStation({
        ...stationData,
        averageRating: 0,
        totalReviews: 0,
      });
    }
    setShowForm(false);
    setEditingStation(undefined);
  };

  // Get status color for badges
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Manage Charging Stations</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Station
        </button>
      </div>

      {showForm ? (
        <StationForm
          station={editingStation}
          onSubmit={handleStationSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Station
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Connectors
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Usage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                          {station.photos[0] ? (
                            <img
                              src={station.photos[0]}
                              alt={station.name}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-300">
                              <MapPin className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{station.name}</div>
                          <div className="text-sm text-gray-500">ID: {station.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{station.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Battery className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{station.connectorTypes.join(', ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          station.status
                        )}`}
                      >
                        {station.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span>${station.pricePerKwh.toFixed(2)}/kWh</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span>
                          {station.currentUsers}/{station.maxCapacity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(station)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(station.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {stations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No stations found. Add a new station to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this station? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationManagement;