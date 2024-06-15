import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [flightDetails, setFlightDetails] = useState({
        flightId: '',
        classFlight: '',
        from: '',
        to: '',
        date: '',
        availability: '',
        price: '',
        rating: '',
        time: '',
        duration: '',
    });
    const [flightError, setFlightError] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/admin/login');
        }
        const interval = setInterval(() => {
            const dateTime = new Date().toLocaleString();
            document.getElementById('date-time').innerText = dateTime;
        }, 1000);

        return () => clearInterval(interval);
    }, [isLoggedIn, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFlightDetails({
            ...flightDetails,
            [name]: value,
        });
    };

    const handleCreateFlight = async (e) => {
        e.preventDefault();
        if (validateFlightDetails()) {
            try {
                const response = await fetch('http://localhost:5000/api/admin/create-flight', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(flightDetails),
                });

                const data = await response.json();
                if (response.ok) {
                    setFlightError('');
                    alert('Flight created successfully!');
                    setFlightDetails({
                        flightId: '',
                        classFlight: '',
                        from: '',
                        to: '',
                        date: '',
                        availability: '',
                        price: '',
                        rating: '',
                        time: '',
                        duration: '',
                    });
                } else {
                    setFlightError(data.message);
                }
            } catch (error) {
                setFlightError('Failed to create flight');
                console.error('Error creating flight:', error);
            }
        }
    };

    const validateFlightDetails = () => {
        const {
            flightId,
            classFlight,
            from,
            to,
            date,
            availability,
            price,
            rating,
            time,
            duration,
        } = flightDetails;

        if ( !flightId || !classFlight || !from || !to || !date ||
            !availability || !price || !rating || !time || !duration) {
            setFlightError('Please enter all the details');
            return false;
        }
        return true;
    };

    return (
        <div className="admin-dashboard-container">
            {isLoggedIn && (
                <nav className="navbar">
                    <span>Hi, Admin</span>
                    <span id="date-time"></span>
                    <button className="home-button" onClick={() => {
                        localStorage.removeItem('adminLoggedIn');
                        navigate('/');
                    }}>Return to Home Page</button>
                </nav>
            )}
            <div className="admin-dashboard">
                <h2>Create New Flight</h2>
                <form onSubmit={handleCreateFlight} className="flight-form">
                    <label>Flight ID</label>
                    <input className="dashboard-input"
                        type="text"
                        name="flightId"
                        value={flightDetails.flightId}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Class</label>
                    <select className="dashboard-select"
                        name="classFlight"
                        value={flightDetails.classFlight}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Class</option>
                        <option value="Business">Business</option>
                        <option value="Economy">Economy</option>
                    </select>
                    <label>From</label>
                    <input className="dashboard-input"
                        type="text"
                        name="from"
                        value={flightDetails.from}
                        onChange={handleInputChange}
                        required
                    />
                    <label>To</label>
                    <input className="dashboard-input"
                        type="text"
                        name="to"
                        value={flightDetails.to}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Date</label>
                    <input className="dashboard-input"
                        type="date"
                        name="date"
                        value={flightDetails.date}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Availability</label>
                    <input className="dashboard-input"
                        type="number"
                        name="availability"
                        value={flightDetails.availability}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Price</label>
                    <input className="dashboard-input"
                        type="number"
                        name="price"
                        value={flightDetails.price}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Rating</label>
                    <input className="dashboard-input"
                        type="number"
                        name="rating"
                        value={flightDetails.rating}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Time</label>
                    <input className="dashboard-input"
                        type="time"
                        name="time"
                        value={flightDetails.time}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Duration</label>
                    <input className="dashboard-input"
                        type="text"
                        name="duration"
                        value={flightDetails.duration}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit" className="createFlight">Create Flight</button>
                    {flightError && <p className="error">{flightError}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
