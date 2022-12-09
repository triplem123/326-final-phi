'use strict';

// For loading environment variables.
require('dotenv').config();

const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy
const app = express();
const port = process.env.PORT || 3000;
const router = require('./router.js');

app.use('/', router);

/// NEW
const minicrypt = require('./miniCrypt');
const mc = new minicrypt();

// Session configuration

const session = {
    secret: process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave: false,
    saveUninitialized: false
};

// Passport configuration

const strategy = new LocalStrategy(
    async (username, password, done) => {
        if (!findUser(username, password)) {
            // no such user
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Wrong username' });
        }
        if (!validatePassword(username, password)) {
            // invalid password
            // should disable logins after N messages
            // delay return to rate-limit brute-force attacks
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Wrong password' });
        }
        // success!
        // should create a user object here, associated with a unique identifier
        return done(null, username);
    });


// App configuration

const dbo = require('./conn.js');
dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        console.log("--- EXITING ---");
        process.exit();
    } else {
        console.log("DB Connection Successful!");
    }
});

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({ 'extended': true })); // allow URLencoded data

// Returns true iff the user's userhash exists.
async function findUser(username, password) {
    const userhash = mc.hash(username + password)[1];
    const db = await dbo.getDb().db("Users").collection("User_Data");
    const data = await db.findOne({ userhash: userhash });
    return data === null ? false : true;
}

// Returns true iff the password is the one we have stored.
function validatePassword(name, pwd) {
    if (!findUser(name, pwd)) {
        return false;
    }
    if (mc.check(pwd, users[name][0], users[name][1])) {
        return true;
    }
    return false;
}

// Add a user to the database.
async function addUser(name, pwd) {

    const userhash = mc.hash(name + pwd)[1];

    const db = await dbo.getDb().db("Users").collection("User_Data");
    const user = {
        userhash: userhash,
        Email: name,
        Password: mc.hash(pwd),
        Rooms_Created: 1,
        rooms: [{
            roomName: 'Living-Room-Sample',
            corners: '{"corner-1":"<div id=\\"draggable\\" class=\\"ui-widget-content corner-1\\"></div>","corner-2":"<div id=\\"draggable\\" class=\\"ui-widget-content corner-2\\"></div>","corner-3":"<div id=\\"draggable\\" class=\\"ui-widget-content corner-3\\"></div>","corner-4":"<div id=\\"draggable\\" class=\\"ui-widget-content corner-4\\"></div>"}',
            furniture: '{"image-draggable-container-1":"<div id=\\"image-draggable-container-1\\" class=\\"Three-Seat-Sofa-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 368px; left: 695px; height: 102px; width: 208px;\\"><img id=\\"Three-Seat-Sofa-image-draggable\\" class=\\"Three-Seat-Sofa-image draggable-furniture\\" src=\\"/assets/furniture-images/Three-Seat-Sofa.png\\"></div>","image-draggable-container-2":"<div id=\\"image-draggable-container-2\\" class=\\"TV-Stand-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 605px; left: 712px; width: 180px; height: 100px;\\"><img id=\\"TV-Stand-image-draggable\\" class=\\"TV-Stand-image draggable-furniture\\" src=\\"/assets/furniture-images/TV-Stand.png\\"></div>","image-draggable-container-3":"<div id=\\"image-draggable-container-3\\" class=\\"Fireplace-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 366px; left: 518px;\\"><img id=\\"Fireplace-image-draggable\\" class=\\"Fireplace-image draggable-furniture\\" src=\\"/assets/furniture-images/Fireplace.png\\"></div>","image-draggable-container-4":"<div id=\\"image-draggable-container-4\\" class=\\"Bookcase-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 367px; left: 1013px;\\"><img id=\\"Bookcase-image-draggable\\" class=\\"Bookcase-image draggable-furniture\\" src=\\"/assets/furniture-images/Bookcase.png\\"></div>","image-draggable-container-5":"<div id=\\"image-draggable-container-5\\" class=\\"Right-Opening-Door-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 655px; left: 983px; width: 122px; height: 112px;\\"><img id=\\"Right-Opening-Door-image-draggable\\" class=\\"Right-Opening-Door-image draggable-furniture\\" src=\\"/assets/furniture-images/Right-Opening-Door.png\\"></div>","image-draggable-container-6":"<div id=\\"image-draggable-container-6\\" class=\\"Rug-image-container draggable-furniture-container\\" style=\\"width: 251px; height: 137px; cursor: grab; top: 466px; left: 677px;\\"><img id=\\"Rug-image-draggable\\" class=\\"Rug-image draggable-furniture\\" src=\\"/assets/furniture-images/Rug.png\\"></div>"}'
        }]
    };

    db.insertOne(user, function (err, result) {
        if (err) {
            console.log("Error inserting entry");
            return false;
        } else {
            console.log("Successfully added a new entry");
        }
    });
    return true;
}

// Routes

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/login');
    }
}

app.get('/',
    checkLoggedIn,
    (req, res) => {
        res.send("hello world");
    });

// Handle post data from the login.html form.
app.post('/login',
    passport.authenticate('local', {     // use username/password authentication
        'successRedirect': __dirname + '/pages/html/home-loggedin.html',   // when we login, go to /private 
        'failureRedirect': __dirname + '/pages/html/home-notloggedin.html'      // otherwise, back to login
    }), (req, res) => {  });

// Handle the URL /login (just output the login.html file).
app.get('/login',
    (req, res) => res.sendFile('/pages/html/home-notloggedin.html',
        { 'root': __dirname }));

// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/login'); // back to login
});


// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/register',
    (req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];
        if (addUser(username, password)) {
            res.redirect('/login');
        } else {
            res.redirect('/register');
        }
    });

// Register URL
app.get('/register',
    (req, res) => res.sendFile('/pages/html/home-notloggedin.html',
        { 'root': __dirname }));

// Private data
app.get('/private',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {             // Go to the user's page.
        res.redirect('/private/' + req.user);
    });

// A dummy page for the user.
app.get('/private/:userID/',
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.userID === req.user) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write('<H1>HELLO ' + req.params.userID + "</H1>");
            res.write('<br/><a href="/logout">click here to logout</a>');
            res.end();
        } else {
            res.redirect('/private/');
        }
    });

app.use(express.static('html'));

app.get('*', (req, res) => {
    res.send('Error');
});

app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});