document.addEventListener("DOMContentLoaded", function(){
const planetWalelet = document.querySelector(".tap__wallet-amout")
const walletTon=document.querySelector(".wallet__ton")
fetch(`${HOST}/planet-taps/${addres}`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        planetWalelet.textContent = data.money ? data.money.toFixed(2) : 0
        walletTon.textContent = data.tonium ? data.tonium.toFixed(2) : 0

    })
    
})