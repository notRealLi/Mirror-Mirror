import Router from "next/router";
import React, { useState, useEffect } from "react";
import "../styles/globals.scss";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/header";

const MyApp = ({ Component, pageProps, router }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const routingStart = () => {
      setLoading(true);
    };

    const routingEnd = () => {
      setLoading(false);
    };

    const routingError = () => {
      setError(true);
    };

    Router.events.on("routeChangeStart", routingStart);
    Router.events.on("routeChangeComplete", routingEnd);
    Router.events.on("routeChangeError", routingError);

    return () => {
      Router.events.off("routeChangeStart", routingStart);
      Router.events.off("routeChangeComplete", routingEnd);
      Router.events.off("routeChangeError", routingError);
    };
  }, []);

  if (error) {
    return (
      <>
        <Header />
        <AnimatePresence exitBeforeEnter>
          <motion.div
            className="loading-and-error"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="error"
          >
            <p>Server Error</p>
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {loading ? (
        <>
          <Header />
          <AnimatePresence exitBeforeEnter>
            <motion.div
              className="loading-and-error"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="loading"
            >
              <p>Loading...</p>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <>
          <Header />
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default MyApp;
