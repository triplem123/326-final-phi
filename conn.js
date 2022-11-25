const { MongoClient, ServerApiVersion } = require("mongodb");
const connectionString = process.env.ATLAS_URI;

let dbConnection;

module.exports = {
  connectToServer: async function (callback) {
    try {
      const client = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
      });
        dbConnection = client;
        callback(false);
    } catch (err) {
        console.log("error");
        console.log(err);
    }
  },

  getDb: function () {
    return dbConnection;
  },
};