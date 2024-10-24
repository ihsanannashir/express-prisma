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
  try {
    const players = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
        age: true,
        marketValue: true,
        nationality: {
          select: {
            id: true,
            name: true,
          },
        },
        Club: {
          select: {
            id: true,
            name: true,
          },
        },
        position: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).send(players);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong!" });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
