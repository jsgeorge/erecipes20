import React, { useReducer, createContext } from "react";
import isEmpty from "lodash/isEmpty";

export const UserContext = createContext();

const initialState = {
  users: [],
  user: {}, // selected or new
  // message: {}, // { type: 'success|fail', title:'Info|Error' content:'lorem ipsum'}
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_USER": {
      return {
        ...state,
        user: [action.payload],
        message: {
          type: "success",
          title: "Success",
          content: "User login successfull",
        },
      };
    }
    case "SET_USER": {
      return {
        ...state,
        user: [action.payload],
      };
    }
    // case "FETCH_USERS": {
    //   return {
    //     ...state,
    //     users: action.payload,
    //     user: {},
    //   };
    // }
    case "CREATE_USER": {
      return {
        ...state,
        users: [...state.users, action.payload],
        message: {
          type: "success",
          title: "Success",
          content: "New User created!",
        },
      };
    }
    case "FETCH_USER": {
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        message: {},
      };
    }
    case "ADD_FAVORITE": {
      const user = action.payload;
      return {
        ...state,
        users: state.users.map((item) => (item._id === user._id ? user : item)),
        message: {
          type: "success",
          title: "Update Successful",
          content: `User  has been updated!`,
        },
      };
    }
    case "DEL_FAVORITE": {
      const user = action.payload;
      return {
        ...state,
        users: state.users.map((item) => (item._id === user._id ? user : item)),
        message: {
          type: "success",
          title: "Update Successful",
          content: `User  has been updated!`,
        },
      };
    }
    case "LOGOUT_USER": {
      return {
        ...state,
        user: {},
      };
    }
    default:
      throw new Error();
  }
}

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
