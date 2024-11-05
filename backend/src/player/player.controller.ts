import { Request, Response, Router } from "express";
import prisma from "../shared/database";
import {
  createPlayer,
  deletePlayerById,
  getAllPlayers,
  getPlayerById,
  updatePlayerById,
} from "./player.service";
import { PlayerData } from "../shared/types/player";

const router = Router();

const validatePlayerFields = (req: Request, res: Response, next: Function) => {
  const { name, age, clubId, nationalityId, marketValue, position } = req.body;

  if (!name || !age || !clubId || !nationalityId || !marketValue || !position) {
    return res
      .status(400)
      .json({ status: 404, message: "All fields are required" });
  }

  next();
};

router.get("/", async (req: Request, res: Response) => {
  try {
    const players = await getAllPlayers();

    res.status(200).json({ status: 200, message: "", data: players });
  } catch (error: any) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const playerId = Number(req.params.id);
    const player = await getPlayerById(playerId);

    res.status(200).json({ status: 200, message: "success", data: player });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ status: 400, message: error.message });
  }
});

router.post("/", validatePlayerFields, async (req: Request, res: Response) => {
  try {
    const playerData: PlayerData = req.body;
    const player = await createPlayer(playerData);

    res.status(201).json({
      status: 201,
      message: "Player added successfully",
      data: player,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ status: 500, message: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const playerId = Number(req.params.id);
    await deletePlayerById(playerId);

    res.status(200).json({ message: "Player removed" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ status: 400, message: error.message });
  }
});

router.put(
  "/:id",
  validatePlayerFields,
  async (req: Request, res: Response) => {
    try {
      const playerId = Number(req.params.id);
      const playerData: PlayerData = req.body;

      const player = await updatePlayerById(playerId, playerData);

      res.status(200).json({
        status: 200,
        data: player,
        message: "Data updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update player" });
    }
  }
);

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const playerId = Number(req.params.id);
    const playerData = req.body;

    const player = await updatePlayerById(playerId, playerData);

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

export default router;
