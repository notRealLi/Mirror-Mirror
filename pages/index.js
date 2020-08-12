import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Index = () => {
  const [keywords, setKeywords] = useState("");
  const searchLabelRef = useRef(null);
  const router = useRouter();

  const showResults = () => {
    if (keywords !== "")
      router.push({ pathname: "/results", query: { keywords } });
  };

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
    // ENTER
    if (e.keyCode === 13) {
      showResults();
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
      <button onClick={showResults} disabled={keywords === ""}>
        <span>Show</span>
      </button>
    </motion.div>
  );
};

export default Index;
