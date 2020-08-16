import React, { useState } from "react";
import Particles from "react-particles-js";
import { motion, AnimatePresence } from "framer-motion";

const Background = () => {
  const colorGold = "#e28413";
  const colorGreen = "#86e7b8";
  const colorRed = "#de3c4b";

  const [color, setColor] = useState(colorGold);

  return (
    <div className="background">
      <AnimatePresence exitBeforeEnter>
        <motion.div
          className="ease-out"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={Math.random()}
        >
          <Particles
            params={{
              particles: {
                number: {
                  value: 15,
                  density: {
                    enable: true,
                    value_area: 800,
                  },
                },
                color: {
                  value: color,
                },
                shape: {
                  type: "circle",
                },
                line_linked: {
                  enable: false,
                },
                size: {
                  value: 3,
                  random: true,
                  anim: {
                    speed: 4,
                    size_min: 0.3,
                  },
                },
              },
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Background;
