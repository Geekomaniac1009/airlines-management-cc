const mongoose = require('mongoose');
const Admin = require('./database'); 

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create Admin
const createAdmin = async () => {
    try {
        const admin = new Admin({
            username: 'sanchay',
            password: 'san_wiz04',
        });
        await admin.save();
        console.log('Admin created:', admin);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();
