import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import UserDashboard from './UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
