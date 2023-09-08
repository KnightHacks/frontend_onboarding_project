import { Outlet } from "@tanstack/react-router";
import { AuthContext } from "../hooks/useAuth";
import { useState } from "react";

export function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Outlet />
      </AuthContext.Provider>
    </>
  );
}
