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

const Results = ({ tweets, topic }) => {
  const [tweetIndex, setTweetIndex] = useState(0);
  const [tweetsSentiment, setTweetsSentiment] = useState({
    done: false,
    label: "Calibrating...",
    score: "Calculating...",
  });
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
    const calculateScore = (score, firstCutoff, secondCutoff) => {
      console.log(score);
      let res;
      if (score < firstCutoff) res = (score / firstCutoff) * 0.33;
      else if (score < secondCutoff)
        res =
          0.33 + ((score - firstCutoff) / (secondCutoff - firstCutoff)) * 0.33;
      else res = 0.66 + ((score - secondCutoff) / (1 - secondCutoff)) * 0.33;

      return res.toFixed(2);
    };
    const getSentiment = async () => {
      const neutralCutoff = 0.47;
      const positiveCutoff = 0.55;
      if (!tweetsSentiment.done && tweets && tweets.length > 0) {
        let score = 0;
        let scoreCount = 0;

        for (const tweet of tweets.slice(0, 30)) {
          // TODO: Better special character filtering
          let query = tweet.replace(/[^\w\s]/gi, " ");
          const sentimentRes = await fetch(`/api/sentiment?q=${query}`);
          const sentimentJson = await sentimentRes.json();

          if (sentimentJson && sentimentJson.score) {
            score += Number(sentimentJson.score);
            scoreCount++;
          }
        }

        score = scoreCount == 0 ? score : score / scoreCount;

        setTweetsSentiment({
          score: calculateScore(score, neutralCutoff, positiveCutoff),
          label:
            score < neutralCutoff
              ? "Negative"
              : score < positiveCutoff
              ? "Neutral"
              : "Positive",
          done: true,
        });

        // set particles color
        dispatch({
          type: "CHANGE_PARTICLES_COLOR",
          payload:
            colors[
              score < neutralCutoff
                ? "negative"
                : score < positiveCutoff
                ? "neutral"
                : "positive"
            ],
        });
      }
    };

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
        <div className="container">
          <div className="sentiment-section">
            <AnimatePresence exitBeforeEnter>
              <motion.div
                id="sentiment"
                className={tweetsSentiment.label.toLowerCase()}
                ref={sentimentDiv}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={tweetsSentiment.label}
              >
                <h2>{tweetsSentiment.label}</h2>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="details-and-tweets-section">
            <div className="details">
              <h2>
                Topic: <span>{`"${topic}"`}</span>
              </h2>
              <h2>
                Location: <span>Unspecified</span>
              </h2>
              <h2>
                Recency: <span>Unspecified</span>
              </h2>
              <h2>
                Score:
                <AnimatePresence exitBeforeEnter>
                  <motion.span
                    id="score"
                    className={tweetsSentiment.label.toLowerCase()}
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={tweetsSentiment.score}
                  >
                    {tweetsSentiment.score}
                  </motion.span>
                </AnimatePresence>
              </h2>
            </div>
            <h2>{/* What folks were saying: */}What folks are saying: </h2>
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
                {/* <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reprehenderit omnis, fuga laboriosam unde temporibus eos quasi
                  velit consequatur commodi quos optio nobis delectus eaque nisi
                  facere! Repudiandae tempora accusamus ad quia, id ex harum quo
                  repellendus deserunt ipsum sapiente cum placeat? Magnam
                  perspiciatis quisquam quod nobis, recusandae ut impedit enim
                  obcaecati odit ab! Neque, at iste. Impedit beatae deleniti
                  atque?
                </p> */}
              </motion.div>
            </AnimatePresence>
          </div>
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
  // TODO: handle no network connection on server
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
      topic,
    },
  };
};

export default withRouter(Results);
