const mongoose = require('mongoose');
require('dotenv').config();

const { Schema } = mongoose;

let nextUserId = 1;
const getNextUserId = () => {
    const userId = `u${nextUserId}`;
    nextUserId++;
    return userId;
};

let nextFlightId = 1;
const getNextFlightId = () => {
    const flightId = `u${nextFlightId}`;
    nextFlightId++;
    return flightId;
};

// Define the admin schema
const adminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Define the user schema
const userSchema = new Schema({
    userId: { type: String, required: true, unique: true, default: getNextUserId },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 40000 },
    // Bookings attribute pertains to flights booked by the user, referenced from the booking schema
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }], 
});

// Define the user rating schema to keep a tab on flights rated by user
const userRatingSchema = new Schema({
    userId: { type: String, required: true },
    flightId: { type: String, required: true },
    flight: {
        flightId: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        classFlight: { type: String, required: true }, 
        duration: { type: String, required: true },
        price: { type: Number, required: true },
    },
    rating: { type: Number, required: true },
});


// Define the flight schema for searching flights
const flightSchema = new Schema({
    flightId: { type: String, required: true, unique: true,  default: getNextFlightId },
    classFlight: { type: String, require: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    date: { type: String, required: true },
    availability: { type: Number, required: true, default: 240 },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true},
    totalRatings: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 10 },
});

// Define the booking schema to account for the flights booked by the user
const bookingSchema = new Schema({
    username: { type: String, required: true },
    flightId: { type: String, required: true },
    flight: {
        flightId: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        classFlight: { type: String, required: true }, 
        duration: { type: String, required: true },
        price: { type: Number, required: true },
    },
    passengerName: { type: String, required: true },
    passengerAge: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    PNR: { type: String, required: true },
});

// Create models for each schema 
const User = mongoose.model('User', userSchema);
const UserRating = mongoose.model('UserRating', userRatingSchema);
const Flight = mongoose.model('Flight', flightSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Connect to MongoDB (MONGO_URI for compass used in .env file)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = {
    User,
    UserRating,
    Flight,
    Booking, 
    Admin,
};
