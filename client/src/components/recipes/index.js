import React, { useContext, useEffect, useState } from "react";
import RecipeItem from "./item";
import { EDAMAM_APPID, EDAMAM_APPKEY } from "../constants";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { Link, Redirect } from "react-router-dom";
//import { sdata } from "../constants";

const RecipesPage = ({ match }) => {
  const [state, dispatch] = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [header, setHeader] = useState("");
  const [srchTerm, setSrchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(true);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState("");
  const [showRecipes, setShowRecipes] = useState(false);
  const [isAthenticated, setIsAuthenticated] = useState(false);

  const setAuthUser = async (token) => {
    const response = await axios.post("/users/id", { id: token.id });
    dispatch({
      type: "SET_USER",
      payload: response.data,
    });
  };

  useEffect(() => {
    //getRecipes("Beef");
    if (!state.user[0] && localStorage.jwtToken) {
      setAuthUser(jwtDecode(localStorage.jwtToken));
    }
    console.log("home user", state.user[0]);
    
    if (match.params.category) showCategory(match.params.category);
  }, []);

  const getRecipes = async (ctgry) => {
    setApiError("");
    let qry = "";
    if (srchTerm) {
      qry = srchTerm;
      console.log("in getRecipes srchTerm: ", srchTerm);
    } else if (ctgry) {
      qry = ctgry;
    }
    if (qry) {
      try {
        const request = await fetch(
          `https://api.edamam.com/search?q=${qry}&app_id=${EDAMAM_APPID}&app_key=${EDAMAM_APPKEY}&from=0&to=20`
        );
        const data = await request.json();
        if (!data) {
          console.log("ERROR - could not retrieve data");
          setApiError("ERROR - could not retrieve data");
        } else {
          console.log(data.hits);
          setRecipes(data.hits);
        }
        ////setRecipes(sdata);
      } catch (err) {
        console.log("error", err);
        setApiError("Could not retrive selected records. Netowrk problem.");
      }
    } else {
      setErrors("Missing/invalid query");
      console.log("ERROR", "INvalid query");
      setShowRecipes(false);
    }
  };

  const onChange = (e) => {
    // if (!!errors) {
    //   let errors = Object.assign({}, errors);

    //   setErrors(e.target.value, errors);
    // } else {
    if (e.target.value) setSrchTerm(e.target.value);
    else {
      //setSrchTerm("");
      //setShowRecipes(false);
    }
  };

  const isValidEntry = () => {
    if (!srchTerm) {
      setErrors("Missing/invalid serach string");
      return false;
    }

    return true;
  };
  const onSearchEnter = (e) => {
    if (e.key == "Enter") onSearch();
  };
  const onSearch = () => {
    setShowRecipes(false);
    setHeader("");
    if (isValidEntry) {
      setErrors("");
      setHeader(srchTerm);
      getRecipes();
      setSrchTerm("");
      setShowCategories(false);
    } else {
      console.log("ERROR", errors);
      setErrors(errors);
      setShowRecipes(false);
      setHeader("");
    }
  };

  const categoryLink = (img, ctgry) => (
    <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 selCategory">
      <div className="card mb-3 box-shadow">
        <img
          src={img}
          alt="img"
          className="card-img-top"
          onClick={() => showCategory(ctgry)}
        />
        <div className="categoryCaption">
          <h3 onClick={() => showCategory(ctgry)}>{ctgry}</h3>
        </div>
      </div>
    </div>
  );

  const showCategory = (ctgry) => {
    onClearFliters();
    //  console.log("in showCategory() srchTerm1:", srchTerm);
    setCategory(ctgry);
    setHeader(ctgry);
    getRecipes(ctgry);
    setShowCategories(false);
    setShowRecipes(true);
    setErrors();
  };

  const onClearFliters = () => {
    setHeader("");
    setSrchTerm("");
    setShowRecipes(false);
  };

  const renderCategoryLinks = () => (
    <div className="row">
      {categoryLink(
        "https://www.edamam.com/web-img/98a/98aa5d5cc0d88b28c2b9221a099b1a14.jpg",
        "Beef"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/cdf/cdf5903cc1799537ef1f7644880e39f8.jpg",
        "Chicken"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/5a5/5a5220b7a65c911a1480502ed0532b5c.jpg",
        "Pasta"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/b14/b140daf0b4d0b3f111750c46f1f07501.jpg",
        "Soups"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/272/2724347f1843a7c437faacf837326676.jpg",
        "Salad"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/605/605db9567967e4fcef1eb059d0cfd7fe.jpg",
        "Seafood"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/ab6/ab6e92ca81b5cde8127582cda4c00864.jpg",
        "Vegeterian"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/84c/84c49b028be56aafa29ef7505d4dfb60.jpg",
        "Desserts"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/88f/88f1a1c61f6d257e58aae3733440a58b",
        "Drinks"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/b80/b80c4325b0ab90776020df68634b9c0b.jpg",
        "Condiments"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/cd2/cd22b14330062e18fbdf3f41017d4bb9",
        "Breakfast"
      )}
      {categoryLink(
        "https://www.edamam.com/web-img/675/675460d88ec4b6324369fe95763539d6.jpg",
        "Sides"
      )}
    </div>
  );
  return (
    <div className="page-wrapper">
      {errors ? <div className="has-error">{errors}</div> : null}

      <div className="input-group md-form form-sm form-2 pl-0 form">
        <input
          className="form-control my-0 py-1 red-border"
          type="text"
          placeholder="Search"
          aria-label="Search"
          onChange={onChange}
          onKeyPress={onSearchEnter}
        />
        <div className="input-group-append">
          <button
            onClick={() => onSearch()}
            className="input-group-text red lighten-3 srchBtn"
            id="basic-text1"
          >
            <i className="fa fa-search text-grey" aria-hidden="true"></i>
          </button>
        </div>
        <br />
      </div>
      {/* <p>
        srchTerm:{srchTerm} showRecipes:{showRecipes} errors:{errors}
      </p> */}
      <div className="CategoryLinks desktop">{renderCategoryLinks()}</div>
      <div className="CategoryLinks mobile">
        {showCategories ? renderCategoryLinks() : null}
      </div>
      {showRecipes ? (
        <div className="recipeWrapper">
          <div className="recipeHeader">
            <h4>
              <a href="/" onClick={() => onClearFliters()}>
                categories
              </a>{" "}
              > {header}{" "}
            </h4>
          </div>
          {apiError ? (
            <div className="has-error">
              Error in retriving recipes. {apiError}
            </div>
          ) : null}

          {/* <Link
            to={`/recipes/${header}/${"Vegi Burrito"}/${"Mexicali Delights"}`}
          >
            Vegi Burrito by Mexicali Delights
          </Link> */}

          {recipes && recipes.length > 0 ? (
            <div className="row">
              {recipes.map((recipe) => (
                <RecipeItem
                  category={category}
                  key={recipe.recipe.label + " " + recipe.recipe.source}
                  recipe={recipe.recipe}
                />
              ))}
            </div>
          ) : (
            <p style={{ margin: "30px 0" }}>
              {" "}
              {!apiError ? "No matching records" : null}
            </p>
          )}
        </div>
      ) : null}
      {/* {!showRecipes ? ( */}

      {/* ) : null} */}
    </div>
  );
};

export default RecipesPage;
