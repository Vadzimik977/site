import axios, { Axios } from "axios";

const instance = new Axios({
    headers: {
        Authorization: window.adress,
    },
    transformRequest: [...axios.defaults.transformRequest],
});

export const url = "http://localhost:8000";
// export const url = process.env.VITE_BACKEND;

// export const getUser = async () => {
//     const user = await instance.get(
//         `${url}/api/users?filter=${JSON.stringify({ adress: window.adress })}`
//     );
//     if (user?.data?.length > 2) {
//         return JSON.parse(user.data)[0];
//     } else {
//         console.log(undefined);
//         return undefined;
//     }
// };
export const getUser = async (adress) => {
    try {
        // Запрос к API для получения пользователя по адресу
        const response = await instance.get(`https://playmost.ru/api2/users?adress=${adress}`);
        
        // Если данные получены
        if (response?.data) {
            // Парсим строку JSON в объект
            const user = JSON.parse(response.data);
            console.log("AXIOS", user);

            // Проверяем, есть ли данные (например, id у пользователя)
            if (user?.id) {
                return user;  // Возвращаем пользователя
            } else {
                console.log("User not found");
                return undefined;
            }
        } else {
            console.log("No data in response");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return undefined;
    }
};





// export const createUser = async () => {
//     const data = { adress: window.adress };
//     let user = await instance.post(`${url}/api/users`, { ...data });
//     const wallet = await instance.post(`${url}/api/wallet`, {
//         userId: JSON.parse(user.data).id,
//     });
//     const history = await instance.post(`${url}/api/userHistory`, {
//         userId: JSON.parse(user.data).id
//     })
//     user = { ...JSON.parse(user.data), wallet: JSON.parse(wallet.data), history: JSON.parse(history.data) };
//     return user;
// };

// export const createUser = async ({ tg_id = null, userName = null } = {}) => {
//     try {
//         console.log("Попытка создать пользователя...");
//         const userRes = await fetch(`https://playmost.ru/api2/users`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 adress: window.adress ?? null,
//                 tg_id,
//                 userName,
//             }),
//         });

//         if (!userRes.ok) throw new Error("Failed to create user");

//         const user = await userRes.json();

//         const walletRes = await fetch(`https://playmost.ru/api2/wallet`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ userId: user.id }),
//         });

//         const historyRes = await fetch(`https://playmost.ru/api2/userHistory`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ userId: user.id }),
//         });

//         const wallet = await walletRes.json();
//         const history = await historyRes.json();

//         return { ...user, wallet, history };
//     } catch (error) {
//         console.error("Ошибка при создании пользователя:", error);
//         return null;
//     }
// };

export async function getUserByTgId(tg_id) {
    try {
        const res = await fetch(`https://playmost.ru/api2/user_by_tg/${tg_id}`);
        if (!res.ok) throw new Error("User not found");
        return await res.json();
    } catch (err) {
        console.error("Ошибка при получении пользователя по tg_id:", err);
        return null;
    }
}



export const createUser = async ({ tg_id, userName, adress }) => {
    try {
        console.log("Попытка создать");

        // Проверь все необходимые параметры
        if (!tg_id || !userName ) {
            throw new Error("Отсутствуют обязательные данные для создания пользователя.");
        }

        const userRes = await fetch(`https://playmost.ru/api2/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tg_id,            // tg_id
                userName,         // userName
                adress,           // adress
                createdAt: new Date().toISOString(), // добавляем createdAt
            }),
        });

        if (!userRes.ok) throw new Error("Failed to create user");

        const user = await userRes.json();

        const walletRes = await fetch(`https://playmost.ru/api2/wallet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
        });

        if (!walletRes.ok) throw new Error("Failed to create wallet");

        // const historyRes = await fetch(`https://playmost.ru/api2/userHistory`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ userId: user.id }),
        // });

        // if (!historyRes.ok) throw new Error("Failed to create user history");

        const wallet = await walletRes.json();
        const history = [];

        return {
            ...user,
            wallet,
            history,
        };
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
};





export const getPlanet = async (id, userId) => {
    const planet = await instance.get(`${url}/api/planets/${id}?userId=${userId ?? 0}`);
    const planetData = JSON.parse(planet.data).rows[0];
    
    planetData.element = planetData.elements[0]
    return planetData
}


export const getPlanets = async (range, laboratory, userId) => {
    const rang = range ?? [0, 9];

    const queryParams = new URLSearchParams();

    // Подаем как два отдельных query-параметра
    rang.forEach(val => queryParams.append("range", val));

    if (laboratory) {
        queryParams.append("laboratory", "true");
    }

    if (userId != null) {
        queryParams.append("userId", userId.toString());
    }

    try {
        const response = await fetch(`https://playmost.ru/api2/planets?${queryParams}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        data.forEach(item => {
            item.element = item.elements?.[0];  // если нужно
        });

        return data;
    } catch (error) {
        console.error("Failed to fetch planets:", error);
        return [];
    }
};



// export const getPlanets = async (range, laboratory, userId) => {
//     let rang = range ?? [0, 9];
//     const filters = () => {
//         if (laboratory) {
//             return {
//                 active: 1,
//                 forLaboratory: 1,
//             };
//         } else {
//             return {
//                 active: 1,
//             };
//         }
//     };

//     console.log(userId)
   
//     const planets = await instance.get(
//         `https://playmost.ru/api/planets?range=${JSON.stringify(
//             rang
//         )}&filter=${JSON.stringify(filters())}&sort=${JSON.stringify([[
//             "forLaboratory",
//             "DESC",
//         ]])}&userId=${userId ?? 0}`
//     );
//     console.log(planets)
//     const planetsData = JSON.parse(planets.data).rows;
//     planetsData.map(item => item.element = item.elements[0])
//     return planetsData;
// };

// export const getPlanets = async (range, laboratory, userId) => {
//     // Устанавливаем диапазон по умолчанию
//     let rang = range ?? [0, 7];

//     // Строим фильтры на основе значения laboratory
//     const filters = () => {
//         if (laboratory) {
//             return {
//                 active: 1,
//                 forLaboratory: 1,
//             };
//         } else {
//             return {
//                 active: 1,
//             };
//         }
//     };

//     console.log(userId);
    
//     try {
//         // Выполняем запрос с использованием Axios
//         const response = await instance.get(
//             `https://playmost.ru/api2/planets`, {
//                 params: {
//                     range: JSON.stringify(rang), 
//                     filter: JSON.stringify(filters()), 
//                     sort: JSON.stringify([["forLaboratory", "DESC"]]), 
//                     userId: userId ?? 0
//                 }
//             }
//         );
//         console.log("Response data (raw):", response.data);

//         // Проверка на успешный ответ
//         if (response?.data) {
//             // Преобразуем строку JSON в объект (если она строка)
//             let planetsData;
//             try {
//                 planetsData = JSON.parse(response.data);
//             } catch (error) {
//                 console.error("Error parsing response data:", error);
//                 return [];
//             }

//             console.log("Parsed planets data:", planetsData);

//             // Работайте с массивом планет прямо
//             planetsData.forEach(item => {
//                 if (item.elements && Array.isArray(item.elements)) {
//                     item.element = item.elements[0]; // Присваиваем первый элемент
//                 }
//             });

//             console.log("Processed planets data:", planetsData);
//             return planetsData;
//         } else {
//             console.log("No data found in response.");
//             return [];
//         }

//     } catch (error) {
//         console.error("Error fetching planets data:", error);
//         return [];
//     }
// };





// export const getElements = async () => {
//     const elements = await instance.get(`${url}/api/elements`);
//     return JSON.parse(elements.data);
// }

export const getElements = async () => {
    try {
        const response = await fetch(`https://playmost.ru/api2/elements`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const elements = await response.json();
        return elements;
    } catch (error) {
        console.error("Failed to fetch elements:", error);
        return [];
    }
};


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

// export const updateWalletElement = async (wallet, value) => {
//     console.log("FETCH WALLET", wallet);
  
//     const response = await fetch(`https://playmost/api2/wallet/${wallet.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         ...wallet,
//         value: value,
//       }),
//     });
  
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(`Failed to update wallet: ${error}`);
//     }
  
//     const updated = await response.json();
//     return updated;
//   };

export async function getWalletFromBackend(userId) {
    try {
      const response = await fetch('https://playmost.ru/api2/get-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })  // <== передаём в теле
      });
  
      if (!response.ok) {
        throw new Error('Не удалось получить данные о кошельке');
      }

  
      const data = await response.json();

      return data; // или data.wallet если так оформлено
    } catch (error) {
      console.error('Ошибка при получении кошелька:', error);
      return null;
    }
  }

  export const updateWalletElement = async (wallet, value) => {
    console.log("FETCH WALLET", wallet);
  
    const response = await fetch(`https://playmost.ru/api2/wallet/${wallet.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: wallet.id,
        user_id: user?.id,
        value: value,
      }),
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update wallet: ${error}`);
    }
  
    const updated = await response.json();
    return updated;
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
    const response = await fetch(`https://playmost.ru/api2/users/${window.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(val),
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update user: ${error}`);
    }
  
    const updatedUser = await response.json();
    return updatedUser;
  };
  

export const addPlanetToUser = async (planetId) => {
    const isOk = await instance.post(`https://playmost.ru/api/userPlanets`, {
        userId: window.user.id,
        planetId,
    });
    return isOk;
};

export const getTasks = async () => {
    try {
      const response = await axios.get('https://playmost.ru/api2/tasks');
      return response.data.tasks; // Возвращаем данные в поле tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return []; // Возвращаем пустой массив в случае ошибки
    }
  };
  

  export const sendTaskAction = async (taskId, userId) => {
    console.log("Отправка запроса с taskId:", taskId, "userId:", userId);
    
    try {
        const response = await instance.post(`https://playmost.ru/api2/tasks/${taskId}/action`, {
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



export const addToAlliance = async (planetId) => {
    try {
        const response = await axios.post(`${url}/api/alliance`, {
            planetId,
        });
        return response.data.result;
    } catch (error) {
        console.error('Error adding to alliance:', error);
        throw error; // Бросаем ошибку дальше, чтобы ее можно было обработать в вызывающем коде
    }
};


export const getAllUserPlanets = async () => {
    const planets = await instance.get(`${url}/api/userPlanets?filter=${JSON.stringify({userId: window.user.id || 9999})}`)
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
