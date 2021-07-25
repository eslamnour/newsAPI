const mongoClient = mongodb.MongoClient;
const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "news-app";

mongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Error has occurred");
    }
    console.log("Success");
    const db = client.db(dbName);
  }
);
