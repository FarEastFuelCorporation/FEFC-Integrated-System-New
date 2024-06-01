import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../auth';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('marketing'); // Default role
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        signup({ username, role });
        navigate('/dashboard');
    };

    return (
        <div>
            <h2>Signup</h2>
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
                {/* <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="marketing">Marketing</option>
                    <option value="dispatching">Dispatching</option>
                    <option value="receiving">Receiving</option>
                </select> */}
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
