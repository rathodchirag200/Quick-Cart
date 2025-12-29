import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [forgotEmail, setForgotEmail] = useState("");

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const handleBlockedUser = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/currentuser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.user.block) {
          console.log("User is blocked  auto logout");
          handleBlockedUser();
          return;
        }

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth Error:", err);

        if (err.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        setUser(null);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const login = (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        forgotEmail,
        setForgotEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
