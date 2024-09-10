export default function input() {

    const inputs = document.querySelectorAll('.market__banner-input');

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function unformatNumber(str) {
        return str.replace(/\./g, '');
    }

    inputs.forEach(input => {
        input.addEventListener('focus', function(e) {
            let value = unformatNumber(e.target.value);
            if (value === '0') {
                e.target.value = '';
            } else {
                e.target.value = value;
            }
        });

    });
}
