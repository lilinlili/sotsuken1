const { Bodies, Body, Composite, Engine, Events, Render, Runner, Sleeping } = Matter;

const WIDTH = 600; // 横幅
const HEIGHT = 580; // 高さ
const WALL_T = 10; // 壁の厚さ
const DEADLINE = 500; // ゲームオーバーになる高さ
const FRICTION = 0.013; // 摩擦
const MASS = 15; // 重量
const MAX_LEVEL = 11;
const WALL_COLOR = "#ccc";
const BUBBLE_IMAGES = {
  0: { src: "ほし_0619032257.png", width: 340, height: 340 },
  1: { src: "まんげつ_0619032311.png", width: 998, height: 1000 },
  2: { src: "水星_0627110532.png", width: 207, height: 207 },
  3: { src: "火星_0627110137.png", width: 261, height: 261 },
  4: { src: "ちきゅう_0625102810.png", width: 500, height: 500 },
  5: { src: "かいおうせい_0625102459.png", width: 500, height: 500 },
  6: { src: "どせい.png", width: 300, height: 300 },
  7: { src: "もくせい.png", width: 512, height: 512 },
  8: { src: "た_0620111527.png", width: 500, height: 500 },
  9: { src: "うちゅう_0620101246.png", width: 500, height: 500 },
  10: { src: "ぎ_0620113749.png", width: 500, height: 500 },
};

const OBJECT_CATEGORIES = {
  WALL: 0x0001,
  BUBBLE: 0x0002,
  BUBBLE_PENDING: 0x0004,
};

// ローカルストレージからランキングを取得する関数
function getScores() {
  const scores = JSON.parse(localStorage.getItem('bubbleGameScores')) || [];
  return scores;
}

// ローカルストレージにランキングを保存する関数
function saveScores(scores) {
  localStorage.setItem('bubbleGameScores', JSON.stringify(scores));
}

// 新しいスコアを追加する関数
function addScore(playerName, score) {
  const scores = getScores();
  scores.push({ playerName, score });
  scores.sort((a, b) => b.score - a.score); // スコアを降順でソート
  saveScores(scores);
}

// スコアを更新する関数
function updateScoreDisplay(score) {
  const scoreElement = document.querySelector(".score");
  scoreElement.textContent = `Score: ${score}`;
}

class BubbeGame {
  engine;
  render;
  runner;
  currentBubble = undefined;
  score;
  scoreChangeCallBack;
  gameover = false;
  defaultX = WIDTH / 2;
  message;

