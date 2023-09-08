import { useState } from "react";
import { AuthContext } from "./hooks/useAuth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated }}
    ></AuthContext.Provider>
  );
}

export default App;
