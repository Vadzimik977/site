import { useUserStore } from "../../store/userStore";
import { createUser, getUser } from "../../utils/axios";

export const fetchDefaultUser = async () => {
  const { setUser } = useUserStore.getState();

  const user = await getUser();

  if (user) {
    setUser(user);
    return user;
  } else {
    const newUser = await createUser();

    setUser(newUser);
    return newUser;
  }
};
