import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import playerController from "./player/player.controller";
import "dotenv/config";

const app: Express = express();
const port = process.env.REST_PORT;

const prisma = new PrismaClient();

app.use(express.json());

app.use("/players", playerController);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
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
