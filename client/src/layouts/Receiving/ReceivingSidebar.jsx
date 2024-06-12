import React from "react";
import { Link } from "react-router-dom";

const ReceivingSidebar = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/Receiving/section1">Section 1</Link>
        </li>
        <li>
          <Link to="/Receiving/section2">Section 2</Link>
        </li>
      </ul>
    </div>
  );
};

export default ReceivingSidebar;
