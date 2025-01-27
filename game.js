// スライドの設定
let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// 最初の画像を表示
function showSlide(index) {
  // すべてのスライドを非表示にする
  slides.forEach(slide => slide.classList.remove('active'));
  
  // 指定されたインデックスのスライドを表示
  slides[index].classList.add('active');
}

// 次のスライドへ進む
function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  showSlide(currentIndex);
}

// 前のスライドへ戻る
function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  showSlide(currentIndex);
}

// スライドショーを自動で切り替える
setInterval(nextSlide, 5000);  // 5秒ごとにスライドを切り替え

// スライドショー初期表示
showSlide(currentIndex);

// 前のスライドボタン
document.getElementById('prev').addEventListener('click', prevSlide);

// 次のスライドボタン
document.getElementById('next').addEventListener('click', nextSlide);

// 画像クリックでゲームページに遷移
slides.forEach(slide => {
  slide.addEventListener('click', () => {
    window.location.href = 'https://example.com/game';  // ゲームページのURLに置き換えてください
  });
});
