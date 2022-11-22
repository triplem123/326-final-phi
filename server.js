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

const uri = "mongodb+srv://<username>:<password>@326-phi-project.l6dgjtn.mongodb.net/?retryWrites=true&w=majority";
