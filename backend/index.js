const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const timetableRoutes = require('./routes/timetable');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Smart Task Planner API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
