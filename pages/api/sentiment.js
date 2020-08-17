import { google } from "googleapis";
import googleServiceAccountKey from "../../apiKeys/Mirror Mirror-109ca6cdd6eb.json";

export default async (req, res) => {
  try {
    const content = req.query.tweet;

    // getting gcp access token
    const googleJWTClient = new google.auth.JWT(
      googleServiceAccountKey.client_email,
      null,
      googleServiceAccountKey.private_key,
      [
        "https://www.googleapis.com/auth/cloud-language",
        "https://www.googleapis.com/auth/cloud-platform",
      ], // You may need to specify scopes other than analytics
      null
    );

    const googleRes = await googleJWTClient.authorize();
    const accessToken = googleRes.access_token;

    // calling gcp sentiment api
    const body = JSON.stringify({
      payload: {
        textSnippet: {
          content,
          mime_type: "text/plain",
        },
      },
    });
    const sentimentAnalysisUrl =
      "https://automl.googleapis.com/v1/projects/1932829714/locations/us-central1/models/TST7969368030259970048:predict";
    const sentimentRes = await fetch(sentimentAnalysisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    });
    const sentimentJson = await sentimentRes.json();

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(sentimentJson);
  } catch (err) {
    res.statusCode = 300;
    res.send(JSON.stringify(err));
  }
};
