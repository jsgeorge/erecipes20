import React, { useReducer, createContext } from "react";

export const UserContext = createContext();

const initialState = {
  users: [],
  user: {}, // selected or new
  message: {}, // { type: 'success|fail', title:'Info|Error' content:'lorem ipsum'}
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
    case "FETCH_USERS": {
      return {
        ...state,
        users: action.payload,
        user: {},
      };
    }
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
        user: action.payload,
        message: {},
      };
    }
    case "UPDATE_FAVORITE": {
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
    default:
      throw new Error();
  }
}

export const UserContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { children } = props;

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
