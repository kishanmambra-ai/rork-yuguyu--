import { createTRPCRouter } from "./create-context";
import { authRouter } from "./routes/auth";
import { dietRouter } from "./routes/diet";
import { exampleRouter } from "./routes/example";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  diet: dietRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
