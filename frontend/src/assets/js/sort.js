document.querySelector('.wallet__table-header div:nth-child(2)').addEventListener('click', function() {
    const wrapper = document.querySelector('.wallet__table-wrapper');
    const rows = Array.from(wrapper.querySelectorAll('.wallet__table-row'));

    const isDescending = this.classList.contains('sorted-desc');

    rows.sort((a, b) => {
        const balanceA = parseFloat(a.children[1].textContent.replace(/[^\d.-]/g, ''));
        const balanceB = parseFloat(b.children[1].textContent.replace(/[^\d.-]/g, ''));
        return isDescending ? balanceA - balanceB : balanceB - balanceA;
    });

    wrapper.innerHTML = '';
    rows.forEach(row => wrapper.appendChild(row));

    if (isDescending) {
        this.classList.remove('sorted-desc');
        this.classList.add('sorted-asc');
    } else {
        this.classList.remove('sorted-asc');
        this.classList.add('sorted-desc');
    }
});
