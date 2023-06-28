document.addEventListener("DOMContentLoaded", function () {
    let sec = 0;
    let minutes = 0;
    let hours = 0;
    let t;
    //Переменная для определения времени старта таймера 
    let f = false;
    let timeTxt = this.getElementById("timer_txt");

    function tick() {
        sec++;
        if (sec == 60) {
            minutes++;
            sec = 0;
            if (minutes == 60) {
                hours++;
                minutes = 0;
            }
        }

    }

    //Функция для старта таймера
    function timeStart() {
        if (!f) {
            f = true;
            timer();
        }
        else {
            return;
        }

    }
    //Функция для подсчёта времени и вставки времени в html
    function timer() {
        tick();
        /* вставляем время в html */
        timeTxt.textContent =
            (hours > 9 ? hours : "0" + hours) + ":" +
            (minutes > 9 ? minutes : "0" + minutes) + ":" +
            (sec > 9 ? sec : "0" + sec);

        repeatTime();
    }
    //Функция для повторения подсчёта каждую секунду времени
    function repeatTime() {
        t = setTimeout(timer, 1000);
    }

    // Находим все пазлы по классу puzzle
    let puzzles = document.querySelectorAll(".puzzle");
    for (let i = 0; i < puzzles.length; i++) {
        puzzles[i].setAttribute("draggable", "true");
    }
    // Находим все блоки по классу block
    let blocks = document.querySelectorAll("[id^='block-']");
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].classList.add("block");
    }
    // Объявляем переменную для хранения перетаскиваемого элемента
    let dragged;

    // Для каждого пазла добавляем обработчик события dragstart
    // Это событие срабатывает, когда начинается перетаскивание элемента

    puzzles.forEach(function (puzzle) {

        puzzle.addEventListener("dragstart", function (event) {
            // Сохраняем ссылку на перетаскиваемый элемент в переменную
            dragged = event.target;
            // Меняем прозрачность элемента на 50%
            event.target.style.opacity = "0.5";
            timeStart();

        });
    });

    // Для каждого пазла добавляем обработчик события dragend
    // Это событие срабатывает, когда заканчивается перетаскивание элемента
    puzzles.forEach(function (puzzle) {
        puzzle.addEventListener("dragend", function (event) {
            // Возвращаем прозрачность элемента на 100%
            event.target.style.opacity = "1";
            // Удаляем класс highlight со всех блоков
            blocks.forEach(function (block) {
                block.classList.remove("highlight");
            });
        });
    });

    // Для каждого блока добавляем обработчик события dragover
    // Это событие срабатывает, когда перетаскиваемый элемент находится над целевым элементом
    blocks.forEach(function (block) {
        block.addEventListener("dragover", function (event) {
            // Отменяем действие по умолчанию, чтобы разрешить перетаскивание
            event.preventDefault();
            // Добавляем класс highlight для подсветки целевого элемента
            event.target.classList.add("highlight");
        });
    });
    // Для каждого блока добавляем обработчик события dragleave
    // Это событие срабатывает, когда перетаскиваемый элемент покидает область элемента
    blocks.forEach(function (block) {
        block.addEventListener("dragleave", function (event) {
            // Отменяем действие по умолчанию, чтобы разрешить перетаскивание
            event.preventDefault();
            // Убираем класс highlight для подсветки целевого элемента
            event.target.classList.remove("highlight");


        });
    });


    // Для каждого блока добавляем обработчик события drop
    // Это событие срабатывает, когда перетаскиваемый элемент отпускается над целевым элементом
    blocks.forEach(function (block) {
        block.addEventListener("drop", function (event) {
            // Отменяем действие по умолчанию, чтобы разрешить перетаскивание
            event.preventDefault();
            // Удаляем класс highlight с целевого элемента
            event.target.classList.remove("highlight");
            // Если целевой элемент не равен перетаскиваемому элементу и не содержит его
            if (event.target !== dragged && !event.target.contains(dragged)) {
                // Находим родительский элемент перетаскиваемого элемента
                let parent = dragged.parentNode;
                // Удаляем перетаскиваемый элемент из его родительского элемента
                parent.removeChild(dragged);
                // Если целевой элемент является блоком
                if (event.target.classList.contains("block")) {
                    // Добавляем перетаскиваемый элемент в целевой элемент
                    event.target.appendChild(dragged);
                    /*  event.target.classList.add("put"); */
                } else {
                    // Иначе, если целевой элемент является пазлом
                    if (event.target.classList.contains("puzzle")) {
                        // Находим родительский элемент целевого элемента
                        let targetParent = event.target.parentNode;
                        // Удаляем целевой элемент из его родительского элемента
                        targetParent.removeChild(event.target);
                        // Добавляем целевой элемент в родительский элемент перетаскиваемого элемента
                        parent.appendChild(event.target);
                        // Добавляем перетаскиваемый элемент в родительский элемент целевого элемента
                        targetParent.appendChild(dragged);
                    }
                }
            }
        });
    });
    
})