document.addEventListener('DOMContentLoaded', function () {

    function attachEventListeners() {
        const planetElements = document.querySelectorAll('.planets__planet');

        planetElements.forEach(planet => {
            planet.addEventListener('click', async function (e) {
                if (e.target.tagName.toLowerCase() === 'button') return;

                const planetIndex = parseInt(planet.dataset.index, 10);
                if (!addres) return;

                try {
                    const response = await fetch(`${HOST}/planet-taps/${addres}`);
                    if (!response.ok) throw new Error(`Network response was not ok ${response.statusText}`);
                    
                    const data = await response.json();
                    const planetToUpdate = data.planets.find(p => p.id === planetIndex);

                    if (!planetToUpdate) throw new Error('Planet to update not found');

                    // Ensure speed and taps are numbers
                    const planetIndexTap = Number(planetToUpdate.speed) || 0;
                    planetToUpdate.taps = (Number(planetToUpdate.taps) || 0) + planetIndexTap;

                    const updateResponse = await fetch(`${HOST}/planet-taps/${addres}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: addres,
                            auth: addres,
                            money: data.money,
                            tonium: data.tonium,
                            planets: data.planets.map(p => p.id === planetIndex ? planetToUpdate : p),
                            time: new Date(data.time).toISOString().replace('T', ' ').slice(0, 19)                            ,
                            history: data.history
                        })
                    });
                    

                    if (!updateResponse.ok) {
                        const errorText = await updateResponse.text();
                        throw new Error(`Update failed: ${errorText}`);
                    }

                    const updatedData = await fetch(`${HOST}/planet-taps/${addres}`);
                    if (!updatedData.ok) throw new Error(`Network response was not ok ${updatedData.statusText}`);
                    
                    const updatedPlanetData = await updatedData.json();
                    const updatedPlanet = updatedPlanetData.planets.find(p => p.id === planetIndex);

                    if (updatedPlanet) {
                        const planetElement = document.querySelector(`.planets__planet[data-index='${updatedPlanet.id}']`);
                        if (planetElement) {
                            const gcElement = planetElement.querySelector('.planet__gc');
                            if (gcElement) {
                                gcElement.textContent = `${Number(updatedPlanet.taps).toFixed(4)} ${updatedPlanet.smileName}`;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error during fetch/update:', error);
                }

                const plusIcon = document.createElement('div');
                plusIcon.textContent = '+';
                plusIcon.classList.add('plus-icon');
                plusIcon.style.left = `${e.pageX}px`;
                plusIcon.style.top = `${e.pageY}px`;

                document.body.appendChild(plusIcon);
                plusIcon.addEventListener('animationend', () => plusIcon.remove());
            });
        });
    }

    // Attach event listeners after a delay
    setTimeout(attachEventListeners, 1000);
});
