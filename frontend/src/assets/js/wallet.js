document.addEventListener('DOMContentLoaded', async () => {
    const manifestUrl = '/tonconnect-manifest.json';

    try {
        const tonConnect = new TonConnect(manifestUrl);
        const connection = await tonConnect.connectWallet();

        if (connection) {
            console.log('Wallet connected:', connection);
            
            // Hamyon manzilini olish
            const walletAddress = connection.walletAddress;
            
            // Planet taps ma'lumotlarini olish
            fetchPlanetTaps(walletAddress);
        } else {
            console.log('Wallet connection failed');
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
    }
});

function fetchPlanetTaps(walletAddress) {
    const HOST = 'https://tap-tau.vercel.app'; // O'zingizning backend URL manzilingizni kiriting

    setTimeout(() => {
        fetch(`${HOST}/planet-taps/${walletAddress}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(taps => {
                const totalTap = document.querySelector(".wallet-total_tap");
                totalTap.textContent = taps.money.toFixed(2);
            })
            .catch(error => {
                console.error('Error fetching planet taps:', error);
            });
    }, 100);
}
