// ページが読み込まれたときに、ボタンにクリックイベントを追加
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startGameBtn');

  // 「ゲームをプレイ」ボタンをクリックした時の動作
  startButton.addEventListener('click', () => {
    alert('ゲームが始まりました！');
    // ゲームの開始ロジックをここに追加できます
    startGame();
  });
});

// ゲーム開始のロジック（仮の例）
function startGame() {
  // キャンバスの準備
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;

  // ゲームオブジェクトの初期化（仮）
  ctx.fillStyle = 'red';
  ctx.fillRect(50, 50, 100, 100); // 仮のオブジェクト（四角形）

  // 簡単なアニメーション：赤い四角形が動く
  let x = 50;
  const speed = 2;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
    ctx.fillStyle = 'red';
    ctx.fillRect(x, 50, 100, 100); // 四角形を描く
    x += speed;
    if (x > canvas.width) x = 0; // 画面外に出たら左端に戻る

    requestAnimationFrame(animate); // 次のフレームで再度アニメーションを呼ぶ
  }

  animate();
}
