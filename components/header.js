import React from "react";
import { Link } from "next/link";

const Header = () => {
  return (
    <div className="header">
      <div className="flex">
        <div className="logo">
          <a href="/">
            <a>Mirror rorriM</a>
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
