const board = Array(8).fill(null).map(() => Array(8).fill(null));
let currentPlayer = 'X';
let cannotMoveAlertShown = false;

function createBoard() {
    const table = document.getElementById('board');
    for (let r = 0; r < 8; r++) {
        const row = document.createElement('tr');
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('td');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    resetBoard();
}

function resetBoard() {
    // 盤面のリセット
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            board[r][c] = null;
            const cell = document.querySelector(`td[data-row='${r}'][data-col='${c}']`);
            cell.innerHTML = '';
            cell.style.pointerEvents = 'auto';  // セルを再度有効にする
        }
    }

    // 初期配置
    board[3][3] = 'O';
    board[4][4] = 'O';
    board[3][4] = 'X';
    board[4][3] = 'X';

    // ボードと状態の更新
    updateBoard();
    updateStatus();

    // パスボタンを無効化
    document.getElementById('passButton').disabled = true;

    // 勝者メッセージと再スタートボタンを非表示
    const winnerMessage = document.getElementById('winnerMessage');
    const restartButton = document.getElementById('restartButton');
    winnerMessage.style.display = 'none';
    restartButton.style.display = 'none';
}

function updateBoard() {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.querySelector(`td[data-row='${r}'][data-col='${c}']`);
            cell.innerHTML = '';
            if (board[r][c]) {
                const disk = document.createElement('div');
                disk.className = `${board[r][c]} disk`;
                cell.appendChild(disk);
            }
        }
    }
    checkGameOver();
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (isValidMove(row, col)) {
        makeMove(row, col);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
        updateBoard();
        document.getElementById('passButton').disabled = true;
        cannotMoveAlertShown = false;
    } else {
        alert('その位置には置けません！');
    }
    checkForPass();
}

function isValidMove(row, col) {
    if (board[row][col]) return false;

    return directions.some(([dr, dc]) => {
        let r = row + dr, c = col + dc;
        let foundOpponent = false;

        while (0 <= r && r < 8 && 0 <= c && c < 8) {
            if (board[r][c] === null) break;
            if (board[r][c] === currentPlayer) return foundOpponent;
            foundOpponent = true;
            r += dr;
            c += dc;
        }
        return false;
    });
}

function makeMove(row, col) {
    board[row][col] = currentPlayer;
    directions.forEach(([dr, dc]) => {
        let r = row + dr, c = col + dc;
        let toFlip = [];

        while (0 <= r && r < 8 && 0 <= c && c < 8) {
            if (board[r][c] === null) break;
            if (board[r][c] === currentPlayer) {
                toFlip.forEach(([fr, fc]) => {
                    board[fr][fc] = currentPlayer;
                });
                break;
            }
            toFlip.push([r, c]);
            r += dr;
            c += dc;
        }
    });
}

const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [1, 1], [-1, 1], [1, -1]
];

function updateStatus() {
    const playerText = currentPlayer === 'X' ? '黒の番' : '白の番';
    document.getElementById('status').innerText = playerText;
    checkForPass();
}

document.getElementById('passButton').addEventListener('click', () => {
    alert(`${currentPlayer === 'X' ? '黒' : '白'}のターンをスキップしました。`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
    checkForPass();
});

function checkForPass() {
    if (checkGameOver()) return;  // ゲームが終了していればパス処理をスキップ

    // 現在のプレイヤーが置けない場合
    if (!canMove(currentPlayer)) {
        document.getElementById('passButton').disabled = false;
        alert(`${currentPlayer === 'X' ? '黒' : '白'}は置けません。`);

        // 次のプレイヤーが置けるか確認
        if (!canMove(currentPlayer === 'X' ? 'O' : 'X')) {
            // 両プレイヤーが置けない場合にゲームオーバーを判定
            setTimeout(() => checkGameOver(), 100);  // setTimeoutで遅延させてアラート後にゲームオーバー判定
        } else {
            // もし次のプレイヤーが置ける場合、次のプレイヤーにターンを移す
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();  // 状態を更新
        }
    } else {
        // 現在のプレイヤーが置ける場合は、パスボタンを無効化
        document.getElementById('passButton').disabled = true;
    }
}

document.getElementById('passButton').addEventListener('click', () => {
    alert(`${currentPlayer === 'X' ? '黒' : '白'}のターンをスキップしました。`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // 次のプレイヤーにターンを移す
    updateStatus();  // 状態を更新
    checkForPass();  // パス後に次のプレイヤーが置けるか確認
});


function canMove(player) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(r, c)) {
                return true;
            }
        }
    }
    return false;
}

function checkGameOver() {
    const isFull = board.flat().every(cell => cell !== null);
    const xCount = board.flat().filter(cell => cell === 'X').length;
    const oCount = board.flat().filter(cell => cell === 'O').length;

    // 両プレイヤーが置けない場合やボードが埋まった場合にゲーム終了
    if (isFull || (!canMove('X') && !canMove('O'))) {
        displayWinner(xCount, oCount);
        return true;
    }
    return false;
}

function displayWinner(xCount, oCount) {
    const winnerMessage = document.getElementById('winnerMessage');
    const restartButton = document.getElementById('restartButton');
    const winnerText = document.getElementById('winnerText');
    
    // 勝者の表示
    if (xCount > oCount) {
        winnerText.innerText = '黒 WIN!!';
    } else if (oCount > xCount) {
        winnerText.innerText = '白 WIN!!';
    } else {
        winnerText.innerText = '引き分け！';
    }

    winnerMessage.style.display = 'block';  // 勝者メッセージを表示
    restartButton.style.display = 'block';  // 再スタートボタンを表示

    // 盤面とボタンを無効にする
    document.getElementById('passButton').disabled = true;
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => cell.style.pointerEvents = 'none');  // 盤面のセルを無効にする

    // 再スタートボタンにイベントリスナーを追加
    restartButton.addEventListener('click', () => {
        resetBoard();  // ゲームをリセット
        winnerMessage.style.display = 'none';  // 勝者メッセージを非表示
        restartButton.style.display = 'none';  // 再スタートボタンを非表示
    });
}

createBoard();
