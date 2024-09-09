export default function input() {

    const inputs = document.querySelectorAll('.market__banner-input');
    const MAX_VALUE = 9999999;

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

        input.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Разрешаем только цифры
            value = value.replace(/[^\d]/g, '');
            
            // Ограничиваем значение до MAX_VALUE
            value = Math.min(parseInt(value) || 0, MAX_VALUE).toString();
            
            e.target.value = value;
        });

        input.addEventListener('blur', function(e) {
            let value = e.target.value;
            
            // Если значение пустое или некорректное, устанавливаем 0
            if (value === '' || isNaN(parseInt(value))) {
                value = '0';
            }
            
            // Форматируем число с разделителями тысяч
            e.target.value = formatNumber(value);
        });
    });
}
