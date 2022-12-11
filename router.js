'use strict';

const express = require('express');
const router = express.Router();
const dbo = require('./conn.js');

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/html/home-notloggedin.html');
});

router.get('/*.css', (req, res) => {
    res.sendFile(__dirname + '/pages/css' + req.url);
});

router.get('/*.js', (req, res) => {
    res.sendFile(__dirname + '/pages/js' + req.url);
});

router.get('/assets/furniture-images/*', (req, res) => {
    res.sendFile(__dirname + req.url);
});

router.get('/getAccInfo/*', async (req, res) => {
    const db = await dbo.getDb().db("Users").collection("User_Data");
    const data = await db.findOne({ userhash: req.url.split("/")[2] });
    data === null ? res.status(400).send('Not a valid user hash') : res.send(data);
});

router.post('/updateAcc/*', async (req, res) => {
    // save req.body to mongodb for the given user hash in req.body
    const db = await dbo.getDb().db("Users").collection("User_Data");
    function errorfunc (err, result) {
        if (err) {
            res.status(400).send('Error updating entry');
        } else {
            console.log("Succesfully updated an entry");
        }
    }
    if (Object.keys(req.body).includes("password")) {
        db.updateOne({ userhash: req.url.split("/")[2] }, { $set: { Password: req.body.password } }, errorfunc);
    }
    if (Object.keys(req.body).includes("Rooms_Created")) { // this isn't changing the value for some reason
        db.updateOne({ userhash: req.url.split("/")[2] }, { $set: { Rooms_Created: req.body.Rooms_Created } }, errorfunc);
    }
    if (Object.keys(req.body).includes("rooms")) {
        db.updateOne({ userhash: req.url.split("/")[2] }, { $set: { rooms: req.body.rooms } }, errorfunc);
    }
    if (Object.keys(req.body).includes("userhash")) {
        db.updateOne({ userhash: req.url.split("/")[2] }, { $set: { userhash: req.body.userhash } }, errorfunc);
    }
    res.sendStatus(200);
});

router.delete('/deleteAcc/*', async (req, res) => {
    // delete the entry in mongodb with the given user hash
    const db = await dbo.getDb().db("Users").collection("User_Data");
    db.deleteOne({ userhash: req.url.split("/")[2] }, function (err, result) {
        if (err) {
            res.status(400).send('Error inserting entry');
        } else {
            console.log("Succesfully deleted an account");
        }
    });
});

module.exports = router;