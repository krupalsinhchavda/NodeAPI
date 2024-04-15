const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.post('/user/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the user exists
    dbConnection.query('SELECT * FROM users WHERE username = ?', [username], function (err, result) {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // If user doesn't exist
        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result[0];

        // Compare passwords
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Passwords match, generate JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

        // Send token to the client
        res.status(200).json({ message: 'Login successful', token });
    });
});
