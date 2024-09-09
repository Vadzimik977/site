const style = document.createElement('style');
style.textContent = `
    .market__trade, .market__history {
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    .market__trade.hidden, .market__history.hidden {
        opacity: 0;
        transform: translateY(-20px);
        pointer-events: none;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    const marketTrade = document.querySelector('.market__trade');
    const marketHistory = document.querySelector('.market__history');
    const settingsButtons = document.querySelectorAll('.market__settings');

    function toggleMarketView() {
        if (marketTrade.classList.contains('hidden')) {
            marketHistory.classList.add('hidden');
            setTimeout(() => {
                marketHistory.style.display = 'none';
                marketTrade.style.display = 'block';
                setTimeout(() => marketTrade.classList.remove('hidden'), 50);
            }, 300);
        } else {
            marketTrade.classList.add('hidden');
            setTimeout(() => {
                marketTrade.style.display = 'none';
                marketHistory.style.display = 'block';
                setTimeout(() => marketHistory.classList.remove('hidden'), 50);
            }, 300);
        }
    }

    settingsButtons.forEach(button => {
        button.addEventListener('click', toggleMarketView);
    });

    function initialSetup() {
        marketHistory.classList.add('hidden');
        marketHistory.style.display = 'none';
        marketTrade.classList.remove('hidden');
        marketTrade.style.display = 'block';
    }

    initialSetup();
});