export default function plus () {

    function attachEventListeners() {
        const planetElements = document.querySelectorAll('.planets__planet');

        planetElements.forEach(planet => {
            planet.addEventListener('click', async function (e) {
                if (e.target.tagName.toLowerCase() === 'button') return;

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
};
