import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ show, onClose, onSubmit }) => {
    const [passengerName, setPassengerName] = useState('');
    const [passengerAge, setPassengerAge] = useState('');
    
    useEffect(() => {
        if (show) {
            const savedPassengerName = localStorage.getItem('passengerName');
            const savedPassengerAge = localStorage.getItem('passengerAge');
            if (savedPassengerName) setPassengerName(savedPassengerName);
            if (savedPassengerAge) setPassengerAge(savedPassengerAge);
            localStorage.removeItem('passengerName');
            localStorage.removeItem('passengerAge');
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!passengerName || !passengerAge) {
            alert('Please enter passenger details');
            return;
        }

        const passengerDetails = { name: passengerName, age: passengerAge };
        localStorage.setItem('passengerName', passengerName);
        localStorage.setItem('passengerAge', passengerAge);
        onSubmit(passengerDetails);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal"style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Enter Passenger Details</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:
                        <input
                            id = "name"
                            type="text"
                            value={passengerName}
                            onChange={(e) => setPassengerName(e.target.value)}
                            required
                        />
                        </label>
                    </div>
                    <div>
                        <label>Age:
                        <input
                            id = "age"
                            type="number"
                            value={passengerAge}
                            onChange={(e) => setPassengerAge(e.target.value)}
                            required
                        />
                        </label>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
