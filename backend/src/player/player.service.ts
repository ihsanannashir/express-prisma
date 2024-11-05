import prisma from "../shared/database";
import { PlayerData } from "../shared/types/player";
import {
  deletePlayer,
  editPlayer,
  findPlayerById,
  findPlayers,
  insertPlayer,
} from "./player.repository";

const getAllPlayers = async () => {
  const players = await findPlayers();

  return players;
};

const getPlayerById = async (id: number) => {
  const player = await findPlayerById(id);

  if (!player) {
    throw Error("Player not found");
  }

  return player;
};

const createPlayer = async (playerData: PlayerData) => {
  const player = await insertPlayer(playerData);

  return player;
};

const deletePlayerById = async (id: number) => {
  await getPlayerById(id);
  await deletePlayer(id);
};

const updatePlayerById = async (id: number, playerData: PlayerData) => {
  await getPlayerById(id);

  const player = await editPlayer(id, playerData);

  return player;
};

export {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  deletePlayerById,
  updatePlayerById,
};
