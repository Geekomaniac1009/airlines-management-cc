import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter, faInstagramSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import HomeNavbar from "./Navbar-Home.js/Navbar-Home";
import SearchFlight from "./SearchFlight";
import TestimonialSlider from "./TestimonialSlider";
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <br />
            <br />
            <br />
            <HomeNavbar />
            <hr className="header-divider" />
            <div className="content-wrapper">
                <div className="home-content">
                    <div className="home-text">
                        <h1>Welcome to FlyAir</h1>
                        <p>The sky no more a limit for seamless flight experience.</p>
                        <p>The one-stop destination for booking flights.</p>
                    </div>
                    <div className="home-buttons">
                        <p>If you are the administrator, <Link to="/admin/login">click here</Link></p>
                        <SearchFlight />
                    </div>
                </div>
            </div>
            <TestimonialSlider />
            <footer className="footer">
                <div className="social-icons">
                    <Container>
                    <a href="https:://facebook.com" alt="Facebook"><FontAwesomeIcon icon = {faFacebook} /></a>
                    <a href="https:://twitter.com" alt="Twitter"><FontAwesomeIcon icon = {faXTwitter} /></a>
                    <a href="https:://instagram.com" alt="Instagram"><FontAwesomeIcon icon = {faInstagramSquare} /></a>
                    <a href="https:://linkedin.com" alt="LinkedIn"><FontAwesomeIcon icon = {faLinkedin} /></a>
                    </Container>
                </div>
                <hr className="divider" />
                <p className="copyright">&copy; {new Date().getFullYear()} FlyAir Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
