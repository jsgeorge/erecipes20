import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EDAMAM_APPID, EDAMAM_APPKEY } from "../constants";
import { UserContext } from "../../context/user-context";
import axios from "axios";

const RecipeDetailPage = ({ match }) => {
  const [recipes, setRecipes] = useState([]);
  const [label, setLabel] = useState([]);
  const [category, setCategory] = useState([]);
  const [source, setSource] = useState([]);
  const [errors, setErrors] = useState([]);
  const [state, dispatch] = useContext(UserContext);
  const [savedRecipe, setSavedRecipe] = useState(false);

  useEffect(() => {
    setCategory(match.params.c);
    setLabel(match.params.l);
    setSource(match.params.s);
    getRecipes();
  });

  const getRecipes = async () => {
    let item = label + " " + source;
    if (item) {
      const request = await fetch(
        `https://api.edamam.com/search?q=${item}&to=1&app_id=${EDAMAM_APPID}&app_key=${EDAMAM_APPKEY}`
      );
      const data = await request.json();
      setRecipes(data.hits);
      console.log(recipes);
    } else {
      setErrors("Error could not retrieve recipe. Invalid search query");
    }
  };
  const saveRecipe = async (label, source, image) => {
    setSavedRecipe(!savedRecipe);
    let favorite = {
      label: label,
      source: source,
      imgURL: image,
    };
    try {
      const response = await axios.post("/users/favorite", favorite);
      dispatch({
        type: "UPDATE_FAVORITE",
        payload: response.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onSaveRecipe = async (label, source, image) => {
    await saveRecipe(label, source, image);
  };
  return (
    <div className="page-wrapper ">
      {recipes ? (
        recipes.map((recipe) => (
          <div className="detailWrapper">
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

                <div style={{ paddingBottom: "15px" }}>
                  <button
                    style={{ background: "transparent", border: "none" }}
                    onClick={() =>
                      onSaveRecipe(
                        recipe.recipe.label,
                        recipe.recipe.source,
                        recipe.recipe.image
                      )
                    }
                  >
                    {!savedRecipe ? (
                      <span>
                        {" "}
                        <i className="fa fa-heart" style={{ color: "gray" }}>
                          {" "}
                        </i>{" "}
                        Save{" "}
                      </span>
                    ) : (
                      <span>
                        <i className="fa fa-heart" style={{ color: "red" }}>
                          {" "}
                        </i>{" "}
                        Saved
                      </span>
                    )}
                  </button>
                </div>
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
