import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // This tells React Router to use $.tsx for EVERYTHING, including the home page
  route("*?", "routes/$.tsx"), 
] satisfies RouteConfig;
