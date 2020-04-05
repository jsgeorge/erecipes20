import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
          <div className="container">
            <Link to="/">
              <h3 style={{ color: "red" }}> eRecipes</h3>
            </Link>
            <Link to="/" style={{ color: "#111" }}>
              Recipes
            </Link>
            <Link to="/user/signin">
              <h3 style={{ color: "#aaa" }}>
                {" "}
                <i className="fa fa-user "></i>
              </h3>
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
