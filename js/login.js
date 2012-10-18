var error0 = "Incomplete fields!";
var error1 = "Maximum 24 character length exceeded!";
var error2 = "Bad login!";

$(document).ready(function() {
  if (localStorage.getItem("wassapp-credentials") !== null || localStorage.getItem("wassapp-token") !== null) {
    window.location = "home";
  } else {
    $("body").css({"visibility": "visible"});
  }
  $("#login").click(function(event) {
    event.preventDefault();
    var name = $("#name").val();
    var sender = $("#sender").val().replace("+","");
    var pass = $("#pass").val();
    if (name.length === 0 || sender.length === 0 || pass.length === 0) {
      $("#contentBox").children(".error").text(error0).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if (name.length >= 24 || sender.length >= 24 || pass.length >= 24) {
      $("#contentBox").children(".error").text(error1).slideDown(500).delay(1600).slideUp(500);
      return;
    }
    login(name, sender, pass);
  });

  var login = function(name, sender, pass) {
    var request = $.ajax({
      type: "POST",
      dataType: "text",
      async: false,
      url: "utils/exist.php",
      data: {"data": name + ":" + sender + ":" + pass},
      success: function(status) {
        if (status == "true") {
          var code = name + ":" + sender + ":" + pass;
          localStorage.setItem("wassapp-token", token);
          localStorage.setItem("wassapp-credentials", GibberishAES.enc(code, token));
          window.location = "home";
        } else if (status == "false") {
          $("#contentBox").children(".error").text(error2).slideDown(500).delay(1600).slideUp(500);
        }
      }
    })/*.done(function() {return;})*/;
  }
});