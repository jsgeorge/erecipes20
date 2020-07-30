import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import axios from "axios";
import RecipeItem from "../recipes/item";
import { EDAMAM_APPID, EDAMAM_APPKEY } from "../constants";
import jwtDecode from "jwt-decode";

const FavoritesPage = () => {
  const [errMsg, setErrMsg] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const [user, setUser] = useState({});
  const setAuthUser = async (token) => {
    const response = await axios.post("/users/id", { id: token.id });
    dispatch({
      type: "SET_USER",
      payload: response.data,
    });
  };

  useEffect(() => {
    if (state.user[0]) {
      console.log("in user page user is", state.user[0]);
    }
    if (!state.user[0] && localStorage.jwtToken) {
      setAuthUser(jwtDecode(localStorage.jwtToken));
    }
  }, []);

  //const { username, email, favorites } = state.user[0];

  // if (!state.user) return <div className="page-wrapper">No such user</div>;

  const onLogout = () => {
    localStorage.clear();
    dispatch({
      type: "LOGOUT_USER",
    });
    setRedirect(true);
  };

  const renderRecipe = (f) => (
    <div className=" col-md-4 col-sm-4 col-xs-4 recipeItem">
      <div className="card mb-3 box-shadow">
        <Link to={`/recipes/${f.label}/${f.source}`}>
          <img src={f.image} alt="img" className="card-img-top" />
        </Link>
        <div className="card-body" style={{ textAlign: "center" }}>
          <h6 className="card-title">{f.label}</h6>
          <span style={{ color: "gray" }}>by {f.source}</span>
        </div>
      </div>
    </div>
  );
  if (!user && !localStorage.jwtToken) return <Redirect to="/user/signin" />;
  if (state.user[0]) console.log("user in user page", state.user[0].user);
  return (
    <div className="page-wrapper ">
      <div className="col-lg-8 col-md-12 col-sm-12 userPanel">
        {state.user[0] ? (
          <div>
            <div className="recipeWrapper">
              <h5>Your Saved Recipes</h5>

              <div>
                {state.user[0].user.favorites &&
                state.user[0].user.favorites.length > 0 ? (
                  <div className="row">
                    {state.user[0].user.favorites.map((f) => (
                      <RecipeItem key={f.label + " " + f.source} recipe={f} />
                    ))}
                  </div>
                ) : (
                  <p>No saved recipes</p>
                )}
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

export default FavoritesPage;
