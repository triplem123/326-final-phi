'use strict';

// import { validUser } from './pages/js/home-notloggedin.js';

const express = require('express');
const router = express.Router();
const dbo = require('./conn.js');

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/html/home-notloggedin.html');
});

router.get('/*.html', (req, res) => {
    res.sendFile(__dirname + '/pages/html' + req.url);
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

// maybe change to post? idk yet, need to test
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

router.post('/createAcc/*', async (req, res) => {
    // create new entry in mongodb for the given user hash in req.body
    const db = await dbo.getDb().db("Users").collection("User_Data");
    const obj = {
        userhash: req.url.split("/")[2],
        Email: "test@fakeaddress.com",
        Password: "badpassword123",
        Rooms_Created: 1,
        rooms: [{
            roomName: 'Living-Room-Sample',
            corners: '{"corner-1":"<div id=\\"draggable\\" class=\\"ui-widget-content corner-1\\"></div>","corner-2":"<div id=\\"draggable\\" class=\\"ui-widget-content corner-2\\"></div>","corner-3":"<div id=\\"draggable\\" class=\\"ui-widget-content corner-3\\"></div>","corner-4":"<div id=\\"draggable\\" class=\\"ui-widget-content corner-4\\"></div>"}',
            furniture: '{"image-draggable-container-1":"<div id=\\"image-draggable-container-1\\" class=\\"Three-Seat-Sofa-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 368px; left: 695px; height: 102px; width: 208px;\\"><img id=\\"Three-Seat-Sofa-image-draggable\\" class=\\"Three-Seat-Sofa-image draggable-furniture\\" src=\\"/assets/furniture-images/Three-Seat-Sofa.png\\"></div>","image-draggable-container-2":"<div id=\\"image-draggable-container-2\\" class=\\"TV-Stand-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 605px; left: 712px; width: 180px; height: 100px;\\"><img id=\\"TV-Stand-image-draggable\\" class=\\"TV-Stand-image draggable-furniture\\" src=\\"/assets/furniture-images/TV-Stand.png\\"></div>","image-draggable-container-3":"<div id=\\"image-draggable-container-3\\" class=\\"Fireplace-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 366px; left: 518px;\\"><img id=\\"Fireplace-image-draggable\\" class=\\"Fireplace-image draggable-furniture\\" src=\\"/assets/furniture-images/Fireplace.png\\"></div>","image-draggable-container-4":"<div id=\\"image-draggable-container-4\\" class=\\"Bookcase-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 367px; left: 1013px;\\"><img id=\\"Bookcase-image-draggable\\" class=\\"Bookcase-image draggable-furniture\\" src=\\"/assets/furniture-images/Bookcase.png\\"></div>","image-draggable-container-5":"<div id=\\"image-draggable-container-5\\" class=\\"Right-Opening-Door-image-container draggable-furniture-container\\" style=\\"cursor: grab; top: 655px; left: 983px; width: 122px; height: 112px;\\"><img id=\\"Right-Opening-Door-image-draggable\\" class=\\"Right-Opening-Door-image draggable-furniture\\" src=\\"/assets/furniture-images/Right-Opening-Door.png\\"></div>","image-draggable-container-6":"<div id=\\"image-draggable-container-6\\" class=\\"Rug-image-container draggable-furniture-container\\" style=\\"width: 251px; height: 137px; cursor: grab; top: 466px; left: 677px;\\"><img id=\\"Rug-image-draggable\\" class=\\"Rug-image draggable-furniture\\" src=\\"/assets/furniture-images/Rug.png\\"></div>"}'
        }]
    };
    db.insertOne(obj, function (err, result) {
        if (err) {
          res.status(400).send('Error inserting entry');
        } else {
          console.log("Succesfully added a new entry");
        }
      });
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