import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const app: Express = express();
const port = process.env.REST_PORT;

const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/players", async (req: Request, res: Response) => {
  const players = await prisma.player.findMany();

  res.send(players);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
