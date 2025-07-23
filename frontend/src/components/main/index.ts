import { IPlanet, IUserPlanet } from "../../types/planets.type";
import { IUser } from "../../types/user.type";

export const getInitialValue = (
    planet: IPlanet,
    user: IUser | null,
    isLoading: boolean,
    user_planets: IUserPlanet[]
  ): { speed: number; cost: number; level: number } | 0 => {
    if (!user || isLoading || !user_planets) return 0;
  
    const userPlanet = user_planets.find(
      (item) => item.planetId === planet.id && item.userId === user.id
    );
  
    if (!userPlanet) return 0;
  
    let cost = 0;
    let speed = 0.1;
  
    for (let i = 0; i <= +userPlanet.level; i++) {
      if (i === 0) {
        cost = 3;
      } else {
        cost = cost * 2.5;
      }
  
      if (i === 1) {
        speed = 0.1;
      } else if (i > 1) {
        speed = speed * 2;
      }
    }
  
    return {
      cost,
      level: +userPlanet.level,
      speed,
    };
  };
  

const getInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getAllResourceVal = (rare: 'Обычная' | 'Редкая' | 'Эпическая') => {
    switch(rare) {
        case 'Обычная':
            return getInteger(300000000, 400000000)
        case 'Редкая':
            return getInteger(100000000, 200000000)
        case 'Эпическая':
            return getInteger(50000000, 100000000)
    }
}

export const getInitValCorables = (port) => {
    let cost = 3;
    let amount = 10;
    let damage = 0;
    if(port?.level) {
        for(let i = 0; i <= +port.level; i++) {
            if(i === 0) continue
            if(i === 1) {
                amount = 9
            }
            cost = cost * 2;
            amount = amount + 1;
            damage = 1;
            
        }
    }
    
    return {cost, amount, damage};
}