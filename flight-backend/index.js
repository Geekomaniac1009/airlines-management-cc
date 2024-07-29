const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { User, UserRating, Flight, Booking, Admin } = require('./database');

// Backend operations are performed at localhost::5000
const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

// Connecting to mongoDB
mongoose.connect('mongodb://localhost:27017/airlines-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Admin login (separate from user login)
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    try {
        const admin = await Admin.findOne({ username, password });
        console.log(admin);
        if (admin) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Creating a new flight (admin only)
app.post('/api/admin/create-flight', async (req, res) => {
    const { flightId, classFlight, from, to, date, availability, price, rating, time, duration } = req.body;
    try {

        // Initial rating given by admin is equivalent to rating given by 10 users
        const numRatings = 10;
        const totalRatings = numRatings*rating;

        const newFlight = new Flight({
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
            totalRatings,
            numRatings,
        });

        await newFlight.save();
        res.json({ message: 'Flight created successfully', flight: newFlight });
    } catch (error) {
        res.status(500).json({ message: 'Error creating flight', error });
    }
});

// Fetch user profile
app.get('/api/profiles/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            username: user.username,
            email: user.email,
            balance: user.balance,
        });
    } 
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Set user balance to 40000, if balance is greater than or equal to 40000, indicate the same to the user
app.post('/api/profiles/:username/set-balance', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.balance >= 40000) {
            return res.status(400).json({ user, message: 'Sufficient balance present' });
        }

        user.balance = 40000;
        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Error setting balance:', error);
        res.status(500).json({ message: 'Error setting balance' });
    }
});

// Change user password
app.post('/api/profiles/:username/change-password', async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = password; 
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const validUser = await User.findOne({ username, password });
        if (validUser) {
            res.json(validUser);
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } 
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Signup user 
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(409).json({ message: 'Username already exists' });
            return;
        }
        
        // Creating a new user in the database corresponding to the signup
        const newUser = new User({
            userId: `u${Math.floor(Math.random() * 10000)}`, 
            username,
            email,
            password: password,
            balance: 40000,
            bookings: [],
        });

        await newUser.save();
        res.json(newUser);
    } 
    catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Error signing up', error });
    }
});

// Flight search and filter
app.get('/api/flights', async (req, res) => {
    const { from, to, date, classFlight } = req.query;
    try {
        const query = {};
        if (from) query.from = from;
        if (to) query.to = to;
        if (date) query.date = date;
        if (classFlight) query.classFlight = classFlight;

        const flights = await Flight.find(query);
        res.json(flights);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching flights', error });
    }
});

