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
// Function to delete a user
function deleteUser(username) {
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

    // SQL query to delete a user by username
    const sql = 'DELETE FROM USER_INFO WHERE USERNAME = ?';
    const values = [username];

    // Execute the query
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error deleting user:', err);
        return;
      }
      if (results.affectedRows > 0) {
        console.log('User deleted successfully.');
      } else {
        console.log('No user found with that username.');
      }

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
// InsertNewPantry('admin', 'password', 'Admin Pantry', '12345');

//TODO: Function to Create a new Table for a new Pantry within PANTRIES Database
function CreateNewPantryTable(NEW_PANTRY_NAME) {
  // Create a connection to the PANTRIES database
  const connection = mysql.createConnection({
    host: '192.168.0.11', // Replace with your Raspberry Pi's IP
    user: 'admin',         // The user you created
    password: 'password',  // The user's password
    database: 'PANTRIES'   // The PANTRIES database
  });

  // Connect to the database
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the PANTRIES database!');

    // SQL query to create a new pantry table dynamically
    const sql = `CREATE TABLE \`${NEW_PANTRY_NAME}\` (
      FOOD_ID INT AUTO_INCREMENT PRIMARY KEY,
      STOCK_NAME VARCHAR(255) NOT NULL,
      QUANTITY INT DEFAULT 0,
      STATUS VARCHAR(255) NOT NULL
    )`;

    // Execute the query
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log(`New pantry table '${NEW_PANTRY_NAME}' created successfully.`);
      
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

//TODO: Function to add food items to a pantry named in the PANTRY_INFO Table 

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