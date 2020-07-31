import React, { useContext, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import RecipeItem from "./item";
import { EDAMAM_APPID, EDAMAM_APPKEY } from "../constants";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { Link, Redirect } from "react-router-dom";
import { sdata } from "../constants";
import hits from "../../data/recipes";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryList from "../categories";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const CategoryRecipesPage = ({ match }) => {
  const [loading, setLoading] = useState(false);
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
    console.log(match.params.c);
    setCategory(match.params.c);
    setHeader(match.params.c);
    getRecipes(match.params.c);
  }, []);

  const getRecipes = async (ctgry) => {
    setApiError("");

    let qry = "";
    if (srchTerm) {
      qry = srchTerm;
    } else if (ctgry) {
      qry = ctgry;
    }
    if (qry) {
      try {
        setLoading(true);
        // const request = await fetch(
        //   `https://api.edamam.com/search?q=${qry}&app_id=${EDAMAM_APPID}&app_key=${EDAMAM_APPKEY}` //&from=0&to=20`
        // );
        // const request = await fetch(
        //   "https://jsonplaceholder.typicode.com/posts"
        // );
        // const request = await fetch(
        //   "movie-database-imdb-alternative.p.rapidapi.com?page=1&r=json&s=Avengers%20Endgame&x-rapidapi-key=95bcab4269msh504eb8fe30a7d34p16db21jsne501ac022ca9"
        // );
        // const data = await request.json();
        // if (!data) {
        //   setLoading(false);
        //   setApiError("ERROR - could not retrieve data");
        // } else {
        //   setLoading(false);
        //   setShowRecipes(true);
        //   setRecipes(data.hits);
        // }
        setLoading(false);
        setShowRecipes(true);
        //setRecipes(hits);
        setRecipes(sdata);
      } catch (err) {
        setLoading(false);
        setApiError(
          "Error. Could not retrive selected records. Netowrk problem."
        );
      }
    } else {
      setLoading(false);
      setErrors("Missing/invalid query");
      setSrchTerm("");
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

  const onClearFliters = () => {
    setHeader("");
    setSrchTerm("");
    setShowRecipes(false);
  };

  return (
    <div className="page-wrapper">
      {loading ? <Spinner animation="border" role="status"></Spinner> : null}
      {errors ? <div className="has-error">{errors}</div> : null}

      <div className="input-group md-form form-sm form-2 pl-0 form">
        <input
          className="form-control my-0 py-1 red-border"
          type="text"
          placeholder="Search recipes"
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
            <FontAwesomeIcon icon={faSearch} />

            {/* <i className="fa fa-search text-grey" aria-hidden="true"></i> */}
          </button>
        </div>
        <br />
      </div>
      {/* <p>
        srchTerm:{srchTerm} showRecipes:{showRecipes} errors:{errors}
      </p> */}
      <div className="CategoryLinks desktop">
        <CategoryList type="page" />
      </div>
      {/* <div className="CategoryLinks mobile">
        {showCategories ? <CategoryList /> : null}
      </div> */}
      {showRecipes ? (
        <div className="recipeWrapper">
          <div className="recipeHeader">
            <a href="/" onClick={() => onClearFliters()}>
              categories
            </a>{" "}
            <FontAwesomeIcon icon={faAngleRight} size="xs" /> {header}
          </div>
          {apiError ? <div className="has-error">{apiError}</div> : null}

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

export default CategoryRecipesPage;
