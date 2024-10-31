import axios, { Axios } from "axios";
import { useUserStore } from "../store/userStore";
import { INft } from "../types/nft";
import { IPlanet, IUserPlanet } from "../types/planets.type";
import { IHistory, IUser, IWallet, IWalletElement } from "../types/user.type";

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
    return user.data.user;
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
  const instance = getAxios();

  const planet = await instance.get(
    `${url}/api/planets/${id}?userId=${userId ?? 0}`
  );
  const planetData = planet.data.rows[0];

  planetData.element = planetData.elements[0];
  return planetData;
};

export const getPlanets = async (
  range: number[],
  laboratory: boolean,
  userId: number
) => {
  const instance = getAxios();

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

  const planetsData = planets.data.rows;
  planetsData.map((item) => (item.element = item.elements[0]));

  return planetsData;
};

export const getElements = async () => {
  const instance = getAxios();

  const elements = await instance.get(`${url}/api/elements`);
  return elements.data;
};

export const getPlanetByName = async (name: { name: string }) => {
  const instance = getAxios();

  const planets = await instance.get(
    `${url}/api/planets?filter=${JSON.stringify(name)}`
  );

  return planets.data.rows[0] as IPlanet;
};

export const createWalletElement = async (elementId) => {
  const instance = getAxios();

  const user = useUserStore.getState().user;
  if (!user) return null;

  const data = {
    userId: user.id,
  };
  const created = await instance.post(`${url}/api/wallet`, { ...data });
  return JSON.parse(created.data);
};

export const updateWalletElement = async (
  wallet: IWallet,
  value: IWalletElement[]
) => {
  const instance = getAxios();

  const updated = await instance.put(`${url}/api/wallet/${wallet.id}`, {
    ...wallet,
    value: value,
  });
  return updated.data.dataValues;
};

export const getUserWallet = async () => {
  const instance = getAxios();

  const userWallet = await instance.get(
    `${url}/api/wallet?filter=${JSON.stringify({ userId: window.user.id })}`
  );
  return JSON.parse(userWallet.data);
};

export const auth = async ({ login, password }) => {
  const instance = getAxios();

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

export const updateUser = async (val: { coins?: number; ton?: number }) => {
  const instance = getAxios();

  const user = useUserStore.getState().user;
  if (!user) return null;

  await instance.put<IUser>(`${url}/api/users/${user?.id}`, {
    ...val,
  });

  const newUser = await getUser();

  return newUser;
};

export const addPlanetToUser = async (planetId: number) => {
  const instance = getAxios();

  const user = useUserStore.getState().user;
  if (!user) return null;

  const isOk = await instance.post(`${url}/api/userPlanets`, {
    userId: user.id,
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

export const updateHistory = async (history: IHistory, value) => {
  const instance = getAxios();

  const updated = await instance.put(`${url}/api/userHistory/${history.id}`, {
    ...history,
    value: value,
  });
  return updated.data;
};

export const updateBuilds = async (wallet, value) => {
  const instance = getAxios();
  const updated = await instance.put(`${url}/api/wallet/${wallet.id}`, {
    ...wallet,
    builds: value,
  });
  return updated.data;
};
