// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
            <div className="container-fluid">
                <div className="d-flex justify-content-between w-100">
                    {/* <!-- Left side with logo and brand name --> */}
                    <Link to="/" style={{ height: '40px', backgroundColor: '#303030', textDecoration: 'none' }} className="d-flex">
                        <img src="/images/logo.png" alt="Logo" />
                        <span>
                            <h6 className="d-flex align-items-center ps-2 fw-bold" style={{ color: '#ffbf00', fontFamily: 'Times New Roman' }}>FAR EAST FUEL<br />CORPORATION</h6>
                        </span>
                    </Link>

                    {/* <!-- Right side with navigation links --> */}
                    <div className="collapse navbar-collapse" id="navbarScroll">
                        <ul className="navbar-nav" style={{ marginLeft: 'auto' }}>
                            <li className="nav-item">
                                <Link to="/signup" className="nav-link">Sign Up</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">Log In</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LandingPage;
