import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { motion } from "framer-motion";

const Index = (props) => {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={"sdff"}
      className="home"
    >
      <motion.input type="text" name="keyword" id="searchbar" />
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
