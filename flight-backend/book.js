const express = require('express');
const app = express();
app.use(express.json());

// Assuming you have a database to store booked flights
let bookedFlights = [];

app.post('/api/book-flight', (req, res) => {
    const { flightId } = req.body;

    // Add flight to booked flights record
    bookedFlights.push({ userId: req.user.id, flightId });

    // Optionally, you can save bookedFlights to your database

    res.json({ success: true });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
