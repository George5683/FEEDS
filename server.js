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
async function add_user(username, password, name, zip_code, email) {
  try {
    const connection = await mysql.createConnection({
      host: 'sql5.freesqldatabase.com', // Remote database host
      user: 'sql5738700',               // Database username
      password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
      database: 'sql5738700',           // The database name
      port: 3306                        // Default MySQL port
    });

    await connection.execute(
      'INSERT INTO USER_INFO (username, password, name, zip_code, email) VALUES (?, ?, ?, ?, ?)',
      [username, password, name, zip_code, email]
    );

    await connection.end();
    console.log('User added successfully!');
  } catch (error) {
    console.error('Error adding user:', error);
  }
}

// Function to delete users from database
async function deleteUser(username) {
  try {
    const connection = await mysql.createConnection({
      host: 'sql5.freesqldatabase.com', // Remote database host
      user: 'sql5738700',               // Database username
      password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
      database: 'sql5738700',           // The database name
      port: 3306                        // Default MySQL port
    });

    await connection.execute('DELETE FROM USER_INFO WHERE username = ?', [username]);

    await connection.end();
    console.log('User deleted successfully!');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

//TODO: Function to update user information


//TODO: Function to verify if user is in database 
async function verifyUser(username, password) {
  try {
    const connection = await mysql.createConnection({
      host: 'sql5.freesqldatabase.com', // Remote database
      user: 'sql5738700',               // Database username
      password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
      database: 'sql5738700',           // The database name
      port: 3306                        // Default MySQL port
    });

    const [rows] = await connection.execute(
      'SELECT * FROM USER_INFO WHERE username = ? AND password = ?',
      [username, password]
    );

    await connection.end();

    if (rows.length > 0) {
      console.log('User verified successfully!');
      return true;
    } else {
      console.log('User not found!');
      return false;
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return false;
  }
}


//TODO: Function to update pantry information


// Function to Insert Pantries into PANTRY_INFO Table
async function InsertNewPantry(username, password, name, zip_code, pantry_id) {
  try {
    const connection = await mysql.createConnection({
      host: 'sql5.freesqldatabase.com', // Remote database host
      user: 'sql5738700',               // Database username
      password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
      database: 'sql5738700',           // The database name
      port: 3306                        // Default MySQL port
    });

    await connection.execute(
      'INSERT INTO PANTRY_INFO (username, password, name, zip_code, pantry_id) VALUES (?, ?, ?, ?, ?)',
      [username, password, name, zip_code, pantry_id]
    );

    await connection.end();
    console.log('New pantry inserted successfully!');
  } catch (error) {
    console.error('Error inserting new pantry:', error);
  }
}

// Function to Create a new Table for a new Pantry 
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

// __________________________Routing for the login htmls_________________________________________________________________________________

//TODO: Routing for the username, password, name, zip_code, email from the login page sign up
app.post('/SignUpUser', async (req, res) => {
  const { username, password, name, zip_code, email } = req.body;
  try {
    await add_user(username, password, name, zip_code, email);
    res.send('User added successfully!');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user');
  }
});

//TODO: Routing for the username and password from the login page sign in
app.post('/SignInUser', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userVerified = await verifyUser(username, password);
    if (userVerified) {
      res.send('User signed in successfully!');
    } else {
      res.status(401).send('Error signing in');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).send('Error signing in');
  }
});


// __________________________Routing for the dashboard htmls_________________________________________________________________________________

//TODO: ROuting for a user to add something to favorites list

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
