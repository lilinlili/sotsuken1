// 要素を取得
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start-btn");
const submitButton = document.getElementById("submit");
const resetButton = document.getElementById("reset");
const inputField = document.getElementById("number");
const result = document.getElementById("result");
const quitButton = document.querySelector("#quit");

let randomNumber = Math.floor(Math.random() * 100) + 1; // 1〜100のランダムな数字
let attemptCount = 0; // 試行回数をカウントする変数

// ゲームを開始する関数
function startGame() {
  // スタート画面を非表示、ゲーム画面を表示
  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  // ゲーム画面の初期設定
  inputField.disabled = false; // 入力フィールドを有効化
  submitButton.disabled = false; // 送信ボタンを有効化
  resetButton.style.display = "inline-block"; // リセットボタンを表示
  result.textContent = "ゲーム開始！1から100の数字を入力してください。";
  inputField.focus();
}

// ユーザーの答えをチェックする関数
function checkAnswer() {
  const userAnswer = Number(inputField.value); // ユーザーの入力値を取得

  // 入力値が無効な場合
  if (isNaN(userAnswer) || userAnswer < 1 || userAnswer > 100) {
    result.textContent = "1から100までの数字を入力してください。";
    inputField.value = ""; // 入力欄を空にする
    inputField.focus(); // 入力欄にフォーカスを戻す
    return;
  }

  let message;
  attemptCount++; // 試行回数をカウントアップ

  if (userAnswer === randomNumber) {
    // 正解の場合
    message = `正解です！あなたは ${attemptCount} 回目で正解しました。`;
    inputField.disabled = true; // 入力フィールドを無効化
    submitButton.disabled = true; // 送信ボタンを無効化
  } else {
    // 不正解の場合
    message = "違います。";
    if (userAnswer > randomNumber) {
      message += `${userAnswer} より小さい数字です。`; // ヒント: 小さい数字
    } else {
      message += `${userAnswer} より大きい数字です。`; // ヒント: 大きい数字
    }
    inputField.value = ""; // 入力欄を空にする
    inputField.focus(); // 入力欄にフォーカスを戻す
  }

  result.textContent = message; // 結果を表示
}

// ゲームをリセットする関数
function resetGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1; // 新しいランダムな数字を生成
  attemptCount = 0; // 試行回数をリセット
  result.textContent = "ゲームをリセットしました。もう一度挑戦してください！";
  inputField.disabled = false; // 入力フィールドを再び有効化
  submitButton.disabled = false; // 送信ボタンを再び有効化
  inputField.value = ""; // 入力欄を空にする
  inputField.focus(); // 入力欄にフォーカスを戻す
}

function quitGame() {
  resetGame(); // ゲーム状態をリセット
  startScreen.style.display = "flex"; // スタート画面を表示
  gameScreen.style.display = "none"; // ゲーム画面を非表示
}


document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("number").disabled = false;
  document.getElementById("submit").disabled = false;
});

document.getElementById("quit").addEventListener("click", () => {
  // ゲーム画面を非表示にしてスタート画面を表示
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "flex";

  // リセット処理（必要に応じて）
  document.getElementById("number").value = ""; // 入力欄をクリア
  document.getElementById("result").textContent = ""; // 結果メッセージをクリア
  document.getElementById("reset").style.display = "none"; // リセットボタンを非表示
  document.getElementById("submit").disabled = false; // 送信ボタンを有効化
});


// ボタンのイベントリスナー
startButton.addEventListener("click", startGame);
submitButton.addEventListener("click", checkAnswer);
resetButton.addEventListener("click", resetGame);
quitButton.addEventListener("click", quitGame);