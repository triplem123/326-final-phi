// schema.js begins here- editing that file for testing

// import { ObjectId } from "mongodb";
let ObjectId = require("mongodb");
// import mongoose, { Promise, connect } from "mongoose";
let Promise = require("mongoose");
let connect = require("mongoose");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

Promise = global.Promise;
// connect("mongodb://localhost:3000/team-phi");
mongoose.connect("mongodb://localhost:3000");
// mongoose.connect("mongodb://localhost/team-phi");

// creating the schema
const userSchema = new Schema({
    email: String,
    emailhash: String,
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