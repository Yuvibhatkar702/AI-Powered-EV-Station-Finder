import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StationProvider } from './context/StationContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StationList from './pages/StationList';
import StationDetails from './components/stations/StationDetails';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <StationProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/stations" element={<StationList />} />
                <Route path="/stations/:stationId" element={<StationDetails />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <footer className="bg-white py-4 text-center text-sm text-gray-500">
              <p>© 2025 EV Finder. All rights reserved.</p>
            </footer>
          </div>
        </Router>
      </StationProvider>
    </AuthProvider>
  );
}

export default App;