const board = document.getElementById('board');
const cardValues = [
    { value: '2', suit: '♠' }, { value: '2', suit: '♥' }, { value: '2', suit: '♣' }, { value: '2', suit: '♦' },
    { value: '3', suit: '♠' }, { value: '3', suit: '♥' }, { value: '3', suit: '♣' }, { value: '3', suit: '♦' },
    { value: '4', suit: '♠' }, { value: '4', suit: '♥' }, { value: '4', suit: '♣' }, { value: '4', suit: '♦' },
    { value: '5', suit: '♠' }, { value: '5', suit: '♥' }, { value: '5', suit: '♣' }, { value: '5', suit: '♦' },
    { value: '6', suit: '♠' }, { value: '6', suit: '♥' }, { value: '6', suit: '♣' }, { value: '6', suit: '♦' },
    { value: '7', suit: '♠' }, { value: '7', suit: '♥' }, { value: '7', suit: '♣' }, { value: '7', suit: '♦' },
    { value: '8', suit: '♠' }, { value: '8', suit: '♥' }, { value: '8', suit: '♣' }, { value: '8', suit: '♦' },
    { value: '9', suit: '♠' }, { value: '9', suit: '♥' }, { value: '9', suit: '♣' }, { value: '9', suit: '♦' },
    { value: '10', suit: '♠' }, { value: '10', suit: '♥' }, { value: '10', suit: '♣' }, { value: '10', suit: '♦' },
    { value: 'J', suit: '♠' }, { value: 'J', suit: '♥' }, { value: 'J', suit: '♣' }, { value: 'J', suit: '♦' },
    { value: 'Q', suit: '♠' }, { value: 'Q', suit: '♥' }, { value: 'Q', suit: '♣' }, { value: 'Q', suit: '♦' },
    { value: 'K', suit: '♠' }, { value: 'K', suit: '♥' }, { value: 'K', suit: '♣' }, { value: 'K', suit: '♦' },
    { value: 'A', suit: '♠' }, { value: 'A', suit: '♥' }, { value: 'A', suit: '♣' }, { value: 'A', suit: '♦' }
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let playerScores = [];
let currentPlayer = 0;  // 現在のプレイヤーのインデックス
let totalPlayers = 2; // デフォルトで2人
let playerColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'];  // プレイヤーごとの色を設定


// ターン表示用の要素を作成
const turnDisplay = document.createElement('div');
turnDisplay.classList.add('turn');
document.body.appendChild(turnDisplay);

let backButton; // 戻るボタンの参照

// プレイヤー数選択インターフェースの作成
function createPlayerSelection() {
    const selectionDiv = document.createElement('div');
    selectionDiv.classList.add('player-selection');
    
    const label = document.createElement('label');
    label.textContent = 'プレイヤー数を選んでください (2〜4): ';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 2;
    input.max = 4;
    input.value = totalPlayers;

    const startButton = document.createElement('button');
    startButton.textContent = 'ゲーム開始';
    startButton.addEventListener('click', startGame);

    selectionDiv.appendChild(label);
    selectionDiv.appendChild(input);
    selectionDiv.appendChild(startButton);

    // プレイヤー数選択画面を追加
    document.body.appendChild(selectionDiv);

    // プレイヤー数変更時の処理
    input.addEventListener('change', function () {
        totalPlayers = parseInt(input.value);
        if (totalPlayers < 2 || totalPlayers > 4) {
            input.value = totalPlayers;
        }
    });

    // プレイヤー選択画面を中央に配置
    document.body.style.display = 'flex';  
    document.body.style.flexDirection = 'column';  
    document.body.style.justifyContent = 'center';  
    document.body.style.alignItems = 'center';  
    document.body.style.height = '100vh';  

    selectionDiv.style.textAlign = 'center';  
    selectionDiv.style.padding = '20px';  
    selectionDiv.style.border = '2px solid #333';  
    selectionDiv.style.backgroundColor = '#f9f9f9';  
    selectionDiv.style.borderRadius = '10px';  
    selectionDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';  
}

function startGame() {
    alert(`${totalPlayers}人でゲームを開始します！`);
}

// ゲーム開始
function startGame() {
    totalPlayers = parseInt(document.querySelector('.player-selection input').value);
    playerScores = new Array(totalPlayers).fill(0);  // プレイヤー数に応じてスコアをリセット
    currentPlayer = 0;  // ゲーム開始時のターンを最初のプレイヤーに
    document.querySelector('.player-selection').remove();  // プレイヤー数選択画面を非表示

    // ゲーム開始時にタイトルを非表示にする
    const title = document.querySelector('h1');
    if (title) {
        title.style.display = 'none';  // タイトルを非表示にする
    }

    createBoard();
    updateTurnDisplay();
    createBackToPlayerSelectionButton();  // ゲーム中に戻るボタンを表示
}

// 戻るボタンを作成
function createBackToPlayerSelectionButton() {
    // ボタンがすでに存在しない場合にのみ作成
    if (!backButton) {
        backButton = document.createElement('button');
        backButton.textContent = 'プレイヤー数選択に戻る';

        // クラスを追加
        backButton.classList.add('player-selection-backbutton');

        backButton.addEventListener('click', restartGame);

        document.body.appendChild(backButton);
    }
}


// ゲームをリスタートしてプレイヤー数選択に戻る
function restartGame() {
    // 戻るボタンを削除
    if (backButton) {
        backButton.remove();
        backButton = null; // ボタンの参照をリセット
    }

    // 現在のボードやターンをリセット
    board.innerHTML = '';
    playerScores = [];
    currentPlayer = 0;
    matches = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    cards = [];
    document.querySelector('.turn').textContent = '';

    // プレイヤー数選択画面を再表示
    createPlayerSelection();
    // タイトルを再表示
    const title = document.querySelector('h1');
    if (title) {
        title.style.display = 'block';  // タイトルを再表示
    }
}

// カードのシャッフル
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // シャッフル
    }
}

