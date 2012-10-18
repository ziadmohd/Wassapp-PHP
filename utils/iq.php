<?php
$data = $_POST["data"];
if ($data === null || strlen($data) <= 6) {echo "false"; return;}
$prefix = substr($data, 0,2);
$phone = substr($data, 2);
$xml = file_get_contents("https://sro.whatsapp.net/client/iphone/iq.php?cc=".$prefix."&me=".$phone."&u[]=".$phone);
if (strlen($xml) <= 256) {echo "false"; return;}
echo $xml;
?>