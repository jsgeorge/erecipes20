import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../context/user-context";

const Header = () => {
  const [redirect, setRedirect] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const [isAthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (state.user[0]) {
      setIsAuthenticated(true);
    }
  });
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
          {!isAthenticated ? (
            <Link to="/user/signin">
              <i
                className="fa fa-user fa-sm"
                style={{
                  color: "#aaa",
                  borderRadius: "120px",
                  border: "2px solid #aaa",
                  padding: "4px",
                }}
              ></i>
            </Link>
          ) : (
            <Link to="/user">
              <i
                className="fa fa-user fa-sm"
                style={{
                  color: "#333",
                  borderRadius: "120px",
                  border: "2px solid #333",
                  padding: "4px",
                }}
              ></i>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
