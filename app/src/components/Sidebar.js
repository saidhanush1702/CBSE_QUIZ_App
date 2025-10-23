import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-square"></div>
        <h2 className="sidebar-app-name">SmaranAI</h2>
      </div>

      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <div className="icon-square"></div>
          Analysis
        </li>
        <li className="sidebar-item">
          <div className="icon-square"></div>
          Quizzes
        </li>
        <li className="sidebar-item">
          <div className="icon-square"></div>
          Results
        </li>
        <li className="sidebar-item">
          <div className="icon-square"></div>
          Help Centre
        </li>
      </ul>

      <div className="back-to-home">
        <div className="back-square"></div>
        <span>Back to home</span>
      </div>
    </div>
  );
};

export default Sidebar;
