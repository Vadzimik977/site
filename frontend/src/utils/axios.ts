import axios, { Axios } from "axios";
import { useUserStore } from "../store/userStore";
import { INft } from "../types/nft";
import { IPlanet, IUserPlanet } from "../types/planets.type";
import { IUser } from "../types/user.type";

const getAxios = () => {
  const address = useUserStore.getState().address;
  return new Axios({
    headers: {
      Authorization: address,
    },
    transformRequest: axios.defaults.transformRequest,
    transformResponse: axios.defaults.transformResponse,
  });
};

const instance = getAxios();

export const url = "http://localhost:8000";
// export const url = process.env.VITE_BACKEND;

export const getUser = async () => {
  const instance = getAxios();

  try {
    const user = await instance.get<{ user: IUser | null }>(`${url}/api/user`);
    return user.data.user ?? null;
  } catch (error) {
    return null;
  }
};

export const createUser = async () => {
  const instance = getAxios();

  try {
    const user = await instance.post<{ user: IUser }>(`${url}/api/user`);
    return user.data.user ?? null;
  } catch (error) {
    return null;
  }
};

export const getPlanet = async (id, userId) => {
  const planet = await instance.get(
    `${url}/api/planets/${id}?userId=${userId ?? 0}`
  );
  const planetData = JSON.parse(planet.data).rows[0];

  planetData.element = planetData.elements[0];
  return planetData;
};

export const getPlanets = async (range, laboratory, userId) => {
  let rang = range ?? [0, 9];
  const filters = () => {
    if (laboratory) {
      return {
        active: 1,
        forLaboratory: 1,
      };
    } else {
      return {
        active: 1,
      };
    }
  };

  const planets = await instance.get(
    `${url}/api/planets?range=${JSON.stringify(rang)}&filter=${JSON.stringify(
      filters()
    )}&sort=${JSON.stringify([["forLaboratory", "DESC"]])}&userId=${
      userId ?? 0
    }`
  );

  const planetsData = JSON.parse(planets.data).rows;
  planetsData.map((item) => (item.element = item.elements[0]));

  return planetsData;
};

export const getElements = async () => {
  const elements = await instance.get(`${url}/api/elements`);
  return JSON.parse(elements.data);
};

export const getPlanetByName = async (name: { name: string }) => {
  const instance = getAxios();

  const planets = await instance.get(
    `${url}/api/planets?filter=${JSON.stringify(name)}`
  );

  return planets.data.rows[0] as IPlanet;
};

export const createWalletElement = async (elementId) => {
  const data = {
    userId: window.user.id,
  };
  const created = await instance.post(`${url}/api/wallet`, { ...data });
  return JSON.parse(created.data);
};

export const updateWalletElement = async (wallet, value) => {
  const updated = await instance.put(`${url}/api/wallet/${wallet.id}`, {
    ...wallet,
    value: value,
  });
  return updated.data;
};

export const getUserWallet = async () => {
  const userWallet = await instance.get(
    `${url}/api/wallet?filter=${JSON.stringify({ userId: window.user.id })}`
  );
  return JSON.parse(userWallet.data);
};

export const auth = async ({ login, password }) => {
  const auth = await instance.post(`${url}/api/user/auth`, {
    email: login,
    password,
  });
  return auth.status === 200;
};

export const getNfts = async () => {
  const instance = getAxios();

  const adress = useUserStore.getState().address;

  if (!adress) return [];

  const apiUrl = `https://tonapi.io/v2/accounts/${adress}/nfts?collection=EQBo4e5HpH1TFMJ4an39mcEtIt-b7Ny9msJhAE2ljBeOmHu1&limit=1000&offset=0&indirect_ownership=true`;
  const data = await axios.get<{ nft_items: INft[] }>(apiUrl);
  return data.data.nft_items;
};

export const updateUser = async (val) => {
  const user = await instance.put(`${url}/api/users/${window.user.id}`, {
    ...val,
  });
  return user;
};

export const addPlanetToUser = async (planetId) => {
  const isOk = await instance.post(`${url}/api/userPlanets`, {
    userId: window.user.id,
    planetId,
  });
  return isOk;
};

export const getAllUserPlanets = async () => {
  const instance = getAxios();

  const planets = await instance.get<{ result: IUserPlanet[] }>(
    `${url}/api/userPlanets`
  );
  return planets.data.result;
};

export const updateUserPlanet = async (id, level) => {
  const isOk = await instance.put(`${url}/api/userPlanets/${id}`, { level });
  return isOk;
};

export const updateHistory = async (history, value) => {
  const updated = await instance.put(`${url}/api/userHistory/${history.id}`, {
    ...history,
    value: value,
  });
  return updated.data;
};

export const updateBuilds = async (wallet, value) => {
  const updated = await instance.put(`${url}/api/wallet/${wallet.id}`, {
    ...wallet,
    builds: value,
  });
  return updated.data;
};
