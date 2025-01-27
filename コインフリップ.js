$(document).ready(function() {
    const coincnt = 21; // コインの数
    let gameOver = false; // ゲームオーバーフラグ
    let safeCoins = coincnt - 1; // セーフコインの数（1枚はハズレに設定）
    let count = 0; // あたりを引いた回数
    let isAnimating = false; // コインのアニメーション中かどうかのフラグ

    // ゲームの初期化関数
    function initGame() {
        $(".sheet").empty(); // コインをクリア
        $("#game-over").hide(); // メッセージを非表示
        $("#restart-btn").hide(); // リスタートボタンを非表示
        $("#quit-btn").hide(); // やめるボタンを非表示
        $("#start-btn").show(); // スタートボタンを表示
        $("#start-screen").show(); // スタートボタンを表示
        $(".start-background").show(); // スタート画面の背景を表示
        $(".start-background1").show(); // スタート画面の背景を表示
    }

    // ゲームスタート
    $("#start-btn").on("click", function() {
        $(this).hide(); // スタートボタンを非表示
        generateCoins(); // コインを生成し、ゲーム開始
        $("#quit-btn").hide(); // やめるボタンは初めは非表示
        $(".start-background").hide(); // スタート画面の背景を非表示
        $(".start-background1").hide(); // スタート画面の背景を非表示
        $(".start-screen").hide(); // スタートボタンを表示
    });

    // やめるボタンの動作
    $("#quit-btn").on("click", function() {
        initGame(); // ゲーム初期化してスタート画面に戻す
    });

    // コイン生成とゲームの初期化
    function generateCoins() {
        $(".sheet").empty(); // コインをクリア
        for (let i = 0; i < coincnt; i++) {
            $(".sheet").append("<li class='normal' data-role='1'></li>");
        }

        const outcoin = Math.floor(Math.random() * coincnt);
        $(".sheet li").eq(outcoin).attr("data-role", "2");

        safeCoins = coincnt - 1;
        count = 0;
        gameOver = false;

        $("#game-over").hide();
        $("#restart-btn").hide();
        $("#quit-btn").hide(); // やめるボタンはゲーム中に非表示
    }

    // ゲームオーバーの処理内でやめるボタンを表示
    function notice(li) {
        if (li.data("role") == "2") { // ハズレコイン
            li.attr("class", "out"); // ハズレのクラスを適用
            $("#game-over").text("ゲームオーバー！引いた回数: " + count + "/20回🐻").css("color", "red").show();
            $("#restart-btn").show(); // リスタートボタンを表示
            $("#quit-btn").show(); // やめるボタンを表示
            gameOver = true; // ゲームオーバー
        } else { // セーフコイン
            li.attr("class", "safe"); // セーフのクラスを適用
            count++; // カウントを増やす
            safeCoins--; // 残りのセーフコイン数を減らす

            // すべてのセーフコインを引いた場合のチェック
            if (safeCoins === 0) {
                $("#game-over").text("おめでとう！すべてのコインを引いた！🐳").css("color", "green").show();
                $("#restart-btn").show(); // リスタートボタンを表示
                $("#quit-btn").show(); // やめるボタンを表示
                gameOver = true; // ゲームオーバー
            }
        }
    }

    // コインの角度を傾ける関数
    function turn(li, f, b, motiontime) {
        $({ deg: f }).animate({ deg: b }, {
            duration: motiontime,
            progress: function() {
                li.css({ transform: 'rotateY(' + this.deg + 'deg)' });
            }
        });
    }

    // 演出の関数
    function motion(li, motiontime) {
        if (isAnimating) return; // すでにアニメーション中なら何もしない
        isAnimating = true; // アニメーション中フラグを立てる

        turn(li, 0, 90, motiontime);
        setTimeout(function() {
            notice(li); // コインの状態を確認し、画像を切り替え
            turn(li, 90, 0, motiontime);
        }, motiontime * 1.8); // motiontime * 2 よりアニメーションと合いやすい

        // アニメーションが終了したらフラグを解除
        setTimeout(function() {
            isAnimating = false;
        }, motiontime * 2);
    }

    // コインのクリックイベント
    $(".sheet").on("click", "li", function() {
        if (gameOver || $(this).hasClass("safe") || $(this).hasClass("out")) return; // ゲームオーバーまたはすでにクリックされたコインは何もしない
        const li = $(this);
        motion(li, 100); // セーフコインの場合のアニメーション
    });

    // リスタートボタンのクリックイベント
    $("#restart-btn").on("click", function() {
        generateCoins(); // 新しいコインを生成してゲームをリセット
    });

    // 初回ゲーム初期化
    initGame();
});

