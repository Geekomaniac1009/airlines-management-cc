import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import './FlightRatings.css';

const FlightRatings = () => {
    const [ratings, setRatings] = useState([]);
    const uid = localStorage.getItem('username');

    useEffect(() => {
        fetchUserRatings();
    }, []);

    const fetchUserRatings = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ratings/${uid}`);
            const data = await response.json();
            console.log(data);
            setRatings(data);
        } catch (error) {
            console.error('Error fetching user ratings:', error);
        }
    };

    const deleteRating = async (ratingId) => {
        try {
            const response = await fetch('http://localhost:5000/api/ratings/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ratingId }),
            });

            if (response.ok) {
                setRatings(ratings.filter(rating => rating._id !== ratingId));
                alert('Rating deleted successfully!');
            } else {
                alert('Error deleting rating');
            }
        } catch (error) {
            console.error('Error deleting rating:', error);
        }
    };

    return (
        <div className="my-ratings">
            <h2>My Ratings</h2>
            {ratings.length > 0 ? (
                <ul className="rating-list">
                    {ratings.map((rating) => (
                        <li key={rating._id} className="rating-item">
                            <p><span className="label">Flight ID:</span> <span className="token">{rating.flightId}</span></p>
                            <p><span className="label">Flight Details:</span> <span className="token">{rating.flight.from} to {rating.flight.to} | Date: {new Date(rating.flight.date).toLocaleDateString()} | Time: {rating.flight.time}</span></p>
                            <p><span className="label">Rating:</span> <StarRating value={rating.rating} /></p>
                            <button className="delete-rating-btn" onClick={() => deleteRating(rating._id)}>Delete Rating</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No ratings available.</p>
            )}
        </div>
    );
};

export default FlightRatings;
