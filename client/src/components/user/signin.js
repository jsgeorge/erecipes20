import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import axios from "axios";
import classnames from "classnames";
import { FlashMessage, flashErrorMessage } from "../flash-message";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [user, setUser] = useState("");
  const [state, dispatch] = useContext(UserContext);
  const [errors, setErrors] = useState({});

  useEffect(() => {});

  const validData = () => {
    let errs = {};
    setErrors({});
    if (!email) {
      errs.email = "Inalid/Missing email";
    }
    if (!password) {
      errs.password = "Invalid/Missing password";
    }
    console.log(errs);
    if (errs.email || errs.password) {
      setErrors(errs);
    }
    console.log(errors);
    if (errors) return false;
    return true;
  };
  const signinUser = async () => {
    setErrors("");
    validData();
    if (email && password) {
      console.log("true");
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
        localStorage.setItem("jwtToken", response.data.token);
        setRedirect(true);
      } catch (error) {
       setErrors({form: "invalid email and/or password"})
        //flashErrorMessage(dispatch, error);
      }
    } else {
      console.log("false");
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
            {/* {state.message.content && <FlashMessage message = {state.message}/>}
            */}
            {errors.form && <div className="alert alert-danger">{errors.form}</div>}

            <div className={classnames("form-group", { "has-error": errors })}>
              {errors.email && (
                <span className="help-block">{errors.email}</span>
              )}

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
            <div className={classnames("form-group", { "has-error": errors })}>
              {errors.password && (
                <span className="help-block">{errors.password}</span>
              )}

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
