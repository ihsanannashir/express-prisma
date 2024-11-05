import express, { Express, Request, Response } from "express";
import playerController from "./player/player.controller";
import "dotenv/config";

const app: Express = express();
const port = process.env.REST_PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/players", playerController);
app.use("/countries", playerController);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
