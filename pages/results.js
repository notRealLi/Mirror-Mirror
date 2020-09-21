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
const MAX_TOPIC_LENGTH = 30;

const Results = ({ tweets, topic, dirty }) => {
  const [tweetIndex, setTweetIndex] = useState(0);
  const [tweetsSentiment, setTweetsSentiment] = useState({
    done: false,
    label: "Calibrating",
    score: "Calculating",
  });
  const sentimentDiv = useRef(null);

  const dispatch = useGlobalDispatchContext();
  const { colors } = useGlobalStateContext();

  useEffect(() => {
    if (tweets && tweets.length > 0) {
      const changeTweet = setInterval(() => {
        setTweetIndex((tweetIndex) => (tweetIndex + 1) % tweets.length);
      }, 6000);

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
      if (!tweets || tweets.length === 0) {
        setTweetsSentiment({
          score: 0.5,
          label: "Neutral",
          done: true,
        });

        return;
      }

      const neutralCutoff = 0.47;
      const positiveCutoff = 0.55;
      if (!tweetsSentiment.done && tweets && tweets.length > 0) {
        let score = 0;
        let scoreCount = 0;

        for (const tweet of tweets.slice(0, 25)) {
          // TODO: Better special character filtering
          console.log("start");
          let query = tweet.replace(/[^\w\s]/gi, " ");
          let sentimentUrl = `/api/sentiment?q=${query}`;
          if (dirty) sentimentUrl += "&dirty=true";
          console.log(query);
          const sentimentRes = await fetch(sentimentUrl);
          const sentimentJson = await sentimentRes.json();
          console.log(sentimentJson);
          if (sentimentJson && sentimentJson.score) {
            score += Number(sentimentJson.score);
            scoreCount++;
          }
          console.log("done");
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
  }, []);

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
                Topic:{" "}
                <span>{`"${
                  topic.length < MAX_TOPIC_LENGTH
                    ? topic
                    : topic.substring(0, MAX_TOPIC_LENGTH).concat("...")
                }"`}</span>
              </h2>
              <h2>
                Location: <span>N/A</span>
              </h2>
              <h2>
                Recency: <span>N/A</span>
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
            <div className="tweets">
              <h2>{/* What folks were saying: */}What folks are saying: </h2>
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  className="text-bubble"
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

  let topic;
  let location;
  try {
    const witAiQueryUrl = `https://api.wit.ai/message?v=20200811&q=${utterance}`;
    // TODO: handle no network connection on server
    const witAiRes = await fetch(witAiQueryUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer TFCWCET22RBPVMGKJQ3YDPXIWAAISCJB",
      },
    });
    const witAiJson = await witAiRes.json();
    if (witAiJson.entities["topic:topic"]) {
      topic = witAiJson.entities["topic:topic"]
        .map((topic) => topic.value)
        .join(" ");
    } else {
      topic = query.keywords;
    }
    location = witAiJson.entities["wit$location:location"]
      ? witAiJson.entities["wit$location:location"][0].resolved.values[0].name
      : "N/A";
  } catch (err) {
    topic = topic = query.keywords;
  }

  // if tweets are dirty (depending on API source)
  let dirty = false;

  try {
    // calling Magic Well api
    const magicWellQueryUrl = `${process.env.MAGIC_WELL_URL}/tweets/search?keywords=${topic}&location=${location}`;
    const magicWellRes = await fetch(magicWellQueryUrl);
    const magicWellJson = await magicWellRes.json();
    const tweets = magicWellJson.map((tweet) => tweet.text);

    return {
      props: {
        dirty,
        tweets,
        topic,
      },
    };
  } catch (err) {
    const tweetsRes = await fetch(`${process.env.HOST}/api/tweets?q=${topic}`);
    const tweets = await tweetsRes.json();
    dirty = true;

    return {
      props: {
        dirty,
        tweets,
        topic,
      },
    };
  }
};

export default withRouter(Results);
