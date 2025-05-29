import { Station } from '../types';

// Calculate distance between two points using Haversine formula
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

// Calculate a score for each station based on distance, rating, and availability
const calculateStationScore = (
  station: Station,
  userLat: number,
  userLng: number
): number => {
  // Calculate distance (lower is better)
  const distance = calculateDistance(userLat, userLng, station.lat, station.lng);
  const distanceScore = Math.max(0, 10 - distance); // 0-10 score, higher for closer stations
  
  // Rating score (0-5)
  const ratingScore = station.averageRating;
  
  // Availability score
  let availabilityScore = 0;
  if (station.status === 'Available') {
    // Higher score for stations with more available spots
    const availablePercent = 1 - (station.currentUsers / station.maxCapacity);
    availabilityScore = 5 * availablePercent;
  } else if (station.status === 'Busy') {
    // Lower score for busy stations, but still possible
    const availablePercent = 1 - (station.currentUsers / station.maxCapacity);
    availabilityScore = 2 * availablePercent;
  }
  // Inactive stations get 0 for availability
  
  // Combine scores with appropriate weights
  // Distance is most important (50%), then availability (30%), then rating (20%)
  return 0.5 * distanceScore + 0.3 * availabilityScore + 0.2 * ratingScore;
};

// Main recommendation function
export const getRecommendedStations = (
  stations: Station[],
  userLat: number,
  userLng: number,
  limit = 3
): Station[] => {
  // Filter out inactive stations
  const activeStations = stations.filter(station => station.status !== 'Inactive');
  
  // Calculate scores for each station
  const scoredStations = activeStations.map(station => ({
    station,
    score: calculateStationScore(station, userLat, userLng),
  }));
  
  // Sort by score (highest first)
  scoredStations.sort((a, b) => b.score - a.score);
  
  // Return top N stations
  return scoredStations.slice(0, limit).map(item => item.station);
};

// Get stations for specific user needs
export const getStationsForUserNeeds = (
  stations: Station[],
  userLat: number,
  userLng: number,
  connectorType?: string,
  needsAmenities?: string[],
  maxWaitTime?: number
): Station[] => {
  // Filter stations based on user requirements
  let filteredStations = stations;
  
  // Filter by connector type if specified
  if (connectorType) {
    filteredStations = filteredStations.filter(station => 
      station.connectorTypes.includes(connectorType)
    );
  }
  
  // Filter by required amenities
  if (needsAmenities && needsAmenities.length > 0) {
    filteredStations = filteredStations.filter(station => 
      needsAmenities.every(amenity => station.amenities.includes(amenity))
    );
  }
  
  // Filter by estimated wait time (based on current users vs capacity)
  if (maxWaitTime !== undefined) {
    filteredStations = filteredStations.filter(station => {
      // Skip inactive stations
      if (station.status === 'Inactive') return false;
      
      // Estimate wait time based on current users and capacity
      // This is a very simple model - in reality would need more data
      const availableSlots = station.maxCapacity - station.currentUsers;
      const estimatedWaitTime = availableSlots <= 0 ? 15 : 0; // Assume 15 min wait if full
      
      return estimatedWaitTime <= maxWaitTime;
    });
  }
  
  // Sort remaining stations by a score
  return getRecommendedStations(filteredStations, userLat, userLng, 5);
};