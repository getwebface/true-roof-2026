import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - this file is created during the build process
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({ build });
