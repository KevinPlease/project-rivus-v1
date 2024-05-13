import { createContext } from "react";
import { Issuer } from "src/utils/auth";

export const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

export const AuthContext = createContext({
  ...initialState,
  issuer: Issuer.USER,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});
