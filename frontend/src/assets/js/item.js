function fetchPlanets() {
    return fetch(`${HOST}/planets`)
        .then(response => {
            return response.json();
        });
}

function fetchUserData(addres) {
    return fetch(`${HOST}/planet-taps/${addres}`)
        .then(response => {
            return response.json();
        });
}

function updateUserData(addres, purchaseData) {
    return fetch(`${HOST}/planet-taps/${addres}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseData)
    }).then(response => {
        return response.json();
    });
}

function buyItem(id) {
    fetchPlanets()
        .then(planets => {
            const planet = planets.find(item => item.id === id);

            return fetchUserData(addres)
                .then(userData => {
                    if (userData.money < Number(planet.price)) {
                        throw new Error('Insufficient funds');
                    }

                    const existingPlanetIndex = userData.planets.findIndex(p => p.id === id);
                    let updatedPlanets;

                    if (existingPlanetIndex > -1) {
                        const existingPlanet = userData.planets[existingPlanetIndex];
                        const updatedPlanet = {
                            ...existingPlanet,
                            taps: Number(existingPlanet.taps) + 0.0005,
                            planetstatus: 1,
                            buyDay: new Date().toLocaleDateString(),
                            buyTime: new Date().toLocaleTimeString(),
                        };
                        updatedPlanets = [...userData.planets];
                        updatedPlanets[existingPlanetIndex] = updatedPlanet;
                    } else {
                        const newPlanet = {
                            ...planet,
                            taps: Number(planet.taps) + 0.0005,
                            planetstatus: 1,
                            buyDay: new Date().toLocaleDateString(),
                            buyTime: new Date().toLocaleTimeString(),
                        };
                        updatedPlanets = [...userData.planets, newPlanet];
                    }

                    const purchaseData = {
                        id: addres,
                        auth: userData.auth,
                        money: userData.money - Number(planet.price),
                        tonium: userData.tonium,
                        planets: updatedPlanets,
                        time: new Date(userData.time).toISOString().replace('T', ' ').slice(0, 19) ,
                        history: userData.history
                    };

                    return updateUserData(addres, purchaseData);
                })
        })
        .catch(error => {
        });
}

function upgradeItem(id) {
    fetchPlanets()
        .then(planets => {
            const planet = planets.find(item => item.id === id);

            return fetchUserData(addres)
                .then(userData => {
                    const existingPlanetIndex = userData.planets.findIndex(p => p.id === id);

                    if (existingPlanetIndex === -1) {
                        throw new Error('Planet not found for upgrade');
                    }

                    const existingPlanet = userData.planets[existingPlanetIndex];
                    const newLevel = Number(existingPlanet.level) + 1;

                    const updatedPlanet = {
                        ...existingPlanet,
                        level: newLevel,
                        hourTap: Number(existingPlanet.hourTap) + 1, // Double the hourTap
                        price: Number(existingPlanet.price) * newLevel, // Multiply price by level
                        ratio: Number(existingPlanet.ratio) + (Number(existingPlanet.ratio) / 3),
                        speed: Number(existingPlanet.speed),
                        buyDay: new Date().toLocaleDateString(),
                        buyTime: new Date().toLocaleTimeString(),
                    };

                    const updatedPlanets = [...userData.planets];
                    updatedPlanets[existingPlanetIndex] = updatedPlanet;

                    const purchaseData = {
                        id: userData.id,
                        auth: userData.auth,
                        money: userData.money - existingPlanet.price,
                        tonium: userData.tonium,
                        planets: updatedPlanets,
                        time: new Date(userData.time).toISOString().replace('T', ' ').slice(0, 19) ,
                        history: userData.history
                    };


                    if (userData.money < Number(existingPlanet.price)) {
                        // throw new Error('Insufficient funds to upgrade');

                    } else {

                        return updateUserData(addres, purchaseData);
                    }

                });
        })
        .catch(error => {
            console.error('Error upgrading item:', error);
        });
}


document.addEventListener('DOMContentLoaded', async function () {
    try {
        const getUser = await fetch(`${HOST}/planet-taps/${addres}`);
        const user = await getUser.json();
        
        
        
     
        const [planetTapsResponse, planetRandResponse] = await Promise.all([
            fetch(`${HOST}/planet-taps/${addres}`),
            fetch(`${HOST}/planet-rand`)
        ]);

        const planetTapsData = await planetTapsResponse.json();
        const planetRandData = await planetRandResponse.json();

        const combinedData = [...planetTapsData.planets, ...planetRandData];

        const groupedData = combinedData.reduce((acc, planet) => {
            const currentMax = acc[planet.id];
            if (currentMax) {
                if (Number(planet.taps) > Number(currentMax.taps) ||
                    (Number(planet.taps) === Number(currentMax.taps) && Number(planet.rand) === 1 && Number(currentMax.rand) === 0)) {
                    acc[planet.id] = planet;
                }
            } else {
                acc[planet.id] = planet;
            }
            return acc;
        }, {});

        const sortedData = Object.values(groupedData).sort((a, b) => {
            if (Number(a.planetstatus) !== Number(b.planetstatus)) {
                return Number(b.planetstatus) - Number(a.planetstatus);
            }

            if (a.rand !== b.rand) {
                return b.rand - a.rand;
            }

            return Number(b.taps) - Number(a.taps);
        });
        const hoursFetch = await fetch(`${HOST}/planet-rand-time`)
        const hoursData = await hoursFetch.json()
        const hours = hoursData.hours || '00';
        const minutes = hoursData.minutes || '00';
        const seconds = hoursData.seconds || '00';

        const mappedData = sortedData.map(planet => {
            const randData = planetRandData.find(item => item.id === planet.id);
            return `
                <div class="planets__planet animated-border-container  ${planet.planetstatus ? "ver1" : `${randData ? "ver2" : "ver3"}`} with_To rotate" data-index="${planet.id}">
                    <div class="animated-border">
                        <div class="planet__img" style="--planet-bg: url('../img/icon/${planet.id}${planet.smileName}.png');">
                            <img src="img/planet/${planet.id}${planet.smileName}.png" alt="${planet.planetName}">
                        </div>
                        <div class="planet__information">
                            <h4 class="planet__title">${planet.planetName}(${planet.smileName}) - Planet #${planet.id}</h4>
                            <p class="planet__lvl">level ${planet.level}</p>
                            <p class="planet__speed">Speed: ${planet.hourTap} (${planet.smileName})/час</p>
                            <p class="planet__description">The extracted resource is ${planet.planetName}(${planet.smileName})</p>
                            <p class="planet__gc">${parseFloat(planet.taps).toFixed(4)} ${planet.smileName}</p>
                        </div>
                        <div class="planet__price">Стоимость апгрейда <span>${planet.price} GC</span></div>
                        <div class="planet__row">
                            ${planet.planetstatus === 1
                    ? `<button class="btn upgrade" onclick="upgradeItem(${planet.id})">Обновить</button>`
                    : `<button class="btn ${user.money>=Number(planet.price)? "buy" : "error"}" onclick="buyItem(${planet.id})">Купить</button>`
                }
                            ${randData ? `<div class="planet__time-block">
                                <div class="time-block__timer">
                                    <span class="days">0</span> : 
                                    <span class="hours">${hours}</span> : 
                                    <span class="minutes">${minutes}</span> : 
                                    <span class="seconds">${seconds}</span>
                                </div>
                                <div class="planet__timer">Таймер обратного отсчета до следующего апгрейда</div>
                            </div>` : ""}
                        </div>
                    </div>
                </div>`;
        }).join('');

        document.querySelector('.planets').innerHTML = mappedData;
    } catch (error) {
    }
});
