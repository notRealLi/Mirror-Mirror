import React from "react";
import fetch from "isomorphic-unfetch";
import { withRouter } from "next/router";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";

async function fetcher(url) {
  const res = await fetch(url);
  const json = await res.json();

  return json;
}

const Results = (props) => {
  const { data, error } = useSWR(
    `https://magic-well.herokuapp.com/tweets/search?keywords=${props.router.query.keywords}`,
    fetcher
  );

  if (error)
    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div
          className="results"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key="error"
        >
          failed to load
        </motion.div>
      </AnimatePresence>
    );
  if (!data)
    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div
          className="results"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key="loading"
        >
          loading...
        </motion.div>
      </AnimatePresence>
    );

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="results"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key="success"
      >
        {data[0]}
      </motion.div>
    </AnimatePresence>
  );
};

export default withRouter(Results);
