import { useContext } from "react";
import { AuthContext } from "src/contexts/auth/user";

export const useAuth = () => useContext(AuthContext);
