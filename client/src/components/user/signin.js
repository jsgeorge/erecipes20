import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import axios from "axios";

const SigninPage = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const LoginUser = () => {};

  useEffect(() => {});

  const signinUser = async () => {
    let userData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post("/auth", userData);
      dispatch({
        type: "LOGIN_USER",
        payload: response.data,
      });
      setRedirect(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async () => {
    await signinUser();
  };
  if (redirect) {
    return <Redirect to="/user" />;
  }

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className=" col-md-6 col-md-offset-3 ">
          <div className="recipeHeader">
            <h3>Sign In</h3>
          </div>
          <div className="form-wrapper">
            <div className="form-group">
              <input
                className="form-control"
                aria-label="Enter your task"
                data-testid="add-task-content"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                aria-label="Enter your task"
                data-testid="add-task-content"
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errMsg ? (
              <div className="errMsgFont">Login Error. {errMsg}</div>
            ) : null}
            <button
              type="button"
              className="btn btn-danger btn-sm"
              data-testid="add-shout"
              onClick={() => onSubmit()}
            >
              Login
            </button>

            <div>
              New User{" "}
              <Link to="/user/signup" className="btn btn-default bt-sm">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
