import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import axios from "axios";

const SignupPage = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const RegisterUser = () => {};

  useEffect(() => {});

  const createUser = async () => {
    let newUser = {
      email: email,
      password: password,
      username: username,
    };
    console.log(newUser);
    try {
      const response = await axios.post("/users", newUser);
      dispatch({
        type: "CREATE_USER",
        payload: response.data,
      });
      setRedirect(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async () => {
    await createUser();
  };
  if (redirect) {
    return <Redirect to="/user/signin" />;
  }

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className=" col-md-6 col-md-offset-3 ">
          <div className="form-wrapper">
            <h3>Sign Up</h3>
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
            <div className="form-group">
              <input
                className="form-control"
                aria-label="Enter your Username"
                data-testid="add-task-content"
                type="text"
                value={username}
                placeholder="Userame"
                onChange={(e) => setUsername(e.target.value)}
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
              Submit
            </button>

            <div>
              Existing User{" "}
              <Link to="/user/signin" className="btn btn-default bt-sm">
                Sign In
              </Link>
              <Link to="/" className="btn btn-default btn-sm">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
