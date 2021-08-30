import "./css/app.css";

(function () {
    //Функция создаёт дерево опций из переданного селекта, 
    //работает также для многоуровневого селекта(уровни указывать в атрибутах data-level).
    function createOptionsTree(select) {
        const selectArr = [];
        for (let option of select.options) {
            let obj = {
                text: option.text,
                childList: [],
                value: option.value
            };
            if (!option.dataset.level) {
                selectArr.push(obj);
            }
            else if (selectArr.length > 0) {
                const parent = getNthParent(selectArr[selectArr.length - 1], parseInt(option.dataset.level));
                parent.childList.push(obj);
            }
        }
        return selectArr;
    }

    // Вспомогательная функция. Нужна при использовании многоуровневого селекта. 
    // Определяет родительский элемент для добавления вложенных опций.
    function getNthParent(option, level) {
        let resultOption = option;
        --level;
        while (--level) {
            let childList = resultOption.childList;
            resultOption = childList[childList.length - 1];
        }
        return resultOption;
    }

    // Создаём список на основе ранее подготовленного из селекта массива данных.
    // Для многоуровневых селектов используется рекурсия.
    function createTreeDom(arr) {

        let ul = document.createElement('ul');

        for (let option of arr) {
            let li = document.createElement('li');
            li.classList.add("selectWindow__list-item");
            li.insertAdjacentHTML("afterbegin", `<label class="checkbox">
                                                  <input value="${option.value}" type="checkbox" class="checkbox__input">
                                                  <div class="checkbox__state">
                                                      <div class="checkbox__control">
                                                          <svg class="checkbox__icon" width="13" height="13" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                              <path d="M1.71484 7.92681L5.60056 10.9913L10.4577 3.33011" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                                                          </svg>    
                                                      </div>
                                                  </div>
                                                  <span class="checkbox__legend selectWindow__list-item-text">
                                                  ${option.text}
                                                </span>
                                              </label>`
            );
            if (option.childList.length > 0) {
                let childrenUl = createTreeDom(option.childList);
                if (childrenUl) {
                    li.append(childrenUl);
                }
            }
            ul.classList.add('selectWindow__sublist');
            ul.append(li);
        }
        return ul;
    }

    // Отрисовываем DOM
    function createDOM() {

        // Для каждого мультиселекта на странице...
        let multiSelects = document.querySelectorAll('.multiSelect');
        for (let multiSelect of multiSelects) {

            // Передаём мультиселект для подготовки дерева опций.
            let finalArr = createOptionsTree(multiSelect);

            // Создаём контейнер.
            let container = document.createElement('div');
            container.classList.add("container");
            document.body.append(container);
            container.append(multiSelect);

            // Название нашего селекта.
            let headerTitle = document.createElement('p');
            headerTitle.classList.add("header__title");
            headerTitle.textContent = "Выбор мультфильмов";

            // Кнопку "Показать выбранное".
            let showSelected = document.createElement("button");
            showSelected.setAttribute("type", "button");
            showSelected.classList.add("header__button_showSelected");
            let closestSelect = container.querySelector(".multiSelect");
            showSelected.textContent = `Показать выбранное (${getSelectValues(closestSelect).length})`;

            // Хедер.
            let header = document.createElement("div");
            header.classList.add("header");
            header.append(headerTitle);
            header.append(showSelected);
            container.append(header);

            // Создаём поле индикации выбора.
            let selectField = document.createElement("div");
            selectField.classList.add("selectField");
            selectField.textContent = "Пока ничего не выбрано";
            container.append(selectField);

            // Окно выбора опций.
            let selectWindow = document.createElement("div");
            selectWindow.classList.add("selectWindow");

            let selectHeader = document.createElement("div");
            selectHeader.classList.add("selectWindow__header");
            selectWindow.append(selectHeader);

            // Название окна выбора опций.
            let selectTitle = document.createElement("div");
            selectTitle.classList.add("selectWindow__title");
            selectTitle.innerHTML = `<svg class="selectWindow__back-arrow" width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 2.68524L3 11.8787M3 11.8787L10 21.0721M3 11.8787H18" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                                  </svg>
                              <p>Выбор мультфильмов</p>`;
            selectHeader.append(selectTitle);

            // Поле поиска.
            let searchField = document.createElement("input");
            searchField.classList.add("selectWindow__searchField");
            searchField.setAttribute("type", "text");
            selectHeader.append(searchField);

            // Создаём DOM на основе дерева опций, добавляем его в окно выбора опций.
            selectWindow.append(createTreeDom(finalArr));

            // Кнопка "Применить".
            let applyButton = document.createElement("button");
            applyButton.setAttribute("type", "button");
            applyButton.classList.add("selectWindow__apply-button");
            let applyButtonText = document.createElement("span");
            applyButtonText.textContent = "Применить";
            applyButtonText.classList.add("selectWindow__apply-button-text");
            applyButton.append(applyButtonText);

            // Кнопка "Очистить".
            let clearButton = document.createElement("button");
            clearButton.setAttribute("type", "button");
            clearButton.classList.add("selectWindow__clear-button");
            clearButton.textContent = "Очистить";

            // Контейнер для кнопок "Применить" и "Очистить".
            let buttonsWrapper = document.createElement("div");
            buttonsWrapper.classList.add("selectWindow__buttons-wrapper");
            selectWindow.append(buttonsWrapper);

            buttonsWrapper.append(applyButton);
            buttonsWrapper.append(clearButton);

            container.append(selectWindow);

            // Правим классы основного списка для корректной работы кода.
            let uls = selectWindow.querySelectorAll('ul');
            uls[0].classList.remove('selectWindow__sublist');
            uls[0].classList.add('selectWindow__list');
        }
    }
    createDOM();

    // Добавляем стрелочки в многоуровневые опции.
    function addArrows() {
        let liTexts = document.querySelectorAll(".selectWindow__list-item");
        for (let li of liTexts) {
            if (li.closest(".selectWindow__list-item").querySelector(".selectWindow__sublist")) {
                li.insertAdjacentHTML("afterbegin", `<svg class="selectWindow__arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M3 5L5.92468 8L9 5" stroke="black" stroke-linejoin="round"/>
                                                </svg>`);
            }
        }
    }
    addArrows();

    // Добавляем обработчики событий на элементы.
    function addListeners() {
        let containers = document.querySelectorAll(".container");
        for (let container of containers) {

            let showSelected = container.querySelector(".header__button_showSelected");
            showSelected.addEventListener("click", openList1);

            let selectField = container.querySelector(".selectField");
            selectField.addEventListener("click", openList2);

            let backArrow = container.querySelector(".selectWindow__back-arrow");
            backArrow.addEventListener("click", goBack);

            let applyButton = container.querySelector(".selectWindow__apply-button");
            applyButton.addEventListener("click", handleApply);

            let checkItems = container.querySelectorAll(".checkbox__input");
            for (let item of checkItems) {
                item.addEventListener("change", checkSelects);
            }

            let clearButton = container.querySelector(".selectWindow__clear-button");
            clearButton.addEventListener("click", clearChecks);

            let multiSelect = container.querySelector('.multiSelect');
            multiSelect.addEventListener("change", onSelectChange);

            let listItems = container.querySelectorAll(".selectWindow__list-item-text");
            for (let item of listItems) {
                item.addEventListener("click", handleSub);
            }
            let arrows = container.querySelectorAll(".selectWindow__arrow");
            for (let arrow of arrows) {
                arrow.addEventListener("click", handleSub);
            }

            let checks = container.querySelectorAll(".checkbox");
            for (let check of checks) {
                check.addEventListener("click", handleCheck);
            }
        }
    }
    addListeners();

    // Функция отвечает за открытие вложенных опций. 
    function handleSub(e) {
        let sub = e.currentTarget.closest(".selectWindow__list-item").querySelector(".selectWindow__sublist");
        e.stopPropagation();
        if (e.target.classList.contains("checkbox")) return
        if (sub) {
            sub.classList.toggle("visible");

            if (sub.classList.contains("visible")) {
                e.currentTarget.closest(".selectWindow__list-item").querySelector(".selectWindow__arrow").innerHTML = `<svg class="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8L5.92468 5L9 8" stroke="black" stroke-linejoin="round"/>
            </svg>`;
            } else {
                e.currentTarget.closest(".selectWindow__list-item").querySelector(".selectWindow__arrow").innerHTML = `<svg class="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5L5.92468 8L9 5" stroke="black" stroke-linejoin="round"/>
            </svg>`;
            }
        }
    }

    // Функция-обработчик выбора опций путём клика в чекбоксах.
    function handleCheck(e) {
        let targetCheck = e.target.closest(".checkbox").querySelector(".checkbox__input");
        let otherChecks = targetCheck.closest(".selectWindow__list-item").querySelectorAll(".checkbox__input");
        targetCheck.checked = !targetCheck.checked;
        for (let item of otherChecks) {
            if (targetCheck.checked) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        }
    }

    // Обработчик клика по кнопке "Показать выбранное". Открывает окно выбора опций.
    function openList1(e) {
        document.querySelectorAll(".selectWindow_visible").forEach((elem) => elem.classList.remove("selectWindow_visible"));
        e.target.closest(".container").querySelector(".selectWindow").classList.toggle("selectWindow_visible");
    }

    // Обработчик клика по полю индикации выбора. Открывает окно выбора опций.
    function openList2(e) {
        document.querySelectorAll(".selectWindow_visible").forEach((elem) => elem.classList.remove("selectWindow_visible"));
        e.target.parentNode.querySelector(".selectWindow").classList.toggle("selectWindow_visible");
    }

    // Возвращение из окна выбора опций при нажатии стрелочки "назад".
    function goBack(e) {
        e.target.closest(".selectWindow").classList.remove("selectWindow_visible");
    }

    // Обработка клика по кнопке "Применить".
    function handleApply(event) {
        let closestContainer = event.target.closest(".container");
        let allChecks = closestContainer.querySelectorAll(".checkbox__input");
        let storeChecked = [];
        for (let check of allChecks) {
            if (check.checked == true) {
                storeChecked.push(check);
            }
            else continue
        }
        let fieldSelect = closestContainer.querySelector(".selectField");
        if (storeChecked.length > 0) {
            let firstCheckText = storeChecked[0].closest(".selectWindow__list-item").querySelector(".selectWindow__list-item-text").textContent;
            fieldSelect.textContent = firstCheckText;
            fieldSelect.classList.add("selectField_some-selected");
        } else {
            fieldSelect.textContent = "Пока ничего не выбрано";
            fieldSelect.classList.remove("selectField_some-selected");
        }

        let showSelected = closestContainer.querySelector(".header__button_showSelected");
        showSelected.textContent = `Показать выбранное (${storeChecked.length})`;

        closestContainer.querySelector(".selectWindow").classList.remove("selectWindow_visible");
        checkSelects();
    }

    // Стилизация выбранных опций.
    function checkSelects() {
        let containers = document.querySelectorAll(".container");
        for (let container of containers) {
            let listItems = container.querySelectorAll(".selectWindow__list-item");
            for (let item of listItems) {
                if (item.querySelector(".checkbox__input").checked == true) {
                    item.style.background = "linear-gradient(0deg, rgba(3, 91, 119, 0.05), rgba(3, 91, 119, 0.05)), #FFFFFF";
                } else {
                    item.style.background = "transparent";
                    // listItems[0].querySelector(".checkbox__input").checked = false;
                }
            }
        }
    }

    // Сброс всех выбранных опций в контейнере.
    function clearChecks(event) {
        let container = event.target.closest(".container");
        let clearButton = container.querySelector(".selectWindow__clear-button");
        let allCheckInputs = clearButton.closest(".selectWindow").querySelectorAll(".checkbox__input");
        for (let item of allCheckInputs) {
            item.checked = false;
        }
    }

    // Получение опций с атрибутом "selected" из переданного селекта.
    function getSelectValues(select) {
        let result = [];
        let options = select && select.options;
        let opt;

        for (let i = 0; i < options.length; i++) {
            opt = options[i];
            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return result;
    }

    // Обработчик изменений в селекте.
    function onSelectChange(event) {
        if (event.target == document) {
            let containers = document.querySelectorAll(".container");
            for (let container of containers) {
                processSelectChange(container);
            }
        } else {
            let container = event.target.closest(".container");
            processSelectChange(container)
        }

        function processSelectChange(container) {
            let multiSelect = container.querySelector('.multiSelect');
            let allSelected = getSelectValues(multiSelect);

            let inputs = container.querySelectorAll(".checkbox__input");
            for (let input of inputs) {
                if (allSelected.includes(input.value)) {
                    input.checked = true;
                } else {
                    input.checked = false;
                }
            }

            let click = new Event("click");
            let applyButton = container.querySelector(".selectWindow__apply-button");
            applyButton.dispatchEvent(click);
        }
    }

    // При загрузке страницы будут проверены атрибуты "selected" для их незамедлительной отрисовки в UI.
    window.onload = onSelectChange;

})();
