import React, { useState } from "react";
import Particles from "react-particles-js";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStateContext } from "../context/globalContext";

const Background = () => {
  const { particlesColor } = useGlobalStateContext();

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
                  value: 16,
                  density: {
                    enable: true,
                    value_area: 800,
                  },
                },
                color: {
                  value: particlesColor,
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