// ボードを作成
function createBoard() {
    //shuffle(cardValues);  // シャッフルしない

    cardValues.forEach((cardData, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardData.value;
        card.dataset.suit = cardData.suit;

        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = `${cardData.value} ${cardData.suit}`;
        front.dataset.suit = cardData.suit;

        const back = document.createElement('div');
        back.classList.add('back');
        
        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', flipCard);
        board.appendChild(card);
        cards.push(card);
    });
}

// カードをめくる
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');  // flipped クラスを追加

    // めくられたカードにプレイヤーの色を設定
    this.style.border = `2px solid ${playerColors[currentPlayer]}`;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

// 一致を確認
function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        playerScores[currentPlayer]++;  // 一致した場合、現在のプレイヤーのスコアを増加
        matches++;

        // スコア更新
        updateTurnDisplay();

        // 一致したカードを無効化
        disableCards();

        if (matches === cardValues.length / 2) {
            setTimeout(() => {
                displayWinner(getWinner());  // ゲーム終了時に勝者を表示
            }, 500);
        }
    } else {
        // 一致しなかったカードを元に戻す
        unflipCards();
    }
}

// 一致したカードを無効化
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // 一致したカードは赤枠を外す
    firstCard.style.border = '1px solid black';
    secondCard.style.border = '1px solid black';

    // 一致したカードを無効化
    setTimeout(() => {
        [firstCard, secondCard, lockBoard] = [null, null, false]; // 状態をリセットしてカード選択を継続
        updateTurnDisplay();  // ターン表示を更新
    }, 500); // 少し遅延を入れて処理を実行
}

// 一致しなかったカードを元に戻す
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        
        // 一致しなかった場合、赤枠を外す
        firstCard.style.border = '';
        secondCard.style.border = '';

        resetBoard(); // 一致しなかった場合、ターンを次のプレイヤーに移行
    }, 1000);
} 

// ボードのリセット（ターン移行時に使用）
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];  // カードの状態をリセット
    currentPlayer = (currentPlayer + 1) % totalPlayers;  // 次のプレイヤーに移行
    updateTurnDisplay();  // ターン表示を更新
}

