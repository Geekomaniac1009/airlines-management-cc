import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchFlight.css'

const SearchFlight = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [classFlight, setClassFlight] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!from || !to || !date || !classFlight) {
            alert('Please enter valid details for all fields.');
            return;
        }
        navigate(`/results?from=${from}&to=${to}&date=${date}&classFlight=${classFlight}`);
    };

    return (
        <div className="search-container">
            <div className="search-box">
                <label htmlFor="from">From:</label>
                <input type="text" id="from" name="from" placeholder="City or Airport" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="search-box">
                <label htmlFor="to">To:</label>
                <input type="text" id="to" name="to" placeholder="City or Airport" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="search-box">
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="search-box">
                <label htmlFor="classFlight">Class:</label>
                <select id="classFlight" name="classFlight" value={classFlight} onChange={(e) => setClassFlight(e.target.value)}>
                    <option value="">Select Class</option>
                    <option value="Business">Business</option>
                    <option value="Economy">Economy</option>
                </select>
            </div>
            <button className="search-button" onClick={handleSearch}>Search Flights</button>
        </div>
    );
};

export default SearchFlight;
