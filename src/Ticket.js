import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Ticket.css';

const Ticket = () => {
const [ticket, setTicket] = useState(null);
const [seatNumber, setSeatNumber] = useState(localStorage.getItem('seatNumber') || '');
const pnr = localStorage.getItem('pnr');
console.log(pnr);
useEffect(() => {
if (pnr) {
fetchBooking();
}
}, [pnr]);

useEffect(() => {
    localStorage.setItem('seatNumber', seatNumber);
}, [seatNumber]);
const row = Math.floor(Math.random() * 30) + 1;
const column = String.fromCharCode(65 + Math.floor(Math.random() * 6));
const fetchBooking = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/tickets/${pnr}`);
        const data = await response.json();
        console.log(data);
        setTicket(data);
        if (!seatNumber) {
            setSeatNumber(`${row}${column}`);
        }
    } catch (error) {
        console.error('Error fetching booking:', error);
    }
};

if (!ticket) {
    return <p>Loading ticket details...</p>;
}

return (
    <div className="ticket-container">
        <h2>Ticket Details</h2>
        <p><strong>PNR:</strong> {ticket.PNR}</p>
        <p><strong>Username:</strong> {ticket.username}</p>
        <p><strong>Flight ID:</strong> {ticket.flight.flightId}</p>
        <p><strong>From:</strong> {ticket.flight.from}</p>
        <p><strong>To:</strong> {ticket.flight.to}</p>
        <p><strong>Date:</strong> {new Date(ticket.flight.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {ticket.flight.time}</p>
        <p><strong>Duration:</strong> {ticket.flight.duration}</p>
        <p><strong>Class:</strong> {ticket.flight.classFlight}</p>
        <p><strong>Price:</strong> ${ticket.flight.price}</p>
        <p><strong>Passenger Name:</strong> {ticket.passengerName}</p>
        <p><strong>Passenger Age:</strong> {ticket.passengerAge}</p>
        <p><strong>Seat Number: </strong> {seatNumber}</p>
        <p><Link to ="/user/booking-history">View Another Ticket</Link></p>
    </div>
);
};

export default Ticket;