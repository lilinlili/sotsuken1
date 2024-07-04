<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>おしゃれなゲームホームページ</title>
    <link rel="stylesheet" href="styles.css">
    <!-- Google Fontsを使う場合 -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            background-color: #000;
            color: #fff;
            margin: 0;
            padding: 0;
        }

        #wrapper {
            max-width: 960px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background-color: #333;
            color: #fff;
            padding: 10px 0;
            text-align: center;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }

        header h1 {
            font-size: 2em;
            margin: 0;
        }

        nav {
            margin-top: 10px;
        }

        nav a {
            color: #fff;
            text-decoration: none;
            font-size: 1.2em;
            margin-right: 10px;
            padding: 5px 10px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        nav a:hover {
            background-color: #555;
        }

        #hero {
            text-align: center;
            padding: 100px 0;
            margin-top: 80px; /* ヘッダーの高さ分下げる */
        }

        #hero h2 {
            font-size: 3em;
            margin-bottom: 20px;
        }

        #hero p {
            font-size: 1.2em;
            margin-bottom: 20px;
        }

        .btn {
            display: inline-block;
            background-color: #eeff00;
            color: #333;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 1.1em;
            transition: background-color 0.3s ease;
        }

        .btn:hover {
            background-color: #ffcc00;
        }

        footer {
            background-color: #333;
            color: #fff;
            text-align: center;
            padding: 10px 0;
            width: 100%;
            clear: both;
        }

        footer p {
            font-size: 0.9em;
            margin: 0;
        }

        /* 他のスタイル */
        section {
            margin-bottom: 40px;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>ミニゲーム</h1>
            <nav>
                <a href="">ポーカー</a>
                <a href="#">テトリス</a>
                <a href="#">スイカ</a>
                <a href="#">クソゲー</a>
            </nav>
        </div>
    </header>

    <div id="wrapper">
        <section id="hero">
            <div class="hero-content">
                <h2>素晴らしいゲームの世界へようこそ！</h2>
                <p>壮大な冒険に備えてください。</p>
                <a href="#" class="btn">今すぐプレイ</a><br><br><br><br><br><br>
                
        </section>

        <!-- 他のセクションを追加 -->

    </div>

    <footer>
        <div class="container">
            <p>&copy; 2024 中澤ゆうたのすけ.</p>
        </div>
    </footer>
</body>
</html>
