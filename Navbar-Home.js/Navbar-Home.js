import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar-Home.css';

const HomeNavbar = () => {
// For the sliding login/signup windows
const [showLogin, setShowLogin] = useState(false);
const [showSignup, setShowSignup] = useState(false);

// Tabs to keep an account of the login status, username
const [loggedIn, setLoggedIn] = useState(false);
const [username, setUsername] = useState('');

// Login/Signup details to be checked if valid
const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });
const [signupDetails, setSignupDetails] = useState({ username: '', email: '', password: '' });
const location = useLocation();
// State for maintaining status of login/signup error (if any)
const [loginError, setLoginError] = useState('');
const [signupError, setSignupError] = useState('');

// User dropdown, to be displayed after successful login/signup
const [showDropdown, setShowDropdown] = useState(false);

const isAdminLogin = (location.pathname === '/admin/login' || location.pathname === '/admin/dashboard');

useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        setLoggedIn(true);
        setUsername(storedUsername);
    }
}, []);

// Toggles to ensure form transitions in/out on a click 
const toggleLogin = () => setShowLogin(!showLogin);
const toggleSignup = () => setShowSignup(!showSignup);
const toggleDropdown = () => setShowDropdown(!showDropdown);

const handleLoginChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
};

const handleSignupChange = (e) => {
    setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value });
};

const validateLogin = () => {
    const { username, password } = loginDetails;
    if (!username || !password) {
        setLoginError('Please fill out all fields.');
        return false;
    }
    return true;
};

const validateSignup = () => {
    const { username, email, password } = signupDetails;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username || !email || !password) {
        setSignupError('Please fill out all fields.');
        return false;
    } else if (!emailPattern.test(email)) {
        setSignupError('Please enter a valid email address.');
        return false;
    }
    return true;
};

const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDetails),
            });
            const data = await response.json();

            if (response.ok) {
                setLoginError('');
                setLoggedIn(true);
                setUsername(data.username);
                localStorage.setItem('username', data.username);
                localStorage.setItem('loggedIn', 'true');
                setShowLogin(false);
            } 
            else {
                setLoginError(data.message);
            }
        } catch (error) {
            setLoginError('Error logging in.');
            console.error('Error:', error);
        }
    }
};

const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (validateSignup()) {
        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupDetails),
            });
            console.log(signupDetails);
            const data = await response.json();
            if (response.ok) {
                setSignupError('');
                setLoggedIn(true);
                setUsername(data.username);
                localStorage.setItem('username', data.username);
                localStorage.setItem('loggedIn', 'true');
                setShowSignup(false);
            } else {
                setSignupError(data.message);
            }
        } catch (error) {
            setSignupError('Error signing up.');
            console.error('Error:', error);
        }
    }
};

const handleSignOut = () => {
    setLoggedIn(false);
    setUsername('');
    setShowDropdown(false);
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn');
};

if (isAdminLogin) {
    return null;
}

return (
    <header className="header-container">
        <div className="button-container">
            {!loggedIn ? (
                <>
                    <button id="loginBtn" onClick={toggleLogin}>Login</button>
                    <button id="signupBtn" onClick={toggleSignup}>Signup</button>
                </>
            ) : (
                <div className="user-menu">
                    <span onClick={toggleDropdown}>Hi, {username}</span>
                    <img src="/user.png" alt="" className="user-icon" onClick={toggleDropdown} />
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <Link to="/"><button>Home</button></Link>
                            <Link to="/user/profile"><button>My Profile</button></Link>
                            <Link to="/user/booking-history"><button>Booking History</button></Link>
                            <Link to="/user/reviews"><button>Reviews</button></Link>
                            <Link to= "/"><button onClick={handleSignOut}>Signout</button></Link>
                        </div>
                    )}
                </div>
            )}
        </div>
        {showLogin && (
            <div id="loginWindow" className="login-window">
                <div className="login-content">
                    <span id="closeLoginBtn" className="close-btn" onClick={toggleLogin}>&times;</span>
                    <h2>Login</h2>
                    {loginError && <p className="error">{loginError}</p>}
                    <form onSubmit={handleLoginSubmit}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={loginDetails.username}
                            onChange={handleLoginChange}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginDetails.password}
                            onChange={handleLoginChange}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        )}
        {showSignup && (
            <div id="signupWindow" className="signup-window">
                <div className="signup-content">
                    <span id="closeSignupBtn" className="close-btn" onClick={toggleSignup}>&times;</span>
                    <h2>Signup</h2>
                    {signupError && <p className="error">{signupError}</p>}
                    <form onSubmit={handleSignupSubmit}>
                        <label htmlFor="newUsername">Username</label>
                        <input
                            type="text"
                            id="newUsername"
                            name="username"
                            value={signupDetails.username}
                            onChange={handleSignupChange}
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={signupDetails.email}
                            onChange={handleSignupChange}
                            required
                        />
                        <label htmlFor="newPassword">Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="password"
                            value={signupDetails.password}
                            onChange={handleSignupChange}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        )}
    </header>
);
};

export default HomeNavbar;