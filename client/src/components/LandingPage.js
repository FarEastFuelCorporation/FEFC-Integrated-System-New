// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <h1>Welcome to Our Application</h1>
            <p>Please login or sign up to continue.</p>
            <div className="auth-links">
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
};

export default LandingPage;
