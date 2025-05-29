import { Station, Review } from '../types';

export const mockStations: Station[] = [
  {
    id: '1',
    name: 'Central EV Hub',
    address: '123 Main St, Metropolis, CA',
    lat: 34.0522,
    lng: -118.2437,
    connectorTypes: ['CCS', 'CHAdeMO', 'Type 2'],
    pricePerKwh: 0.35,
    status: 'Available',
    currentUsers: 2,
    maxCapacity: 8,
    amenities: ['Restroom', 'Cafe', 'WiFi'],
    openingHours: '24/7',
    photos: [
      'https://images.pexels.com/photos/5915192/pexels-photo-5915192.jpeg',
      'https://images.pexels.com/photos/9511554/pexels-photo-9511554.jpeg'
    ],
    averageRating: 4.5,
    totalReviews: 28
  },
  {
    id: '2',
    name: 'Green Energy Station',
    address: '456 Oak Blvd, Metropolis, CA',
    lat: 34.0500,
    lng: -118.2600,
    connectorTypes: ['CCS', 'Type 2'],
    pricePerKwh: 0.38,
    status: 'Busy',
    currentUsers: 5,
    maxCapacity: 6,
    amenities: ['Restroom', 'Shopping'],
    openingHours: '6:00 AM - 10:00 PM',
    photos: [
      'https://images.pexels.com/photos/11740177/pexels-photo-11740177.jpeg',
      'https://images.pexels.com/photos/3678799/pexels-photo-3678799.jpeg'
    ],
    averageRating: 3.8,
    totalReviews: 15
  },
  {
    id: '3',
    name: 'Tesla Supercharger',
    address: '789 Electric Ave, Metropolis, CA',
    lat: 34.0600,
    lng: -118.2500,
    connectorTypes: ['Tesla'],
    pricePerKwh: 0.40,
    status: 'Available',
    currentUsers: 3,
    maxCapacity: 12,
    amenities: ['Restroom'],
    openingHours: '24/7',
    photos: [
      'https://images.pexels.com/photos/13351421/pexels-photo-13351421.jpeg',
      'https://images.pexels.com/photos/12982095/pexels-photo-12982095.jpeg'
    ],
    averageRating: 4.9,
    totalReviews: 42
  },
  {
    id: '4',
    name: 'City Center Charging',
    address: '101 Downtown Rd, Metropolis, CA',
    lat: 34.0450,
    lng: -118.2550,
    connectorTypes: ['CCS', 'CHAdeMO', 'Type 2', 'Tesla'],
    pricePerKwh: 0.45,
    status: 'Inactive',
    currentUsers: 0,
    maxCapacity: 10,
    amenities: ['Restroom', 'Cafe', 'WiFi', 'Shopping'],
    openingHours: '8:00 AM - 8:00 PM',
    photos: [
      'https://images.pexels.com/photos/14120527/pexels-photo-14120527.jpeg',
      'https://images.pexels.com/photos/6998402/pexels-photo-6998402.jpeg'
    ],
    averageRating: 4.2,
    totalReviews: 19
  },
  {
    id: '5',
    name: 'Suburban Supercharger',
    address: '555 Residential Lane, Metropolis, CA',
    lat: 34.0700,
    lng: -118.2800,
    connectorTypes: ['CCS', 'Type 2'],
    pricePerKwh: 0.30,
    status: 'Available',
    currentUsers: 1,
    maxCapacity: 4,
    amenities: ['Restroom', 'Parking'],
    openingHours: '6:00 AM - 12:00 AM',
    photos: [
      'https://images.pexels.com/photos/13861568/pexels-photo-13861568.jpeg',
      'https://images.pexels.com/photos/12981990/pexels-photo-12981990.jpeg'
    ],
    averageRating: 4.0,
    totalReviews: 12
  },
  {
    id: '6',
    name: 'Highway Rest Stop',
    address: '999 Interstate Hwy, Metropolis, CA',
    lat: 34.0800,
    lng: -118.3000,
    connectorTypes: ['CCS', 'CHAdeMO'],
    pricePerKwh: 0.42,
    status: 'Busy',
    currentUsers: 8,
    maxCapacity: 8,
    amenities: ['Restroom', 'Restaurant', 'Shop', 'WiFi'],
    openingHours: '24/7',
    photos: [
      'https://images.pexels.com/photos/3280908/pexels-photo-3280908.jpeg',
      'https://images.pexels.com/photos/11121968/pexels-photo-11121968.jpeg'
    ],
    averageRating: 3.5,
    totalReviews: 34
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    stationId: '1',
    userId: '2',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent charging speed and plenty of amenities while you wait. The cafe has great coffee!',
    datePosted: '2023-04-15T10:30:00Z',
    helpful: 12
  },
  {
    id: '2',
    stationId: '1',
    userId: '3',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Good location and usually available. Would be perfect if they had more food options.',
    datePosted: '2023-05-20T14:15:00Z',
    helpful: 8
  },
  {
    id: '3',
    stationId: '2',
    userId: '4',
    userName: 'Robert Johnson',
    rating: 3,
    comment: 'Often busy during peak hours. Had to wait 30 minutes to get a spot.',
    datePosted: '2023-03-10T09:45:00Z',
    helpful: 15
  },
  {
    id: '4',
    stationId: '3',
    userId: '2',
    userName: 'John Doe',
    rating: 5,
    comment: 'Tesla Supercharger is blazing fast! Got 80% charge in just 20 minutes.',
    datePosted: '2023-06-05T16:20:00Z',
    helpful: 20
  },
  {
    id: '5',
    stationId: '4',
    userId: '5',
    userName: 'Emily Wilson',
    rating: 4,
    comment: 'Great location in the city center. The shopping area has nice stores to browse while charging.',
    datePosted: '2023-02-28T11:10:00Z',
    helpful: 7
  },
  {
    id: '6',
    stationId: '5',
    userId: '6',
    userName: 'Michael Brown',
    rating: 4,
    comment: 'Quiet location with enough spots. Charging speed is decent.',
    datePosted: '2023-01-15T13:25:00Z',
    helpful: 5
  },
  {
    id: '7',
    stationId: '6',
    userId: '3',
    userName: 'Jane Smith',
    rating: 2,
    comment: 'Always full with long wait times. Needs more chargers.',
    datePosted: '2023-04-02T08:50:00Z',
    helpful: 18
  },
  {
    id: '8',
    stationId: '1',
    userId: '7',
    userName: 'David Lee',
    rating: 5,
    comment: 'My favorite charging spot in the city. Always clean and well-maintained.',
    datePosted: '2023-05-30T15:40:00Z',
    helpful: 9
  },
  {
    id: '9',
    stationId: '2',
    userId: '8',
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Good chargers but the location could use more amenities.',
    datePosted: '2023-03-25T12:15:00Z',
    helpful: 4
  },
  {
    id: '10',
    stationId: '3',
    userId: '9',
    userName: 'Thomas Anderson',
    rating: 5,
    comment: 'Tesla knows how to build chargers. Always reliable and fast.',
    datePosted: '2023-06-10T17:30:00Z',
    helpful: 11
  }
];