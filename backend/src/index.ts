import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const app: Express = express();
const port = process.env.REST_PORT;

const prisma = new PrismaClient();

app.use(express.json());

const validatePlayerFields = (req: Request, res: Response, next: Function) => {
  const { name, age, clubId, nationalityId, marketValue, position } = req.body;

  if (!name || !age || !clubId || !nationalityId || !marketValue || !position) {
    return res.status(400).json({ error: "All fields are required" });
  }

  next();
};

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  // Log the error stack for debugging
  console.error("Error stack:", err.stack);

  // Send a consistent error response
  res.status(500).json({
    error: "An internal server error occurred. Please try again later.",
    details: err.message || "Unknown error",
  });
});

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

    res.status(200).json({ status: 200, message: "", data: players });
  } catch (error) {
    res.status(500).send({ error: "Something went wrong!" });
  }
});

app.get("/players/:id", async (req: Request, res: Response, next: Function) => {
  try {
    const id = Number(req.params.id);

    const player = await prisma.player.findUnique({
      where: {
        id: id,
      },
    });

    if (!player) {
      return res
        .status(404)
        .json({ status: 404, message: "Player not found", data: player });
    }

    res.status(200).json({ status: 200, message: "", data: player });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/players",
  validatePlayerFields,
  async (req: Request, res: Response) => {
    const { name, age, clubId, nationalityId, marketValue, position } =
      req.body;

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
        .json({ message: "Player added successfully", data: player });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Failed to add player" });
    }
  }
);

app.delete("/players/:id", async (req: Request, res: Response) => {
  const playerId = Number(req.params.id);

  try {
    await prisma.player.delete({
      where: {
        id: playerId,
      },
    });

    res.status(200).json({ message: "Player removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to remove player" });
  }
});

app.put(
  "/players/:id",
  validatePlayerFields,
  async (req: Request, res: Response) => {
    const playerId = Number(req.params.id);
    const { name, age, clubId, nationalityId, marketValue, position } =
      req.body;

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
  }
);

app.patch("/players/:id", async (req: Request, res: Response) => {
  const playerId = Number(req.params.id);
  const data = req.body;

  try {
    const player = await prisma.player.update({
      where: {
        id: playerId,
      },
      data,
    });

    res.status(200).json({
      status: 200,
      message: "Data updated successfully",
      data: player,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update player" });
  }
});

app.get("/countries", async (req: Request, res: Response) => {
  const countries = await prisma.country.findMany();

  res.status(200).json({ status: 200, message: "", data: countries });
});

app.post("/countries", async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const country = await prisma.country.create({
      data: {
        name,
      },
    });

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
    res.status(500).send({ error: "Something went wrong!", message: error });
  }
});

app.put("/countries/:id", async (req: Request, res: Response) => {
  const countryId = Number(req.params.id);
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "All fields are required" });
  }

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
