// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { login } from '../../auth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('marketing'); // Default role
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ username, role }); // Include role in login
        navigate('/dashboard'); // Use navigate instead of history.push
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="marketing">Marketing</option>
                    <option value="dispatching">Dispatching</option>
                    <option value="receiving">Receiving</option>
                </select>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
