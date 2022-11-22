const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI || "mongodb+srv://phiproject:phiProject@326-phi-project.l6dgjtn.mongodb.net/?retryWrites=true&w=majority";;

const client = MongoClient;
client.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("phiproject");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};