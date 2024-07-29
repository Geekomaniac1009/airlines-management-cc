# cc-airlines-management
 
Fly-Air is a flight booking application where users can search for available flights based on their travel preferences, view flight details, and book flights. The application is built with React for the frontend and Node.js for the backend. It uses a REST API to fetch flight data and handle bookings.

## Table of Contents
<li> Features </li>
<li> Live Demo </li>
<li> Technologies Used </li>
<li> Getting Started  </li>
<li> Prerequisites </li>
<li> Installation </li>
<li> Contributing  </li>
<li> License </li>

### Features
<li> User authentication (login and signup) </li>
<li> Search flights based on origin, destination, date, and class </li>
<li> View flight details </li>
<li> Book flights </li>
<li> Responsive design </li>

### Live Demo
Check out the live demo of the application deployed on Render: Fly-Air Live Demo

### Technologies Used
<li> Frontend: React, CSS </li>
<li>Backend: Node.js, Express </li>
<li>Database: MongoDB </li>

### Getting Started
Follow these steps to set up the project locally.

Prerequisites\
Node.js\
npm (Node Package Manager)\
MongoDB (or a MongoDB Atlas account)\

### Installation
Clone the repository

git clone https://github.com/your-username/fly-air.git/
cd fly-air/

Install backend dependencies

cd backend/
npm install/

Install frontend dependencies

cd ../frontend/
npm install/

Set up environment variables

Create a .env file in the backend directory with the following content:

PORT=5000/
MONGO_URI=your_mongodb_connection_string/
JWT_SECRET=your_jwt_secret/
Replace your_mongodb_connection_string and your_jwt_secret with your actual MongoDB connection string and a secret key for JWT.

### Usage
Run the backend server

sh
Copy code
cd backend
npm start
Run the frontend development server

sh
Copy code
cd frontend
npm start

Open your browser and navigate to

Copy code
http://localhost:3000

### Contributing
Contributions are welcome! Please follow these steps to contribute:

Fork the repository\
Create a new branch (git checkout -b feature/your-feature-name)\
Make your changes\
Commit your changes (git commit -m 'Add some feature')\
Push to the branch (git push origin feature/your-feature-name)\
Open a pull request\
### License
This project is licensed under the MIT License. See the LICENSE file for details.
