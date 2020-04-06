import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import axios from "axios";
import RecipeItem from "../recipes/item";
import { EDAMAM_APPID, EDAMAM_APPKEY } from "../constants";

const UserPage = ({}) => {
  const [errMsg, setErrMsg] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const [recipe, setRecipe] = useState([]);
  const [header, setHeader] = useState("");
  const [srchTerm, setSrchTerm] = useState("");
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState("");
  const [showRecipes, setShowRecipes] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("/users/id");
        dispatch({
          type: "FETCH_USER",
          payload: response.data,
        });
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [dispatch]);
  console.log("User", state.user[0]);
  const { username, email, favorites } = state.user;

  // if (!state.user) return <div className="page-wrapper">No such user</div>;
  if (!state.user || !state.user._id) {
    return <Redirect to="/user/signin" />;
  }
  return (
    <div className="page-wrapper ">
      <div className="userPanel">
        <h3>Profile Page</h3>
        {state.user[0] ? (
          <div key={state.user[0]._id}>
            <p>
              <strong>Username</strong> {state.user[0].username} <br />
              <strong>Email</strong> {state.user[0].email}
            </p>
            <div>
              <Link to="/" className="btn btn-danger btn-sm">
                Edit Proile
              </Link>
              <Link to="/" className="btn btn-danger btn-sm">
                Change Password
              </Link>
              <br />
              <button
                className="btn btn-default btn-sm"
                style={{ marginTop: "20px", color: "red" }}
              >
                Logout
              </button>
            </div>
            <hr />
            <div className="recipeWrapper">
              <h5>Your Saved Recipes</h5>
              <div>
                <div className="row">
                  {state.user[0].favorites &&
                  state.user[0].favorites.length > 0 ? (
                    state.user[0].favorites.map((f) => (
                      <div className="col-md-3 col-sm-3 col-xs-4 recipeItem">
                        <div className="card mb-3 box-shadow">
                          <Link to={`/recipes/${f.label}/${f.source}`}>
                            <img
                              src={f.imgURL}
                              alt="img"
                              className="card-img-top"
                            />
                          </Link>
                          <div
                            className="card-body"
                            style={{ textAlign: "center" }}
                          >
                            <h6 className="card-title">{f.label}</h6>
                            <span style={{ color: "gray" }}>by {f.source}</span>
                          </div>
                        </div>
                      </div>
                      //getRecipe(f.label, f.source);
                      //console.log(recipe);
                      //  recipe.map((r) => (

                      // <RecipeItem
                      //   category=""
                      //   key={r.recipe.label + " " + r.recipe.source}
                      //   recipe={r.recipe}
                      // />
                      // ));
                    ))
                  ) : (
                    <p>No saved recipes</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              {/* <Link to="/" className="btn btn-danger bt-sm">
                  Cancel
                </Link> */}
            </div>
          </div>
        ) : (
          <div>No CUrrent user</div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
