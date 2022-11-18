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
