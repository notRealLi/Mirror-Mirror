import { connect } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
    } catch (err) {
      res.statusCode = 500;
      res.send(JSON.stringify([]));
    }
  } else if (req.method === "POST") {
    const { record } = req.body;

    const { db } = await connect();
    await db.collection("records").insertOne(record);

    res.statusCode = 200;
    res.send({
      sucess: true,
    });
  } else {
    res.statusCode = 500;
    res.send("Request method not supported.");
  }
};
