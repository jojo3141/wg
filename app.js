// Correctly load dotenv package and configure it
require('dotenv').config({ path: './credentials.env' });  // Using path to specify a custom env file
const axios = require('axios'); // Import axios at the top

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');


// Initialize Express app
const app = express();
app.listen(3000);


// MySQL database connection configuration using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Limits simultaneous connections
    queueLimit: 0
});



// Test Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Error connecting to database:", err);
    } else {
        console.log("✅ Connected successfully to database");
        connection.release(); // Release the connection back to the pool
    }
});


const people = ['Jeanne', 'Noella', 'Josia', 'Franek', 'Livia'];

// Serve static files (like index.html) from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());  // Middleware to parse JSON request bodies


app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'start.html'));  // Serve start.html instead of index.html
});

app.post('/update-job/:id', (req, res) => {
    const jobId = req.params.id;
    const { person, last_done } = req.body;

    const currentPersonIndex = people.indexOf(person);
    const nextPersonIndex = (currentPersonIndex + 1) % people.length;
    const nextPerson = people[nextPersonIndex];

    console.log("id:", jobId);
    console.log("currentPerson:", person);
    console.log("nextPerson", nextPerson);
    console.log("last_done:", last_done);

    const query = `UPDATE jobs SET person = ?, last_done = ? WHERE id = ?`;
    pool.query(query, [nextPerson, last_done, jobId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error updating job in database');
            return;
        }

        // Return the updated job data
        res.status(200).json({
            id: jobId,
            person: nextPerson,
            last_done
        });
    });
});

app.get('/jobs', (req, res) => {
    const query = 'SELECT * FROM jobs';
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching jobs from database');
            return;
        }

        const today = new Date();
        
        results.forEach(job => {
            if (job.last_done) {
                const lastDone = new Date(job.last_done);
                const weeksToNext = job.weeks;

                // Get the next Monday after the last done date + weeks
                const nextDeadline = calculateNextMonday(lastDone, weeksToNext);

                // Calculate the difference in days from today to the deadline
                const daysLeft = Math.ceil((nextDeadline - today) / (1000 * 60 * 60 * 24));

                job.deadline = daysLeft;
            } else {
                job.deadline = 'No deadline';  
            }
        });

        res.json(results);
    });
});


// Simplified function to calculate the next Monday and add weeksToNext weeks
function calculateNextMonday(lastDone, weeksToNext) {
    let date = new Date(lastDone);

    // Move to the next Monday
    const dayOfWeek = date.getUTCDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7; // Ensures at least 1 day forward
    date.setUTCDate(date.getUTCDate() + daysUntilNextMonday);

    // Add the specified number of weeks
    date.setUTCDate(date.getUTCDate() + ((weeksToNext-1) * 7));

    return date;
}


// Start the server
// remove for deploying!
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});