// 現在のターン表示を更新
function updateTurnDisplay() {
    // プレイヤーごとのスコアを横並びで表示
    let scoreDisplay = playerScores.map((score, index) => {
        return `<span style="color: ${playerColors[index]};">プレイヤー ${index + 1}: ${score} ポイント</span>`;
    }).join(' | ');  // ' | ' で区切って横並びにする

    // プレイヤーのターン部分に枠と背景を追加
    turnDisplay.innerHTML = ` 
        <div style="font-size: 24px; font-weight: bold; color: #333; margin-top: 20px;">
            <span style="color: ${playerColors[currentPlayer]}; 
                        border: 2px solid ${playerColors[currentPlayer]}; 
                        padding: 5px; 
                        border-radius: 5px; 
                        background-color: white;">
                プレイヤー ${currentPlayer + 1} のターン
            </span>
        </div>
        <div style="font-size: 18px; font-weight: normal; color: #333; margin-top: 10px;">
            ${scoreDisplay}  <!-- 横並びのスコア表示 -->
        </div>
    `;
}


// ゲームクリア時の勝者表示用のdivを作成
function displayWinner(winners) {
    // すでに表示されているゲームクリアメッセージを削除
    const existingWinnerDiv = document.querySelector('.winner-message');
    if (existingWinnerDiv) {
        existingWinnerDiv.remove();
    }

    const winnerDiv = document.createElement('div');
    winnerDiv.classList.add('winner-message');

    // 勝者が一人だけの場合
    if (winners.length === 1) {
        winnerDiv.innerHTML = `ゲームクリア！<br><span class="winner-single" style="color: ${playerColors[winners[0]]};">プレイヤー ${winners[0] + 1} が勝ち！</span>`;
    } else {
        // 引き分けの場合
        let winnerNames = winners.map(index => `<span class="winner-tie" style="color: ${playerColors[index]};">プレイヤー ${index + 1}</span>`).join(' と ');
        winnerDiv.innerHTML = `ゲームクリア！<br><span class="winner-tie">引き分け！ ${winnerNames}</span>`;
    }
    
    // タイトルへ戻るボタンの作成
    const backToTitleButton = document.createElement('button');
    backToTitleButton.textContent = 'タイトルへ戻る';
    backToTitleButton.classList.add('back-to-title-button');
    
    // ボタンとメッセージをまとめて表示
    winnerDiv.appendChild(backToTitleButton);
    document.body.appendChild(winnerDiv);
    
    // ボタンをクリックした時の動作
    backToTitleButton.addEventListener('click', function() {
        restartGame();  // ゲームをリスタート
    });
}


// ゲームをリスタートしてプレイヤー数選択に戻る
function restartGame() {
    // ゲームクリアのメッセージを削除
    const existingWinnerDiv = document.querySelector('.winner-message');
    if (existingWinnerDiv) {
        existingWinnerDiv.remove();  // ゲームクリアメッセージを削除
    }

    // 戻るボタンを削除
    if (backButton) {
        backButton.remove();
        backButton = null; // ボタンの参照をリセット
    }

    // 現在のボードやターンをリセット
    board.innerHTML = '';
    playerScores = [];
    currentPlayer = 0;
    matches = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    cards = [];
    document.querySelector('.turn').textContent = '';

    // プレイヤー数選択画面を再表示
    createPlayerSelection();
    // タイトルを再表示
    const title = document.querySelector('h1');
    if (title) {
        title.style.display = 'block';  // タイトルを再表示
    }
}

// 勝者の決定（引き分け対応）
function getWinner() {
    const maxScore = Math.max(...playerScores);
    const winners = playerScores
        .map((score, index) => score === maxScore ? index : null)
        .filter(index => index !== null);  // 最大スコアを持つプレイヤーのインデックスのリスト

    return winners;  // 引き分けの場合は複数のインデックスが返る
}

// プレイヤー選択画面の表示
createPlayerSelection(); 
