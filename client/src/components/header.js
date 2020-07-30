import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { faHome, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import jwtDecode from "jwt-decode";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  const [redirect, setRedirect] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const [isAthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!state.user[0] && localStorage.jwtToken) {
      setAuthUser(jwtDecode(localStorage.jwtToken));
    }
    if (state.user[0]) {
      setIsAuthenticated(true);
    }
    if (state.user[0]) console.log("user in header", state.user[0].user);
  });

  const setAuthUser = async (token) => {
    console.log("token in header", token.id);
    const response = await axios.post("/users/id", { id: token.id });
    dispatch({
      type: "SET_USER",
      payload: response.data,
    });
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container">
          <div className="navbar-header">
            <Link className="primary-clr" to="/">
              eRecipes
            </Link>
          </div>
          <div className="navbar-right">
            <Link to="/">
              <FontAwesomeIcon
                style={{ float: "left" }}
                icon={faHome}
                size="med"
                marginRight="5px"
                className="primary-btn-clr mobile"
              />
              <span className="desktop primary-btn-clr">Home</span>
            </Link>
            {!isAthenticated ? (
              <Link to="/user/signin">
                <FontAwesomeIcon
                  icon={faUser}
                  size="lg"
                  className="Mobile"
                  style={{
                    color: "#777",
                    borderRadius: "120px",
                    border: "2px solid #777",
                    padding: "Spx",
                    float: "left",
                    marginRight: "5px",
                  }}
                />
                <span className="desktop"> Signin</span>
              </Link>
            ) : (
              <span>
                <Link to="/user/favorites">
                  <FontAwesomeIcon
                    icon={faStar}
                    size="med"
                    className="mobile primary-btn-clr"
                    style={{
                      borderRadius: "120px",
                      marginRight: "5px",
                      float: "left",
                    }}
                  />{" "}
                  <span className="desktop">Favorites</span>
                </Link>
                <Link to="/user">
                  <FontAwesomeIcon
                    icon={faUser}
                    size="lg"
                    style={{
                      color: "#777",
                      borderRadius: "120px",
                      border: "2px solid #777",
                      padding: "Spx",
                      float: "left",
                      marginRight: "5px",
                    }}
                  />{" "}
                  <span className="desktop">
                    {state.user[0] ? state.user[0].user.username : null}
                  </span>
                </Link>
              </span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
