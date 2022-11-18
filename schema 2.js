import { ObjectId } from "mongodb";
import mongoose, { Promise, connect } from "mongoose";

Promise = global.Promise;
connect("mongodb://localhost:3000/team-phi");

let userSchema = new mongoose.Schema({
    email: String,
    emailhash: ObjectId,
    password: String,
    num_room_layouts: Number,
    room_designs: ObjectId
});

let user = mongoose.model("user", userSchema);