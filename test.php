<?php
    $number=$_GET['number'];
    $host=$_GET['host'];
    $port=$_GET['port'];
?>

<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">
    <meta name="mobile-web-app-capable" content="yes">
    <title>PONG - Player<?php echo $number ?></title>
    <link rel="manifest" href="/contents/data/manifest.json">
    <link rel="stylesheet" href="/contents/styles/style.css" />
    <link rel="stylesheet" href="/contents/styles/player.css" />
    <script type="text/javascript" src="/contents/javascript/jquery.min.js"></script>
    <script type="text/javascript" src="/contents/javascript/socket.io.js"></script>
    <script type="text/javascript" src="/contents/javascript/zingtouch-master/dist/zingtouch.js"></script>
    <script type="text/javascript" src="/contents/javascript/player.js"></script>
    <script>
        var socket = io('http://<?php echo $host ?>:<?php echo $port ?>');
        var number = <?php echo $number ?>;
    </script>

</head>

<body>
    <div id="surface" class="player<?php echo $number ?> non-select">
        <h1 id="name">player 1</h1>
        <h2 id="points">0 - 0</h2>
        <div id="messages"></div>
        <div id="profile-image"></div>
    </div>
    <script type="text/javascript" src="/contents/javascript/fb.login.js"></script>
</body>

</html>