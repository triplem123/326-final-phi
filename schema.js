import { ObjectId } from "mongodb";
import mongoose, { Promise, connect } from "mongoose";

Promise = global.Promise;
connect("mongodb://localhost:3000/team-phi");

// creating the schema
let userSchema = new mongoose.Schema({
    email: String,
    emailhash: ObjectId,
    password: String,
    num_room_layouts: Number,
    room_designs: ObjectId
});
// model from the schema
let user = mongoose.model("user", userSchema);

// building CRUD endpoint
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// saving data to database
app.post("/addname", (req, res) => {
    var myData = new user(req.body);
    myData.save().then(item => {
        res.send("item saved to database");
    }).catch(err => {
        res.status(400).send("unable to save to database");
    });
});