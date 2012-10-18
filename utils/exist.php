<?php
require "whatsapi/whatsprot.class.php";

$data = $_POST['data'];

if ($data === null) {
  echo "false";
  exit(0);
}

list($name, $sender, $pass) = explode(":", $data);

$wa = new WhatsProt($sender, $pass, $name, true);
$countrycode = substr($sender, 0, 2);
$phonenumber = substr($sender, 2);
$url = "https://r.whatsapp.net/v1/exist.php?cc=".$countrycode."&in=".$phonenumber."&udid=".$wa->encryptPassword();
$content = file_get_contents($url);

if(stristr($content,'status="ok"') === false){
	echo "false";
	exit(0);
} else {
	echo "true";
	exit(0);
}
?>