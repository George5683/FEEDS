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
    host: 'sql5.freesqldatabase.com', // Remote database host
    user: 'sql5738700',               // Database username
    password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
    database: 'sql5738700',           // The database name
    port: 3306                        // Default MySQL port
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
function deleteUser(username) {
  // Create a connection to the database
  const connection = mysql.createConnection({
    host: 'sql5.freesqldatabase.com', // Remote database host
    user: 'sql5738700',               // Database username
    password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
    database: 'sql5738700',           // The database name
    port: 3306                        // Default MySQL port
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
function InsertNewPantry(username, password, name, zip_code, pantry_id) {
  // Create a connection to the database
  const connection = mysql.createConnection({
    host: 'sql5.freesqldatabase.com', // Remote database host
    user: 'sql5738700',               // Database username
    password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
    database: 'sql5738700',           // The database name
    port: 3306                        // Default MySQL port
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

//TODO: Function to Create a new Table for a new Pantry 
async function CreateNewPantryTable(NEW_PANTRY_NAME) {
  try {
    // Connect to the database
    const connection = await mysql.createConnection({
      host: 'sql5.freesqldatabase.com', // Remote database host
      user: 'sql5738700',               // Database username
      password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
      database: 'sql5738700',           // The database name
      port: 3306                        // Default MySQL port
    });

    // Create the new pantry table
    await connection.execute(
      `CREATE TABLE ${NEW_PANTRY_NAME} (
        FOOD_ID INT AUTO_INCREMENT PRIMARY KEY,
        FOOD_NAME VARCHAR(255) NOT NULL,
        STATUS VARCHAR(255) NOT NULL
      )`
    );

    // Close the connection
    await connection.end();

    console.log(`Table ${NEW_PANTRY_NAME} created successfully!`);
  } catch (error) {
    console.error('Error creating new pantry table:', error);
  }
}

//TODO: Function to add food items to a pantry table


// ______________________Functions Above__________________________________________________________________________

// Main function to initialize the server
async function main() {
  setupServer();

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Call the main function
main();