import { useCallback, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

import userAPI from "src/api/user";
import { Issuer } from "src/utils/auth";
import { AuthContext, initialState } from "./auth-context";

export const STORAGE_KEY = "token";

var ActionType;
(function (ActionType) {
  ActionType["INITIALIZE"] = "INITIALIZE";
  ActionType["SIGN_IN"] = "SIGN_IN";
  ActionType["SIGN_UP"] = "SIGN_UP";
  ActionType["SIGN_OUT"] = "SIGN_OUT";
})(ActionType || (ActionType = {}));

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  SIGN_IN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_UP: (state, action) => {
    throw "NOT IMPLEMENTED!";
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_OUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const token = window.localStorage.getItem(STORAGE_KEY);
      if (!token) throw "No stored token found!";

      const user = await userAPI.getUser(token);
      if (!user) throw "No user found!";

      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: true,
          user
        }
      });

    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const signIn = useCallback(async (username, password) => {
    const token = await userAPI.signIn(username, password);
    if (!token) throw "Could not sign in with those credentials!";

    const user = await userAPI.getUser(token);
    if (!user) throw "Could not get user information at this moment!";

    localStorage.setItem(STORAGE_KEY, token);
    dispatch({
      type: ActionType.SIGN_IN,
      payload: {
        user
      }
    });
  }, [dispatch]);

  const signUp = useCallback(async (email, name, password) => {
    throw "NOT IMPLEMENTED";
    const { token } = await authApi.signUp({ email, name, password });
    const user = await authApi.me({ token });

    localStorage.setItem(STORAGE_KEY, token);

    dispatch({
      type: ActionType.SIGN_UP,
      payload: {
        user
      }
    });
  }, [dispatch]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: ActionType.SIGN_OUT });
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.USER,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
