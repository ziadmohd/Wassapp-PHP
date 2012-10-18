<?php require("header.php"); ?>
<link rel="stylesheet" type="text/css" href="css/login.css" />
<script type="text/javascript" src="js/login.js"></script>
<script type="text/javascript">
  var token = "<?php
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]{}()*%&$@";
    $size = strlen( $chars );
    for( $i = 0; $i < 64; $i++ ) {
      $str .= $chars[ rand( 0, $size - 1 ) ];
    }
    echo $str; ?>";
</script>
</head>
<body>
<header>
  Hi! You need to log in to use this service.
</header>
<div id="logoBox">
  Wass<span class="orange">app</span>
</div>
<div id="contentBox">
  <label>Name:</label>
  <input type="text" class="normalInputText" id="name" name="name" placeholder="Sender name" />
  <label>Your phone:</label>
  <input type="text" class="normalInputText" id="sender" name="sender" placeholder="With prefix (e.x. 34 in Spain)" />
  <label>Password:</label>
  <input type="password" class="normalInputText" id="pass" name="pass" placeholder="IMEI (Android) or MAC (iOS)" />
  <div class="error"></div>
  <input type="button" class="normalInputButton" id="login" value="Login" />
</div>
<?php require("footer.php"); ?>