import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // This tells the builder: "Send EVERYTHING (*) to our $.tsx file"
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
