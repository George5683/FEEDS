const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 8005;

// Function to set up middleware and routes
function setupServer() {
  // Serve static files from the Source and Resources directories
  app.use(express.static(path.join(__dirname, 'Source')));
  app.use(express.static(path.join(__dirname, 'Resources')));

  // Serve the login.html file
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'login.html'));
  });
}

// Function to add a user
function add_user(username, password, name, zip_code, email) {
  // Create a connection to the database
  const connection = mysql.createConnection({
    host: '192.168.0.11', // Replace with your Raspberry Pi's IP
    user: 'admin',         // The user you created
    password: 'password',  // The user's password
    database: 'USERS'      // The database name where USER_INFO is located
  });

  // Connect to the database
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the USERS database!');

    // SQL query to insert a new user
    const sql = 'INSERT INTO USER_INFO (USERNAME, PASSWORD, NAME, ZIP_CODE, EMAIL) VALUES (?, ?, ?, ?, ?)';
    const values = [username, password, name, zip_code, email];

    // Execute the query
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error adding user:', err);
        return;
      }
      console.log('User added with ID:', results.insertId);
      
      // Close the connection
      connection.end(err => {
        if (err) {
          console.error('Error closing the connection:', err);
        } else {
          console.log('Connection closed.');
        }
      });
    });
  });
}

//TODO: Function to delete users from database

//TODO: Function to update user information


//TODO: Function to Insert Pantries into PANTRY_INFO Table
function InsertNewPantry(username, password, name, zip_code) {
  // Create a connection to the database
  const connection = mysql.createConnection({
    host: '192.168.0.11', // Replace with your Raspberry Pi's IP
    user: 'admin',         // The user you created
    password: 'password',  // The user's password
    database: 'PANTRIES'   // The database name where pantry info is stored
  });

  // Connect to the database
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the PANTRIES database!');

    // SQL query to insert a new pantry
    const sql = 'INSERT INTO PANTRY_INFO (USERNAME, PASSWORD, NAME, ZIP_CODE) VALUES (?, ?, ?, ?)';
    const values = [username, password, name, zip_code];

    // Execute the query
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error adding new pantry:', err);
        return;
      }
      console.log('Pantry added with ID:', results.insertId);
      
      // Close the connection
      connection.end(err => {
        if (err) {
          console.error('Error closing the connection:', err);
        } else {
          console.log('Connection closed.');
        }
      });
    });
  });
}

// Example usage
// InsertNewPantry('admin', 'password', 'Admin Pantry', '12345');

//TODO: Function to Create a new Table for a new Pantry within PANTRY

//TODO: 

// ______________________Functions Above__________________________________________________________________________

// Main function to initialize the server
async function main() {
  setupServer();
  add_user("HELL", "HOLE", "HellHole@gmail.com");

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Call the main function
main();