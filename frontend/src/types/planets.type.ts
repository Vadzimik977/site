export type RARE_TYPE = "Обычная" | "Редкая" | "Эпическая";

export interface IPlanetElement {
  id: number;
  name: string; // enum "Flerovium"
  symbol: string; // enum "Fl"
  rare: RARE_TYPE; // enum "Эпическая"
  index: number;
  img: string;
  createdAt: string; //"2024-09-11T13:47:14.000Z"
  updatedAt: string;
  element_planets: {
    createdAt: string; //"2024-09-11T13:47:14.000Z"
    updatedAt: string;
    planetId: number;
    elementId: number;
  };
}

export interface IUserPlanet {
  id: number;
  level: string; // enum "1"
  createdAt: string; //"2024-09-11T13:47:14.000Z"
  updatedAt: string;
  userId: number;
  planetId: number;
  resources: number;
  health: number;
  mined: number;
}

export interface IElement {
  element: string;
  img: string;
  name: string;
  rare: RARE_TYPE;
  symbol: string;
  value: number;
}

export interface IPlanet {
  id: number;
  name: string;
  speed: number;
  updatePrice: number;
  img: string;
  active: boolean;
  forLaboratory: boolean;
  createdAt: string; //"2024-09-11T13:47:14.000Z"
  updatedAt: string;
  elements: IPlanetElement[];
  user_planets: IUserPlanet[];
  element: IPlanetElement;
}

export interface IInitialValue {
  speed: number
  cost: number
  level: number
}