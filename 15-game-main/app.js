//берем кнопку
let newGameButton = document.getElementById('game');

//флаг для определения очередности нажатия кнопки
let newButtonClicked = true;

//событие при клике на кнопку
newGameButton.onclick = start;

//счетчик шагов
let moveCounter = 0;
let gameTime = 0;

updateLeaderboard();

//срабатывает при нажатии на кнопку новой игры
function start() {
    let dif = document.querySelector('[name="game-difficulty"]:checked').value;
    if (newButtonClicked) {
        startGame(dif);
        field.style.display = "block";
        startResults();
        newButtonClicked = false; //меняется значение флага
        newGameButton.innerHTML = "Рестарт";
        difficulty.style.display = "none";
        result.style.display = "block";


    } else {
        window.location.reload(); //перезагрузит страницу
    }
}

function startGame(dif) {
    //ищем field
    const field = document.querySelector('.field');

    //размер ячейки
    const cellSize = 100;
    //складываем инфу о ячейках в массив
    const cells = [];
    //создаем и сортируем массив с числами
    const numbers = [...Array(dif * dif - 1).keys()].sort(() => Math.random() - 0.5);

    for (let i = 0; i <= dif * dif - 2; i++) {
        //создаем тег
        const cell = document.createElement('div');
        const value = numbers[i] + 1;
        cell.className = 'cell';
        //записываем в ячейку значение
        cell.innerHTML = value;

        //позиция в строке
        const left = i % dif;
        //позиция в столбце
        const top = (i - left) / dif;

        //записываем ячейку в массив
        cells.push({
            value: value,
            left: left,
            top: top,
            element: cell
        });

        //сдвигаем координаты
        cell.style.left = `${left * cellSize}px`;
        cell.style.top = `${top * cellSize}px`;

        //добавляем ячейку в поле field
        field.append(cell);

        //при обработчике события срабатывает функция
        cell.addEventListener('click', () => {
            move(i);
        })
    }

    //координаты пустой ячейки
    const empty = {
        value: dif * dif,
        top: dif - 1,
        left: dif - 1,
    }
    //заносим пустую ячейку в массив
    cells.push(empty);


    function move(index) {
        //достаем ячейку
        const cell = cells[index];

        //берем разницу по координате
        const leftDiff = Math.abs(empty.left - cell.left);
        const topDiff = Math.abs(empty.top - cell.top);

        //если разница больше одного, то ячейка не является соседней
        if (leftDiff + topDiff > 1) {
            return;
        }
        moveCounter++;
        //перемещаемся на прошлую ячейку
        cell.element.style.left = `${empty.left * cellSize}px`;
        cell.element.style.top = `${empty.top * cellSize}px`;

        //координаты пустой клетки
        const emptyLeft = empty.left;
        const emptyTop = empty.top;

        //записываем координаты текущей ячейки
        empty.left = cell.left;
        empty.top = cell.top;

        //в ячейку передаем записанные значения
        cell.left = emptyLeft;
        cell.top = emptyTop;

        //метод every проверяет условие для каждого элемента
        const isFinished = cells.every(cell => {
            //проверка на правильную координату
            return cell.value === cell.top * dif + cell.left + 1;
        });

        if (isFinished) {
            endGame();
        }
    }

}


//результаты
function startResults() {
    const moveContainer = document.querySelector('.move-text');
    const timeContainer = document.querySelector('.time-text');
    moveContainer.innerHTML = '' + moveCounter;
    timeContainer.innerHTML = '' + gameTime;
    //обновляем контейнер шагов
    const movesUpdate = setInterval(
        () => {
            moveContainer.innerHTML = '' + moveCounter;
        },
        100);
    //обновляем контейнер времени
    const gameInterval = setInterval(
        () => {
`            timeContainer.innerHTML = '' + ++gameTime;
`        },
        1000);
}


function Message_for_end() {
    alert('You solved the puzzle in '+ gameTime +' seconds and '+ moveCounter + ' moves');
    window.location.reload();

}

function endGame() {
    let playerName = prompt("Игра окончена! Введите ваше имя:");
    if (playerName) {
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name: playerName, time: gameTime, moves: moveCounter });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
    }
    // Message_for_end();
}

function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    let uniqueNames = {};
    leaderboard = leaderboard.filter(function (entry) {
        return uniqueNames.hasOwnProperty(entry.name) ? false : (uniqueNames[entry.name] = true);
    });

    leaderboard.sort((a, b) => a.time - b.time);
    leaderboard = leaderboard.slice(0, 10);

    let leaderboardTable = document.getElementById('leaderboard');
    leaderboardTable.innerHTML = "<tr><th>Имя</th><th>Время</th><th>Количество ходов</th></tr>";
    leaderboard.forEach(entry => {
        let row = leaderboardTable.insertRow(-1);
        let nameCell = row.insertCell(0);
        let timeCell = row.insertCell(1);
        let movesCell = row.insertCell(2);

        nameCell.innerHTML = entry.name;
        timeCell.innerHTML = entry.time;
        movesCell.innerHTML = entry.moves;
    });
}

function clearLeaderboard() {
    localStorage.clear();
    // updateLeaderboard();
}