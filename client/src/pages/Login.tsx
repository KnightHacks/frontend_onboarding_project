import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "@tanstack/react-router";

export function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  return (
    <div className="flex flex-1  items-center justify-center flex-col">
      <form
        className="flex flex-col text-sm w-72"
        onSubmit={async (e) => {
          e.preventDefault();
          const success = await login(username, password);
          if (success) navigate({ to: "/" });
          else alert("Login failed"); // consider a better way to handle this
        }}
      >
        <label htmlFor="username">Username</label>
        <input
          id="username"
          className="border px-3 py-2 mb-4"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="border px-3 py-2 mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="border px-3 py-2 bg-black text-white border-black font-bold uppercase mt-4 mb-2">
          Login
        </button>
      </form>
      <small>
        New User?{" "}
        <Link className="text-blue-500" to="/register">
          Create an account
        </Link>
      </small>
    </div>
  );
}
