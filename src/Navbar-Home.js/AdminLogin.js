import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setAdminUsername] = useState('');
    const [password, setAdminPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setLoginError('');
                localStorage.setItem('adminLoggedIn', 'true'); // Save login status
                navigate('/admin/dashboard');  // Navigate to the admin dashboard
            } else {
                setLoginError(data.message);
            }
        } catch (error) {
            setLoginError('Error logging in.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login">
                <h2 className="admin-login-title">Admin Login</h2>
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <label className="admin-login-label">Username</label>
                    <input
                        type="text"
                        className="admin-login-input"
                        value={username}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        required
                    />
                    <label className="admin-login-label">Password</label>
                    <input
                        type="password"
                        className="admin-login-input"
                        value={password}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                    />
                    <button className="admin-login-button" type="submit">Login</button>
                </form>
                {loginError && <p className="admin-login-error">{loginError}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;
