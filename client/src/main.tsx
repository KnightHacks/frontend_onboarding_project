import {
  RouterProvider,
  Router,
  Route,
  redirect,
  RootRoute,
} from "@tanstack/react-router";
import { Root } from "./components/Root.tsx";
import { Index } from "./pages/index.tsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Admin } from "./pages/admin";
import { isAuthenticated } from "./utils.ts";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Cart } from "./pages/Cart.tsx";
import { Items } from "./pages/admin/Items.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

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
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Admin,
});

export const itemsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/admin/items",
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Items,
});

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

export const cartRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: () => Cart,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  itemsRoute,
  loginRoute,
  registerRoute,
  cartRoute,
]);

export const router = new Router({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
