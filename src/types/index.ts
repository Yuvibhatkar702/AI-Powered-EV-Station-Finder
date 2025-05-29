export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  connectorTypes: string[];
  pricePerKwh: number;
  status: 'Available' | 'Busy' | 'Inactive';
  currentUsers: number;
  maxCapacity: number;
  amenities: string[];
  openingHours: string;
  photos: string[];
  averageRating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  stationId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  datePosted: string;
  helpful: number;
}

export interface StationFilters {
  connectorTypes: string[];
  minRating: number;
  status: string[];
  maxPrice?: number;
  amenities: string[];
}