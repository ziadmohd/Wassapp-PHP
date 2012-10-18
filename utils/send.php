<?php
require "whatsapi/whatsprot.class.php";

function fgets_u($pStdn) {
	$pArr = array($pStdn);

	if (false === ($num_changed_streams = stream_select($pArr, $write = NULL, $except = NULL, 0))) {
		print("\$ 001 Socket Error : UNABLE TO WATCH STDIN.\n");
		return FALSE;
	} elseif ($num_changed_streams > 0) {
		return trim(fgets($pStdn, 1024));
	}
}

$data = $_POST['data'];

if ($data === null) {
  echo "Error";
  exit(0);
}

list($name, $sender, $pass, $dst, $msg) = explode(":", $data);

$countrycode = substr($sender, 0, 2);
$phonenumber = substr($sender, 2);

echo "[] Logging in as '$name' ($sender)\n";
$wa = new WhatsProt($sender, $pass, $name, true);

$wa->Connect();
$wa->Login();

if ($_SERVER['argv'][1] == "-i") {
	echo "\n[] Interactive conversation with $dst:\n";
	stream_set_timeout(STDIN,1);
	while(TRUE) {
		$wa->PollMessages();
		$buff = $wa->GetMessages();
		if(!empty($buff)){
			print_r($buff);
		}
		$line = fgets_u(STDIN);
		if ($line != "") {
			if (strrchr($line, " ")) {
				// needs PHP >= 5.3.0
				$command = trim(strstr($line, ' ', TRUE));
			} else {
				$command = $line;
			}
			switch ($command) {
				case "/query":
					$dst = trim(strstr($line, ' ', FALSE));
					echo "[] Interactive conversation with $dst:\n";
					break;
				case "/accountinfo":
					echo "[] Account Info: ";
					$wa->accountInfo();
					break;
				case "/lastseen":
					echo "[] Request last seen $dst: ";
					$wa->RequestLastSeen("$dst"); 
					break;
				default:
					echo "[] Send message to $dst: $line\n";
					$wa->Message(time()."-1", $dst , $line);
					break;
			}
		}
	}
	exit(0);
}

if ($_SERVER['argv'][1] == "-l") {
	echo "\n[] Listen mode:\n";
	while (TRUE) {
		$wa->PollMessages();
		$data = $wa->GetMessages();
		if(!empty($data)) print_r($data);
		sleep(1);
	}
	exit(0);
}

echo "\n[] Request last seen $dst: ";
$wa->RequestLastSeen($dst); 

echo "\n[] Send message to $dst: $msg\n";
$wa->Message(time()."-1", $dst , $msg);
echo "\n";
?>