import { IPlanet } from "../../types/planets.type";
import { IUser } from "../../types/user.type";

export const getInitialValue = (planet: IPlanet, user: IUser | null, isLoading: boolean): {speed: number; cost: number; level: number} | 0 => {
    if (!user || isLoading) return 0;
    const userPlanet = planet.user_planets.find(
      (item) => item.userId === user.id
    );
    if(!userPlanet) return 0;
    let cost = 0;
    let speed = 0.1;
    for(let i = 0; i <= +userPlanet.level; i++) {
        if(i === 0) {
            cost = 3;  
        } else {
            cost = cost * 2.5;
        }
        if(i === 1) {
            speed = 0.1;
        } else {
            speed = speed * 2
        }
    }

    return {cost, level: +userPlanet.level, speed};
}