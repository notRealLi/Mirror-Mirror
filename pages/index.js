import { useRef } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { motion } from "framer-motion";

const Index = (props) => {
  const searchLabelRef = useRef(null);
  const onInputBlur = () => {
    searchLabelRef.current.classList.remove("active");
  };
  const onInputClick = () => {
    searchLabelRef.current.classList.add("active");
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={"sdff"}
      className="home"
    >
      <label class="search-label" for="search_input" ref={searchLabelRef}>
        <input
          id="search_input"
          name="keywords"
          type="text"
          onClick={onInputClick}
          onBlur={onInputBlur}
        />
      </label>
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
