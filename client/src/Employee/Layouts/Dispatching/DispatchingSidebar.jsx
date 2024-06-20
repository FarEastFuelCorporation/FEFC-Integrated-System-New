import React from "react";
import { Link } from "react-router-dom";

const DispatchingSidebar = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/Dispatching/section1">Section 1</Link>
        </li>
        <li>
          <Link to="/Dispatching/section2">Section 2</Link>
        </li>
      </ul>
    </div>
  );
};

export default DispatchingSidebar;
