const hoursElement = document.querySelector(".laboratory__time-timer .hours");
const minutesElement = document.querySelector(".laboratory__time-timer .minutes");
const secondsElement = document.querySelector(".laboratory__time-timer .seconds");

try {
    const fetchTime = await fetch(`${HOST}/planet-rand-time`);
    const data = await fetchTime.json();
    let totalTimeInSeconds = Math.floor(data.totalSeconds);

    function updateTimer() {
        if (totalTimeInSeconds <= 0) {
            clearInterval(timerInterval);
            document.querySelector(".laboratory__time-text").textContent = "Время истекло";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
            return;
        }

        totalTimeInSeconds--;

        const hours = Math.floor(totalTimeInSeconds / 3600);
        const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
        const seconds = totalTimeInSeconds % 60;

        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');

        localStorage.setItem("endTonium", `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`);
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

} catch (error) {
    console.error("An error occurred while fetching the time:", error);
}
