import { createContext, useContext, useEffect } from "react";
import { isValidAccessToken } from "../utils";

type AuthContextValues = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export const AuthContext = createContext<AuthContextValues>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const useAuth = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const login = async (username: string, password: string) => {
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) return;

    const { accessToken, refreshToken } = await res.json();

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && !isValidAccessToken(accessToken)) {
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      return;
    }

    if (accessToken) {
      setIsAuthenticated(true);
    }

    if (!accessToken && refreshToken) {
      fetch("http://localhost:8080/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }).then((res) => {
        if (!res.ok) return;

        res.json().then(({ accessToken }) => {
          localStorage.setItem("accessToken", accessToken);
          setIsAuthenticated(true);
        });
      });
    }
  }, [setIsAuthenticated]);

  return { isAuthenticated, setIsAuthenticated, login, logout };
};
