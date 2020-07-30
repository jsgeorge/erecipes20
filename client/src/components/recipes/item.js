import React, { useContext, useEffect, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import {
  faHeart,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../context/user-context";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";

const RecipeItem = ({ category, recipe }) => {
  const [isAthenticated, setIsAuthenticated] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const [savedRecipe, setSavedRecipe] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);

  const setAuthUser = async (token) => {
    const response = await axios.post("/users/id", { id: token.id });
    dispatch({
      type: "SET_USER",
      payload: response.data,
    });
  };
  useEffect(() => {
    if (!state.user && localStorage.jwtToken) {
      setAuthUser(jwtDecode(localStorage.jwtToken));
    }
    if (state.user[0]) {
      setIsAuthenticated(true);
    }
    if (state.user[0] && recipe) {
      state.user[0].user.favorites.map((f) => {
        if (f.label == recipe.label && f.source == recipe.source) {
          console.log("setting saved to true");
          setSavedRecipe(true);
        }
      });
    }
  }, []);

  const saveRecipe = async (id, label, source, image) => {
    if (isAthenticated) {
      let favorite = {
        uid: state.user[0].user._id,
        id: id,
        label: label,
        source: source,
        image: image,
      };

      try {
        const response = await axios.post("/users/addfavorite", favorite);
        dispatch({
          type: "ADD_FAVORITE",
          payload: response.data,
        });
        setSavedRecipe(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      setRedirectLogin(true);
    }
  };

  const unSaveRecipe = async (id) => {
    //if (isAthenticated) {
    let favorite = {
      uid: state.user[0].user._id,
      id: id,
    };

    try {
      const response = await axios.post("/users/delfavorite", favorite);
      dispatch({
        type: "DEL_FAVORITE",
        payload: response.data,
      });
      setSavedRecipe(false);
      console.log(savedRecipe);
    } catch (err) {
      console.log(err);
    }
    //}
  };

  const onSaveRecipe = async (id, label, source, image) => {
    saveRecipe(id, label, source, image);
  };

  const onUnSaveRecipe = async (id) => {
    unSaveRecipe(id);
  };

  if (recipe) {
    const { url, label, image, source } = recipe;
    let queryStr = "";

    if (category) queryStr = `/recipes/${category}/${label}/${source}`;
    else queryStr = `/recipes/${label}/${source}`;
    //const srchItem = "c=" + category + "l=" + label + "s=" + source;
    return (
      <div className=" col-md-4 col-sm-4 col-xs-4 recipeItem">
        <div className="card mb-3 box-shadow">
          <Link to={queryStr}>
            <img src={image} alt="img" className="card-img-top" />
          </Link>

          <div className="card-body">
            <div
              className="heading"
              style={{ width: "70%", float: "left", paddingLeft: "10px" }}
            >
              <h6 className="card-title">{label}</h6>
              <span style={{ color: "gray" }}>by {source}</span>
            </div>
            <div className="user-favs" style={{ width: "20%", float: "right" }}>
              {isAthenticated ? (
                <div style={{ paddingBottom: "15px" }}>
                  {!savedRecipe ? (
                    <button
                      style={{ background: "transparent", border: "none" }}
                      onClick={() =>
                        onSaveRecipe(
                          recipe.uri,
                          recipe.label,
                          recipe.source,
                          recipe.image
                        )
                      }
                    >
                      {/* <i className="fa fa-heart" style={{ color: "gray" }}>
                            {" "}
                          </i> */}{" "}
                      <FontAwesomeIcon
                        icon={faHeart}
                        size="lg"
                        style={{ color: "gray" }}
                      />
                    </button>
                  ) : (
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                      }}
                      onClick={() => onUnSaveRecipe(recipe.uri)}
                    >
                      {" "}
                      {/* <i
                            className="fa fa-heart"
                            style={{ color: "red" }}
                          ></i> */}
                      <FontAwesomeIcon
                        icon={faHeart}
                        size="lg"
                        style={{ color: "red" }}
                      />{" "}
                    </button>
                  )}
                </div>
              ) : (
                //Not authenticated
                <div style={{ paddingBottom: "15px" }}>
                  <button
                    className="pull-right"
                    style={{
                      background: "transparent",
                      border: "none",
                    }}
                    onClick={() =>
                      onSaveRecipe(
                        recipe.uri,
                        recipe.label,
                        recipe.source,
                        recipe.image
                      )
                    }
                  >
                    {/* <i className="fa fa-heart" style={{ color: "gray" }}>
                        {" "}
                      </i>{" "} */}
                    <FontAwesomeIcon
                      icon={faHeart}
                      size="lg"
                      style={{ color: "#bbb" }}
                    />{" "}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div>Error</div>;
};

export default RecipeItem;
