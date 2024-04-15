const express = require('express');
const router = express.Router();
const dbConnection = require('../dbconnection');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(cors());

// USER AUTHICATION
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    dbConnection.query('SELECT * FROM users WHERE username = ?', [username], function (err, result) {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'You are not registered' });
        }

        const user = result[0];

        // Compare passwords
        bcrypt.compare(password, user.password, function (err, passwordMatch) {
            if (err) {
                console.error("Error:", err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Wrong password' });
            }

            // Passwords match, generate JWT token
            const token = jwt.sign({ userId: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

            // Send token to the client
            res.status(200).json({ message: 'Login successful', token });
        });
    });
});

// MODIFI PASSWORD
router.put('/modifyPassword', (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    if (!username || !currentPassword || !newPassword) {
        res.status(400).json({ error: "All fileds are required" });
        return;
    }
    dbConnection.query("SELECT * FROM users WHERE username = ?", [username], function (err, result) {
        if (err) {
            console.error("error", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // IF USER DOES NOT EXITS
        if (result.length === 0) {
            return res.status(404).json({ error: "Uesr not found" });
        }

        const user = result[0];

        bcrypt.compare(currentPassword, user.password, function (err, passwordMatch) {
            if (err) {
                console.error("error", err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Password is not match' });
            }

            // HASH NEW PASSWORD
            bcrypt.hash(newPassword, 10, function (err, hashedPassword) {
                if (err) {
                    console.error("error", err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                dbConnection.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id], function (err, result) {
                    if (err) {
                        console.error("error", err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    return res.status(200).json({ message: "Password Updated Successfully", result });
                });
            });
        });
    });
});

// FORGET PASSWORD
router.post('/forgetpassword', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    dbConnection.query('SELECT * FROM users WHERE email = ?', [email], function (err, result) {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // If user not found
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result[0];

        // Generate Unique Token
        const uniqueValue = `${Date.now()}`;
        bcrypt.hash(uniqueValue, 10, (err, token) => {
            if (err) {
                console.error("error", err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const tokenExpiry = Date.now() + 3600000;   //1 hour

            dbConnection.query(
                'UPDATE users SET reset_token = ?, reset_token_expiry = ? where email = ?',
                [token, tokenExpiry, email], (err) => {
                    if (err) {
                        console.error("error", err);
                        return res.status(500).json({ error: 'internal server error' });
                    }
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'krupalsinhchavda36143@gmail.com',
                            pass: 'ssha cypc dsvr clmo'
                        }
                    });

                    const resetLink = `http://localhost:3000/user/resetpassword?token=${token}`;

                    const mailOptions = {
                        from: 'krupalsinhchavda36143@gmail.com',
                        to: email,
                        subject: 'Password Reset',
                        html: `<!DOCTYPE html>
                        <html>
                        <head>
                            <title>Reset Password</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                        
                                .container {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    background-color: #fff;
                                    padding: 20px;
                                    border-radius: 10px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                        
                                .header {
                                    text-align: center;
                                    margin-bottom: 30px;
                                }
                        
                                .header h1 {
                                    color: #333;
                                }
                        
                                p {
                                    margin-bottom: 10px;
                                }
                        
                                a {
                                    color: #007BFF;
                                    text-decoration: none;
                                }
                        
                                a:hover {
                                    text-decoration: underline;
                                }
                            </style>
                        </head>
                        
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>Reset Your Password</h1>
                                </div>
                                <p>If you requested a password reset, click the link below to reset your password:</p>
                                <p><a href="${resetLink}">Reset Password</a></p>
                                <p>If you did not request a password reset, you can safely ignore this email.</p>
                            </div>
                        </body>
                        </html> `
                    };

                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.error("Error:", err);
                            return res.status(500).json({ error: 'Error sending email' });
                        }

                        // Email sent successfully
                        return res.status(200).json({ message: 'Password reset email sent successfully' });
                    });
                }
            )
        });
    });
});

// RESET PASSWORD
router.post('/resetpassword', (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    dbConnection.query('SELECT * FROM users where reset_token = ? AND reset_token_expiry > NOW()', [token], (err, result) => {
        if (err) {
            console.error("error", err);
            return res.status(500).json({ error: 'internal server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Invalid or expired token' });
        }

        const user = result[0];

        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error("error", err);
                return res.status(500).json({ json: 'Internal server error' });
            }

            dbConnection.query('UPDATE users SET password = ?, reset_token = null, reset_token_expiry = null where id = ?',
                [hashedPassword, user.id], (err) => {
                    if (err) {
                        console.error("Error:", err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    // Password reset successfully
                    return res.status(200).json({ message: 'Password reset successfully' });
                }
            );
        });
    });
});
module.exports = router;
