export default function showPopup(parentElement, content, additionalClasses = []) {
    let existingElement = parentElement.querySelector('.popup');
    if (existingElement) {
        existingElement.remove();
    }

    const newDiv = document.createElement('div');
    newDiv.innerHTML = content + '<button class="popup__close">&times;</button>';
    newDiv.classList.add('popup', ...additionalClasses);
    parentElement.appendChild(newDiv);

    const closeButton = newDiv.querySelector('.popup__close');
    closeButton.addEventListener('click', function() {
        newDiv.classList.remove('fade-in');
        setTimeout(() => {
            if (newDiv.parentElement === parentElement) {
                parentElement.removeChild(newDiv);
            }
        }, 500);
    });

    setTimeout(() => {
        requestAnimationFrame(() => {
            newDiv.classList.add('fade-in');
        });
    }, 100);

    setTimeout(() => {
        newDiv.classList.remove('fade-in');
        setTimeout(() => {
            if (newDiv.parentElement === parentElement) {
                parentElement.removeChild(newDiv);
            }
        }, 500);
    }, 5000);
}