import { IUserPlanet, RARE_TYPE } from "./planets.type";

export type USER_ROLE = "user" | "admin";
export interface IWalletElement {
  element: string;
  value: number;
  name: string;
  img: string;
  symbol: string;
  rare: RARE_TYPE;
}
export interface IWallet {
  id: number;
  value: IWalletElement[];
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface IHistoryValue {
  img: string;
  name: string;
  rare: string;
  symbol: string;
  element: string;
  newValue: number;
  oldValue: number;
}

export interface IHistory {
  id: number;
  value: IHistoryValue[]; // ????
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface IUser {
  id: number;
  email: null; // string
  password: null; // string
  role: USER_ROLE;
  coins: number;
  ton: number;
  adress: string;
  createdAt: string;
  updatedAt: string;
  wallet: IWallet;
  userPlanets: IUserPlanet[];
  history: IHistory;
}
