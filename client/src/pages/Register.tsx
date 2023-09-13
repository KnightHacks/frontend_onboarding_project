import { useState } from "react";
import { User } from "../../../server/database/schema";
import { Link } from "@tanstack/react-router";

export function Register() {
  const [user, setUser] = useState<Omit<User, "id">>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    age: 0,
    isAdmin: 0,
  });

  const register = async () => {
    await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <form
        placeholder="Age"
        className="flex flex-col text-sm w-72"
        onSubmit={(e) => {
          e.preventDefault();
          register();
        }}
      >
        <label htmlFor="firstName">First Name</label>
        <input
          className="border px-3 py-2 mb-4"
          placeholder="First Name"
          id="firstName"
          type="text"
          value={user.firstName}
          onChange={(e) =>
            setUser({
              ...user,
              firstName: e.target.value,
            })
          }
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          className="border px-3 py-2 mb-4"
          placeholder="Last Name"
          id="lastName"
          type="text"
          value={user.lastName}
          onChange={(e) =>
            setUser({
              ...user,
              lastName: e.target.value,
            })
          }
        />
        <label htmlFor="username">Username</label>
        <input
          className="border px-3 py-2 mb-4"
          placeholder="Username"
          id="username"
          type="text"
          value={user.username}
          onChange={(e) =>
            setUser({
              ...user,
              username: e.target.value,
            })
          }
        />
        <label htmlFor="password">Password</label>
        <input
          className="border px-3 py-2 mb-4"
          placeholder="Password"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) =>
            setUser({
              ...user,
              password: e.target.value,
            })
          }
        />
        <label htmlFor="age">Age</label>
        <input
          className="border px-3 py-2 mb-4"
          id="age"
          type="number"
          value={user.age}
          onChange={(e) => {
            setUser({
              ...user,
              age: parseInt(e.target.value),
            });
          }}
        />
        <button className="border px-3 py-2 mb-2 bg-black text-white border-black font-bold uppercase mt-4">
          Register
        </button>
      </form>
      <small>
        Already have an account?{" "}
        <Link className="text-blue-500" to="/login">
          Login
        </Link>
      </small>
    </div>
  );
}
