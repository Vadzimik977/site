import { getUser, createUser } from "../../utils/axios";

export const fetchDefaultUser = async () => {
    const user = await getUser();
    console.log("Кажется верно");
    if (user) {
        console.log("Кажется неверно");
        window.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        return user
    } else {
        console.log("Кажется попытка");
        const newUser = await createUser();
        window.user = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
        return newUser
    }
};