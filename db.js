const mysql = require('mysql2/promise');

// Class for the person login in whether pantry or ordinary person
class LoginUser {
    constructor(Email, Password) {
        this.Email = Email;
        this.Password = Password;
    }

    // Function to get the email of the user
    getEmail() {
        return this.Email;
    }

    // Function to get the password of the user
    getPassword() {
        return this.Password;
    }

    // Function to get all the information of the user
    getAll(){
        return this;
    }

    // Method to clean up resources
    cleanup() {
        this.Name = null;
        this.Email = null;
        this.Password = null;
        this.Username = null;
        this.ZipCode = null;
    }

}

// Subclass for the Pantry user
class PantryUser extends LoginUser{
    constructor(Name, Email, Password, ZipCode, Username){
        super(Email, Password);
        this.Name = Name;
        this.ZipCode = ZipCode;
        this.Username = Username;
    }

    // Function for cleaning up
    cleanup() {
        super.cleanup();
        this.Name = null;
        this.ZipCode = null;
        this.Username = null;
    }

    // Function to get the name of the user
    getName() {
        return this.Name;
    }

    // Function to get the zip code of the user
    getZipCode() {
        return this.ZipCode;
    }

    // Function to get the username of the user
    getUsername() {
        return this.Username;
    }

    // Function to get all the information of the user
    getAll(){
        return this;
    }
}

// Subclass for the ordinary user
class OrdinaryUser extends LoginUser{
    constructor(Name, Email, Password, ZipCode, Username){
        super(Email, Password);
        this.Name = Name;
        this.ZipCode = ZipCode;
        this.Username = Username;
    }

    // Function for cleaning up
    cleanup() {
        super.cleanup();
        this.Name = null;
        this.ZipCode = null;
        this.Username = null;
    }

    // Function to get the name of the user
    getName() {
        return this.Name;
    }

    // Function to get the zip code of the user
    getZipCode() {
        return this.ZipCode;
    }

    // Function to get the username of the user
    getUsername() {
        return this.Username;
    }

    // Function to get all the information of the user
    getAll(){
        return this;
    }
}

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'sql5.freesqldatabase.com', // Remote database host
    user: 'sql5738700',               // Database username
    password: 'esGA72UD9Z',           // Database password
    database: 'sql5738700',           // The database name
    port: 3306,                       // Default MySQL port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to add a user
async function addUser(username, password, name, zip_code, email) {
    try {
        await pool.query(
            'INSERT INTO USER_INFO (username, password, name, zip_code, email) VALUES (?, ?, ?, ?, ?)',
            [username, password, name, zip_code, email]
        );
        console.log('User added successfully!');
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

// Function to delete a user
async function deleteUser(username) {
    try {
        await pool.execute('DELETE FROM USER_INFO WHERE username = ?', [username]);
        console.log('User deleted successfully!');
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Function to verify a user
async function verifyUser(email, password) {
    try {
        // printing the results
        console.log('Email: ' + email);
        const [results] = await pool.query(
            'SELECT * FROM USER_INFO WHERE EMAIL = ? AND PASSWORD = ?',
            [email, password]
        );
        if (results.length > 0) {
            console.log('User found Logging in!');
            results[0].NAME = results[0].NAME.charAt(0).toUpperCase() + results[0].NAME.slice(1).toLowerCase();
            return results[0]; // Return user info to be stored
        }
        return null;
    } catch (error) {
        console.error('Error verifying user on server side:', error);
        return null;
    }
}

// Function to get all pantry information
async function getAllPantryInfo() {
    try {
        const [results] = await pool.query('SELECT * FROM PANTRY_INFO');
        console.log('Pantry info retrieved for displaying on dashboard!');
        return results;
    } catch (error) {
        console.error('Error getting pantry info:', error);
        return null;
    }
}

// Function to get items from a specific pantry
async function getPantrySpecificItems(pantryName) {
    try {
        const [results] = await pool.query(`SELECT * FROM ${mysql.escapeId(pantryName).replace(/`.`/g, `.`)}`);
        console.log(`Items from ${pantryName} retrieved successfully!`);
        // console.log('Results: ' + JSON.stringify(results));
        return results;
    } catch (error) {
        console.error('Error getting pantry items:', error);
        return null;
    }
}

// Function to insert a new pantry
async function insertNewPantry(username, password, name, zip_code, email, address) {
    try {
        await pool.query(
            'INSERT INTO PANTRY_INFO (username, password, name, zip_code, email, address) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, name, zip_code, email, address]
        );
        console.log('New pantry inserted successfully!');
    } catch (error) {
        console.error('Error inserting new pantry:', error);
    }
}

// Function to create a new pantry table
async function createNewPantryTable(NEW_PANTRY_NAME) { 
    try {
        // Manually wrap table name in backticks to handle special characters
        const escapedTableName = `\`${NEW_PANTRY_NAME.replace(/`/g, '')}\``;

        await pool.query(
            `CREATE TABLE ${escapedTableName} (
                FOOD_ID INT AUTO_INCREMENT PRIMARY KEY,
                FOOD_NAME VARCHAR(255) NOT NULL,
                STATUS VARCHAR(255) NOT NULL
            )`
        );

        console.log(`Table "${NEW_PANTRY_NAME}" created successfully!`);
    } catch (error) {
        console.error('Error creating new pantry table:', error);
    }
}

// Function for adding items to the pantry  
async function addItemToPantry(pantryName, foodName, status) {
    try {
        // Manually escape the table name by wrapping it in backticks
        const escapedPantryName = `\`${pantryName.replace(/`/g, '')}\``;

        await pool.query(
            `INSERT INTO ${escapedPantryName} (FOOD_NAME, STATUS) VALUES (?, ?)`,
            [foodName, status]
        );

        console.log(`Item ${foodName} added to ${pantryName} successfully!`);
    } catch (error) {
        console.error('Error adding item to pantry:', error);
    }
}

