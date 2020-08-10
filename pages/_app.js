import App from "next/app";
import React from "react";
import "../styles/globals.scss";
import { AnimatePresence } from "framer-motion";
import Header from "../components/header";

class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props;

    // console.log(Component);
    // console.log(pageProps);
    // console.log(router);

    return (
      <>
        <Header />
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </>
    );
  }
}

export default MyApp;
