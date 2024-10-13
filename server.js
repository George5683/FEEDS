const express = require('express');
const mysql = require('mysql2/promise');
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

function AddUser() {
  app.post('/AddUser', async (req, res) => {
    // Get the data from the request
    const { Name, ZipCode, email, password } = req.body;

    // Connect to the database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin',
      password: 'password',
      database: 'FEEDS',
    });

    // Insert the data into the database
    await connection.execute('INSERT INTO users (Name, ZipCode, email, password) VALUES (?, ?, ?, ?)', [Name, ZipCode, email, password]);

    // Close the connection
    await connection.end();

    // Send a response
    res.send('User ' + Name + ' added successfully!');
  });
}

function SearchUser() {
  app.get('/SearchUser', async (req, res) => {
    try {
      // Get the data from the request
      const { email, password } = req.query;

      // Connect to the database
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'admin',
        password: 'password',
        database: 'FEEDS',
      });

      // Search for the user in the database
      const [rows] = await connection.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

      // Close the connection
      await connection.end();

      // Send a response
      res.json(rows);
    } catch (error) {
      console.error('Error searching for user:' + email + ". Error code:", error);
      res.status(500).send('Error searching for user');
    }
  });
}

function DeleteUser() {
  app.delete('/DeleteUser', async (req, res) => {
    try {
      // Get the data from the request
      const { email, password } = req.query;

      // Connect to the database
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'admin',
        password: 'password',
        database: 'FEEDS',
      });

      // Delete the user from the database
      await connection.execute('DELETE FROM users WHERE email = ? AND password = ?', [email, password]);

      // Close the connection
      await connection.end();

      // Send a response
      res.send('User ' + email + ' deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:' + email + ". Error code:", error);
      res.status(500).send('Error deleting user');
    }
  });
}

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