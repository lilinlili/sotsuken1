"use strict";

const x = 3; // 横のマスの数
const y = 3; // 縦のマスの数
let array = []; // マスの数
let clickCount = 0; // クリックした数をカウント
const levels = [
  { count: 3, time: 1000 }, // レベル1: 表示数 3、表示時間 1秒
  { count: 6, time: 1500 }, // レベル2: 表示数 6、表示時間 2秒
  { count: 9, time: 3600 }, // レベル3: 表示数 9、表示時間 3秒
];
let currentLevel = 0; // 現在のレベル（初期レベル0）
let sliceEnd = levels[currentLevel].count; // 初期の表示マス数
let displayTime = levels[currentLevel].time; // 表示時間
const table = document.querySelector("table");
const btn = document.getElementById("btn");
const modal = document.getElementById("modal");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameScreen = document.querySelector("main");

// パソコンかスマートフォンか判定
const eventType = window.ontouchstart !== null ? "click" : "touchstart";

// ゲーム画面生成
function init() {
  let id = 0;
  for (let i = 0; i < y; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < x; j++) {
      let td = document.createElement("td");
      td.id = id;
      td.classList.remove("color"); // 緑のクラスを初期化
      td.textContent = ""; // 内容をクリア
      array.push(id);
      id++;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

init();

// ゲームをスタートさせる
function startGameScreen() {
  startScreen.classList.add("hidden"); // スタート画面を非表示
  gameScreen.style.display = "block"; // ゲーム画面を表示
  btn.textContent = "スタート！🐶"; // ボタンにテキストを設定
  btn.classList.remove("hidden"); // ゲーム画面のボタンを表示
  btn.addEventListener(eventType, startGame); // ゲーム開始のイベントを追加
}

function startGame() {
  btn.classList.add("hidden"); // ゲーム中はボタンを隠す
  clickCount = 0; // クリックカウントをリセット

  // 次のレベルに進む際に設定を反映
  sliceEnd = levels[currentLevel].count; // 現在のレベルの表示数
  displayTime = levels[currentLevel].time; // 現在のレベルの表示時間

  // モーダルを隠してリセット
  modal.classList.remove("show");
  modal.textContent = "";

  // クイズを準備して開始
  makeQuiz();
  setTimeout(() => {
    showNumbers();
    setTimeout(hideNumbers, displayTime); // 表示時間後に数字を隠す
  }, 1000); // 1秒後に数字を表示
}

// クイズ作成
function makeQuiz() {
  array.slice(0, sliceEnd).forEach((value) => {
    const cell = document.getElementById(value);
    cell.classList.remove("color");
    cell.textContent = "";
    cell.removeEventListener(eventType, checkAnswer); // 既存のイベントリスナーを削除
  });

  // Fisher–Yates shuffleアルゴリズムでシャッフル
  let a = array.length;
  while (a) {
    let j = Math.floor(Math.random() * a);
    let t = array[--a];
    array[a] = array[j];
    array[j] = t;
  }
}

// 数字を表示
function showNumbers() {
  array.slice(0, sliceEnd).forEach((value, index) => {
    const cell = document.getElementById(value);
    cell.classList.add("color");
    cell.textContent = index + 1; // 数字を表示
    cell.setAttribute("data-value", index + 1); // データ属性に数字を保存
  });
}

// 数字を隠す
function hideNumbers() {
  array.slice(0, sliceEnd).forEach((value) => {
    const cell = document.getElementById(value);
    cell.textContent = ""; // 表示を消す
    cell.style.cursor = "pointer"; // クリック可能に設定
    cell.addEventListener(eventType, checkAnswer); // 答え合わせ用のイベントを追加
  });
}

// 答え合わせ
function checkAnswer() {
  const correctValue = Number(this.getAttribute("data-value"));

  if (correctValue === clickCount + 1) {
    clickCount++; // 正解なのでカウントを進める
    this.textContent = correctValue; // 数字を表示
    this.style.cursor = "default"; // カーソルをリセット
    this.removeEventListener(eventType, checkAnswer); // イベントリスナーを削除

    if (clickCount === sliceEnd) {
      if (currentLevel < levels.length - 1) {
        // 次のレベルに進む
        showSuccessMessage();
      } else {
        // 最終レベルクリア
        showCongratulationsMessage();
      }
    }
  } else {
    // 不正解の場合
    showNumbers(); // 数字を再表示
    gameOver(); // ゲームオーバー処理
  }
}

function showSuccessMessage() {
  modal.textContent = `Level ${currentLevel + 1} クリア！🐻`; // 次のレベルを表示
  modal.classList.add("show"); // モーダルを表示

  // 次のレベルに進む処理
  setTimeout(() => {
    if (currentLevel < levels.length - 1) {
      // レベルを1つ進める
      currentLevel++; // レベルを進める
      sliceEnd = levels[currentLevel].count; // 次のレベルのマス数を設定
      displayTime = levels[currentLevel].time; // 次のレベルの表示時間を設定

      // ボタンのテキストを更新して表示
      btn.textContent = "次のレベル！🐬";
      btn.classList.remove("hidden");

      // 古いイベントリスナーを削除して、新しいイベントリスナーを追加
      btn.removeEventListener(eventType, startGame);
      btn.addEventListener(eventType, startGame); // 新しいレベルをスタート
    } else {
      // ゲームクリア後
      btn.textContent = "play again";
      btn.classList.remove("hidden");

      // リスタートボタンのリスナーを追加
      btn.removeEventListener(eventType, startGame); // 古いリスナーを削除
      btn.addEventListener(eventType, () => location.reload()); // ゲームを再起動
    }
  }, 1000); // モーダル表示後1秒で次の処理へ
}

function showCongratulationsMessage() {
  modal.textContent = "コンプリート🎉おめでとう！=^_^="; // 最後のレベルクリア時
  modal.classList.add("show"); // モーダルを表示

  // ゲームクリア後の処理
  setTimeout(() => {
    btn.textContent = "ホームへ🐳";
    btn.classList.remove("hidden");
    btn.removeEventListener(eventType, startGame);
    btn.addEventListener(eventType, () => location.reload());
  }, 1000);
}

// ゲームオーバー処理
function gameOver() {
  const modal = document.getElementById("modal");
  modal.textContent = "ゲームオーバー！🐨"; // メッセージ設定
  modal.classList.add("show"); // モーダルを表示

  // ボタンを再表示して再挑戦を促す
  setTimeout(() => {
    btn.textContent = "もう一度！🐹";
    btn.classList.remove("hidden");
    btn.addEventListener(eventType, () => location.reload());
  }, 1000);
}

// スタートボタンのイベントリスナー
startBtn.addEventListener(eventType, () => {
  // スタート画面を非表示にしてゲーム画面を表示
  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  // ゲーム開始ボタンを表示
  btn.textContent = "ゲームスタート🐉";
  btn.classList.remove("hidden");

  // イベントリスナーを設定
  btn.addEventListener(eventType, startGameScreen);
});

// ゲーム画面をスタートさせる
function startGameScreen() {
  // ゲーム画面のスタートボタンを非表示
  btn.classList.add("hidden");

  // ゲームの準備と開始
  clickCount = 0; // カウントリセット
  sliceEnd = levels[currentLevel].count; // レベルに応じた設定
  displayTime = levels[currentLevel].time;

  modal.classList.remove("show"); // モーダル非表示
  modal.textContent = "";

  // クイズを生成して開始
  makeQuiz();
  setTimeout(() => {
    showNumbers();
    setTimeout(hideNumbers, displayTime); // 数字を隠す処理
  }, 1000); // 1秒後に数字を表示
}
