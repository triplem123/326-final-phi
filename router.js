'use strict';

const fs = require('fs');
const express = require('express');
const router = express.Router();

const fakeAccDB = 'fakeaccdb.json';

fs.open(fakeAccDB, 'r', (err, fd) => {
    if (err) {
        fs.writeFileSync(fakeAccDB, '{}');
    }
});

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

router.get('/getAccInfo', async (req, res) => {
    const data = JSON.parse(fs.readFileSync(fakeAccDB));
    res.send(data);
});

router.post('/saveAccInfo', async (req, res) => {
    fs.writeFileSync(fakeAccDB, JSON.stringify(req.body));
    res.sendStatus(200);
});

router.get('/getBuild', async (req, res) => {
    const data = JSON.parse(fs.readFileSync(fakeAccDB));
    res.send(data);
});

router.post('/saveBuild', async (req, res) => {
    fs.writeFileSync(fakeAccDB, JSON.stringify(req.body));
    res.sendStatus(200);
});


// NEW ROUTES THAT ARE NOT TESTED YET

// get the user hash by doing req.url.split("/")[2]

router.get('/getAccInfo/*', async (req, res) => {
    // get data from mongodb for the user hash (*) and send it
});

// maybe change to post? idk yet, need to test
router.put('/updateAcc/*', async (req, res) => {
    // save req.body to mongodb for the given user hash in req.body
});

router.post('createAcc/*', async (req, res) => {
    // create new entry in mongodb for the given user hash in req.body
});

router.delete('deleteAcc/*', async (req, res) => {
    // delete the entry in mongodb with the given user hash
});
    


const dbo = require('./conn.js');

router.put('/db/test', async (req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect.collection('testcollection').insertOne({'testkey': 'testvalue'}, function (err, result) {
        if (err) {
          res.status(400).send('Error inserting matches!');
        } else {
          console.log(`Added a new match with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
    res.sendStatus(200);
});

module.exports = router;