import {
  RouterProvider,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import { Root } from "./pages/Root.tsx";
import { Index } from "./pages/index.tsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Admin } from "./pages/Admin.tsx";
import { Users } from "./pages/Users.tsx";
import { User } from "../../server/database/schema.ts";

const rootRoute = new RootRoute({
  component: Root,
});

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

export const adminRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

export const usersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  loader: async () => {
    const res = await fetch("http://localhost:8080/users");
    const data:User = await res.json();
    return data;
  },
  component: Users,
});

export const itemsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/admin/items",
  component: () => <div>Items</div>,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  usersRoute,
  itemsRoute,
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
