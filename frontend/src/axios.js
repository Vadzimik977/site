import axios, { Axios } from "axios";

const instance = new Axios({
    headers: {
        Authorization: window.adress,
    },
    transformRequest: [...axios.defaults.transformRequest],
});

// export const url = "http://localhost:8000";
export const url = process.env.VITE_BACKEND;

export const getUser = async () => {
    const user = await instance.get(
        `${url}/api/users?filter=${JSON.stringify({ adress: window.adress })}`
    );
    if (user?.data?.length > 2) {
        return JSON.parse(user.data)[0];
    } else {
        console.log(undefined);
        return undefined;
    }
};

export const createUser = async () => {
    const data = { adress: window.adress };
    let user = await instance.post(`${url}/api/users`, { ...data });
    const wallet = await instance.post(`${url}/api/wallet`, {
        userId: JSON.parse(user.data).id,
    });
    const history = await instance.post(`${url}/api/userHistory`, {
        userId: JSON.parse(user.data).id
    })
    user = { ...JSON.parse(user.data), wallet: JSON.parse(wallet.data), history: JSON.parse(history.data) };
    return user;
};

export const getPlanet = async (id, userId) => {
    const planet = await instance.get(`${url}/api/planets/${id}?userId=${userId ?? 0}`);
    const planetData = JSON.parse(planet.data).rows[0];
    
    planetData.element = planetData.elements[0]
    return planetData
}

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

    console.log(userId);

    // Используем правильный URL для нового backend
    const planets = await instance.get(
        `${url}/api2/planets?range=${JSON.stringify(
            rang
        )}&filter=${JSON.stringify(filters())}&sort=${JSON.stringify([[
            "forLaboratory",
            "DESC",
        ]])}&userId=${userId ?? 0}`
    );
    console.log(planets);

    // Обработка данных
    const planetsData = JSON.parse(planets.data).rows;
    planetsData.map(item => item.element = item.elements[0]);
    return planetsData;
};


export const getElements = async () => {
    const elements = await instance.get(`${url}/api/elements`);
    return JSON.parse(elements.data);
}

export const getPlanetByName = async (name) => {
    const planets = await instance.get(`${url}/api/planets?filter=${JSON.stringify(name)}`)
    return JSON.parse(planets.data).rows[0];
}

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

export const getNfts = async (adress) => {
    const apiUrl = `https://tonapi.io/v2/accounts/${adress}/nfts?collection=EQBo4e5HpH1TFMJ4an39mcEtIt-b7Ny9msJhAE2ljBeOmHu1&limit=1000&offset=0&indirect_ownership=true`;
    const data = await instance.get(apiUrl);
    return JSON.parse(data.data).nft_items;
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

export const getTasks = async () => {
    try {
      const response = await instance.get('https://playmost.ru/api2/tasks');
      return response.data.tasks; // Возвращаем данные в поле tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return []; // Возвращаем пустой массив в случае ошибки
    }
  };
  

  export const sendTaskAction = async (taskId, userId) => {
    console.log("Отправка запроса с taskId:", taskId, "userId:", userId);
    
    try {
        const response = await instance.post(`https://playmost.ru/tasks/${taskId}/action`, {
            userId: userId   // Добавляем userId в тело запроса
        });
        return response;
    } catch (error) {
        console.error("Ошибка при отправке данных на сервер", error);
        throw error;
    }
};

export const updateBuilds = async (wallet, value) => {
    const instance = getAxios();
    const updated = await instance.put(`${url}/api/wallet/${wallet.id}`, {
        ...wallet,
        builds: value,
    });
    return updated.data;
};

export const getUserSpaceships = async (userId) => {
    const instance = getAxios();

    return (await instance.get(`${url}/api/cosmoports?filter=${JSON.stringify({userId})}`)).data
}

export const updateUserSpaceship = async (spaceShip, type) => {
    const instance = getAxios();

    if(type === 'create') {
        return await instance.post(`${url}/api/cosmoports`, spaceShip)
    } else {
        return await instance.put(`${url}/api/cosmoports/${spaceShip.id}`, spaceShip);
    }
}



export const getAllUserPlanetsById = async (id) => {
    const instance = getAxios();

    const planets = await instance.get(`${url}/api/userPlanets?filter=${JSON.stringify({userId: window.user.id})}`);
    return planets.data.result;
};


export const updateMinedResource = async (id, mined) => {
    const instance = getAxios();

    const updateMinedResource = await instance.put(`${url}/api/userPlanets/${id}/`, { mined });
};


  


export const getAllUserPlanets = async () => {
    const planets = await instance.get(`${url}/api/userPlanets?filter=${JSON.stringify({userId: window.user.id})}`)
    return JSON.parse(planets.data)
}

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
