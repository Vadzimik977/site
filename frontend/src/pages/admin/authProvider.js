
import { auth } from "../../utils/axios";

export const authProvider = {
    // called when the user attempts to log in
    login: async ({ username, password }) => {
        
        // accept all username/password combinations
        
            try {
                const user = await auth({login: username, password});
                if(!user) {
                    console.log(user)
                    return Promise.reject();
                }
                localStorage.setItem('auth', true);
                return Promise.resolve()
            } catch(err) {
                return Promise.reject()
            }

        
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.setItem("auth", false);
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.setItem("auth", false);
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem("auth") === 'true' ? Promise.resolve() : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};