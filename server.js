const express = require('express');
const path = require('path');
const session = require('express-session');
const { LoginUser, PantryUser, OrdinaryUser } = require('./db'); // Import the classes
const db = require('./db.js'); // Importing db functions

const app = express();
const PORT = 8005;

// Function to set up static file serving and routes
function setupServer() {

    // Middleware to parse JSON and URL-encoded bodies
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Configure session middleware
    app.use(session({
        secret: 'FEEDS', 
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 60000 } // Session expires in 1 minute (60000 ms)
    }));

    // Serve static files from the Source and Resources directories
    app.use(express.static(path.join(__dirname, 'Source')));
    app.use(express.static(path.join(__dirname, 'Resources')));

    // Serve HTML files for various pages
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'login.html')));
    app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'register.html')));
    app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'dashboard.html')));
    app.get('/my-items', (req, res) => res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'my-items.html')));
    app.get('/item-browser', (req, res) => res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'item-browser.html')));
    app.get('/pantry-dashboard', (req, res) => res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'pantry-dashboard.html')));
}

// Main function to initialize the server
async function main() {
    setupServer();
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Routing for signup functionality
app.post('/SignUpUser', async (req, res) => {
    const { username, password, name, zip_code, email } = req.body;
    try {
        await db.addUser(username, password, name, zip_code, email);
        res.json({ username, name, zip_code, email });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user');
    }
});

// Routing for login functionality
app.post('/SignInUser', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userInfo = await db.verifyUser(email, password);
        const possiblePantry = await db.verifyPantry(email, password);
        if (userInfo) {
            req.session.currentUser = new OrdinaryUser(userInfo.NAME, email, password, userInfo.ZIP_CODE, userInfo.USERNAME);
            res.json({ name: req.session.currentUser.getName() });
        } else if (possiblePantry) {
            req.session.currentUser = new PantryUser(possiblePantry.NAME, email, password, possiblePantry.ZIP_CODE, possiblePantry.USERNAME);
            res.json({ name: req.session.currentUser.getName() });
        } else {
            res.status(401).send('Not authorized to sign in');
        }
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).send('Error signing in');
    }
});

// Routing for logout functionality
app.post('/SignOutUser', (req, res) => {
    if (req.session.currentUser) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Error signing out');
            }
            res.send('Signed out successfully');
        });
    } else {
        res.status(400).send('No user is signed in');
    }
});

// Routing to get all pantry information
app.post('/GetPantryInfo', async (req, res) => {
    try {
        const info = await db.getAllPantryInfo();
        res.json(info);
    } catch (error) {
        res.status(500).send('Error retrieving pantry information');
    }
});

// Routing to get specific pantry items
app.post('/GetPantryItems', async (req, res) => {
    try {
        const info = await db.getPantrySpecificItems(req.body.pantryName);
        res.json(info);
    } catch (error) {
        res.status(500).send('Error retrieving pantry items');
    }
});

// Routing to update item status from pantry dashboard
app.post('/updateItemStatus', async (req, res) => {
    const { pantryName, foodName, status } = req.body;
    try {
        await db.updateItemStatus(pantryName, foodName, status);
        res.status(200).send(`Status of ${foodName} updated to ${status}`);
    } catch (error) {
        console.error('Error updating item status:', error);
        res.status(500).send('Error updating item status');
    }
});

// Routing to insert a new pantry
app.post('/InsertNewPantry', async (req, res) => {
    const { username, password, name, zip_code, email, address } = req.body;
    try {
        await db.insertNewPantry(username, password, name, zip_code, email, address);
        res.status(201).send('New pantry added successfully');
    } catch (error) {
        console.error('Error adding pantry:', error);
        res.status(500).send('Error adding pantry');
    }
});

// Routing to create a new pantry table
app.post('/CreateNewPantryTable', async (req, res) => {
    const { NEW_PANTRY_NAME } = req.body;
    try {
        await db.createNewPantryTable(NEW_PANTRY_NAME);
        res.status(201).send('New pantry table created successfully');
    } catch (error) {
        console.error('Error creating pantry table:', error);
        res.status(500).send('Error creating pantry table');
    }
});

// Routing to insert a new favorited item into the table
app.post('/InsertFavoritedItem', async (req, res) => {
    const { foodName } = req.body;
    try {
        let problem = await db.insertFavoritedItem(foodName, req.session.currentUser);
        // Error checking if the database accomplished the task
        if(problem == false){
            res.status(500).send('Error adding favorited item to the database');
        }
        else{
            res.status(201).send('New favorited item added successfully');
        }
    } catch (error) {
        console.error('Error adding favorited item:', error);
        res.status(500).send('Error adding favorited item');
    }
});

// Route to handle cleanup request
app.post('/cleanup', (req, res) => {
    if (req.session.currentUser) {
        req.session.destroy(err => {
            if (err) {
                console.error('Error during cleanup:', err);
            }
        });
    }
    res.sendStatus(200); // Respond with a status code
});

main();