  constructor(container, message, scoreChangeCallBack) {
    this.container = container;
    this.message = message;
    this.score = 0;
    this.scoreChangeCallBack = scoreChangeCallBack;
    this.engine = Engine.create({
      constraintIterations: 3,
      gravity: {
        x: 0,
        y: 0.6 // 重力の強さを設定
      }
    });


    this.render = Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: WIDTH,
        height: HEIGHT,
        wireframes: false,
      },
    });
    this.runner = Runner.create();
    Render.run(this.render);
    Runner.run(this.runner, this.engine);
    container.addEventListener("click", this.handleClick.bind(this));
    container.addEventListener("mousemove", this.handleMouseMove.bind(this));
    Events.on(this.engine, "collisionStart", this.handleCollision.bind(this));
    Events.on(this.engine, "afterUpdate", this.checkGameOver.bind(this));
  }

  init() {
    // リセット時も使うので一旦全部消す
    Composite.clear(this.engine.world);
    this.resetMessage();

    // 状態初期化
    this.gameover = false;
    this.setScore(0);

    // 地面と壁作成
    const ground = Bodies.rectangle(
      WIDTH / 2,
      HEIGHT - WALL_T / 2,
      WIDTH,
      WALL_T,
      {
        isStatic: true,
        label: "ground",
        render: {
          fillStyle: WALL_COLOR,
        },
      }
    );
    const leftWall = Bodies.rectangle(WALL_T / 2, HEIGHT / 2, WALL_T, HEIGHT, {
      isStatic: true,
      label: "leftWall",
      render: {
        fillStyle: WALL_COLOR,
      },
    });
    const rightWall = Bodies.rectangle(
      WIDTH - WALL_T / 2,
      HEIGHT / 2,
      WALL_T,
      HEIGHT,
      {
        isStatic: true,
        label: "rightWall",
        render: {
          fillStyle: WALL_COLOR,
        },
      }
    );
    Composite.add(this.engine.world, [ground, leftWall, rightWall]);
    Runner.run(this.runner, this.engine);

    // ステータスをゲーム準備完了に
    this.gameStatus = "ready";
    this.showReadyMessage();
  }

  start(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.gameStatus === "ready") {
      this.gameStatus = "canput";
      this.createNewBubble();
      this.resetMessage();
    }
  }

  createNewBubble() {
    if (this.gameover) {
      return;
    }
    // バブルの大きさをランダムに決定
    const level = Math.floor(Math.random() * 5);
    const radius = level * 10 + 20;
    const { src, width, height } = BUBBLE_IMAGES[level];
    const currentBubble = Bodies.circle(this.defaultX, 30, radius, {
      isSleeping: true,
      label: "bubble_" + level,
      friction: FRICTION,
      mass: MASS,
      collisionFilter: {
        group: 0,
        category: OBJECT_CATEGORIES.BUBBLE_PENDING,
        mask: OBJECT_CATEGORIES.WALL | OBJECT_CATEGORIES.BUBBLE,
      },
      render: {
        sprite: {
          texture: src,
          xScale: (2 * radius) / width,
          yScale: (2 * radius) / height,
        },
      },
    });
    this.currentBubble = currentBubble;
    Composite.add(this.engine.world, [currentBubble]);
  }

  putCurrentBubble() {
    if (this.currentBubble) {
      Sleeping.set(this.currentBubble, false);
      this.currentBubble.collisionFilter.category = OBJECT_CATEGORIES.BUBBLE;
      this.currentBubble = undefined;
    }
  }

  checkGameOver() {
    const bubbles = Composite.allBodies(this.engine.world).filter((body) =>
      body.label.startsWith("bubble_")
    );
    for (const bubble of bubbles) {
      if (bubble.position.y < HEIGHT - DEADLINE && bubble.velocity.y < 0) {
        Runner.stop(this.runner);
        this.gameover = true;
        this.showGameOverMessage();
        break;
      }
    }
  }

  showReadyMessage() {
    const p = document.createElement("p");
    p.classList.add("mainText");
    p.textContent = "バブルゲーム";
    const p2 = document.createElement("p");
    p2.classList.add("subText");
    p2.textContent = "バブルを大きくしよう";
    const p3 = document.createElement("p");
    p3.classList.add("subText");
    p3.textContent = `スコア: ${this.score}`;
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add("button");
    button.addEventListener("click", this.start.bind(this));
    button.innerText = "ゲーム開始";
    this.message.appendChild(p);
    this.message.appendChild(p2);
    this.message.appendChild(button);
    this.message.style.display = "block";
  }

  resetMessage() {
    this.message.replaceChildren();
    this.message.style.display = "none";
  }

  handleClick() {
    if (this.gameover) {
      return;
    }
    if (this.gameStatus === "canput") {
      this.putCurrentBubble();
      this.gameStatus = "interval";
      setTimeout(() => {
        this.createNewBubble();
        this.gameStatus = "canput";
      }, 500);
    }
  }

  handleCollision({ pairs }) {
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (
        !Composite.get(this.engine.world, bodyA.id, "body") ||
        !Composite.get(this.engine.world, bodyB.id, "body")
      ) {
        continue;
      }
      if (bodyA.label === bodyB.label && bodyA.label.startsWith("bubble_")) {
        const currentBubbleLevel = Number(bodyA.label.substring(7));
        this.setScore(this.score + 2 ** currentBubbleLevel);
        if (currentBubbleLevel === 10) {
          Composite.remove(this.engine.world, [bodyA,bodyB]);
          continue;
        }
      const newLevel = currentBubbleLevel + 1;
      const newX = (bodyA.position.x + bodyB.position.x) / 2;
      const newY = (bodyA.position.y + bodyB.position.y) / 2;
      const newRadius = newLevel * 10 + 20;
      const { src, width, height } = BUBBLE_IMAGES[newLevel];
      const newBubble = Bodies.circle(newX, newY, newRadius, {
        label: "bubble_" + newLevel,
        friction: FRICTION,
        mass: MASS,
        inertia: Infinity, // 回転慣性を無限大に設定
        collisionFilter: {
          group: 0,
          category: OBJECT_CATEGORIES.BUBBLE,
          mask: OBJECT_CATEGORIES.WALL | OBJECT_CATEGORIES.BUBBLE,
        },
        render: {
          sprite: {
            texture: src,
            xScale: (2 * newRadius) / width,
            yScale: (2 * newRadius) / height,
          },
        },
      });

      // Play a random sound effect
      const audioSources = ['select01.mp3', 'select02.mp3'];
      const randomIndex = Math.floor(Math.random() * audioSources.length);
      const audio = new Audio(audioSources[randomIndex]);
      audio.play();

      Composite.remove(this.engine.world, [bodyA, bodyB]);
      Composite.add(this.engine.world, [newBubble]);
    }
  }
}

