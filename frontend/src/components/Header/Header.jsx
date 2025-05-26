import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your favorites now and satisfy your cravings!</h2>
        <p>
          Step into the heart of Vietnamese cuisine with a menu full of
          mouthwatering flavors — from sizzling street bites to hearty
          home-style dishes. Made with fresh, local ingredients and bursting
          with tradition, every meal is a journey worth savoring.
        </p>
        <a href="#explore-menu">
          <button className="buttonwl">View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