// Function for updating status of items in the pantry
async function updateItemStatus(pantryName, foodName, status) {
    try {
        await pool.query(`UPDATE ${mysql.escapeId(pantryName)} SET STATUS = ? WHERE FOOD_NAME = ?`, [status, foodName]);
        console.log(`Status of ${foodName} in ${pantryName} updated to ${status} successfully!`);
        if (status === 'IN STOCK' || status === 'LOW STOCK') {
            //get FOOD_ID from the pantry table
            const [itemResults] = await pool.query(
                `SELECT FOOD_ID FROM \`${pantryName}\` WHERE FOOD_NAME = ?`,
                [foodName]
            );
            const foodId = itemResults[0]?.FOOD_ID;
            if (!foodId) {
                console.error('Food ID not found');
                return;
            }
            //find users who favorited this item
            const [userResults] = await pool.query(
                `SELECT UF.USER_ID, UI.EMAIL 
                 FROM USER_FAVORITES UF
                 JOIN USER_INFO UI ON UF.USER_ID = UI.USER_ID
                 WHERE UF.FOOD_ID = ?`,
                [foodId]
            );            
            //add notification for each user
            for (const user of userResults) {
                await pool.query(
                    `INSERT INTO USER_NOTIFICATIONS (USER_ID, FOOD_NAME, TYPE, NAME) VALUES (?, ?, 1, ?)`,
                    [user.USER_ID, foodName, pantryName]
                );
            }
        }
    } catch (error) {
        console.error('Error updating item status:', error);
    }
}

// Function to verify a pantry in the database
async function verifyPantry(email, password) {
    try {
        const [results] = await pool.query(
            'SELECT * FROM PANTRY_INFO WHERE EMAIL = ? AND PASSWORD = ?',
            [email, password]
        );
        if (results.length > 0) {
            return results[0];
        }
        //console.log('Pantry not found!');
        return null;
    } catch (error) {
        console.error('Error verifying pantry:', error);
        return null;
    }
}

