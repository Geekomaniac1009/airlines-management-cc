import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ show, onClose, onSubmit }) => {
    const [passengerName, setPassengerName] = useState(localStorage.getItem('passengerName') || '');
    const [passengerAge, setPassengerAge] = useState(localStorage.getItem('passengerAge') || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!passengerName || !passengerAge) {
            alert('Please enter passenger details');
            return;
        }

        localStorage.setItem('passengerName', passengerName);
        localStorage.setItem('passengerAge', passengerAge);
        onSubmit({ passengerName, passengerAge });
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Enter Passenger Details</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={passengerName}
                            onChange={(e) => setPassengerName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Age:</label>
                        <input
                            type="number"
                            value={passengerAge}
                            onChange={(e) => setPassengerAge(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
