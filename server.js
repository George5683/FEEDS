const express = require('express');
const path = require('path');
const session = require('express-session');
const { LoginUser, PantryUser, OrdinaryUser } = require('./db'); // Import the classes
const db = require('./db.js'); // Importing db functions

const app = express();
const PORT = 8005;

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

// Function to set up static file serving and routes
function setupServer() {
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
            req.session.currentUser = new OrdinaryUser(userInfo.Name, email, password, userInfo.ZipCode, userInfo.Username);
            res.json({ name: req.session.currentUser.getName() });
        } else if (possiblePantry) {
            req.session.currentUser = new PantryUser(possiblePantry.Name, email, password, possiblePantry.ZipCode, possiblePantry.Username);
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
        req.session.currentUser.cleanup(); // Clean up resources
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

// Route to handle cleanup request
app.post('/cleanup', (req, res) => {
    if (req.session.currentUser) {
        req.session.currentUser.cleanup(); // Clean up resources
        req.session.destroy(err => {
            if (err) {
                console.error('Error during cleanup:', err);
            }
        });
    }
    res.sendStatus(200); // Respond with a status code
});

main();