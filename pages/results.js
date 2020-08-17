import React, { useEffect, useState, useRef } from "react";
import fetch from "isomorphic-unfetch";
import { withRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGlobalDispatchContext,
  useGlobalStateContext,
} from "../context/globalContext";

const Results = ({ tweets, test }) => {
  console.log(test);
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
      if (!tweetsSentiment && tweets && tweets.length > 0) {
        let sentimentScore = 0;
        let sentimentScoreCount = 0;

        for (const tweet of tweets.slice(0, 3)) {
          const sentimentRes = await fetch(`/api/sentiment?tweet=${tweet}`);
          const sentimentJson = await sentimentRes.json();

          if (
            sentimentJson &&
            sentimentJson.metadata &&
            sentimentJson.metadata.sentiment_score
          ) {
            sentimentScore += Number(sentimentJson.metadata.sentiment_score);
            sentimentScoreCount++;
          }
        }

        sentimentScore =
          sentimentScoreCount == 0
            ? sentimentScore
            : sentimentScore / sentimentScoreCount;

        setTweetsSentiment(
          sentimentScore < -0.05
            ? "Negative"
            : sentimentScore < 0.3
            ? "Neutral"
            : "Positive"
        );

        // set particles color
        dispatch({
          type: "CHANGE_PARTICLES_COLOR",
          payload:
            colors[
              sentimentScore < -0.05
                ? "negative"
                : sentimentScore < 0.3
                ? "neutral"
                : "positive"
            ],
        });
      }
    }

    getSentiment();
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
            <h2>{tweetsSentiment !== "" ? tweetsSentiment : "Calculating"}</h2>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence exitBeforeEnter>
          <motion.p
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={tweetIndex}
          >
            {tweets && tweets.length > 0
              ? tweetIndex >= 0
                ? tweets[tweetIndex]
                : tweets[0]
              : "No tweets found"}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export const getServerSideProps = async function ({ query }) {
  console.log(process.env.DB_USER);
  const test = process.env.GCP_CLIENT_EMAIL;
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
  const magicWellQueryUrl = `https://magic-well.herokuapp.com/tweets/search?keywords=${topic}&location=${location}`;
  const magicWellRes = await fetch(magicWellQueryUrl);
  const magicWellJson = await magicWellRes.json();

  return {
    props: {
      tweets: magicWellJson,
      test,
    },
  };
};

export default withRouter(Results);
