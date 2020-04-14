import React, { useContext, useEffect, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import { EDAMAM_APPID, EDAMAM_APPKEY } from "../constants";
import { UserContext } from "../../context/user-context";
import axios from "axios";
import jwtDecode from "jwt-decode";
//import { sdata } from "../constants";
import hits from "../../data/recipes";

const RecipeDetailPage = ({ match }) => {
  const [recipe, setRecipe] = useState([]);
  const [label, setLabel] = useState([]);
  const [category, setCategory] = useState([]);
  const [source, setSource] = useState([]);
  const [apiError, setApiError] = useState([]);
  const [errors, setErrors] = useState("");
  const [state, dispatch] = useContext(UserContext);
  const [savedRecipe, setSavedRecipe] = useState(false);
  const [isAthenticated, setIsAuthenticated] = useState(false);

  const setAuthUser = async (token) => {
    const response = await axios.post("/users/id", { id: token.id });
    dispatch({
      type: "SET_USER",
      payload: response.data,
    });
  };

  useEffect(() => {
    if (!state.user[0] && localStorage.jwtToken) {
      setAuthUser(jwtDecode(localStorage.jwtToken));
    }
    if (state.user[0]) {
      setIsAuthenticated(true);
    }
    setLabel(match.params.l);
    setSource(match.params.s);
    setCategory(match.params.c);
    getRecipe(match.params.c + " " + match.params.s);
    if (isAthenticated) {
      state.user[0].user.favorites.map((f) => {
        if (f.label === match.params.l && f.source === match.params.s) {
          setSavedRecipe(true);
        }
      });
    }
  }, []);

  const getRecipe = async (item) => {
    setErrors("");
    if (item) {
      try {
        console.log("fetching data");
        const request = await fetch(
          `https://api.edamam.com/search?q=${item}&to=1&app_id=${EDAMAM_APPID}&app_key=${EDAMAM_APPKEY}`
        );

        const data = await request.json();
        if (!data) {
          setErrors("ERROR - could not retrieve data");
        } else {
          setErrors("");
          setRecipe(data.hits[0].recipe);
        }

        // let rec = hits.filter((data) => {
        //   if (data.recipe.label.includes(label)) {
        //     console.log("rec filter", data.recipe);
        //     setRecipe(data.recipe);
        //   }
        // });

        // setRecipe(sdata);
      } catch (err) {
        setErrors("Error could not retrieve recipe. Network Error");
        // setApiError("ERROR could not retrieve recipe. Network Error");
      }
    } else {
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

  return (
    <div className="page-wrapper ">
      <div key={label} className="detailWrapper">
        <div className="recipeHeader">
          <Link to="/">categories></Link> >{" "}
          {category ? (
            <span>
              <Link to={`/${category}`}> {category}</Link> <br />
            </span>
          ) : (
            <Link to="/user">
              <i className="fa fa-angle-left fa-lg"></i>Back
            </Link>
          )}
        </div>
        {!errors && recipe ? (
          // recipe.map((recipe) => (
          <div className="row recipeDetail">
            <div className="col-lg-4 col-md-6 col-sm-6 detailHeader">
              <h3>{label} </h3>
              <h5>by {source}</h5>

              <img src={recipe.image} alt="img" className="card-img-top" />
              <div>
                <p>
                  <strong> Diet Labels</strong>{" "}
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
                </p>
              </div>
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
                      <i className="fa fa-heart" style={{ color: "gray" }}>
                        {" "}
                      </i>{" "}
                      Save{" "}
                    </button>
                  ) : (
                    <button
                      style={{ background: "transparent", border: "none" }}
                      onClick={() => onUnSaveRecipe(recipe.uri)}
                    >
                      <i className="fa fa-heart" style={{ color: "red" }}></i>
                      Saved
                    </button>
                  )}
                </div>
              ) : null}
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6 detailSection">
              <h4>Ingredients</h4>
              {recipe.ingredients &&
                recipe.ingredients.map((i) => (
                  <p key={i.text + " " + i.weight}>{i.text}</p>
                ))}
            </div>

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
