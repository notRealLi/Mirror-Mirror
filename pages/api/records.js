import { connect } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const { limit } = req.query;

      const { db } = await connect();
      let records = db.collection("records").find({});
      if (limit) records = records.limit(Number(limit));
      records = await records.toArray();

      res.statusCode = 200;
      res.send(records);
    } catch (err) {
      res.statusCode = 500;
      res.send(JSON.stringify(err));
    }
  } else if (req.method === "POST") {
    try {
      const { record } = req.body;

      const { db } = await connect();
      await db.collection("records").insertOne(record);

      res.statusCode = 200;
      res.send({
        sucess: true,
      });
    } catch (err) {
      res.statusCode = 500;
      res.send(JSON.stringify(err));
    }
  } else {
    res.statusCode = 500;
    res.send("Request method not supported.");
  }
};
