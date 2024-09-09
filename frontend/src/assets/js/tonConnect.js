const tonconnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: `${TonUrl}/tonconnect-manifest.json`,
    buttonRootId: 'ton-connect'
});

async function connectToWallet() {
    try {
        const connectedWallet = await tonconnectUI.connectWallet();
        if (connectedWallet?.account?.address) {
            const address = connectedWallet.account.address;
            localStorage.setItem('userWalletAddress', address);

            const money = 50000; // Replace with actual balance check if available
            const tonium = 0; // Replace with actual balance check if available

            const planets = await fetchPlanetsFromServer();
            const userExists = await checkUserOnServer(address);

            if (!userExists) {
                await sendUserInfoToServer(address, planets, money, tonium);
            }
        }
    } catch (error) {
        console.error('Error connecting to wallet:', error);
    }
}

async function fetchPlanetsFromServer() {
    try {
        const response = await fetch(`${HOST}/planets`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error fetching planets:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error fetching planets:', error);
        return [];
    }
}

async function checkUserOnServer(address) {
    try {
        const response = await fetch(`${HOST}/planet-taps/${address}`);
        return response.ok;
    } catch (error) {
        console.error('Error checking user on server:', error);
        return false;
    }
}

function formatDateForMySQL(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function sendUserInfoToServer(address, planets, money, tonium) {
    try {
        const now = new Date();
        const formattedTime = formatDateForMySQL(now);

        const response = await fetch(`${HOST}/planet-taps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: address,
                auth: address,
                tonium: tonium,
                money: money,
                planets: planets,
                time: formattedTime,
                history: []
            })
        });

        if (!response.ok) {
            console.error('Error sending user info to server:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending user info to server:', error);
    }
}

function getAddressFromLocalStorage() {
    const tonAddress = localStorage.getItem("userWalletAddress");
    return tonAddress || null;
}

async function fetchAndCalculateTaps() {
    const address = getAddressFromLocalStorage();
    try {
        if (!address) {
            console.warn('No address found in local storage');
            return;
        }

        const user = await fetchUserData(address);
        if (!user?.planets?.length) {
            return;
        }

        const updates = user.planets
            .filter(planet => planet.planetstatus === 1)
            .map(planet => {
                const accumulatedTaps = calculateAccumulatedTaps(planet);
                return updatePlanetTaps(address, planet.id, accumulatedTaps, user.money, user.tonium, user, planet);
            });

        await Promise.all(updates);
    } catch (error) {
        console.error('Error fetching and calculating taps:', error);
    }
}

async function fetchUserData(address) {
    try {
        const response = await fetch(`${HOST}/planet-taps/${address}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error fetching user data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

function calculateAccumulatedTaps(planet) {
    const { buyDay, buyTime, hourTap, taps } = planet;
    const [day, month, year] = buyDay.split('.');
    const formattedDate = `${year}-${month}-${day}`;
    const buyDateTime = new Date(`${formattedDate}T${buyTime}`);
    const now = new Date();

    const elapsedTimeInMs = now - buyDateTime;
    const elapsedTimeInHours = elapsedTimeInMs / (1000 * 60 * 60);
    return (elapsedTimeInHours * Number(hourTap));
}

async function updatePlanetTaps(address, planetId, newTapsValue, money, tonium, user, planet) {
    const now = new Date();
    const timeBuy = now.toTimeString().split(' ')[0];

    const updatedPlanets = user.planets.map(p => {
        if (p.id === planetId) {
            return {
                ...p,
                taps: newTapsValue + p.taps,
                buyDay: new Date().toLocaleDateString(),
                buyTime: timeBuy
            };
        }
        return p;
    });

    try {
        const response = await fetch(`${HOST}/update-planet/${address}/${planetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...planet,
                taps: newTapsValue + planet.taps,
                buyDay: new Date().toLocaleDateString(),
                buyTime: timeBuy
            }),
        });

        if (!response.ok) {
            console.error('Error updating planet taps:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating planet taps:', error);
    }
}

async function purchasePlanet(planetId) {
    try {
        const address = getAddressFromLocalStorage();
        if (!address) {
            console.error('Wallet address not found');
            return;
        }

        const planet = await fetchPlanetById(planetId);
        if (!planet) {
            console.error('Planet not found');
            return;
        }

        const user = await fetchUserData(address);
        if (!user) {
            console.error('User data not found');
            return;
        }

        if (user.money < planet.price) {
            alert('Insufficient funds');
            return;
        }

        // Execute transaction using TON Connect
        await tonconnectUI.sendTransaction({
            to: "SELLER_WALLET_ADDRESS", // Replace with the actual seller wallet address
            amount: planet.price * 1000000000 // Convert to nanoton
        });

        // Update user and server data after successful purchase
        await updatePlanetTaps(address, planetId, 0, user.money - planet.price, user.tonium, user, planet);
        alert(`You have successfully purchased ${planet.name}!`);
    } catch (error) {
        console.error('Error during purchase:', error);
        alert('Purchase failed. Please try again.');
    }
}

async function fetchPlanetById(planetId) {
    try {
        const response = await fetch(`${HOST}/planets/${planetId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error fetching planet data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching planet data:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const tonAddress = getAddressFromLocalStorage();
        if (tonAddress) {
            await connectToWallet();
        } else {
            console.warn('TON address not found in local storage');
        }
    } catch (error) {
        console.error('Error initializing:', error);
    }
});

fetchAndCalculateTaps();
