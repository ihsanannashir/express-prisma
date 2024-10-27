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
      .json({ data: player, message: "Player added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add player" });
  }
});

app.delete("/players/:id", async (req: Request, res: Response) => {
  const playerId = Number(req.params.id);

  try {
    await prisma.player.delete({
      where: {
        id: playerId,
      },
    });

    res.status(200).json({ message: "Played removed" });
  } catch (error) {
    console.log(error);
  }
});

app.put("/players/:id", async (req: Request, res: Response) => {
  const playerId = Number(req.params.id);
  const { name, age, clubId, nationalityId, marketValue, position } = req.body;

  try {
    const player = await prisma.player.update({
      where: {
        id: playerId,
      },
      data: {
        name,
        age,
        clubId,
        nationalityId,
        marketValue,
        position,
      },
    });

    res.status(200).json({
      data: player,
      message: "Data updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update player" });
  }
});

app.get("/countries", async (req: Request, res: Response) => {
  const countries = await prisma.country.findMany();

  res.status(200).send(countries);
});

app.post("/countries", async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const country = await prisma.country.create({
      data: {
        name,
      },
    });

    if (!name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    res.status(201).json({
      data: country,
      message: "country added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add country" });
  }
});

app.delete("/countries/:id", async (req: Request, res: Response) => {
  const countryId = Number(req.params.id);

  try {
    await prisma.country.delete({
      where: {
        id: countryId,
      },
    });

    res.status(200).json({ message: "Country Removed" });
  } catch (error) {
    console.log(error);
  }
});

app.put("/countries/:id", async (req: Request, res: Response) => {
  const countryId = Number(req.params.id);
  const { name } = req.body;

  try {
    const country = await prisma.country.update({
      where: {
        id: countryId,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      data: country,
      message: "Data updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update country" });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
