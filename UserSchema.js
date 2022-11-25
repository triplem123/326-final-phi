// import { ObjectId } from "mongodb";
// import mongoose, { Promise, connect } from "mongoose";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

Promise = global.Promise;
connect("mongodb://localhost:3000/team-phi");

let userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    emailhash: ObjectId,
    password: {
        type: String,
        required: true
    },
    num_room_layouts: Number,
    room_designs: ObjectId
});

// let user = mongoose.model("user", userSchema);
module.exports = mongoose.model("UserSchema", userSchema);