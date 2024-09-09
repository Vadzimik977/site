setTimeout(()=>{
    function showPopup(parentElement, content, additionalClasses = []) {
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
    
    const marketButtons = document.querySelectorAll('.market__trade .btn');
    marketButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const planetElement = event.currentTarget.closest('.market__trade');
            let content, additionalClasses = ['market__popup'];
    
            if (button.classList.contains('complete')) {
                content = '<div class="market__popup-title">Обмен выполнен успешно</div><div class="market__popup-text">Баланс в кошельке обновлён!</div>';
                // setTimeout(() => {
                //     window.location.reload()
                // }, 2000);
            } else if (button.classList.contains('error')) {
                content = '<div class="market__popup-title">Ошибка</div><div class="market__popup-text">Недостаточно средств для обмена</div>';
                // setTimeout(() => {
                //     window.location.reload()
                // }, 2000);
            } else {
                content = '<div class="market__popup-title">Повторите попытку позже</div>';
                // setTimeout(() => {
                //     window.location.reload()
                // }, 2000);
            }
    
            content = '<div class="popup__inner">' + content + '</div>';
    
            showPopup(planetElement, content, additionalClasses);
        });
    });
    
    const planetButtons = document.querySelectorAll('.planets__planet .btn');
    planetButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const planetElement = event.currentTarget.closest('.planets__planet');
            let content;
    
            if (button.classList.contains('upgrade')) {
                content = '<div class="planet__popup-title">ПЛАНЕТА ОБНОВЛЕНА</div><div class="planet__popup-text">СКорость добычи увеличена</div>';
             
            } else if(button.classList.contains('buy')) {
                content = '<div class="planet__popup-title">ПЛАНЕТА Куплена</div>';
            
            } else {
                content = '<div class="planet__popup-title">Ошибка</div><div class="wallet__popup-text">Недостаточно средств для Куплена</div>';

            }
    
            content = '<div class="popup__inner">' + content + '</div>';
    
            showPopup(planetElement, content, ['planet__popup']);
        });
    });
    
    const walletButtons = document.querySelectorAll('.wallet .btn');
    walletButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const walletElement = event.currentTarget.closest('.wallet__table');
            let content, additionalClasses = ['wallet__popup'];
    
            if (button.classList.contains('complete')) {
                content = '<div class="wallet__popup-title">Обмен выполнен успешно</div><div class="wallet__popup-text">Баланс в кошельке обновлён!</div>';
                // setTimeout(() => {
                //     window.location.reload()
                // }, 2000);
            } else if (button.classList.contains('error')) {
                content = '<div class="wallet__popup-title">Ошибка</div><div class="wallet__popup-text">Недостаточно средств для обмена</div>';
                // setTimeout(() => {
                //     window.location.reload()
                // }, 2000);
            } else {
                content = '<div class="wallet__popup-title">Повторите попытку позже</div>';
            }
    
            content = '<div class="popup__inner">' + content + '</div>';
    
            showPopup(walletElement, content, additionalClasses);
        });
    });
    
    const laboratoryButtons = document.querySelectorAll('.laboratory__button');
    laboratoryButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const laboratoryElement = event.currentTarget.closest('.laboratory');
            let content, additionalClasses = ['laboratory__popup'];
    
            if (button.classList.contains('complete')) {
                content = '<div class="laboratory__popup-title">объединение прошло успешно</div>';
            } else {
                content = '<div class="laboratory__popup-title">Ошибка</div><div class="laboratory__popup-text">Повторите попытку позже</div>';
            }
    
            content = '<div class="popup__inner">' + content + '</div>';
    
            showPopup(laboratoryElement, content, additionalClasses);
        });
    });
}, 2000)