// Insert into the favorited items table
async function insertFavoritedItem(FoodName, email) {
    try {
        // trying to get the food id from the food table
        try{
            // printing the email
            // console.log('Email: ' + email);
            // printing the food name
            // console.log('Food Name: ' + FoodName);

            // getting user id from the user table
            const [results1] = await pool.query(
                'SELECT * FROM USER_INFO WHERE EMAIL = ?',
                [email]
            );
            //printing the results
            // console.log('results from SQL: ' + JSON.stringify(results1));

            // getting the user id from the results
            const UserID = results1[0].USER_ID;

            // getting the food id from a random pantry table
            const [results] = await pool.query(
                'SELECT * FROM `Gainesville Harvest` WHERE FOOD_NAME = ?',
                [FoodName]
            );

            // printing the results
            // console.log('Food ID: ' + results[0].FOOD_ID);

            // putting the ID's into the FAVORITES table
            await pool.query(
                'INSERT INTO USER_FAVORITES (FOOD_ID, USER_ID) VALUES (?, ?)',
                [results[0].FOOD_ID, UserID]
            );

            // printing the results
            // console.log('Results: ' + JSON.stringify(result2));
            
            console.log('Favorited item added successfully!');
            return true;
                        
        }catch (error){
            console.error('Error adding favorited item:', error);
            return false;
        }
        // // inserting the favorited item into the table
        // await pool.query(
        //     'INSERT INTO USER_FAVORITES (FoodID, UserID) VALUES (?, ?, ?)',
        //     [FoodID, UserID]
        // );
        // console.log('Favorited item added successfully!');
        return true;
    } catch (error) {
        console.error('Error adding favorited item:', error);
        return false;
    }
}

async function removeFavoritedItem(FoodName, email) {
    try{
        // getting the user id from the user table
        const [results1] = await pool.query(
            'SELECT * FROM USER_INFO WHERE EMAIL = ?',
            [email]
        );

        // getting the user id from the results
        const UserID = results1[0].USER_ID;

        // getting the food id from the food table
        const [results] = await pool.query(
            'SELECT * FROM `Gainesville Harvest` WHERE FOOD_NAME = ?',
            [FoodName]
        );

        // removing the favorited item from the table
        await pool.query(
            'DELETE FROM USER_FAVORITES WHERE FOOD_ID = ? AND USER_ID = ?',
            [results[0].FOOD_ID, UserID]
        );
        console.log('Favorited item removed successfully!');
        return true;
    }catch(error){
        console.error('Error removing favorited item:', error);
        return false;

    }
}

// Function to get all favorited items
async function getFavoritedItems(email) {
    try {
        // getting the user id from the user table
        const [results1] = await pool.query(
            'SELECT * FROM USER_INFO WHERE EMAIL = ?',
            [email]
        );

        // getting the user id from the results
        const UserID = results1[0].USER_ID;

        // getting the favorited items from the table
        const [results] = await pool.query(
            'SELECT * FROM USER_FAVORITES WHERE USER_ID = ?',
            [UserID]
        );
        //console.log('Results: ' + JSON.stringify(results));
        return results;
    } catch (error) {
        console.error('Error getting favorited items:', error);
        return null;
    }
}

// Function to get user notifications
async function getUserNotifications(email) {
    try {
        const [userResults] = await pool.query(
            'SELECT USER_ID FROM USER_INFO WHERE EMAIL = ?',
            [email]
        );
        console.log('Notification info retrieved for displaying on dashboard!');
        const userId = userResults[0]?.USER_ID;
        if (!userId) {
            console.error('No USER_ID found for email:', email);
            return [];  // No USER_ID, return an empty array
        }

        const [notifications] = await pool.query(
            'SELECT * FROM USER_NOTIFICATIONS WHERE USER_ID = ?',
            [userId]
        );
        return notifications;
    } catch (error) {
        console.error('Error fetching user notifications:', error);
        return [];
    }
}


//Function to remove notifications
async function removeNotifications(notificationIds) {
    try {
        // Delete notifications by ID
        await pool.query(
            'DELETE FROM USER_NOTIFICATIONS WHERE id IN (?)',
            [notificationIds]
        );
        console.log('Notifications removed successfully!');
        return true;
    } catch (error) {
        console.error('Error removing notifications:', error);
        return false;
    }
}


module.exports = {
    addUser,
    deleteUser,
    verifyUser,
    getAllPantryInfo,
    getPantrySpecificItems,
    insertNewPantry,
    createNewPantryTable,
    addItemToPantry,
    updateItemStatus,
    LoginUser,
    PantryUser,
    verifyPantry,
    OrdinaryUser,
    insertFavoritedItem,
    removeFavoritedItem,
    getFavoritedItems,
    getUserNotifications,
    removeNotifications
};
