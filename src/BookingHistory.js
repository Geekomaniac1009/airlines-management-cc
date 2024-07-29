import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import './BookingHistory.css'

const BookingHistory = () => {


const [bookings, setBookings] = useState([]);
const username = localStorage.getItem('username');
const [selectedBooking, setSelectedBooking] = useState(null);
const [rating, setRating] = useState(0);
const navigate = useNavigate();

useEffect(() => {
    fetchBookings();
}, [username]);

// fetch booking history of user
const fetchBookings = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${username}`);
        const data = await response.json();
        setBookings(data);
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
};

// if not rated yet, add a rating to the booked flight
const addRating = async (flightId) => {
    console.log(flightId);
    try {
        const response = await fetch('http://localhost:5000/api/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, flightId, rating }),
        });

        if (response.ok) {
            alert('Rating added successfully!');
            setSelectedBooking(null);
            setRating(0);
            fetchBookings();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error adding rating:', error);
        alert('Error adding rating');
    }
};

const cancelBooking = async (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (!booking) {
        return;
    }

    const currentDate = new Date();
    const flightDate = new Date(booking.flight.date);

    // if currentDate > flightDate, cancellation is not possible 
    if (flightDate < currentDate) {
        alert('Flight date has already passed, cancellation not possible');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingId }),
        });

        if (response.ok) {
            setBookings(bookings.filter(booking => booking._id !== bookingId));
            alert('Booking deleted successfully!');
        } else {
            alert('Error deleting booking');
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
};

// navigate to view ticket corresponding to booked flight
const viewTicket = (PNR) => {
    localStorage.setItem('pnr', PNR);
    navigate('/ticket');
};

const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
};

const handleCloseReview = () => {
    setSelectedBooking(null);
    setRating(0);
};

return (
    <div className="booking-history-container">
        <h2 className="booking-history-title">Booking History</h2>
        {bookings.length > 0 ? (
            <ul className="booking-list">
                {bookings.map((booking, index) => (
                    <li key={index} className="booking-item">
                        <p className="booking-info"><span className="label">Username:</span> <span className="token">{booking.username}</span></p>
                        <p className="booking-info"><span className="label">Flight ID:</span> <span className="token">{booking.flightId}</span></p>
                        <p className="booking-info"><span className="label">Flight Details:</span> <span className="token">{booking.flight.from} to {booking.flight.to} | Date: {new Date(booking.flight.date).toLocaleDateString()} | Time: {booking.flight.time}</span></p>
                        <p className="booking-info"><span className="label">Passenger Name:</span> <span className="token">{booking.passengerName}</span></p>
                        <p className="booking-info"><span className="label">Booking Date:</span> <span className="token">{new Date(booking.bookingDate).toLocaleDateString()}</span></p>
                        <p className="booking-info"><span className="label">PNR:</span> <span className="token">{booking.PNR}</span></p>
                        <div className="button-container">
                            <button className="view-ticket-btn" onClick={() => viewTicket(booking.PNR)}>View Ticket</button>
                            <button className="add-review-btn" onClick={() => handleOpenReview(booking)}>Add Review</button>
                            <button className="cancel-booking-btn" onClick={() => cancelBooking(booking._id)}>Cancel Booking</button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="no-booking-msg">No bookings available.</p>
        )}
        {selectedBooking && (
            <div className="review-modal">
                <div className="review-content">
                    <h3>Add Review for {selectedBooking.flight.from} to {selectedBooking.flight.to}</h3>
                    <StarRating value={rating} onChange={setRating} />
                    <div className="button-container">
                        <button className="submit-rating-btn" onClick={() => addRating(selectedBooking.flightId)}>Submit Rating</button>
                        <button className="cancel-review-btn" onClick={handleCloseReview}>Cancel</button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default BookingHistory;
