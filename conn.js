const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI || "mongodb+srv://phiproject:phiProject@326-phi-project.l6dgjtn.mongodb.net/?retryWrites=true&w=majority";;

// const client = MongoClient;
// client.connect(connectionString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

let dbConnection;
async function start() {
    const client = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    let testDb = await client.db("TestDb").collection('testcollection');
    console.log(client);
    dbConnection = client;
    testDb.insertOne({'test': 'testvalue'});
}

start();

module.exports = {
  connectToServer: async function (callback) {
    const client = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    let testDb = await client.db("TestDb").collection('testcollection');
    console.log(client);
    dbConnection = client;
    testDb.insertOne({'test': 'testvalue'});
  },

  getDb: function () {
    return dbConnection;
  },
};