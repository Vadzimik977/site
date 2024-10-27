import { RARE_TYPE } from "./planets.type";

export interface IWalletElement {
  element: string;
  value: number;
  name: string;
  img: string;
  symbol: string;
  rare: RARE_TYPE;
}

export type USER_ROLE = "user" | "admin";

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
  wallet: {
    id: number;
    value: IWalletElement[];
    createdAt: string;
    updatedAt: string;
    userId: number;
  };
  userPlanets: [];
  history: {
    id: number;
    value: []; // ????
    createdAt: string;
    updatedAt: string;
    userId: number;
  };
}
