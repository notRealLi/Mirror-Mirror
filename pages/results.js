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
  const keywords = query.keywords;
  const magicWellQueryUrl = `https://magic-well.herokuapp.com/tweets/search?keywords=${keywords}`;
  const res = await fetch(magicWellQueryUrl);
  const json = await res.json();

  return {
    props: {
      keywords: json,
    },
  };
};

export default withRouter(Results);
