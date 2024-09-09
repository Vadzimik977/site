const elements = document.querySelectorAll('.with_Click');

function addClassOnClick(element) {
    const btn = element.querySelector('.btn');
    
    if (btn) {
        btn.addEventListener('click', function() {
            element.classList.add('hovered');
        }, { once: true });
    }
}

elements.forEach(element => {
    addClassOnClick(element);
});