import React from "react";
import { withRouter } from "next/router";

const Results = (props) => {
  return <div className="results">{props.router.query.keywords}</div>;
};

export default withRouter(Results);
