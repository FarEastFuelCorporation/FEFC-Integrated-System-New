// MarketingSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const MarketingSidebar = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/marketing/section1">Section 1</Link>
        </li>
        <li>
          <Link to="/marketing/section2">Section 2</Link>
        </li>
      </ul>
    </div>
  );
};

export default MarketingSidebar;
