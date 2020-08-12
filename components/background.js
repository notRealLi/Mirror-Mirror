import React from "react";
import Particles from "react-particles-js";

const Background = () => {
  const colorGold = "#e28413";
  return (
    <div className="background">
      <Particles
        params={{
          particles: {
            number: {
              value: 30,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: colorGold,
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
    </div>
  );
};

export default Background;
