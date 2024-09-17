const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plan');
const setupRoutes = require('./routes/setup');
const paymentRoutes = require('./routes/payment');

const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;
// Connect to MongoDB
mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Routes
app.use('/api', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api', paymentRoutes);

app.use(cors());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});