'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./router');

app.use(express.json());

app.use('/', router);

app.listen(port, () => {
    console.log("Listening on port " + port);
});

const uri = process.env.MONGODB_URI;

import { ObjectId } from "mongodb";
import mongoose, { Promise, connect } from "mongoose";

Promise = global.Promise;
connect("mongodb://localhost:3000/team-phi");

// creating the schema
const userSchema = new mongoose.Schema({
    email: String,
    emailhash: ObjectId,
    password: String,
    num_room_layouts: Number,
    room_designs: ObjectId
});
// model from the schema
const User = mongoose.model("user", userSchema);

module.exports = User;

// building CRUD endpoint
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// saving data to database
app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save().then(item => {
        res.send("item saved to database");
    }).catch(err => {
        res.status(400).send("unable to save to database");
    });
});