import React, { useContext, useEffect, useState, useReducer } from "react";
import { Link, Redirect } from "react-router-dom";
import { EDAMAM_APPID, EDAMAM_APPKEY } from "../constants";
import { UserContext } from "../../context/user-context";
import axios from "axios";
import jwtDecode from "jwt-decode";
//import { sdata } from "../constants";
//import rec from "../../data/recipe";
import Spinner from "react-bootstrap/Spinner";
import {
  faHeart,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RecipeDetailPage = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState([]);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [apiError, setApiError] = useState([]);
  const [errors, setErrors] = useState("");
  const [state, dispatch] = useContext(UserContext);
  const [savedRecipe, setSavedRecipe] = useState(false);
  const [isAthenticated, setIsAuthenticated] = useState(false);
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
    console.log("label", match.params.l);
    setLabel(match.params.l);
    setSource(match.params.s);
    setCategory(match.params.c);

    getRecipe(match.params.l + " " + match.params.s);
    if (state.user[0]) {
      console.log(state.user[0]);
      state.user[0].user.favorites.map((f) => {
        if (f.label == match.params.l && f.source == match.params.s) {
          console.log("setting saved to true");
          setSavedRecipe(true);
        }
      });
    }
    console.log("savedRecipe", savedRecipe);
  }, []);

  const getRecipe = async (item) => {
    setErrors("");
    setLoading(true);
    if (item) {
      try {
        console.log(item);
        // console.log("fetching data");
        setLoading(true);
        const request = await fetch(
          `https://api.edamam.com/search?q=${item}&to=1&app_id=${EDAMAM_APPID}&app_key=${EDAMAM_APPKEY}`
        );

        const data = await request.json();
        if (!data) {
          setLoading(false);
          setErrors("ERROR - could not retrieve data");
        } else {
          setErrors("");
          setLoading(false);
          console.log(data.hits[0].recipe);
          setRecipe(data.hits[0].recipe);
        }

        // let rec = hits.filter((data) => {
        //   if (data.recipe.label.includes(label)) {
        //     console.log("rec filter", data.recipe);
        //     setRecipe(data.recipe);
        //   }
        // });

        // setRecipe(rec.recipe);
      } catch (err) {
        setLoading(false);
        setErrors("Error could not retrieve recipe. Network Error");
        // setApiError("ERROR could not retrieve recipe. Network Error");
      }
    } else {
      setLoading(false);
      setErrors("Error could not retrieve recipe. Invalid search query");
    }
  };
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

  //const { recipe } = recipe.recipe;
  if (redirectLogin) {
    return <Redirect to="/user/signin" />;
  }
  return (
    <div className="page-wrapper ">
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : null}
      <div key={label} className="detailWrapper">
        <div className="recipeHeader">
          <Link to="/">categories</Link>
          <FontAwesomeIcon icon={faAngleRight} />
          {category ? (
            <span>
              <Link to={`/${category}`}> {recipe.category}</Link>
            </span>
          ) : null}
          <span className="desktop">
            <FontAwesomeIcon icon={faAngleRight} />
            {label}{" "}
          </span>
        </div>
        {!errors && recipe ? (
          // recipe.map((recipe) => (
          <div className="recipeDetail">
            <div class="row">
              <div className="col-md-7 ">
                <div className="heading">
                  <span className="card-title">{recipe.label}</span>
                  <br />
                  <div
                    className="user-favs"
                    style={{ width: "20%", float: "right" }}
                  >
                    {isAthenticated ? (
                      <div style={{ paddingBottom: "15px" }}>
                        {!savedRecipe ? (
                          <button
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
                          </i> */}{" "}
                            <FontAwesomeIcon
                              icon={faHeart}
                              size="lg"
                              style={{ color: "gray" }}
                            />
                            Save{" "}
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
                            Saved
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
                          <span className="desktop">Save</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <span style={{ color: "gray" }}>by {recipe.source}</span>
                </div>
                <img src={recipe.image} alt="img" className="card-img-top" />
              </div>
              <div className="col-md-5">
                <div className="detailSection diet-section">
                  <strong>Health Labels</strong>{" "}
                  {recipe.healthLabels &&
                    recipe.healthLabels.map((l) => <span key={l}>{l}, </span>)}
                  <br />
                  <strong>Coutions</strong>{" "}
                  {recipe.cautions ? recipe.cautions : "none"}
                  <br />
                  <strong>Calories</strong> {recipe.calories}
                  <br />
                  <strong>Time To Prepare</strong> {recipe.totalTime} min
                  <br />
                </div>
                <div className="detailSection">
                  <h4>Ingredients</h4>
                  {recipe.ingredients &&
                    recipe.ingredients.map((i) => (
                      <p key={i.text + " " + i.weight}>{i.text}</p>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6 detailSection"></div>

            <div className="col-lg-4 col-md-6 col-sm-6 detailSection">
              <h4>Nutrients</h4>
              {recipe.totalNutrients ? (
                <p>
                  <strong>{recipe.totalNutrients.ENERC_KCAL.label}</strong>
                  {recipe.totalNutrients.ENERC_KCAL.quantity}{" "}
                  {recipe.totalNutrients.ENERC_KCAL.unit}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          //))
          <div className="recipeDetail">
            <h3>{label} </h3>
            <h5>by {source}</h5>
            <div className="has-error">
              Error Cannot retrieve recipe{" "}
              {errors ? <span>Network Error</span> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;
