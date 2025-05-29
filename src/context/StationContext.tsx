import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Station, Review, StationFilters } from '../types';
import { mockStations, mockReviews } from '../data/mockData';
import { getRecommendedStations } from '../utils/aiRecommendations';

interface StationState {
  stations: Station[];
  filteredStations: Station[];
  selectedStation: Station | null;
  reviews: Review[];
  filters: StationFilters;
  isLoading: boolean;
  error: string | null;
}

type StationAction =
  | { type: 'SET_STATIONS'; payload: Station[] }
  | { type: 'SET_FILTERED_STATIONS'; payload: Station[] }
  | { type: 'SELECT_STATION'; payload: Station | null }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'UPDATE_FILTERS'; payload: Partial<StationFilters> }
  | { type: 'ADD_STATION'; payload: Station }
  | { type: 'UPDATE_STATION'; payload: Station }
  | { type: 'DELETE_STATION'; payload: string }
  | { type: 'LOADING' }
  | { type: 'ERROR'; payload: string };

interface StationContextType extends StationState {
  addStation: (station: Omit<Station, 'id'>) => void;
  updateStation: (station: Station) => void;
  deleteStation: (id: string) => void;
  selectStation: (station: Station | null) => void;
  addReview: (review: Omit<Review, 'id' | 'datePosted'>) => void;
  updateFilters: (filters: Partial<StationFilters>) => void;
  getRecommendedStations: (lat: number, lng: number) => Station[];
}

const initialFilters: StationFilters = {
  connectorTypes: [],
  minRating: 0,
  status: [],
  maxPrice: undefined,
  amenities: [],
};

const initialState: StationState = {
  stations: [],
  filteredStations: [],
  selectedStation: null,
  reviews: [],
  filters: initialFilters,
  isLoading: false,
  error: null,
};

const StationContext = createContext<StationContextType | undefined>(undefined);

const stationReducer = (state: StationState, action: StationAction): StationState => {
  switch (action.type) {
    case 'SET_STATIONS':
      return {
        ...state,
        stations: action.payload,
        filteredStations: action.payload,
        isLoading: false,
      };
    case 'SET_FILTERED_STATIONS':
      return {
        ...state,
        filteredStations: action.payload,
        isLoading: false,
      };
    case 'SELECT_STATION':
      return {
        ...state,
        selectedStation: action.payload,
      };
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.payload,
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'ADD_STATION':
      return {
        ...state,
        stations: [...state.stations, action.payload],
        filteredStations: [...state.stations, action.payload],
      };
    case 'UPDATE_STATION':
      return {
        ...state,
        stations: state.stations.map(station => 
          station.id === action.payload.id ? action.payload : station
        ),
        filteredStations: state.filteredStations.map(station => 
          station.id === action.payload.id ? action.payload : station
        ),
        selectedStation: state.selectedStation?.id === action.payload.id 
          ? action.payload 
          : state.selectedStation,
      };
    case 'DELETE_STATION':
      return {
        ...state,
        stations: state.stations.filter(station => station.id !== action.payload),
        filteredStations: state.filteredStations.filter(station => station.id !== action.payload),
        selectedStation: state.selectedStation?.id === action.payload 
          ? null 
          : state.selectedStation,
      };
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const StationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stationReducer, initialState);

  useEffect(() => {
    // Load mock data on initial render
    dispatch({ type: 'SET_STATIONS', payload: mockStations });
    dispatch({ type: 'SET_REVIEWS', payload: mockReviews });
    
    // Simulate real-time status updates
    const interval = setInterval(() => {
      dispatch({
        type: 'SET_STATIONS',
        payload: state.stations.map(station => {
          // Randomly update status and currentUsers for simulation
          const statusOptions = ['Available', 'Busy', 'Inactive'] as const;
          const randomStatus = Math.random() > 0.8 
            ? statusOptions[Math.floor(Math.random() * statusOptions.length)] 
            : station.status;
          
          const newCurrentUsers = randomStatus === 'Available' 
            ? Math.floor(Math.random() * (station.maxCapacity / 2))
            : randomStatus === 'Busy'
              ? Math.floor(station.maxCapacity * 0.5 + Math.random() * (station.maxCapacity * 0.5))
              : 0;
            
          return {
            ...station,
            status: randomStatus,
            currentUsers: newCurrentUsers,
          };
        }),
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Apply filters whenever filters or stations change
  useEffect(() => {
    if (state.stations.length > 0) {
      let filtered = [...state.stations];
      
      // Apply connector type filter
      if (state.filters.connectorTypes.length > 0) {
        filtered = filtered.filter(station => 
          station.connectorTypes.some(type => 
            state.filters.connectorTypes.includes(type)
          )
        );
      }
      
      // Apply minimum rating filter
      if (state.filters.minRating > 0) {
        filtered = filtered.filter(station => 
          station.averageRating >= state.filters.minRating
        );
      }
      
      // Apply status filter
      if (state.filters.status.length > 0) {
        filtered = filtered.filter(station => 
          state.filters.status.includes(station.status)
        );
      }
      
      // Apply maximum price filter
      if (state.filters.maxPrice) {
        filtered = filtered.filter(station => 
          station.pricePerKwh <= state.filters.maxPrice!
        );
      }
      
      // Apply amenities filter
      if (state.filters.amenities.length > 0) {
        filtered = filtered.filter(station => 
          state.filters.amenities.every(amenity => 
            station.amenities.includes(amenity)
          )
        );
      }
      
      dispatch({ type: 'SET_FILTERED_STATIONS', payload: filtered });
    }
  }, [state.filters, state.stations]);

  const addStation = (stationData: Omit<Station, 'id'>) => {
    const newStation: Station = {
      ...stationData,
      id: `station-${Date.now()}`,
    };
    dispatch({ type: 'ADD_STATION', payload: newStation });
  };

  const updateStation = (station: Station) => {
    dispatch({ type: 'UPDATE_STATION', payload: station });
  };

  const deleteStation = (id: string) => {
    dispatch({ type: 'DELETE_STATION', payload: id });
  };

  const selectStation = (station: Station | null) => {
    dispatch({ type: 'SELECT_STATION', payload: station });
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'datePosted'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      datePosted: new Date().toISOString(),
      helpful: 0,
    };
    dispatch({ type: 'ADD_REVIEW', payload: newReview });
    
    // Update station average rating
    const stationReviews = [...state.reviews, newReview].filter(
      review => review.stationId === reviewData.stationId
    );
    const averageRating = stationReviews.reduce(
      (sum, review) => sum + review.rating, 0
    ) / stationReviews.length;
    
    const station = state.stations.find(s => s.id === reviewData.stationId);
    if (station) {
      updateStation({
        ...station,
        averageRating,
        totalReviews: stationReviews.length,
      });
    }
  };

  const updateFilters = (filters: Partial<StationFilters>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  };

  const getRecommendedStationsForUser = (lat: number, lng: number) => {
    return getRecommendedStations(state.stations, lat, lng);
  };

  return (
    <StationContext.Provider
      value={{
        ...state,
        addStation,
        updateStation,
        deleteStation,
        selectStation,
        addReview,
        updateFilters,
        getRecommendedStations: getRecommendedStationsForUser,
      }}
    >
      {children}
    </StationContext.Provider>
  );
};

export const useStations = () => {
  const context = useContext(StationContext);
  if (context === undefined) {
    throw new Error('useStations must be used within a StationProvider');
  }
  return context;
};