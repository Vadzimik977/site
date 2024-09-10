import { getUser, createUser } from "../../utils/axios";

export const fetchDefaultUser = async () => {
    const user = await getUser();
    if (user) {
        window.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        return user
    } else {
        const newUser = await createUser();
        window.user = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
        return newUser
    }
};