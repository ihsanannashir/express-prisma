import prisma from "../shared/database";
import { PlayerData } from "../shared/types/player";

const findPlayers = async () => {
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

const findPlayerById = async (playerId: number) => {
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
  });

  return player;
};

const insertPlayer = async (playerData: PlayerData) => {
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

const deletePlayer = async (playerId: number) => {
  await prisma.player.delete({
    where: {
      id: playerId,
    },
  });
};

const editPlayer = async (playerId: number, playerData: PlayerData) => {
  const player = await prisma.player.update({
    where: {
      id: playerId,
    },
    data: playerData,
  });

  return player;
};

export { findPlayers, findPlayerById, insertPlayer, deletePlayer, editPlayer };
