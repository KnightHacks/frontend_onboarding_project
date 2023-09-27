import { useContext, useEffect } from "react";
import { isValidToken } from "../utils";
import { User } from "../../../server/database/schema";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

async function fetchCurrentUser() {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch("http://localhost:8080/me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    return null;
  }

  const data: User = await response.json();
  return data;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const isAuthenticated = !!user;

  const login = async (username: string, password: string) => {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) return false;

    const { accessToken, refreshToken, user } = await response.json();

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setUser(user);

    return true;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate({ to: "/" });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && !isValidToken(accessToken)) {
      localStorage.removeItem("accessToken");
      return;
    }

    if (accessToken) {
      fetchCurrentUser().then((user) => {
        if (!user) return;
        setUser(user);
      });
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
          fetchCurrentUser().then((user) => {
            if (!user) return;
            setUser(user);
          });
        });
      });
    }
  }, [setUser]);

  return { isAuthenticated, user, login, logout };
};