handleMouseMove(e) {
  if (this.gameStatus !== "canput" || !this.currentBubble) {
    return;
  }
  const { offsetX } = e;
  const currentBubbleRadius =
    Number(this.currentBubble.label.substring(7)) * 10 + 20;
  const newX = Math.max(
    Math.min(offsetX, WIDTH - 10 - currentBubbleRadius),
    10 + currentBubbleRadius
  );
  Body.setPosition(this.currentBubble, {
    x: newX,
    y: this.currentBubble.position.y,
  });
  this.defaultX = newX;
}

setScore(score) {
  this.score = score;
  if (this.scoreChangeCallBack) {
    this.scoreChangeCallBack(score);
  }
}

showGameOverMessage() {
  const p = document.createElement("p");
  p.classList.add("mainText");
  p.textContent = "ゲームオーバー";
  const p2 = document.createElement("p");
  p2.classList.add("subText");
  p2.textContent = `スコア: ${this.score}`;
  
  const playerName = prompt('ランキングに登録する名前を入力してください:');
  addScore(playerName || '匿名', this.score); // スコアをランキングに追加

  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.classList.add("button");
  button.addEventListener("click", () => {
    this.init();
    this.displayRankings(); // ランキング表示を更新
  });
  button.innerText = "もう一度";

  this.message.appendChild(p);
  this.message.appendChild(p2);
  this.message.appendChild(button);
  this.message.style.display = "block";
}

displayRankings() {
  const scores = getScores();
  const table = document.createElement("table");
  table.classList.add("ranking-table");

  const headerRow = document.createElement("tr");
  const headerName = document.createElement("th");
  headerName.textContent = "名前";
  const headerScore = document.createElement("th");
  headerScore.textContent = "スコア";
  headerRow.appendChild(headerName);
  headerRow.appendChild(headerScore);
  table.appendChild(headerRow);

  for (let i = 0; i < Math.min(scores.length, 10); i++) {
    const scoreData = scores[i];
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = scoreData.playerName;
    const scoreCell = document.createElement("td");
    scoreCell.textContent = scoreData.score;
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    table.appendChild(row);
  }

  // Clear previous rankings
  const rankingContainer = document.querySelector(".ranking-container .ranking-list");
  rankingContainer.replaceChildren();
  rankingContainer.appendChild(table);
}
}

window.onload = () => {
const container = document.querySelector(".container");
const message = document.querySelector(".message");
const onChangeScore = (val) => {
  const score = document.querySelector(".score");
  score.textContent = `Score: ${val}`;
};
const game = new BubbeGame(container, message, onChangeScore);
game.init();

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    game.handleClick();
  }
});

// ページロード時にランキングを表示
game.displayRankings();
};







