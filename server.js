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
        if (!await findUser(username, password)) {
            // no such user
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Wrong username' });
        }
        if (!await validatePassword(username, password)) {
            // invalid password
            // should disable logins after N messages
            // delay return to rate-limit brute-force attacks
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Wrong password' });
        }
        // success!
        // should create a user object here, associated with a unique identifier
        const db = await dbo.getDb().db("Users").collection("User_Data");
        const data = await db.findOne({ Email: username });
        const delay = setTimeout(() => {
            console.log("delay done");
            done(null, data);
        }, 1000);
        console.log("done with local strategy");
    });

// App configuration and database connection

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
    done(null, user.userhash);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    console.log("uid: ");
    console.log(uid);
    dbo.getDb().db("Users").collection("User_Data").findOne({ userhash: uid }).then(user => {
        done(null, user);
    });
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({ 'extended': true })); // allow URLencoded data

// Returns true iff the user's userhash exists.
async function findUser(username, password) {
    const db = await dbo.getDb().db("Users").collection("User_Data");
    const data = await db.findOne({ Email: username });
    return data === null ? false : true;
}

// Returns true iff the password is the one we have stored.
async function validatePassword(name, pwd) {
    if (!await findUser(name, pwd)) {
        return false;
    }
    const db = await dbo.getDb().db("Users").collection("User_Data");
    const data = await db.findOne({ Email: name });
    if (mc.check(pwd, data.Password[0], data.Password[1])) {
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
    // console.log("checking");
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        console.log("next()");
        next();
    } else {
        // Otherwise, redirect to the login page.

        const page = req.url.split(".")[0];;
        if (page === '/guest-room-builder') {
            console.log("redirecting to guest");
            res.sendFile(__dirname + '/pages/html/guest-room-builder.html');
        } else {
            console.log("redirecting to login");
            res.redirect('/');
        }
    }
}

// app.get('/',
//     checkLoggedIn,
//     (req, res) => {
//         console.log("hello world");
//         res.send("hello world");
//     });

// Handle post data from the login.html form.
// app.post('/login',
//     passport.authenticate('local', {     // use username/password authentication
//         'successRedirect': '/home-loggedin.html',   // when we login, go to /private 
//         'failureRedirect': '/home-notloggedin.html'      // otherwise, back to login
//     }), (req, res) => res.redirect('/home-loggedin.html'));

app.post('/login',
    passport.authenticate('local', { 
        'failureRedirect': '/home-notloggedin.html',
        'failureFlash': true 
    }), (req, res) => {
        console.log("redirecting after authentication");
        // console.log(req.user);
        res.redirect('/home-loggedin.html');
        console.log("after redirect");
        // res.sendFile(__dirname + '/pages/html/home-loggedin.html');
    });

// Handle the URL /login (just output the login.html file).
app.get('/login',
    (req, res) => {
        console.log("login get route");
        res.sendFile('pages/html/home-notloggedin.html',
            { 'root': __dirname });
    });

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
        let bool = false;
        addUser(username, password).then(r => bool = r);
        if (bool) {
            console.log("successfully registered!");
            res.redirect('/login');
        } else {
            console.log("failed to register");
        }
    });

// Register URL
app.get('/register',
    (req, res) => res.sendFile(__dirname + '/pages/html/home-notloggedin.html'));

// // Private data
// app.get('/private',
//     checkLoggedIn, // If we are logged in (notice the comma!)...
//     (req, res) => {             // Go to the user's page.
//         res.redirect('/private/' + req.user);
//     });

// // A dummy page for the user.
// app.get('/private/:userID/',
//     checkLoggedIn, // We also protect this route: authenticated...
//     (req, res) => {
//         // Verify this is the right user.
//         // if (req.params.userID === req.user) {
//         //     res.writeHead(200, { "Content-Type": "text/html" });
//         //     res.write('<H1>HELLO ' + req.params.userID + "</H1>");
//         //     res.write('<br/><a href="/logout">click here to logout</a>');
//         //     res.end();
//         // } else {
//         //     res.redirect('/private/');
//         // }
//     });

app.use(express.static('html'));

app.get('/home-notloggedin.html', (req, res) => {
    res.sendFile(__dirname + '/pages/html/home-notloggedin.html');
});

app.get('/*.html', checkLoggedIn, (req, res) => {
    const page = req.url.split(".")[0];
    console.log("using new route");
    if (page === '/home-loggedin' || page === '/profile' || page === '/room-builder' || page === '/my-rooms') {
        res.sendFile(__dirname + '/pages/html' + req.url);
    } else {
        res.redirect('/home-notloggedin.html');
    }
});

// app.get('*', (req, res) => {
//     res.send('Error');
// });

app.use('/', router);

app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});