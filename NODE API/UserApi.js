const express = require('express');
const router = express.Router();
const dbConnection = require('../dbconnection');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const upload = require('./multerConfig');

const app = express();
const port = 3000;
const jwtSecretKey = "HELLOKRUPALSINH"
const createdOn = new Date();
const IsActive = 1;

app.use(express.json());
app.use(cors());

// WELCOME EMAIL TO USER
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'krupalsinhchavda36143@gmail.com',
        pass: 'ssha cypc dsvr clmo'
    }
});
function welcomeEmail(username, email, res) {
    const mailOptions = {
        from: 'krupalsinhchavda36143@gmail.com',
        to: email,
        subject: 'Welcome Email',
        html: `  
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
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
                .content {
                    margin-bottom: 30px;
                }
                .content p {
                    color: #555;
                    line-height: 1.6;
                }
                span{
                    font-weight: 600;
                }
                .footer {
                    text-align: center;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Our Platform!</h1>
                </div>
                <div class="content">
                    <p>Hello <span> ${username}</span>,</p>
                    <p>Thank you for joining our platform! We are excited to have you on board.</p>
                    <p>Here are a few things you can do:</p>
                    <ul>
                        <li>Explore our features</li>
                        <li>Connect with other users</li>
                        <li>Get started on your journey</li>
                    </ul>
                    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                    <p>Best regards,<br> The Team</p>
                </div>
                <div class="footer">
                    <p>This email was sent to you as a part of our service. 
                    If you believe you received this email by mistake, please ignore it.</p>
                </div>
            </div>
        </body>
        </html>  `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent successfully:', info.response);
            res.status(201).json({ message: 'User added successfully and welcome email sent' });
        }
    });
}

// ADD USER API
router.post('/adduser', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ error: 'ALL Fields are required' });
        return;
    }

    // Generate a salt and hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error hasing password", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        dbConnection.query('INSERT INTO users (username,email,password,createdOn,IsActive) VALUES (?,?,?,?,?)', [username, email, hashedPassword, createdOn, IsActive], function (err, result) {
            if (err) {
                console.error("error", err);
                res.status(500).json({ error: 'Internal server error' })
            }
            else {
                welcomeEmail(username, email, res);
                res.status(201).json({ message: 'Record successfully inserted', Data: result.insertId });
            }
        });
    });
});

// GET ALL USER 
router.get('/getalluser', (req, res) => {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.orderBy || 'createdOn';
    const orderDirection = req.query.orderDirection || 'desc';

    const offset = (page - 1) * limit;

    const sqlquery = `select * from users WHERE IsActive = 1 order by ${orderBy} ${orderDirection} limit ${limit} offset ${offset}`;
    dbConnection.query(sqlquery, function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Records not found' });
            return;
        }
        res.status(200).json({ message: "Records fetched successfully", data: result });
    });
});

// GET USER BY ID
router.get('/userbyid', (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.status(400).json({ error: "ID IS REQUIRED" });
        return;
    }
    dbConnection.query('SELECT * FROM users WHERE id = ?', id, function (err, result) {
        if (err) {
            console.error("error", err);
            res.status(500).json({ error: 'internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'record not found' });
        }
        else {
            res.status(200).json({ message: 'Get Record Successfully', Data: result[0] })
        }
    })
})

// UPDATE USER
router.put('/updateuser', (req, res) => {
    const id = req.query.id;
    const modifiedOn = new Date();
    const { username, email, password } = req.body;
    if (!id || !username || !email || !password) {
        res.status(400).json({ error: 'all fields are required' })
    }

    // Generate a salt and hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error hasing Password", err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        dbConnection.query('UPDATE users SET username = ?, email = ?, password = ?, modifiedOn = ? where id = ?', [username, email, hashedPassword, modifiedOn, id], function (err, result) {
            if (err) {
                console.error("Error:", err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'NO record found' });
            } else {
                res.status(200).json({ message: "Record Updated Successfully" })
            }
        });
    });
});

// Delete USER
router.delete('/deleteuser', (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
    }
    dbConnection.query('DELETE FROM users WHERE id = ?', id, function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Rocord not found' });
        }
        else {
            res.status(200).json({ message: 'Record successfully deleted' });
        }
    });
});

// ADD USER PROFILE PIC
router.post('/profilepic', upload.single('profilepic'), (req, res) => {
    const userId = req.query.id;
    const profilePicPath = req.file.path;

    dbConnection.query('UPDATE users SET profilepic = ? WHERE id = ?', [profilePicPath, userId], function (err, result) {
        if (err) {
            console.error("error Upting profile pic");
            res.status(500).json({ error: 'internal server error' })
        }
        else {
            res.status(200).json({ message: 'Profile Picture Add Successfully' })
        }
    });
});

module.exports = router;
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });