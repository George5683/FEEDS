const express = require('express');
const path = require('path');
const app = express();
const PORT = 8005;

// Serve static files from the Source and Resources directories
app.use(express.static(path.join(__dirname, 'Source')));
app.use(express.static(path.join(__dirname, 'Resources')));

// Serve the login.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Resources', 'HTML', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});