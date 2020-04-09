import React, { useContext, useEffect, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import { EDAMAM_APPID, EDAMAM_APPKEY } from "../constants";
import { UserContext } from "../../context/user-context";
import axios from "axios";
import jwtDecode from "jwt-decode";
//import { sdata } from "../constants";

const RecipeDetailPage = ({ match }) => {
  const [recipes, setRecipes] = useState([]);
  const [label, setLabel] = useState([]);
  const [category, setCategory] = useState([]);
  const [source, setSource] = useState([]);
  const [errors, setErrors] = useState([]);
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
     console.log("detail user", state.user[0]);
    if (!state.user[0] && localStorage.jwtToken) {
      setAuthUser(jwtDecode(localStorage.jwtToken));
    }
    if (state.user[0]) {
      setIsAuthenticated(true);
    }
    setCategory(match.params.c);
    setLabel(match.params.l);
    setSource(match.params.s);
    getRecipes();
    if (isAthenticated) {
      state.user[0].user.favorites.map((f) => {
        if (f.label === match.params.l && f.source === match.params.s) {
          setSavedRecipe(true);
        }
      });
    }
  });

  const getRecipes = async () => {
    let item = label + " " + source;
    if (item) {
      const request = await fetch(
        `https://api.edamam.com/search?q=${item}&to=1&app_id=${EDAMAM_APPID}&app_key=${EDAMAM_APPKEY}`
      );

      const data = await request.json();
      setRecipes(data.hits);
     // setRecipes(sdata);
      
    } else {
      setErrors("Error could not retrieve recipe. Invalid search query");
    }
  };
  const saveRecipe = async (id, label, source, image) => {
    if (isAthenticated) {
      console.log("userid in saveRecipe", state.user[0].user._id);
      let favorite = {
        uid: state.user[0].user._id,
        id: id,
        label: label,
        source: source,
        imgURL: image,
      };
      console.log(state.user[0].user._id);

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
  return (
    <div className="page-wrapper ">
      {recipes ? (
        recipes.map((recipe) => (
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
            <div className="row recipeDetail" key={recipe.recipe.label}>
              <div className="col-lg-4 col-md-6 col-sm-6 detailHeader">
                <h3>{recipe.recipe.label} </h3>
                <h5>by {recipe.recipe.source}</h5>
                <img
                  src={recipe.recipe.image}
                  alt="img"
                  className="card-img-top"
                />
                <div>
                  <p>
                    <strong> Diet Labels</strong>{" "}
                    {recipe.recipe.healthLabels.map((l) => (
                      <span key={l}>{l}, </span>
                    ))}
                    <br />
                    <strong>Coutions</strong>{" "}
                    {recipe.recipe.cautions ? recipe.recipe.cautions : "none"}
                    <br />
                    <strong>Calories</strong> {recipe.recipe.calories}
                    <br />
                    <strong>Time To Prepare</strong> {recipe.recipe.totalTime}{" "}
                    min
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
                            recipe.recipe.uri,
                            recipe.recipe.label,
                            recipe.recipe.source,
                            recipe.recipe.image
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
                        onClick={() => onUnSaveRecipe(recipe.recipe.uri)}
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
                {recipe.recipe.ingredients.map((i) => (
                  <p key={i.text + " " + i.weight}>{i.text}</p>
                ))}
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 detailSection">
                <h4>Nutrients</h4>
                <p>
                  <strong>
                    {recipe.recipe.totalNutrients.ENERC_KCAL.label}
                  </strong>
                  {recipe.recipe.totalNutrients.ENERC_KCAL.quantity}{" "}
                  {recipe.recipe.totalNutrients.ENERC_KCAL.unit}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>Error Cannot retrieve recipe</div>
      )}
    </div>
  );
};

export default RecipeDetailPage;
