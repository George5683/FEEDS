const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const PORT = 8005;

// Global variable to store the current user's information
let CurrentInfo;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to set up middleware and routes
function setupServer() {
  // Serve static files from the Source and Resources directories
  app.use(express.static(path.join(__dirname, 'Source')));
  app.use(express.static(path.join(__dirname, 'Resources')));

  // Serve the login.html file
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'login.html'));
  });

  // Service the register.html file
  app.get('/register', (req, res) =>
    res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'register.html'))
  );

  // Service the dashboard.html file
  app.get('/dashboard', (req, res) =>
    res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'dashboard.html'))
  );

  // Service the my-item.html file
  app.get('/my-item', (req, res) =>
    res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'my-item.html'))
  );

  // Service the my-item.html file
  app.get('/item-browser', (req, res) =>
    res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'item-browser.html'))
  );

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

    await connection.query(
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
async function verifyUser(email, password) {
  try {
    const connection = await mysql.createConnection({
      host: 'sql5.freesqldatabase.com', // Remote database
      user: 'sql5738700',               // Database username
      password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
      database: 'sql5738700',           // The database name
      port: 3306                        // Default MySQL port
    });

    console.log('Verifying user...');
    console.log('Email Entered: '+ email);
    console.log('Password Entered: '+ password);

    const [results, fields] = await connection.query(
      'SELECT * FROM USER_INFO WHERE EMAIL = ? AND PASSWORD = ?',
      [email, password]
    );

    //console.log('Fields:', fields);
    console.log('Rows:', results);

    // Changing the Name to always have the first character be capitalized
    if (results.length > 0) {
      let name = results[0].NAME;
      name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      results[0].NAME = name;
    }
    
    // Set the user info
    SetUserInfo(results);

    if (results.length > 0) {
      console.log('User verified successfully!');
      return true;
    } 
    else {
      console.log('User not found!');
      return false;
    }
  } 
  catch (error) {
    console.error('Error verifying user on Server Side:', error);
    return false;
  }
}


//TODO: Function to update pantry information


// Function to Insert Pantries into PANTRY_INFO Table
async function InsertNewPantry(username, password, name, zip_code, email, address) {
  try {
    const connection = await mysql.createConnection({
      host: 'sql5.freesqldatabase.com', // Remote database host
      user: 'sql5738700',               // Database username
      password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
      database: 'sql5738700',           // The database name
      port: 3306                        // Default MySQL port
    });

    await connection.query(
      'INSERT INTO PANTRY_INFO (username, password, name, zip_code, email, address) VALUES (?, ?, ?, ?, ?, ?)',
      [username, password, name, zip_code, email, address]
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
    await connection.query(
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

async function getPantryInfo(){
  try {
    const connection = await mysql.createConnection({
      host: 'sql5.freesqldatabase.com', // Remote database
      user: 'sql5738700',               // Database username
      password: 'esGA72UD9Z',        // Database password (replace 'your_password' with the actual password)
      database: 'sql5738700',           // The database name
      port: 3306                        // Default MySQL port
    });

    console.log('Getting pantry info...');

    const [results, fields] = await connection.query('SELECT * FROM PANTRY_INFO');

    //console.log('Fields:', fields);
    //console.log('Info:', results);

    if (results.length > 0) {
      console.log('Pantry info gotten successfully!');
      return results;
    } 
    else {
      console.log('Pantry info not found!');
      return null;
    }
  } 
  catch (error) {
    console.error('Error getting pantry info on Server Side:', error);
    return null;
  }
}

//TODO: Function to add food items to a pantry table

// __________________________Routing for the login htmls_________________________________________________________________________________

//TODO: Routing for the username, password, name, zip_code, email from the login page sign up
app.post('/SignUpUser', async (req, res) => {
  const { username, password, name, zip_code, email } = req.body;
  try {
    await add_user(username, password, name, zip_code, email);
    let jsonReponse = {
      username: username,
      name: name,
      zip_code: zip_code,
      email: email
    };
    res.json(jsonReponse);
  } 
  catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user');
  }
});

//TODO: Routing for the username and password from the login page sign in
app.post('/SignInUser', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userVerified = await verifyUser(email, password);
    
    if (userVerified) {
      let info = await GetUserInfo();

      console.log('User Info:', info);
      console.log('User Info Name:', info[0].NAME);

      res.json({ name: info[0].NAME });
    } else {
      res.status(401).send('Not authorized to sign in');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).send('Error signing into account.');
  }
});

// Function to get the user info of the current user
async function GetUserInfo(){
  let info = CurrentInfo;
  return info;
}

// Function to set the user info of the current user
async function SetUserInfo(info){
  CurrentInfo = info;
  return;
}

// __________________________Routing for the dashboard htmls_________________________________________________________________________________

//TODO: ROuting for a user to add something to favorites list

// Routing to get the pantry information to the dashboard
app.post('/GetPantryInfo', async (req, res) => {
  let info = await getPantryInfo();

  res.json(info);
});

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
