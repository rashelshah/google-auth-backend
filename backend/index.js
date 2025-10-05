require('dotenv').config({ path: './backend/.env' });
const connectToMongo = require('./db');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
var cors = require('cors');

require('./passport'); // <-- we'll create this file for Google strategy

connectToMongo();
const app = express();
const port = process.env.PORT || 4000;



app.use(express.json());

// Session middleware (needed for Passport)
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET, // change to env variable
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax', // important for local dev
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Normal auth routes
app.use('/api/auth', require('./routes/auth'));

// Google OAuth routes
app.use('/', require('./routes/googleAuth'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
