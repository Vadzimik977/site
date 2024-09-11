import axios, { Axios } from 'axios';

const instance = new Axios({
    headers: {
        Authorization: window.adress
    },
    transformRequest: [...axios.defaults.transformRequest]
});

const url = 'http://tonium.1423807-cl91000.tw1.ru:8000'

export const getUser = async () => {
    const user = await instance.get(`${url}/api/users?filter=${JSON.stringify({wallet: window.adress})}`);
    if(user?.data?.length > 2) {
        return JSON.parse(user.data)[0]
    } else {
        console.log(undefined)
        return undefined
    }
}

export const createUser = async () => {
    const data = {wallet: window.adress}
    const user = await instance.post(`${url}/api/users`, { ...data });
    return JSON.parse(user.data);
}

export const getPlanets = async () => {
    const planets = await instance.get(`${url}/api/planets?filter=${JSON.stringify({active: 1})}`);
    return JSON.parse(planets.data)
}

export const createWalletElement = async (elementId) => {
    const data = {
        userId: window.user.id,
        elementId
    }
    const created = await instance.post(`${url}/api/wallet`, {...data});
    return JSON.parse(created.data);
}


export const updateWalletElement = async (wallet, value) => {
    const updated = await instance.put(`${url}/api/wallet/${wallet.id}`, {...wallet, value: value});
    return updated.data;
}

export const getUserWallet = async () => {
    const userWallet = await instance.get(`${url}/api/wallet?filter=${JSON.stringify({userId: window.user.id})}`);
    return JSON.parse(userWallet.data);
}