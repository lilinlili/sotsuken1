document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const rankingList = document.getElementById('rankingList'); // ランキング表示用のul要素
    const timerDisplay = document.getElementById('timer'); // タイマー表示用の要素

    const cellSize = 40; // セルのサイズ（ピクセル）
    const maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    // Canvasサイズを迷路のサイズに合わせる
    canvas.width = maze[0].length * cellSize;
    canvas.height = maze.length * cellSize;

    
    let pacman = {
        x: 15 * cellSize,
        y: 14 * cellSize,
        direction: 'right',
        nextDirection: 'right',
        speed: 5, // パックマンの速度を調整
        radius: cellSize / 2 - 1 // パックマンのサイズを調整
    };

    let ghost = {
        x: 1 * cellSize,
        y: 1 * cellSize,
        speed: 5, // ゴーストの速度を調整
        color: 'red',
        direction: 'left'
    };

    let pointsArray = [];
    let points = 0;
    let animationId;
    let gameStartTime; // ゲーム開始時刻
    let gameEndTime; // ゲーム終了時刻
    let rankingTimes = []; // ランキングの時間記録

    // ポイントの初期配置
    function initializePoints() {
        pointsArray = [];
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === 0) {
                    pointsArray.push({ x: col, y: row });
                }
            }
        }
    }

    function drawMaze() {
        context.strokeStyle = 'blue';
        context.lineWidth = cellSize / 10;
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === 1) {
                    context.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    function drawPoints() {
        context.fillStyle = 'white';
        pointsArray.forEach(point => {
            context.beginPath();
            context.arc(point.x * cellSize + cellSize / 2, point.y * cellSize + cellSize / 2, cellSize / 8, 0, Math.PI * 2);
            context.fill();
        });
    }

    function drawPacman() {
        context.save();
        let centerX = pacman.x + cellSize / 2;
        let centerY = pacman.y + cellSize / 2;
        context.translate(centerX, centerY);
        switch (pacman.direction) {
            case 'up':
                context.rotate(Math.PI * 1.5);
                break;
            case 'down':
                context.rotate(Math.PI * 0.5);
                break;
            case 'left':
                context.rotate(Math.PI);
                break;
            default:
                break;
        }
        context.translate(-centerX, -centerY);

        context.fillStyle = 'yellow';
        context.beginPath();
        context.arc(pacman.x + cellSize / 2, pacman.y + cellSize / 2, pacman.radius, Math.PI * 0.25, Math.PI * 1.75);
        context.lineTo(pacman.x + cellSize / 2, pacman.y + cellSize / 2);
        context.fill();
        context.restore();
    }

    function drawGhost() {
        context.fillStyle = ghost.color;
        context.beginPath();
        context.arc(ghost.x + cellSize / 2, ghost.y + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }

    function isWall(x, y) {
        let col = Math.floor(x / cellSize);
        let row = Math.floor(y / cellSize);
        return maze[row] && maze[row][col] === 1;
    }

    function movePacman() {
        let newX = pacman.x;
        let newY = pacman.y;

        switch (pacman.nextDirection) {
            case 'up':
                newY -= pacman.speed;
                break;
            case 'down':
                newY += pacman.speed;
                break;
            case 'left':
                newX -= pacman.speed;
                break;
            case 'right':
                newX += pacman.speed;
                break;
        }

        // 次の方向に壁がなければ、パックマンの方向を変更する
        if (!isWall(newX, newY) && !isWall(newX + cellSize - 1, newY) && !isWall(newX, newY + cellSize - 1) && !isWall(newX + cellSize - 1, newY + cellSize - 1)) {
            pacman.direction = pacman.nextDirection;
        }

        newX = pacman.x;
        newY = pacman.y;

        switch (pacman.direction) {
            case 'up':
                newY -= pacman.speed;
                break;
            case 'down':
                newY += pacman.speed;
                break;
            case 'left':
                newX -= pacman.speed;
                break;
            case 'right':
                newX += pacman.speed;
                break;
        }

        if (!isWall(newX, newY) && !isWall(newX + cellSize - 1, newY) && !isWall(newX, newY + cellSize - 1) && !isWall(newX + cellSize - 1, newY + cellSize - 1)) {
            pacman.x = newX;
            pacman.y = newY;
        }

        // ポイントの回収
        for (let i = 0; i < pointsArray.length; i++) {
            let point = pointsArray[i];
            if (Math.abs(pacman.x - point.x * cellSize) < cellSize / 2 && Math.abs(pacman.y - point.y * cellSize) < cellSize / 2) {
                pointsArray.splice(i, 1);
                points++;
                break;
            }
        }
    }

    function moveGhost() {
        let directions = ['up', 'down', 'left', 'right'];
        let shortestDistance = Infinity;
        let bestDirection = ghost.direction;

        directions.forEach(direction => {
            let newX = ghost.x;
            let newY = ghost.y;

            switch (direction) {
                case 'up':
                    newY -= ghost.speed;
                    break;
                case 'down':
                    newY += ghost.speed;
                    break;
                case 'left':
                    newX -= ghost.speed;
                    break;
                case 'right':
                    newX += ghost.speed;
                    break;
            }

            if (!isWall(newX, newY) && !isWall(newX + cellSize - 1, newY) && !isWall(newX, newY + cellSize - 1) && !isWall(newX + cellSize - 1, newY + cellSize - 1)) {
                let distance = Math.hypot(pacman.x - newX, pacman.y - newY);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    bestDirection = direction;
                }
            }
        });

        ghost.direction = bestDirection;

        let newX = ghost.x;
        let newY = ghost.y;

        switch (ghost.direction) {
            case 'up':
                newY -= ghost.speed;
                break;
            case 'down':
                newY += ghost.speed;
                break;
            case 'left':
                newX -= ghost.speed;
                break;
            case 'right':
                newX += ghost.speed;
                break;
        }

        if (!isWall(newX, newY) && !isWall(newX + cellSize - 1, newY) && !isWall(newX, newY + cellSize - 1) && !isWall(newX + cellSize - 1, newY + cellSize - 1)) {
            ghost.x = newX;
            ghost.y = newY;
        }
    }

    function updateTimer() {
        let elapsedTime = (Date.now() - gameStartTime) / 1000; // 経過時間（秒）
        timerDisplay.textContent = `時間: ${elapsedTime.toFixed(2)} 秒`; // タイマーの表示を更新
    }

    function checkGameOver() {
        let distanceX = Math.abs(pacman.x - ghost.x);
        let distanceY = Math.abs(pacman.y - ghost.y);
        return distanceX < cellSize / 2 && distanceY < cellSize / 2;
    }

    function checkGameClear() {
        return pointsArray.length === 0;
    }

    function drawGameOver() {
        gameOverMessage.innerHTML = 'Game Over';
        gameOverMessage.style.display = 'block';
        gameEndTime = Date.now(); // ゲーム終了時刻を記録
        let elapsedTime = (gameEndTime - gameStartTime) / 1000; // 経過時間（秒）
        addRankingTime(elapsedTime); // ランキングに追加
        displayRanking(); // ランキングを表示
    }

    function drawGameClear() {
        gameOverMessage.innerHTML = 'Game Clear';
        gameOverMessage.style.display = 'block';
        gameEndTime = Date.now(); // ゲーム終了時刻を記録
        let elapsedTime = (gameEndTime - gameStartTime) / 1000; // 経過時間（秒）
        addRankingTime(elapsedTime); // ランキングに追加
        displayRanking(); // ランキングを表示
    }

    function addRankingTime(time) {
        rankingTimes.push(time);
        rankingTimes.sort((a, b) => a - b); // 時間の昇順にソート
        if (rankingTimes.length > 5) {
            rankingTimes.pop(); // ランキングが5件を超える場合、最後のエントリを削除
        }
    }

    function displayRanking() {
        rankingList.innerHTML = ''; // ランキングリストをクリア
        rankingTimes.forEach((time, index) => {
            let listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${time.toFixed(2)}秒`;
            rankingList.appendChild(listItem);
        });
    }

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze();
        drawPoints();
        drawPacman();
        drawGhost();
        movePacman();
        moveGhost();
        updateTimer(); // タイマーを更新

        if (checkGameOver()) {
            cancelAnimationFrame(animationId);
            drawGameOver();
            return;
        }

        if (checkGameClear()) {
            cancelAnimationFrame(animationId);
            drawGameClear();
            return;
        }

        animationId = requestAnimationFrame(gameLoop);
    }

    startButton.addEventListener('click', function () {
        gameStartTime = Date.now(); // ゲーム開始時刻を記録
        startButton.style.display = 'none';
        gameOverMessage.style.display = 'none';
        points = 0;
        initializePoints();
        pacman = {
            x: 15 * cellSize,
            y: 14 * cellSize,
            direction: 'right',
            nextDirection: 'right',
            speed: 5, // パックマンの速度を調整
            radius: cellSize / 2 - 1 // パックマンのサイズを調整
        };

        ghost = {
            x: 1 * cellSize,
            y: 1 * cellSize,
            speed: 5, // ゴーストの速度を調整
            color: 'red',
            direction: 'left'
        };

        gameLoop();
    });
    


    window.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowUp':
                pacman.nextDirection = 'up';
                break;
            case 'ArrowDown':
                pacman.nextDirection = 'down';
                break;
            case 'ArrowLeft':
                pacman.nextDirection = 'left';
                break;
            case 'ArrowRight':
                pacman.nextDirection = 'right';
                break;
        }
    });
});

