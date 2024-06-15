import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlightResults from './FlightResults';
import HomeNavbar from './Navbar-Home.js/Navbar-Home';
import Profile from './Profile';
import FlightRatings from './FlightRatings';
import BookingHistory from './BookingHistory';
import AdminLogin from './Navbar-Home.js/AdminLogin';
import AdminDashboard from './Navbar-Home.js/AdminDashboard';
import Ticket from './Ticket'; 
import Home from './Home';



function App() {
    return (
        <Router>
            <div className="App">
                <HomeNavbar />
               
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/results" element={<FlightResults />} />
                    <Route path="/user/profile" element = {<Profile />} />
                    <Route path="/user/reviews" element = {<FlightRatings />} />
                    <Route path="/user/booking-history" element = {< BookingHistory/>}/>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/ticket" element={<Ticket />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
