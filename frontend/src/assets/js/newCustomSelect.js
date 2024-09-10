export default function newCustomSelect() {
    let selectedItemId = null;
    const HOST = ''
    
    const clickOption = async (id) => {
        selectedItemId = id;
    
        try {
            const response = await fetch(`${HOST}/planet-taps/${addres}`);
            if (!response.ok) {
                throw new Error('Failed to fetch planet data');
            }
            const data = await response.json();
            const selectedItem = data.planets.find(item => item.id === id);
    
            if (selectedItem) {
                handleInputs(selectedItem);
            }
    
            return { item: selectedItem, money: data.money, tonium: data.tonium, user: data };
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };
    
    
    const input1 = document.querySelector('.market__banner-input-1');
    const input2 = document.querySelector('.market__banner-input-2');
    
    const handleInputs = (item) => {
        if (item && input1 && input2) {
            let input1Value = parseFloat(input1.value) || 0;
    
            if (input1Value >= item.taps) {
                input1Value = item.taps;
                input1.value = input1Value;
            }
    
            if (input1Value <= item.taps) {
                const input2Value = input1Value / item.ratio;
                input2.value = input2Value.toFixed(2);
                const obmenButton = document.querySelector('.btn-obmen');
                if (obmenButton) {
                    obmenButton.classList.add('complete');
                    obmenButton.classList.remove('error');
                }
            } else {
                input2.value = 0;
                const obmenButton = document.querySelector('.btn-obmen');
                if (obmenButton) {
                    obmenButton.classList.add('error');
                    obmenButton.classList.remove('complete');
                }
            }
        }
    };
    
    const obmen = async () => {
        const input1Value = parseFloat(input1.value) || 0;
        const input2Value = parseFloat(input2.value) || 0;
    
        const { item, money, tonium, user } = await clickOption(selectedItemId);
    
        if (item && user) {
            const newTapsValue = item.taps - input1Value;
    
            const tonAddres = localStorage.getItem("ton-connect-storage_bridge-connection");
            const parsedData = JSON.parse(tonAddres);
            const addres = parsedData?.connectEvent?.payload?.items[0]?.address;
    
            if (!addres) {
                console.error('Error: Invalid addres');
                return;
            }
    
            try {
             
                const updateUserResponse = await fetch(`${HOST}/planet-taps/${addres}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: addres,
                        auth: addres,
                        money: user.money + Number(input2Value),
                        tonium: user.tonium,
                        planets: user.planets,
                        time: new Date(user.time).toISOString().replace('T', ' ').slice(0, 19) ,
                        history: user.history
                    })
                });
                if(updateUserResponse.ok){
                    const updatePlanetResponse = await fetch(`${HOST}/update-planet/${addres}/${item.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: item.id,
                            planetName: item.planetName,
                            smileName: item.smileName,
                            hourTap: item.hourTap,
                            taps: newTapsValue,
                            price: item.price,
                            speed: item.speed,
                            level: item.level,
                            planetstatus: item.planetstatus,
                            rand: item.rand,
                            obmenTaps: item.obmenTaps,
                            ratio: item.ratio,
                            buyDay: item.buyDay,
                            buyTime: item.buyTime
        
                        })
                    });
                   
        
                    const updateHistoryResponse = await fetch(`${HOST}/obmen-history/${addres}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            history: [
                                ...user.history,
                                {
                                    id: user.history.length + 1,
                                    planetId: item.id,
                                    planetName: item.planetName,
                                    smileName: item.smileName,
                                    minusCoin: input1Value,
                                    plusGC: input2Value,
                                    day: new Date().toLocaleDateString(),
                                    time: new Date().toLocaleTimeString()
                                }
                            ]
                        })
                    });
                }
               
            } catch (error) {
               
            }
        } else {
            console.error('Error: No item selected');
        }
    };
    
    
    input1 && input1?.addEventListener('input', () => {
        if (selectedItemId !== null) {
            clickOption(selectedItemId).then(data => handleInputs(data.item));
        }
    });
    
    document.querySelector('.btn-obmen')?.addEventListener('click', obmen);
        const compactSelects = document.querySelectorAll('.compact-select');
    
        compactSelects.forEach(compactSelect => {
            const selectedOption = compactSelect.querySelector('.selected-option');
            const modalSelect = compactSelect.nextElementSibling;
            const optionsList = modalSelect.querySelector('.options-list');
            const searchInput = modalSelect.querySelector('.search-container input');
            const closeButton = modalSelect.querySelector('.close-button');
    
            const firstOption = optionsList.querySelector('.option');
            if (firstOption) {
                const icon = firstOption.querySelector('img').cloneNode(true);
                const cryptoName = firstOption.querySelector('.crypto-name')?.textContent ?? 'Select coin';
                selectedOption.innerHTML = '';
                selectedOption.appendChild(icon);
                selectedOption.appendChild(document.createTextNode(cryptoName));
            }
    
            compactSelect.addEventListener('click', function () {
                modalSelect.style.display = 'flex';
            });
    
            closeButton.addEventListener('click', function () {
                modalSelect.style.display = 'none';
            });
    
            optionsList.addEventListener('click', function (e) {
                const option = e.target.closest('.option');
                if (option) {
                    const icon = option.querySelector('img').cloneNode(true);
                    const cryptoName = option.querySelector('.crypto-name').textContent;
                    selectedOption.innerHTML = '';
                    selectedOption.appendChild(icon);
                    selectedOption.appendChild(document.createTextNode(cryptoName));
                    modalSelect.style.display = 'none';
                }
            });
    
            searchInput.addEventListener('input', function () {
                const searchTerm = this.value.toLowerCase();
                const options = optionsList.querySelectorAll('.option');
    
                options.forEach(option => {
                    const cryptoName = option.querySelector('.crypto-name').textContent.toLowerCase();
                    const cryptoSubLabel = option.querySelector('.crypto-sublabel').textContent.toLowerCase();
                    if (cryptoName.includes(searchTerm) || cryptoSubLabel.includes(searchTerm)) {
                        option.style.display = 'flex';
                    } else {
                        option.style.display = 'none';
                    }
                });
            });
    
            window.addEventListener('click', function (e) {
                if (e.target === modalSelect) {
                    modalSelect.style.display = 'none';
                }
            });
        });
}

