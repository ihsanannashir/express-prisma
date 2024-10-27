import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const app: Express = express();
const port = process.env.REST_PORT;

const prisma = new PrismaClient();

app.use(express.json());

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

app.post("/players", async (req: Request, res: Response) => {
  const { name, age, clubId, nationalityId, marketValue, position } = req.body;

  // Validate the incoming data (basic validation)
  if (!name || !age || !clubId || !nationalityId || !marketValue || !position) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const player = await prisma.player.create({
      data: {
        name,
        age,
        nationalityId,
        clubId,
        marketValue,
        position,
      },
    });

    res
      .status(201)
      .json({ data: player, message: "Player created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create player" });
  }
});

app.get("/countries", async (req: Request, res: Response) => {
  const countries = await prisma.country.findMany();

  res.status(200).send(countries);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
