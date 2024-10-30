import { createUser, getUser } from "../../utils/axios";

export const fetchDefaultUser = async () => {
  const user = await getUser();

  console.log("user: ", user);

  if (user) {
    return user;
  } else {
    const newUser = await createUser();
    return newUser;
  }
};
