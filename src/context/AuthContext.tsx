import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // For demo purposes, we'll simulate API calls
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login for demo
      if (email === 'admin@example.com' && password === 'password') {
        const userData = {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          isAdmin: true,
        };
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, token } });
      } else if (email === 'user@example.com' && password === 'password') {
        const userData = {
          id: '2',
          email: 'user@example.com',
          name: 'Regular User',
          isAdmin: false,
        };
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, token } });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid email or password' });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'An error occurred during login' });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration for demo
      const userData = {
        id: '3',
        email,
        name,
        isAdmin: false,
      };
      const token = 'mock-jwt-token';
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch({ type: 'REGISTER_SUCCESS', payload: { user: userData, token } });
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: 'An error occurred during registration' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Load user data from localStorage on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: JSON.parse(user), token } 
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};