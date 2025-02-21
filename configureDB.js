// Correctly load dotenv package and configure it
require('dotenv').config({ path: './credentials.env' });  // Using path to specify a custom env file
const fs = require('fs');
const mysql = require('mysql2');

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


// Function to insert a new job entry into the database
function addJob(title, person, weeks, last_done, description) {
    const query = "INSERT INTO jobs (title, person, weeks, last_done, description) VALUES (?, ?, ?, ?, ?)";
    
    pool.query(query, [title, person, weeks, last_done, description], (err, result) => {
        if (err) {
            console.error("❌ Error inserting job:", err);
            return;
        }
        console.log("✅ Job inserted successfully, ID:", result.insertId);
    });
}

// Function to delete all entries from the 'jobs' table
function clearJobsTable() {
    const query = "DELETE FROM jobs";

    pool.query(query, (err, result) => {
        if (err) {
            console.error("❌ Error clearing jobs table:", err);
            return;
        }
        console.log("🗑️ All jobs deleted successfully");
    });
}


function fillInNewJobsFromFile() {
// Read the jobs.json file
fs.readFile('jobs.json', 'utf8', (err, data) => {
    if (err) {
        console.error("❌ Error reading file:", err);
        return;
    }

    try {
        const jobs = JSON.parse(data); // Parse JSON data

        jobs.forEach(job => {
            // Convert today's date to the correct format
            const today = new Date();
            const formattedDate = today.toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:MM:SS"

            // Insert job into the database
            addJob(job.title, job.person, job.weeks, formattedDate, job.description);
        });

    } catch (parseError) {
        console.error("❌ Error parsing JSON:", parseError);
    }
});

}


clearJobsTable();
fillInNewJobsFromFile();