const planetsData = [
    { number: 1, name: "Hydrogen", symbol: "H", speed: 0.05, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 2, name: "Helium", symbol: "He", speed: 0.06, level: 1, gc: "000.000", price: 3, img: "./images/planet2.png" },
    { number: 3, name: "Lithium", symbol: "Li", speed: 0.07, level: 1, gc: "000.000", price: 3, img: "./images/planet3.png" },
    { number: 4, name: "Beryllium", symbol: "Be", speed: 0.08, level: 1, gc: "000.000", price: 3, img: "./images/planet4.png" },
    { number: 5, name: "Boron", symbol: "B", speed: 0.09, level: 1, gc: "000.000", price: 3, img: "./images/planet5.png" },
    { number: 6, name: "Carbon", symbol: "C", speed: 0.10, level: 1, gc: "000.000", price: 3, img: "./images/planet6.png" },
    { number: 7, name: "Nitrogen", symbol: "N", speed: 0.11, level: 1, gc: "000.000", price: 3, img: "./images/planet7.png" },
    { number: 8, name: "Oxygen", symbol: "O", speed: 0.12, level: 1, gc: "000.000", price: 3, img: "./images/planet8.png" },
    { number: 9, name: "Fluorine", symbol: "F", speed: 0.13, level: 1, gc: "000.000", price: 3, img: "./images/planet9.png" },
    { number: 10, name: "Neon", symbol: "Ne", speed: 0.14, level: 1, gc: "000.000", price: 3, img: "./images/planet10.png" },
    { number: 11, name: "Sodium", symbol: "Na", speed: 0.15, level: 1, gc: "000.000", price: 3, img: "./images/planet11.png" },
    { number: 12, name: "Magnesium", symbol: "Mg", speed: 0.16, level: 1, gc: "000.000", price: 3, img: "./images/planet12.png" },
    { number: 13, name: "Aluminum", symbol: "Al", speed: 0.17, level: 1, gc: "000.000", price: 3, img: "./images/planet13.png" },
    { number: 14, name: "Silicon", symbol: "Si", speed: 0.18, level: 1, gc: "000.000", price: 3, img: "./images/planet14.png" },
    { number: 15, name: "Phosphorus", symbol: "P", speed: 0.19, level: 1, gc: "000.000", price: 3, img: "./images/planet15.png" },
    { number: 16, name: "Sulfur", symbol: "S", speed: 0.20, level: 1, gc: "000.000", price: 3, img: "./images/planet16.png" },
    { number: 17, name: "Chlorine", symbol: "Cl", speed: 0.21, level: 1, gc: "000.000", price: 3, img: "./images/planet17.png" },
    { number: 18, name: "Argon", symbol: "Ar", speed: 0.22, level: 1, gc: "000.000", price: 3, img: "./images/planet18.png" },
    { number: 19, name: "Potassium", symbol: "K", speed: 0.23, level: 1, gc: "000.000", price: 3, img: "./images/planet19.png" },
    { number: 20, name: "Calcium", symbol: "Ca", speed: 0.24, level: 1, gc: "000.000", price: 3, img: "./images/planet20.png" },
    { number: 21, name: "Scandium", symbol: "Sc", speed: 0.25, level: 1, gc: "000.000", price: 3, img: "./images/planet21.png" },
    { number: 22, name: "Titanium", symbol: "Ti", speed: 0.26, level: 1, gc: "000.000", price: 3, img: "./images/planet22.png" },
    { number: 23, name: "Vanadium", symbol: "V", speed: 0.27, level: 1, gc: "000.000", price: 3, img: "./images/planet23.png" },
    { number: 24, name: "Chromium", symbol: "Cr", speed: 0.28, level: 1, gc: "000.000", price: 3, img: "./images/planet24.png" },
    { number: 25, name: "Manganese", symbol: "Mn", speed: 0.29, level: 1, gc: "000.000", price: 3, img: "./images/planet25.png" },
    { number: 26, name: "Iron", symbol: "Fe", speed: 0.30, level: 1, gc: "000.000", price: 3, img: "./images/planet26.png" },
    { number: 27, name: "Cobalt", symbol: "Co", speed: 0.31, level: 1, gc: "000.000", price: 3, img: "./images/planet27.png" },
    { number: 28, name: "Nickel", symbol: "Ni", speed: 0.32, level: 1, gc: "000.000", price: 3, img: "./images/planet28.png" },
    { number: 29, name: "Copper", symbol: "Cu", speed: 0.33, level: 1, gc: "000.000", price: 3, img: "./images/planet29.png" },
    { number: 30, name: "Zinc", symbol: "Zn", speed: 0.34, level: 1, gc: "000.000", price: 3, img: "./images/planet30.png" },
    { number: 31, name: "Gallium", symbol: "Ga", speed: 0.35, level: 1, gc: "000.000", price: 3, img: "./images/planet31.png" },
    { number: 32, name: "Germanium", symbol: "Ge", speed: 0.36, level: 1, gc: "000.000", price: 3, img: "./images/planet32.png" },
    { number: 33, name: "Arsenic", symbol: "As", speed: 0.37, level: 1, gc: "000.000", price: 3, img: "./images/planet33.png" },
    { number: 34, name: "Selenium", symbol: "Se", speed: 0.38, level: 1, gc: "000.000", price: 3, img: "./images/planet34.png" },
    { number: 35, name: "Bromine", symbol: "Br", speed: 0.39, level: 1, gc: "000.000", price: 3, img: "./images/planet35.png" },
    { number: 36, name: "Krypton", symbol: "Kr", speed: 0.40, level: 1, gc: "000.000", price: 3, img: "./images/planet36.png" },
    { number: 37, name: "Rubidium", symbol: "Rb", speed: 0.41, level: 1, gc: "000.000", price: 3, img: "./images/planet37.png" },
    { number: 38, name: "Strontium", symbol: "Sr", speed: 0.42, level: 1, gc: "000.000", price: 3, img: "./images/planet38.png" },
    { number: 39, name: "Yttrium", symbol: "Y", speed: 0.43, level: 1, gc: "000.000", price: 3, img: "./images/planet39.png" },
    { number: 40, name: "Zirconium", symbol: "Zr", speed: 0.44, level: 1, gc: "000.000", price: 3, img: "./images/planet40.png" },
    { number: 41, name: "Niobium", symbol: "Nb", speed: 0.45, level: 1, gc: "000.000", price: 3, img: "./images/planet41.png" },
    { number: 42, name: "Molybdenum", symbol: "Mo", speed: 0.46, level: 1, gc: "000.000", price: 3, img: "./images/planet42.png" },
    { number: 43, name: "Technetium", symbol: "Tc", speed: 0.47, level: 1, gc: "000.000", price: 3, img: "./images/planet43.png" },
    { number: 44, name: "Ruthenium", symbol: "Ru", speed: 0.48, level: 1, gc: "000.000", price: 3, img: "./images/planet44.png" },
    { number: 45, name: "Rhodium", symbol: "Rh", speed: 0.49, level: 1, gc: "000.000", price: 3, img: "./images/planet45.png" },
    { number: 46, name: "Palladium", symbol: "Pd", speed: 0.50, level: 1, gc: "000.000", price: 3, img: "./images/planet46.png" },
    { number: 47, name: "Silver", symbol: "Ag", speed: 0.51, level: 1, gc: "000.000", price: 3, img: "./images/planet47.png" },
    { number: 48, name: "Cadmium", symbol: "Cd", speed: 0.52, level: 1, gc: "000.000", price: 3, img: "./images/planet48.png" },
    { number: 49, name: "Indium", symbol: "In", speed: 0.53, level: 1, gc: "000.000", price: 3, img: "./images/planet49.png" },
    { number: 50, name: "Tin", symbol: "Sn", speed: 0.54, level: 1, gc: "000.000", price: 3, img: "./images/planet50.png" },
    { number: 51, name: "Antimony", symbol: "Sb", speed: 0.55, level: 1, gc: "000.000", price: 3, img: "./images/planet51.png" },
    { number: 52, name: "Tellurium", symbol: "Te", speed: 0.56, level: 1, gc: "000.000", price: 3, img: "./images/planet52.png" },
    { number: 53, name: "Iodine", symbol: "I", speed: 0.57, level: 1, gc: "000.000", price: 3, img: "./images/planet53.png" },
    { number: 54, name: "Xenon", symbol: "Xe", speed: 0.58, level: 1, gc: "000.000", price: 3, img: "./images/planet54.png" },
    { number: 55, name: "Cesium", symbol: "Cs", speed: 0.59, level: 1, gc: "000.000", price: 3, img: "./images/planet55.png" },
    { number: 56, name: "Barium", symbol: "Ba", speed: 0.60, level: 1, gc: "000.000", price: 3, img: "./images/planet56.png" },
    { number: 57, name: "Lanthanum", symbol: "La", speed: 0.61, level: 1, gc: "000.000", price: 3, img: "./images/planet57.png" },
    { number: 58, name: "Cerium", symbol: "Ce", speed: 0.62, level: 1, gc: "000.000", price: 3, img: "./images/planet58.png" },
    { number: 59, name: "Praseodymium", symbol: "Pr", speed: 0.63, level: 1, gc: "000.000", price: 3, img: "./images/planet59.png" },
    { number: 60, name: "Neodymium", symbol: "Nd", speed: 0.64, level: 1, gc: "000.000", price: 3, img: "./images/planet60.png" },
    { number: 61, name: "Promethium", symbol: "Pm", speed: 0.65, level: 1, gc: "000.000", price: 3, img: "./images/planet61.png" },
    { number: 62, name: "Samarium", symbol: "Sm", speed: 0.66, level: 1, gc: "000.000", price: 3, img: "./images/planet62.png" },
    { number: 63, name: "Europium", symbol: "Eu", speed: 0.67, level: 1, gc: "000.000", price: 3, img: "./images/planet63.png" },
    { number: 64, name: "Gadolinium", symbol: "Gd", speed: 0.68, level: 1, gc: "000.000", price: 3, img: "./images/planet64.png" },
    { number: 65, name: "Terbium", symbol: "Tb", speed: 0.69, level: 1, gc: "000.000", price: 3, img: "./images/planet65.png" },
    { number: 66, name: "Dysprosium", symbol: "Dy", speed: 0.70, level: 1, gc: "000.000", price: 3, img: "./images/planet66.png" },
    { number: 67, name: "Holmium", symbol: "Ho", speed: 0.71, level: 1, gc: "000.000", price: 3, img: "./images/planet67.png" },
    { number: 68, name: "Erbium", symbol: "Er", speed: 0.72, level: 1, gc: "000.000", price: 3, img: "./images/planet68.png" },
    { number: 69, name: "Thulium", symbol: "Tm", speed: 0.73, level: 1, gc: "000.000", price: 3, img: "./images/planet69.png" },
    { number: 70, name: "Ytterbium", symbol: "Yb", speed: 0.74, level: 1, gc: "000.000", price: 3, img: "./images/planet70.png" },
    { number: 71, name: "Lutetium", symbol: "Lu", speed: 0.75, level: 1, gc: "000.000", price: 3, img: "./images/planet71.png" },
    { number: 72, name: "Hafnium", symbol: "Hf", speed: 0.76, level: 1, gc: "000.000", price: 3, img: "./images/planet72.png" },
    { number: 73, name: "Tantalum", symbol: "Ta", speed: 0.77, level: 1, gc: "000.000", price: 3, img: "./images/planet73.png" },
    { number: 74, name: "Tungsten", symbol: "W", speed: 0.78, level: 1, gc: "000.000", price: 3, img: "./images/planet74.png" },
    { number: 75, name: "Rhenium", symbol: "Re", speed: 0.79, level: 1, gc: "000.000", price: 3, img: "./images/planet75.png" },
    { number: 76, name: "Osmium", symbol: "Os", speed: 0.80, level: 1, gc: "000.000", price: 3, img: "./images/planet76.png" },
    { number: 77, name: "Iridium", symbol: "Ir", speed: 0.81, level: 1, gc: "000.000", price: 3, img: "./images/planet77.png" },
    { number: 78, name: "Platinum", symbol: "Pt", speed: 0.82, level: 1, gc: "000.000", price: 3, img: "./images/planet78.png" },
    { number: 79, name: "Gold", symbol: "Au", speed: 0.83, level: 1, gc: "000.000", price: 3, img: "./images/planet79.png" },
    { number: 80, name: "Mercury", symbol: "Hg", speed: 0.84, level: 1, gc: "000.000", price: 3, img: "./images/planet80.png" },
    { number: 81, name: "Thallium", symbol: "Tl", speed: 0.85, level: 1, gc: "000.000", price: 3, img: "./images/planet81.png" },
    { number: 82, name: "Lead", symbol: "Pb", speed: 0.86, level: 1, gc: "000.000", price: 3, img: "./images/planet82.png" },
    { number: 83, name: "Bismuth", symbol: "Bi", speed: 0.87, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 84, name: "Polonium", symbol: "Po", speed: 0.88, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 85, name: "Astatine", symbol: "At", speed: 0.89, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 86, name: "Radon", symbol: "Rn", speed: 0.90, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 87, name: "Francium", symbol: "Fr", speed: 0.91, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 88, name: "Radium", symbol: "Ra", speed: 0.92, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 89, name: "Actinium", symbol: "Ac", speed: 0.93, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 90, name: "Thorium", symbol: "Th", speed: 0.94, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 91, name: "Protactinium", symbol: "Pa", speed: 0.95, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 92, name: "Uranium", symbol: "U", speed: 0.96, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 93, name: "Neptunium", symbol: "Np", speed: 0.97, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 94, name: "Plutonium", symbol: "Pu", speed: 0.98, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 95, name: "Americium", symbol: "Am", speed: 0.99, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 96, name: "Curium", symbol: "Cm", speed: 1.00, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 97, name: "Berkelium", symbol: "Bk", speed: 1.01, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 98, name: "Californium", symbol: "Cf", speed: 1.02, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 99, name: "Einsteinium", symbol: "Es", speed: 1.03, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 100, name: "Fermium", symbol: "Fm", speed: 1.04, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 101, name: "Mendelevium", symbol: "Md", speed: 1.05, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 102, name: "Nobelium", symbol: "No", speed: 1.06, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 103, name: "Lawrencium", symbol: "Lr", speed: 1.07, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 104, name: "Rutherfordium", symbol: "Rf", speed: 1.08, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 105, name: "Dubnium", symbol: "Db", speed: 1.09, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 106, name: "Seaborgium", symbol: "Sg", speed: 1.10, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 107, name: "Bohrium", symbol: "Bh", speed: 1.11, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 108, name: "Hassium", symbol: "Hs", speed: 1.12, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 109, name: "Meitnerium", symbol: "Mt", speed: 1.13, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 110, name: "Darmstadtium", symbol: "Ds", speed: 1.14, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 111, name: "Roentgenium", symbol: "Rg", speed: 1.15, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 112, name: "Copernicium", symbol: "Cn", speed: 1.16, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 113, name: "Nihonium", symbol: "Nh", speed: 1.17, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 114, name: "Flerovium", symbol: "Fl", speed: 1.18, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 115, name: "Moscovium", symbol: "Mc", speed: 1.19, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 116, name: "Livermorium", symbol: "Lv", speed: 1.20, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 117, name: "Tennessine", symbol: "Ts", speed: 1.21, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" },
    { number: 118, name: "Oganesson", symbol: "Og", speed: 1.22, level: 1, gc: "000.000", price: 3, img: "./images/planet1.png" }
  ];



const planetsContainer = document.getElementById("planets-container");

planetsData.forEach(planet => {
    const planetHTML = `
        <div class="planets__planet animated-border-container ver1 with_To rotate">
            <div class="animated-border">
                <div class="planet__img">
                    <img src="${planet.img}" alt="">
                </div>
                <div class="planet__information">
                    <h4 class="planet__title">${planet.name} (${planet.symbol}) - Planet #${planet.number}</h4>
                    <p class="planet__lvl">level ${planet.level}</p>
                    <p class="planet__speed">Speed: ${planet.speed} (${planet.symbol})/час</p>
                    <p class="planet__description">The extracted resource is ${planet.name} (${planet.symbol})</p>
                    <p class="planet__gc">${planet.gc} GC</p>
                </div>
                <div class="planet__price">Стоимость апгрейда <span>${planet.price} GC</span></div>
                <div class="planet__row">
                    <button class="btn upgrade">Обновить</button>
                </div>
            </div>
        </div>
    `;
    planetsContainer.innerHTML += planetHTML;
});