// Book flight
app.post('/api/book', async (req, res) => {
    const { username, flightId, passengerDetails } = req.body;
    console.log(req.body);
    try {
        console.log(`Booking flight for user: ${username}, flightId: ${flightId}`);
        const user = await User.findOne({ username });
        const flight = await Flight.findOne({ flightId });

        if (!user || !flight) {
            console.error('User or flight not found');
            return res.status(404).json({ message: 'User or flight not found' });
        }

        if (flight.availability <= 0) {
            console.error('No seats available');
            return res.status(400).json({ message: 'No seats available' });
        }

        if (user.balance < flight.price) {
            console.error('Insufficient balance');
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        user.balance -= flight.price;
        flight.availability -= 1;

        // Randomly generating the PNR for the flight
        const PNR = `PNR${Math.floor(Math.random() * 1000000)}`;

        // Booked flight added to booking (for ticket generation)
        const booking = new Booking({
            username,
            flightId,
            flight: {
                flightId: flight.flightId,
                from: flight.from,
                to: flight.to,
                date: flight.date,
                classFlight: flight.classFlight, 
                duration: flight.duration,
                price: flight.price,
                time: flight.time,
            },
            passengerName: passengerDetails.name,
            passengerAge: passengerDetails.age,
            bookingDate: new Date(),
            PNR: PNR,
        });
        
        // Updating the databases after the function is executed
        await booking.save();
        await user.save();
        await flight.save();

        console.log('Flight booked successfully');
        res.json({ message: 'Flight booked successfully', user, flight });
    } 
    catch (error) {
        console.error('Error booking flight', error);
        res.status(500).json({ message: 'Error booking flight', error });
    }
        
});

// 
app.get('/api/bookings/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const bookings = await Booking.find({ username });
        res.json(bookings);
    } 
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// Cancel flight
app.post('/api/cancel', async (req, res) => {
    const { bookingId } = req.body;
    try {
        // Find the booking to be deleted
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Find the corresponding flight
        const flight = await Flight.findOne({ flightId: booking.flightId });
        const user = await User.findOne({ username: booking.username });
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        if(!user) {
            return res.status(401).json( { message: 'User not found' });
        }
        
        // Check if the flight date is in the past
        const currentDate = new Date();
        const flightDate = new Date(flight.date);
        if (flightDate < currentDate) {
            return res.status(400).json({ message: 'Flight date has already passed, cancellation not possible' });
        }
        
        flight.availability += 1;
        user.balance += flight.price;
        
        const userId = user.username;
        const flightId = flight.flightId;
        
        // On deleting the flight, if there is any review associated with the flight, cancel it
        const rating = await UserRating.findOneAndDelete({ userId: userId, flightId });
        if (rating) {
            // Update flight's total ratings and number of ratings
            flight.totalRatings -= rating.rating;
            flight.numberOfRatings -= 1;
            flight.rating = flight.numberOfRatings > 0 ? flight.totalRatings / flight.numberOfRatings : 0;
        }

        // Save updated flight
        await flight.save();
        await user.save();
        // Delete the rating
        await Booking.findByIdAndDelete(bookingId);

        res.json({ message: 'Rating deleted successfully', flight });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rating', error });
    }
});

// Add user rating
app.post('/api/ratings', async (req, res) => {
    const { username, flightId, rating } = req.body;
    console.log(req.body);
    try {
        const flight = await Flight.findOne({ flightId });
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        // Check if the user has already rated this flight
        const existingRating = await UserRating.findOne({ userId: username, flightId });
        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this flight.' });
        }

        const userRating = new UserRating({ 
            userId: username, 
            flightId, 
            flight : {
                flightId: flight.flightId,
                from: flight.from,
                to: flight.to,
                date: flight.date,
                classFlight: flight.classFlight, 
                duration: flight.duration,
                price: flight.price,
                time: flight.time,
            } ,
            rating,
         });
        console.log(userRating);
        await userRating.save();

        flight.totalRatings += rating;
        flight.numberOfRatings += 1;
        flight.rating = flight.totalRatings / flight.numberOfRatings;
        
        await flight.save();

        res.json({ message: 'Rating added successfully', flight });
    } catch (error) {
        res.status(500).json({ message: 'Error adding rating', error });
    }
});

// GET request to fetch flights rated by user
app.get('/api/ratings/:uid', async (req, res) => {
    const { uid } = req.query;
    console.log(uid);
    const query = {};
        if (uid) query.userId = uid;
    try {
        const userRatings = await UserRating.find(query);
        res.json(userRatings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user ratings', error });
    }
});

/// Delete user rating
app.post('/api/ratings/delete', async (req, res) => {
    const { ratingId } = req.body;

    try {
        // Find the rating to be deleted
        const rating = await UserRating.findById(ratingId);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Find the corresponding flight
        const flight = await Flight.findOne({ flightId: rating.flightId });
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        // Update flight's total ratings and number of ratings
        flight.totalRatings -= rating.rating;
        flight.numberOfRatings -= 1;
        flight.rating = flight.numberOfRatings > 0 ? flight.totalRatings / flight.numberOfRatings : 0;

        // Save updated flight
        await flight.save();

        // Delete the rating
        await UserRating.findByIdAndDelete(ratingId);

        res.json({ message: 'Rating deleted successfully', flight });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rating', error });
    }
});

app.get('/api/tickets/:pnr', async (req, res) => {
    const { pnr } = req.body;
    console.log(req.body);
    try {
        const booking = await Booking.findOne({ pnr });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
