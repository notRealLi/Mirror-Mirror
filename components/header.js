import React from "react";

const Header = () => {
  return (
    <div className="header">
      <div className="flex">
        <div className="logo">
          <a href="/">
            <a>M I R R O R</a>
          </a>
        </div>
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
