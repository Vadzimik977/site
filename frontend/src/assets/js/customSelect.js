export default function customSelect() {
  var x, i, j, l, ll, selElmnt, a, b, c;
  x = document.getElementsByClassName("custom-select");
  l = x.length;
  
  for (i = 0; i < 1; i++) {
    selElmnt = x[i]?.getElementsByTagName("select")[0];
    ll = selElmnt?.length;
  
    // Создаем элемент для отображения выбранного элемента
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
  
    // Добавляем иконку к выбранному элементу
    if(!selElmnt) {
      return;
    }
    const selectedOption = selElmnt?.options[selElmnt.selectedIndex];
    const selectedIcon = selectedOption?.getAttribute("data-icon") || "";
    a.innerHTML = `<img src="${selectedIcon}" alt="" class="select-icon"> ${selectedOption?.innerHTML}`;
    x[i].appendChild(a);
  
    // Создаем контейнер для элементов списка
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
  
    for (j = 0; j < ll; j++) {
      // Создаем каждый элемент списка с его иконкой
      c = document.createElement("DIV");
      const optionIcon = selElmnt.options[j].getAttribute("data-icon") || "";
      c.innerHTML = `<img src="${optionIcon}" alt="" class="select-icon"> ${selElmnt.options[j].innerHTML}`;
      
      // Добавляем обработчик события клика
      c.addEventListener("click", function(e) {
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
  
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.textContent.trim()) {
              s.selectedIndex = i;
              const selectedOption = s.options[i];
              const selectedIcon = selectedOption.getAttribute("data-icon") || "";
              h.innerHTML = `<img src="${selectedIcon}" alt="" class="select-icon"> ${selectedOption.innerHTML}`;
  
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
  
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
      });
  
      b.appendChild(c);
    }
  
    x[i].appendChild(b);
    
    // Добавляем обработчик события клика для открытия/закрытия списка
    a.addEventListener("click", function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
  }
  
  // Закрытие всех открытых селектов при клике вне них
  function closeAllSelect(elmnt) {
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
  
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
  
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  
  document.addEventListener("click", closeAllSelect);
  
}
