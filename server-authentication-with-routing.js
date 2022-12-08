/*
'use strict';


import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { default as mongodb } from "mongodb";
import dotenv from "dotenv";
let ObjectId = require("mongodb");
const router = require('./router');


app.use('/', router);

const dbo = require('./conn.js');
const { MongoClient, ServerApiVersion } = require("mongodb");
const connectionString = process.env.ATLAS_URI || "mongodb+srv://phiproject:phinewpassword@326-phi-project.l6dgjtn.mongodb.net/?retryWrites=true&w=majority";

dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        console.log("--- EXITING ---");
        process.exit();
    }
    const express = require('express');                
    const expressSession = require('express-session');  
    const passport = require('passport');               // handles authentication
    const LocalStrategy = require('passport-local').Strategy;

    const app = express();

    const MongoClient = mongodb.MongoClient;

    const minicrypt = require('./miniCrypt');
    const mc = new minicrypt();

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    dotenv.config({ path: __dirname + "/.env" });

    const port = process.env.PORT || 3000;


    // DB access configuration

    let secrets, mongoURL, sessionSecret;
    if(!process.env.URL) {
        secrets = JSON.parse(fs.readFileSync("./secrets.json"));
        mongoURL = secrets.URL;
    } else {
        mongoURL = process.env.URL;
    }

    // Secret session in express

    if(!process.env.SECRET) {
        secrets = JSON.parse(fs.readFileSync("./secrets.json"));
        sessionSecret = secrets.sessionSecret;
    } else {
        sessionSecret = process.env.SECRET;
    }


    // Session configuration

    const session = {
        secret : sessionSecret, // set this encryption key in Heroku config (never in GitHub)!
        resave : false,
        saveUninitialized: false
    };

    // Passport configuration

    const strategy = new LocalStrategy(
        async (username, password, done) => {
            const userValid = await validatePassword(username, password);
        if (!userValid) {
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message' : 'Wrong password' });
        }
        // success!
        // should create a user object here, associated with a unique identifier
        return done(null, username);
        });

    async function addUser(username, password, email) {
        const [salt, hash] = mc.hash(password);
        // User or email should not exist in the database
        const result = mongoConnect(async (users, chars) => {
            // check if user exists and returns false if they do
            if ((await users.findOne({ user: username })) !== null) {
            return false;
            // Checks if email exists and returns false if they do
            } else if ((await users.findOne({ email: email })) !== null) {
            return false;
            } else {
            // add user to db if username/password don't exist
            await users.insertOne({
                user: username,
                pass: [salt, hash],
                email: email,
                num_room_layouts: Number,
                room_designs: ObjectId
            });
            console.log("New user created: " + username);
            return true;
            }
        });
        return result;
        }

    async function getUserData(username) {
        return mongoConnect(async (users, chars) => {
            const userData = await users.findOne({ user: username });
            return userData;
        });
        }

    async function validatePassword(username, password) {
        const valid = true;
        return mongoConnect(async (users, chars) => {
            if((await users.findOne({ user: username })) === null) {
                return !valid;
            }
            const userData = await users.findOne({ user: username });
            if(!mc.check(password, userData.pass[0], userData.pass[1])) {
                return !valid;
            }
            return valid;
        });
    }

    // App configuration

    app.use(expressSession(session));
    passport.use(strategy);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.json()); // allow JSON inputs
    app.use(express.static('client'));


    // Convert user object to a unique identifier.
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    // Convert a unique identifier to a user object.
    passport.deserializeUser((uid, done) => {
        done(null, uid);
    });

    app.use(express.urlencoded({'extended' : true})); // allow URLencoded data

    /////

    // we use an in-memory "database"; this isn't persistent but is easy

    //// NEW ////

    // We used to use:
    //   let users = { 'emery' : 'compsci326' } // default user

    // Now, instead of storing the above password in plaintext, we store a
    // random salt and the hash of the password concatentated with that
    // salt.

    let users = {}; // name : [salt, hash]

    // Illustration of how salts and hashes look and work
    const exampleSalt = '541818e33fa6e21a35b718bbd94d1c7f';
    const exampleHash = '902f945dc114cdf04bb1b2bbcc2ccdef6e416fdb1dce93ed8f34dc6aac02eefaaaf5d65c657dec6e405efa977a26c8e41ff4eb3f46722fbd88779a25d1a22c5b';
    console.log(mc.check('compsci326', exampleSalt, exampleHash)); // true
    console.log(mc.check('nope', exampleSalt, exampleHash)); // false

    // Returns true iff the user exists.
    function findUser(username) {
        if (!users[username]) {
            return false;
        } else {
            return true;
        }
    }



    // Add a user to the "database".


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

    async function mongoConnect(func) {
        let result = true;
        const client = new MongoClient(mongoURL);
        try {
            await client.connect();
            const db = client.db("roomio"),
            users = db.collection("users"),
            rooms = db.collection("rooms");
            result = await func(users, rooms);
        } catch(e) {
            console.log(e.stack);
            result = false;
        } finally {
            await client.close();
        }
        return result;
    }

    app.get('/', (req, res) => {
        res.redirect('home-notloggedin.html');
    });

    // Handle post data from the login.html form.
    app.post('/login', passport.authenticate('local' , {     // use username/password authentication
            'successRedirect' : '/private',   // when we login, go to /private 
            'failureRedirect' : '/login'      // otherwise, back to login
    }));


    // Handle logging out (takes us back to the login page).
    app.post('/logout', (req, res) => {
        req.logout(); // Logs us out!
        res.redirect('/login'); // back to login
    });


    // Like login, but add a new user and password IFF one doesn't exist already.
    // If we successfully add a new user, go to /login, else, back to /register.
    // Use req.body to access data (as in, req.body['username']).
    // Use res.redirect to change URLs.
    async function register(username, password) {
        let [salt, hashed] = mc.hash(password);
        return await Db.none('INSERT INTO users(username, password, salt) VALUES ($1, $2, $3);', [username, hashed, salt]);
    }

    app.post('/signup', async (res, req) => {
        if(!req.body.username || !req.body.password) {
            res.sendStatus(400);
        } else if(!req.isAuthenticated()) {
            try {
                let username = req.body.username;
                let password = req.body.password;
                await register(username, passwrod);
            } catch(e) {
                res.sendStatus(400);
                return;
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    });


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
                res.redirect('home-loggedin.html');
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
}); 
*/