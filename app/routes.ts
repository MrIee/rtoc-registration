import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("containers/Landing.tsx"),
  route("login", "containers/Login.tsx"),
] satisfies RouteConfig;
