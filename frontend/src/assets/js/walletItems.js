window.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch(`${HOST}/planet-taps/${addres}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const walletTonium = document.querySelector(".wallet__table-inner .wallet__table-row");
        if (walletTonium) {
            walletTonium.innerHTML = `
                <div class="wallet__table-coin"  style="--icon-bg: url('../img/icon/119To.png');">Tonium</div>
                <div>${data.tonium} To</div>
                <button class="btn btn-to error">Вывести</button>
            `;
        }

        const walletList = document.querySelector(".wallet__table-wrapper");
        if (walletList) {
            const responseData = data.planets.map((item) => `
                <div class="wallet__table-row">
                    <div class="wallet__table-coin" style="--icon-bg: url('../img/icon/${item.id}${item.smileName}.png');">${item.planetName}</div>
                    <div>${Number(item.taps).toFixed(3)} ${item.smileName}</div>
                    <button class="btn error">Обменять</button>
                </div>
            `).join("");
            walletList.innerHTML = responseData;
        }
    } catch (error) {
        console.error('Error fetching or displaying planets data:', error);
    }
});
