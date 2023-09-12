import { Outlet } from "@tanstack/react-router";
import { AuthContext } from "../hooks/useAuth";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
          <Outlet />
        </AuthContext.Provider>
      </QueryClientProvider>
    </>
  );
}

