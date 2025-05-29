import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStations } from '../../context/StationContext';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types';
import {
  MapPin,
  Battery,
  Clock,
  DollarSign,
  Star,
  User,
  ThumbsUp,
  Calendar,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import ReviewForm from './ReviewForm';

const StationDetails: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const { stations, reviews, addReview } = useStations();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Find the station by ID
  const station = stations.find((s) => s.id === stationId);
  // Get reviews for this station
  const stationReviews = reviews.filter((r) => r.stationId === stationId);

  // Handle review submission
  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!user) return;
    
    addReview({
      stationId: stationId!,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      helpful: 0,
    });
  };

  if (!station) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Station not found</h2>
          <p className="mt-2 text-gray-600">
            The station you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/stations"
            className="mt-4 inline-flex items-center text-blue-500 hover:text-blue-700"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to all stations
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/stations"
        className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to all stations
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with image */}
        <div className="relative h-64 sm:h-80">
          <img
            src={station.photos[0]}
            alt={station.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{station.name}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-5 w-5 text-white opacity-90 mr-1" />
                <span className="text-white opacity-90">{station.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({station.totalReviews})
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Status and Ratings */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      station.status
                    )}`}
                  >
                    {station.status} ({station.currentUsers}/{station.maxCapacity})
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="font-medium text-gray-900">{station.averageRating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({station.totalReviews} reviews)</span>
                </div>
              </div>

              {/* Station Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Connector Types</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {station.connectorTypes.map((type, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          <Battery className="h-4 w-4 mr-1" />
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Price</h3>
                    <div className="mt-1 flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
                      ${station.pricePerKwh.toFixed(2)}/kWh
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Hours</h3>
                    <div className="mt-1 flex items-center text-gray-700">
                      <Clock className="h-5 w-5 text-gray-500 mr-1" />
                      {station.openingHours}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Amenities</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {station.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Current Usage</h3>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            (station.currentUsers / station.maxCapacity) * 100 < 50
                              ? 'bg-green-500'
                              : (station.currentUsers / station.maxCapacity) * 100 < 85
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${(station.currentUsers / station.maxCapacity) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {station.currentUsers} out of {station.maxCapacity} chargers in use
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review summary */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center bg-blue-50 rounded-full h-16 w-16">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{station.averageRating.toFixed(1)}</div>
                    <div className="text-xs text-blue-600">out of 5</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(station.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill={i < Math.floor(station.averageRating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Based on {station.totalReviews} reviews
                  </div>
                </div>
              </div>

              {/* Add review button/form */}
              {isAuthenticated ? (
                <ReviewForm onSubmit={handleReviewSubmit} />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    <Link to="/login" className="text-blue-500 font-medium">
                      Sign in
                    </Link>{' '}
                    to leave a review.
                  </p>
                </div>
              )}

              {/* Reviews list */}
              <div className="space-y-4 mt-6">
                {stationReviews.length > 0 ? (
                  stationReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">{review.userName}</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill={i < review.rating ? 'currentColor' : 'none'}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(review.datePosted).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{review.comment}</p>
                      <div className="mt-2 flex items-center">
                        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 text-gray-300 mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Be the first to review this station.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationDetails;