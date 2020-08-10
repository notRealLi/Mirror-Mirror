import React from "react";
import fetch from "isomorphic-unfetch";
import { withRouter } from "next/router";
import useSWR from "swr";

async function fetcher(url) {
  const res = await fetch(url);
  const json = await res.json();

  return json;
}

const Results = (props) => {
  const { data, error } = useSWR(
    `http://127.0.0.1:5000/tweets/search?keywords=${props.router.query.keywords}`,
    fetcher
  );

  if (error) return <div className="results">failed to load</div>;
  if (!data) return <div className="results">loading...</div>;

  return <div className="results">{data[0]}</div>;
};

export default withRouter(Results);
