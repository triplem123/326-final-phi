'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./router');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
const connection = require('./database');
const MongoStore = require('connect-mongo')(session);


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', router);

const dbo = require('./conn.js');
const { MongoClient, ServerApiVersion } = require("mongodb");
const connectionString = process.env.ATLAS_URI || "mongodb+srv://phiproject:phinewpassword@326-phi-project.l6dgjtn.mongodb.net/?retryWrites=true&w=majority";

app.use(router);

require('dotenv').config();


const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
require('./authenticationServer');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./router.js
app.use(router);

dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        console.log("--- EXITING ---");
        process.exit();
    }

    app.listen(port, () => {
        console.log("Listening on port " + port);
    });
}); 





