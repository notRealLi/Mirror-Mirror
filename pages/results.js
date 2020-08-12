import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { withRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

const Results = (props) => {
  const [tweetIndex, setTweetIndex] = useState(0);

  useEffect(() => {
    if (props.keywords && props.keywords.length > 0) {
      const changeTweet = setInterval(() => {
        setTweetIndex((tweetIndex) => (tweetIndex + 1) % props.keywords.length);
      }, 5000);

      return () => clearInterval(changeTweet);
    }
  });

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
          <motion.p
            className="results"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={tweetIndex}
          >
            {props.keywords.length > 0
              ? tweetIndex >= 0
                ? props.keywords[tweetIndex]
                : props.keywords[0]
              : "No tweets found"}
          </motion.p>
        </AnimatePresence>
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
  const magicWellQueryUrl = `https://magic-well.herokuapp.com/tweets/search?keywords=${topic}&location=${location}`;
  const res = await fetch(magicWellQueryUrl);
  const json = await res.json();

  return {
    props: {
      keywords: json,
      wit: { topic, location },
    },
  };
};

export default withRouter(Results);
