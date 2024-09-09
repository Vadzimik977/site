const urlApi = `img`;
async function fetchUserData() {
   
    const userUrl = `${HOST}/planet-taps/${addres}`;

    try {
        const response = await fetch(userUrl);
        if (!response.ok) {
            return 0;
        }
        return await response.json();
    } catch (error) {
        return 0;
    }
}

async function fetchRandomData() {
    const randomUrl = `${HOST}/planet-rand`;

    try {
        const response = await fetch(randomUrl);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

async function fetchAndDisplayData() {
    const userData = await fetchUserData();
    const randomData = await fetchRandomData();

    if (userData && randomData) {
        await displayData(userData, randomData);
    } else {
       await displayData(0, randomData)
    }
}

async function displayData(userData, randomData) {
    const container = document.querySelector('.laboratory__items');
    if (!container) return;

    container.innerHTML = '';

    const userPlanets = userData.planets || [];
    const randomPlanets = randomData || [];

    const userPlanetMap = new Map(userPlanets.map(planet => [planet.id, planet]));

    let isComplete = false;
    let hasError = false;

    randomPlanets.forEach((randomPlanet, index) => {
        const userPlanet = userPlanetMap.get(randomPlanet.id);
        const tapsValue = userPlanet && typeof userPlanet.taps === 'number' 
            ? userPlanet.taps.toFixed(3) 
            : '0';
    
        const div = document.createElement('div');
        const errorDiv=document.createElement('div')
        errorDiv.innerHTML = `
        <img style="width: 85px" src="../${urlApi}/icon/${randomPlanet.id}${randomPlanet.smileName}.png" alt="${randomPlanet.smileName}">
        <span>${randomPlanet.smileName}</span>
    `;
        div.innerHTML = `
            <img style="width: 85px" src="../${urlApi}/icon/${randomPlanet.id}${randomPlanet.smileName}.png" alt="">
            <span>${userPlanet && userPlanet.planetstatus === 1 
                ? `${tapsValue} ${randomPlanet.smileName}` 
                : `0 ${randomPlanet.smileName}`}</span>
        `;
       if(userData!==0){
         container.appendChild(div);
       } else{
        container.appendChild(errorDiv);

       }
    
        if (index < randomPlanets.length - 1) {
            const span = document.createElement('span');
            span.textContent = '+';
            container.appendChild(span);
        }
    
        if (userPlanet && randomPlanet.obmenTaps) {
            if (userPlanet.planetstatus === 1 && parseFloat(tapsValue) >= randomPlanet.obmenTaps) {
                isComplete = true;
            } else if (parseFloat(tapsValue) < randomPlanet.obmenTaps) {
                hasError = true;
            }
        }
    });
    

    const tonObmen = document.querySelector(".laboratory__button");
    if (tonObmen) {
        if (isComplete && !hasError) {
            tonObmen.classList.add('complete');
            tonObmen.classList.remove('error');
            tonObmen.addEventListener('click', () => updatePlanetData(userData, randomData));
        } else {
            tonObmen.classList.add('error');
            tonObmen.classList.remove('complete');
        }
    }

 
}


async function updatePlanetData(userData, randomData) {
    if (!addressss) {
        console.error('No address found');
        return;
    }

    const userPlanets = userData.planets || [];
    const randomPlanets = randomData || [];

    const allPlanetsValid = randomPlanets.every(randomPlanet => {
        const userPlanet = userPlanets.find(planet => planet.id === randomPlanet.id);
        return userPlanet ? userPlanet.taps >= (randomPlanet.obmenTaps || 1) : false;
    });

    if (!allPlanetsValid) {
        console.error('Validation failed. Some random planets have obmenTaps < 1 or insufficient taps.');
        return;
    }

    const updatedPlanets = userPlanets.map(planet => {
        const randomPlanet = randomPlanets.find(rp => rp.id === planet.id);
        if (randomPlanet && planet.planetstatus === 1) {
            const newTapsValue = planet.taps - (randomPlanet.obmenTaps || 0);
            return {
                ...planet,
                taps: newTapsValue >= 1 ? newTapsValue : 0
            };
        }
        return planet;
    });

    try {

        const response = await fetch(`${HOST}/planet-taps/${addressss}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: addressss,
                auth: addressss,
                money: userData.money,
                tonium: userData.tonium + 1,
                planets: updatedPlanets,
                time: new Date(userData.time).toISOString().replace('T', ' ').slice(0, 19) ,
                history: userData.history
            }),
        });

        if (!response.ok) {
            console.error(`Failed to update planet data. Status: ${response.status}`);
            const errorText = await response.text();
            console.error('Response Error:', errorText);
        } else {
            fetchAndDisplayData();
        }
    } catch (error) {
        console.error('Error updating planet data:', error);
    }
}


fetchAndDisplayData();
