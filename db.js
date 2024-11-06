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
        const [results] = await pool.query(
            'SELECT * FROM USER_INFO WHERE EMAIL = ? AND PASSWORD = ?',
            [email, password]
        );
        if (results.length > 0) {
            results[0].NAME = results[0].NAME.charAt(0).toUpperCase() + results[0].NAME.slice(1).toLowerCase();
            return results[0]; // Return user info to be stored
        }
        console.log('User not found!');
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
        console.log('Pantry info retrieved successfully!');
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
            results[0].NAME = results[0].NAME.charAt(0).toUpperCase() + results[0].NAME.slice(1).toLowerCase();
            return results[0];
        }
        console.log('Pantry not found!');
        return null;
    } catch (error) {
        console.error('Error verifying pantry:', error);
        return null;
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
};
