'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./router');

app.use(express.json());

app.use('/', router);


const dbo = require('./conn.js');

dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        process.exit();
    }

    app.listen(port, () => {
        console.log("Listening on port " + port);
    });
}); 