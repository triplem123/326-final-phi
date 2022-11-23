'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./router');

app.use(express.json());

app.use('/', router);


// const dbo = require('./conn.js');
const { MongoClient, ServerApiVersion } = require("mongodb");
const connectionString = process.env.ATLAS_URI || "mongodb+srv://phiproject:phinewpassword@326-phi-project.l6dgjtn.mongodb.net/?retryWrites=true&w=majority";


const connectDb = async () => {
    try {
        const client = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
    });
        let testDb = await client.db("phiproject").collection('phiproject');
        console.log(client);
        testDb.insertOne({'test': 'testvalue'});
    } catch (err) {
        console.log(err);
    }
}

connectDb();

// dbo.connectToServer(function (err) {
//     if (err) {
//         console.error(err);
//         process.exit();
//     }

//     app.listen(port, () => {
//         console.log("Listening on port " + port);
//     });
// }); 
app.listen(port, () => {
    console.log("Listening on port " + port);
});