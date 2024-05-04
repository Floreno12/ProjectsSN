<<<<<<< HEAD
//create script for create congif dependency from mode 
//1 gen config
//2 whith cirrent data
//3 replace the crentiol 
//4 with current filter
 
=======


const express = require('express');
const mongoose = require('mongoose');
const mysql = require('mysql');

const app = express();

// Middleware for caching
app.use(cacheHeaders());

// Middleware for rate limiting (throttling)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware for OAuth authentication
passport.use('oauth2', new OAuth2Strategy({
    authorizationURL: 'https://oauth-provider.com/auth',
    tokenURL: 'https://oauth-provider.com/token',
    clientID: 'your-client-id',
    clientSecret: 'your-client-secret',
    callbackURL: 'http://localhost:3000/auth/callback' // Your callback URL
}, (accessToken, refreshToken, profile, done) => {
    // Handle the authentication callback
    // You can save the access token and profile in the session or database
    done(null, { accessToken, profile });
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());

// MongoDB connection
const mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'MongoDB connection error:'));

const mongoSchema = new mongoose.Schema({
    name: String,
    age: Number
});
const MongoModel = mongoose.model('MongoModel', mongoSchema);

// API endpoints

// Endpoint to get data from MongoDB
app.get('/mongodb-data', (req, res) => {
    mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connected to MongoDB');
            return MongoModel.find({});
        })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error retrieving data from MongoDB:', err);
            res.status(500).send('Error retrieving data from MongoDB');
        });
});

// Endpoint to get data from MySQL
app.get('/mysql-data', (req, res) => {
    const mysqlConnection = mysql.createConnection({
        host: 'localhost',
        user: 'username',
        password: 'password',
        database: 'mydatabase'
    });

    mysqlConnection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            res.status(500).send('Error connecting to MySQL');
            return;
        }
        console.log('Connected to MySQL');
        mysqlConnection.query('SELECT * FROM mytable', (err, results) => {
            if (err) {
                console.error('Error retrieving data from MySQL:', err);
                res.status(500).send('Error retrieving data from MySQL');
                return;
            }
            res.json(results);
            mysqlConnection.end(); // Close MySQL connection after query is executed
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
>>>>>>> e21e17fa2f2e4479cf5970bf61999017d5fcde47
