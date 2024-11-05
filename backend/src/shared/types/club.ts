import { PlayerData } from "./player";

export type ClubData = {
  id: number;
  name: string;
  player?: PlayerData[];
};
