import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Index = () => {
  const [keywords, setKeywords] = useState("");
  const [hoveringButton, setHoveringButton] = useState(false);
  const searchLabelRef = useRef(null);
  const router = useRouter();

  const showResults = () => {
    if (keywords !== "")
      router.push({ pathname: "/results", query: { keywords } });
  };

  const onButtonMouseEnter = () => {
    setHoveringButton(true);
  };
  const onButtonMouseLeave = () => {
    setHoveringButton(false);
  };

  const onInputBlur = () => {
    if (hoveringButton) return;
    setKeywords("");
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
      key={"home"}
      className="home"
    >
      <label
        className="search-label"
        htmlFor="search_input"
        ref={searchLabelRef}
      >
        <img src="/glare.svg" alt="" />
        <input
          id="search_input"
          name="keywords"
          type="text"
          autoComplete="off"
          placeholder="Enter a topic..."
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
        onClick={showResults}
        disabled={keywords === ""}
        onMouseEnter={onButtonMouseEnter}
        onMouseLeave={onButtonMouseLeave}
      >
        <img src="/eye.svg" alt="" />
      </button>
    </motion.div>
  );
};

export default Index;
