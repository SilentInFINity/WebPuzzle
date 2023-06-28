document.addEventListener("DOMContentLoaded", function () {
    let sec = 0;
    let minutes = 0;
    let hours = 0;
    //Переменная для определения времени старта таймера 
    let f = false;
    //Переменная для определения времени остановки таймера
    let f2 = false;
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
        if (!f2) {
            setTimeout(timer, 1000);
        }
        else {
            return;
        }
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
            check();
        });
    });

    let check_divs = document.getElementById("div-puzzles");
    let count_divs;
    //Функция для проверки готовности пазла 
    function check() {
        count_divs = check_divs.getElementsByTagName("div").length;
        if (count_divs == 0) {
            //Заканчиваем счёт времени
            f2 = true;
            for (let i = 0; i < puzzles.length; i++) {
                puzzles[i].setAttribute("draggable", "false");
            }
            //Проверяем ответы
            checkAnswers();
        }
    }
    let block_1;
    let count_ans = 0;
    block_1 = document.getElementById("block-1");
    //Массив правильных позиций пазлов по отношению к блокам
    let answers = [14, 36, 9, 10, 31, 18, 3, 29, 22, 33, 5, 26, 24, 25, 13, 17, 28, 32, 6, 21, 8, 1, 34, 20, 16, 7, 19, 2, 30, 12, 11, 15, 23, 27, 35, 4];
    for (let i = 0; i < answers.length; i++) {
        answers[i]--;
    }

    function checkAnswers() {
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].offsetTop == (puzzles[answers[i]].offsetTop) && blocks[i].offsetLeft == (puzzles[answers[i]].offsetLeft)) {
                count_ans++;
            }
        }
        let percent = count_ans / 36 * 100;
        percent = Math.round(percent);
        alert("Привильных ответов: " + count_ans + ` из 36 (${percent}%)\n` + "Время выполнения: " + timeTxt.textContent);
    }

})