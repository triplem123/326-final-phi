const { MongoClient, ServerApiVersion } = require("mongodb");
const connectionString = process.env.ATLAS_URI || "mongodb+srv://phiproject:phinewpassword@326-phi-project.l6dgjtn.mongodb.net/?retryWrites=true&w=majority";

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