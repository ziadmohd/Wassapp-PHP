<?php require("header.php"); ?>
<script type="text/javascript" src="js/home.js"></script>
<link rel="stylesheet" type="text/css" href="css/home.css" />
</head>
<body>
<header>
  <div id="loginData"></div>
  <input type="button" class="normalInputButton" id="logoutButton" value="Logout" />
</header>
<div id="logoBox">
  Wass<span class="orange">app</span>
</div>
<img id="addInfo" src="img/addInfo.png" alt="Add your contacts!" />
<div id="contactBox">
  <div id="addButton"></div>
</div>
<div id="contentBox">
  <div id="addBox">
    <label>Contact name:</label>
    <input type="text" class="normalInputText" id="contactName" placeholder="Insert name" />
    <label>Contact phone:</label>
    <input type="text" class="normalInputText" id="contactPhone" placeholder="With prefix (e.x. 34 in Spain)" />
	<div class="error"></div>
    <input type="button" class="normalInputButton" id="confirmButton" value="Confirm" />
	<input type="button" class="normalInputButton" id="cancelButton" value="Cancel" />
  </div>
  <div id="quickSendBox">
    <label>Destination phone:</label>
    <input type="text" class="normalInputText" id="dst" placeholder="With prefix (e.x. 34 in Spain)" />
    <label>Message:</label>
    <input type="text" class="normalInputText" id="msg" placeholder="Text..." />
	<div class="error"></div>
	<div class="done"></div>
    <input type="button" class="normalInputButton" id="quickSendButton" value="Quick send" />
  </div>
</div>
<div id="manageBox">
  <div id="editButton"></div>
  <div id="trashButton"></div>
</div>
<?php require("footer.php"); ?>