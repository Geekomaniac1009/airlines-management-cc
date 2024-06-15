import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from './Modal';
import './FlightResults.css';

const FlightResults = () => {
    const [flights, setFlights] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const from = queryParams.get('from');
        const to = queryParams.get('to');
        const date = queryParams.get('date');
        const classFlight = queryParams.get('classFlight');

        fetchFlights(from, to, date, classFlight);

        const userLoggedIn = localStorage.getItem('loggedIn') === 'true';
        if (userLoggedIn) {
            setLoggedIn(true);
            setUsername(localStorage.getItem('username'));
        }
    }, [location]);

    const fetchFlights = async (from, to, date, classFlight) => {
        try {
            const response = await fetch(`http://localhost:5000/api/flights?from=${from}&to=${to}&date=${date}&classFlight=${classFlight}`);
            const data = await response.json();
            setFlights(data.sort((a, b) => a.price - b.price));
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    };

    const handleBookFlight = async (flightId, passengerDetails) => {
        if (!loggedIn) {
            window.location.href = '/';
            return;
        }

        try {
            console.log(`Booking flight with ID: ${flightId} for user: ${username}`);
            const response = await fetch(`http://localhost:5000/api/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, flightId, passengerDetails }),
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const data = await response.json();
                if (response.ok) {
                    alert('Flight booked successfully!');
                    setFlights(flights.map(flight =>
                        flight.flightId === flightId ? { ...flight, availability: flight.availability - 1 } : flight
                    ));
                } else {
                    alert(data.message);
                }
            } else {
                const text = await response.text();
                console.error('Unexpected response format:', text);
                alert('An unexpected error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error booking flight:', error);
            alert('Error booking flight');
        }
    };

    const openModal = (flightId) => {
        setSelectedFlightId(flightId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedFlightId(null);
    };

    const handleModalSubmit = () => {
        const passengerName = localStorage.getItem('passengerName');
        const passengerAge = localStorage.getItem('passengerAge');
        const passengerDetails = {name: passengerName, age: passengerAge};
        console.log(passengerDetails);
        handleBookFlight(selectedFlightId, passengerDetails);
        closeModal();
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>&#9733;</span>
            );
        }
        return stars;
    };

    return (
        <div className="flight-results">
            <h2>Available Flights</h2>
            {flights.length > 0 ? (
                <ul>
                    {flights.map((flight) => (
                        <li key={flight.flightId} className="flight-item">
                            <div className="flight-header">
                                <p className="duration">{flight.duration} hours</p>
                                <div className="rating">{renderStars(flight.rating)}</div>
                            </div>
                            <p>{flight.classFlight}</p>
                            <p>Flight from: {flight.from} to {flight.to}</p>
                            <p>Date: {new Date(flight.date).toLocaleDateString()}</p>
                            <p>Cost: ${flight.price}</p>
                            <p className={`availability ${flight.availability < 50 ? 'low' : 'high'}`}>
                                Availability: {flight.availability}
                            </p>
                            <button className="book-flight-btn" onClick={() => openModal(flight.flightId)}>Book Flight</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No flights available for the selected criteria.</p>
            )}
            <Modal show={showModal} onClose={closeModal} onSubmit={handleModalSubmit} />
        </div>
    );
};

export default FlightResults;
