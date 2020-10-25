import React from "react";

const Header = () => {
  return (
    <div className="header">
      <div className="flex">
        <a href="/">
          <h2>
            <span className="lazy">M</span> I R R{" "}
            <span className="active">O</span> R
          </h2>
        </a>
        <div className="nav-toggle">
          <div className="nav-menu">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
