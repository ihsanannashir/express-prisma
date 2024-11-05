import prisma from "../shared/database";
import { PlayerData } from "../shared/types/player";

const getAllPlayers = async () => {
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

  return players;
};

const getPlayerById = async (id: number) => {
  if (typeof id !== "number") {
    throw Error("ID is not a number");
  }

  const player = await prisma.player.findUnique({
    where: {
      id: id,
    },
  });

  if (!player) {
    throw Error("Player not found");
  }

  return player;
};

const createPlayer = async (playerData: PlayerData) => {
  const player = await prisma.player.create({
    data: {
      name: playerData.name,
      age: playerData.age,
      nationalityId: playerData.nationalityId,
      clubId: playerData.clubId,
      marketValue: playerData.marketValue,
      position: playerData.position,
    },
  });

  return player;
};

const deletePlayerById = async (id: number) => {
  await getPlayerById(id);

  await prisma.player.delete({
    where: {
      id,
    },
  });
};

const updatePlayerById = async (id: number, playerData: PlayerData) => {
  await getPlayerById(id);

  const player = await prisma.player.update({
    where: {
      id,
    },
    data: playerData,
  });

  return player;
};

export {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  deletePlayerById,
  updatePlayerById,
};
