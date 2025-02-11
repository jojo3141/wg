// Correctly load dotenv package and configure it
require('dotenv').config({ path: './credentials.env' });  // Using path to specify a custom env file
const axios = require('axios'); // Import axios at the top

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');


// Initialize Express app
const app = express();
const PORT = 3001;
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




// Connect to database
/* pool.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected successfully to database');
}); */

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

    const query = `UPDATE jobs SET person = ?, last_done = ? WHERE id = ?`;
    connection.query(query, [nextPerson, last_done, jobId], (err, result) => {
        if (err) {
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
 
/* const query = 'SELECT * FROM jobs';
pool.query(query, (err, results) => {
    if (err) {
        console.error("❌ Database query error:", err);
        res.status(500).json({ error: "Error fetching jobs", details: err.message });
        return;
    }
    console.log("✅ Query successful:", results);
    res.json(results);
}); */



// Helper function to calculate the next Monday, starting the week on Tuesday
function calculateNextMonday(lastDone, weeksToNext) {
    // Adjust the last done date to be the next Tuesday if the job was done on a Monday
    const dayOfWeek = lastDone.getUTCDay();  // Get day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

    // Move lastDone to the nearest Tuesday if it's before or on a Monday
    let daysToAdd = 0;
    if (dayOfWeek === 0) {
        daysToAdd = 2; // Sunday, move to Tuesday
    } else if (dayOfWeek === 1) {
        daysToAdd = 1; // Monday, move to Tuesday
    } else if (dayOfWeek > 1) {
        daysToAdd = 0; // Already Tuesday or later, no need to shift
    }

    // Move the date to the following Tuesday, then add the number of weeks
    const adjustedLastDone = new Date(lastDone);
    adjustedLastDone.setUTCDate(lastDone.getUTCDate() + daysToAdd + (weeksToNext * 7));

    // Now calculate the nearest Monday after that date
    const adjustedDayOfWeek = adjustedLastDone.getUTCDay();
    const daysUntilNextMonday = (8 - adjustedDayOfWeek) % 7; // Days until Monday (1)

    // Set the date to the following Monday
    adjustedLastDone.setUTCDate(adjustedLastDone.getUTCDate() + daysUntilNextMonday);

    return adjustedLastDone;
}






// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});