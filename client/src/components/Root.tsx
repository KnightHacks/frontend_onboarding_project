import { Outlet } from "@tanstack/react-router";
import { Navbar } from "./Navbar";

export function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
