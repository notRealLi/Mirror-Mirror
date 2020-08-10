import { useRef, useState } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Index = (props) => {
  const [keywords, setKeywords] = useState("");
  const searchLabelRef = useRef(null);
  const router = useRouter();

  const onInputBlur = (e) => {
    searchLabelRef.current.classList.remove("active");
  };

  const onInputClick = () => {
    searchLabelRef.current.classList.add("active");
  };

  const onInputChange = (e) => {
    setKeywords(e.target.value);
  };

  const onInputFocus = (e) => {
    setKeywords("");
  };

  const onInputKeyDown = (e) => {
    if (e.keyCode === 13 && keywords !== "") {
      router.push({ pathname: "/results", query: { keywords: keywords } });
    }
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={"sdff"}
      className="home"
    >
      <label
        className="search-label"
        htmlFor="search_input"
        ref={searchLabelRef}
      >
        <input
          id="search_input"
          name="keywords"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={keywords}
          onChange={onInputChange}
          onClick={onInputClick}
          onBlur={onInputBlur}
          onFocus={onInputFocus}
          onKeyDown={onInputKeyDown}
        />
      </label>
      <button
        onClick={() =>
          router.push({ pathname: "/results", query: { keywords: keywords } })
        }
      >
        Tweets
      </button>
    </motion.div>
  );
};

export const getStaticProps = async function () {
  const res = await fetch(
    "https://my-json-server.typicode.com/wrongakram/demo/products"
  );

  const data = await res.json();

  return {
    props: {
      products: data,
    },
  };
};

export default Index;
