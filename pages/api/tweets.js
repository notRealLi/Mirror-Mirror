import { connect } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const { q } = req.query;
      const resultRes = await fetch(
        `https://api.twitter.com/2/search/adaptive.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&q=${q}&count=30&query_source=typd&pc=1&spelling_corrections=1&ext=mediaStats%2ChighlightedLabel`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            authorization: `Bearer ${process.env.BACKUP_TWEETS_API_KEY}`,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-csrf-token": "6525fd2e6aafc17eacdb659c619f9c76",
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
            cookie:
              'personalization_id="v1_MtlMBILc4fhA4fFKEusXcA=="; guest_id=v1%3A158769533868030176; _ga=GA1.2.1357189454.1587695339; syndication_guest_id=v1%3A158769536284870930; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCGGY1FlyAToMY3NyZl9p%250AZCIlMGM1MzE5YTFmOTk2NTdhMjUzZWNjZjZjMDBhM2M2NGM6B2lkIiVkNjMw%250AZWZiMzVlZWM3OWMwMWM4MTZjOTlhYjIzZTYwNg%253D%253D--af2451bf84838637872dcd0bef1b9da2e2e4f723; kdt=GUVsAvIJ2fKNquMvcqSGYbBN5CB2oCW6nAwQwDDw; auth_token=6b66759b3de86e44cbc493a16125c18afe83868d; des_opt_in=Y; tfw_exp=0; twid=u%3D1265887400619913216; external_referer=padhuUp37zjgzgv1mFWxJ12Ozwit7owX|0|8e8t2xd8A2w%3D; ct0=6525fd2e6aafc17eacdb659c619f9c76; _gid=GA1.2.83116926.1600389731',
          },
          referrer: `https://twitter.com/search?q=${q}&src=typd`,
          referrerPolicy: "no-referrer-when-downgrade",
          body: null,
          method: "GET",
          mode: "cors",
        }
      );

      const resultJson = await resultRes.json();
      let tweets = [];
      if (resultJson.globalObjects && resultJson.globalObjects.tweets) {
        const tweetsJson = resultJson.globalObjects.tweets;
        for (const tweet in tweetsJson) {
          tweets.push({
            text: tweetsJson[tweet].full_text,
            id: tweetsJson[tweet].id_str,
          });
        }
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(tweets);
    } catch (err) {
      res.statusCode = 500;
      res.send(JSON.stringify([]));
    }
  } else if (req.method === "POST") {
    console.log(req.body);
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
