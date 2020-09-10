import React, { useEffect, useState, useRef } from "react";
import fetch from "isomorphic-unfetch";
import { withRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGlobalDispatchContext,
  useGlobalStateContext,
} from "../context/globalContext";

// constants
const MAX_TWEET_LENGTH = 300;

const Results = ({ tweets }) => {
  const [tweetIndex, setTweetIndex] = useState(0);
  const [tweetsSentiment, setTweetsSentiment] = useState("");
  const sentimentDiv = useRef(null);

  const dispatch = useGlobalDispatchContext();
  const { colors } = useGlobalStateContext();

  useEffect(() => {
    if (tweets && tweets.length > 0) {
      const changeTweet = setInterval(() => {
        setTweetIndex((tweetIndex) => (tweetIndex + 1) % tweets.length);
      }, 5000);

      return () => clearInterval(changeTweet);
    }
  });

  useEffect(() => {
    async function getSentiment() {
      const neutralCutoff = 0.47;
      const positiveCutoff = 0.55;
      if (!tweetsSentiment && tweets && tweets.length > 0) {
        let sentimentScore = 0;
        let sentimentScoreCount = 0;

        for (const tweet of tweets.slice(0, 25)) {
          // TODO: Better special character filtering
          let query = tweet.replace(/[^\w\s]/gi, " ");
          const sentimentRes = await fetch(`/api/sentiment?q=${query}`);
          const sentimentJson = await sentimentRes.json();

          if (sentimentJson && sentimentJson.score) {
            sentimentScore += Number(sentimentJson.score);
            sentimentScoreCount++;
          }
        }

        sentimentScore =
          sentimentScoreCount == 0
            ? sentimentScore
            : sentimentScore / sentimentScoreCount;

        setTweetsSentiment(
          sentimentScore < neutralCutoff
            ? "Negative"
            : sentimentScore < positiveCutoff
            ? "Neutral"
            : "Positive"
        );

        // set particles color
        dispatch({
          type: "CHANGE_PARTICLES_COLOR",
          payload:
            colors[
              sentimentScore < neutralCutoff
                ? "negative"
                : sentimentScore < positiveCutoff
                ? "neutral"
                : "positive"
            ],
        });
      }
    }

    getSentiment();

    // slicing tweets
    tweets = tweets.map((tweet) =>
      tweet.length > MAX_TWEET_LENGTH
        ? tweet.slice(0, MAX_TWEET_LENGTH).concat("...")
        : tweet
    );
  }, [tweetsSentiment]);

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="results"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key="success"
      >
        <div className="results-content">
          <AnimatePresence exitBeforeEnter>
            <motion.div
              id="sentiment"
              className={tweetsSentiment.toLowerCase()}
              ref={sentimentDiv}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={tweetsSentiment}
            >
              <h2>
                {tweetsSentiment !== "" ? tweetsSentiment : "Calibrating"}
              </h2>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              className="tweet"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={tweetIndex}
            >
              <p>
                {tweets && tweets.length > 0
                  ? tweetIndex >= 0
                    ? tweets[tweetIndex]
                    : tweets[0]
                  : "No tweets found"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const getServerSideProps = async function ({ query }) {
  // calling Wit.ai api
  const tokens = query.keywords.split(",");
  tokens[0] = `"${tokens[0]}"`;
  const utterance = tokens.join(",");
  const witAiQueryUrl = `https://api.wit.ai/message?v=20200811&q=${utterance}`;
  const witAiRes = await fetch(witAiQueryUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer TFCWCET22RBPVMGKJQ3YDPXIWAAISCJB",
    },
  });
  const witAiJson = await witAiRes.json();
  let topic;
  if (witAiJson.entities["topic:topic"]) {
    topic = witAiJson.entities["topic:topic"]
      .map((topic) => topic.value)
      .join(" ");
  } else {
    topic = query.keywords;
  }
  const location = witAiJson.entities["wit$location:location"]
    ? witAiJson.entities["wit$location:location"][0].resolved.values[0].name
    : "N/A";

  // calling Magic Well api
  const magicWellQueryUrl = `${process.env.MAGIC_WELL_URL}/tweets/search?keywords=${topic}&location=${location}`;
  const magicWellRes = await fetch(magicWellQueryUrl);
  const magicWellJson = await magicWellRes.json();
  const tweets = magicWellJson.map((tweet) => tweet.text);

  return {
    props: {
      tweets,
    },
  };
};

export default withRouter(Results);
