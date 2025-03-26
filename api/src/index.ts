import { Elysia } from "elysia";
import { getAllEvents, getEvent } from "./lib/service";


if (!process.env.WOOZY_API_PORT) {
  throw new Error("API_PORT is not defined");
}

const app = new Elysia()
  .get("/", () => "hello woozy")
  .get("/events", getAllEvents)
  .get("/events/:id", async (req) => {
    const id = parseInt(req.params.id);
    return getEvent(id);
  })
  .listen(parseInt(process.env.WOOZY_API_PORT));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
