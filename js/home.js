var error0 = "Incomplete fields!";
var error1 = "Maximum 24 character length exceeded!";
var error2 = "This is not a valid number!";
var error3 = "This number already exist!";
var error4 = "This number is not associated to any WhatsApp account!";
var done0 = "Message sent successfully!";

var credentials = localStorage.getItem("wassapp-credentials");
var token = localStorage.getItem("wassapp-token");

var editMode = false;
var editContact;
var sended;

$(document).ready(function() {
  if (credentials === null || token === null) {
    window.location = "./";
  } else {
    $("body").css({"visibility": "visible"});
  }

  var code = GibberishAES.dec(credentials, token).split(":");
  var name = code[0];
  var sender = code[1];
  var pass = code[2];

  $("#loginData").html("Logged as " + name + " (+" + sender + ")");

  for (var i = 0; i < localStorage.length; i++){
    if (localStorage.key(i).indexOf('wassapp-contact') > -1) {
      var contact = GibberishAES.dec(localStorage.getItem(localStorage.key(i)), document.domain).split(":");
      var contactName = contact[0];
      var contactPhone = contact[1];
      $("#contactBox").append('<div class="contactContainer"><p class="contactElement" id="' + contactPhone + '">' + contactName + '</p></div>');
    }
  }

  $("#addButton").click(function(event) {
    event.preventDefault();
    $("#quickSendBox").hide("fast");
    $("#chatBox").hide("fast");
    $("#addBox").show("fast");
  });

  $("#confirmButton").click(function(event) {
    event.preventDefault();
    var contactName = $("#contactName").val();
    var contactPhone = $("#contactPhone").val().replace("+","");
    if (contactName.length === 0 || contactPhone.length === 0) {
      $("#addBox").children(".error").text(error0).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if (contactName.length >= 24 || contactPhone.length >= 24) {
      $("#addBox").children(".error").text(error1).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if (isNaN(contactPhone)) {
      $("#addBox").children(".error").text(error2).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if ($("#" + contactPhone).length !== 0 && !editMode) {
      $("#addBox").children(".error").text(error3).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if (!contactExist(contactPhone)) {
      $("#addBox").children(".error").text(error4).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if (typeof getStorageKey(contactName, contactPhone) === "undefined") {
      if (editContact) localStorage.removeItem(getStorageKey(editContact.children(".contactElement").text(), editContact.children(".contactElement").attr("id")));
      for (var i = 0; i < localStorage.length; i++){
        if (localStorage.getItem("wassapp-contact" + i) === null) {
          localStorage.setItem("wassapp-contact" + i, GibberishAES.enc(contactName + ":" + contactPhone, document.domain));
          break;
        }
      }
    }
    $("#contactBox").append('<div class="contactContainer"><p class="contactElement" id="' + contactPhone + '">' + contactName + '</p></div>');
    $("#addBox").hide("fast");
    $("#quickSendBox").show("fast");
    $("#contactName").val(null);
    $("#contactPhone").val(null);
    editMode = false;
  });

  $("#cancelButton").click(function(event) {
    event.preventDefault();
    $("#addBox").hide("fast");
    $("#quickSendBox").show("fast");
    $("#contactName").val(null);
    $("#contactPhone").val(null);
    if (editMode) {
      $("#contactBox").append(editContact);
    }
    editMode = false;
  });

  $("#quickSendButton").click(function(event) {
    event.preventDefault();
    var dst = $("#dst").val().replace("+","");
    var msg = $("#msg").val();
    if (dst.length === 0 || msg.length === 0) {
      $("#quickSendBox").children(".error").text(error0).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if (dst.length >= 24) {
      $("#quickSendBox").children(".error").text(error1).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if (isNaN(dst)) {
      $("#quickSendBox").children(".error").text(error2).slideDown(500).delay(1600).slideUp(500);
      return;
    } else if (!contactExist(dst)) {
      $("#quickSendBox").children(".error").text(error4).slideDown(500).delay(1600).slideUp(500);
      return;
    } else {
      send(dst, msg, "quickSend");
      return;
    }
  });

  $(".contactContainer").live("click", function(event) {
    var contactElement = $(this).children(".contactElement");
    var contactChat = $("#" + contactElement.attr("id") + "-chat");
    $(this).toggleClass("contactContainerSelected");
    if (contactChat.is(':visible')) {
       contactElement.toggleClass("contactElementSelected");
       contactChat.hide("fast")
       return;
    }
    if (contactChat.length === 0) {
      $("body").append($(
        '<div class="chatArea" id="' + contactElement.attr('id') + '-chat">'+
          '<div class="chatTitle">Talking with ' + contactElement.text() + '<img src="img/close.png" class="chatCloseButton" height="16" width="20" alt="Close" /></div>'+
          '<div class="chatText"></div>'+
          '<textarea class="chatWrite" maxlength="1024" autofocus="autofocus"></textarea>'+
        '</div>'
      ).hide().fadeIn("fast"));
    }
    contactChat.show("fast");
    contactChat.children(".chatWrite").focus();
    contactElement.toggleClass("contactElementSelected");
  }).live("mouseover", function(event) {
    $(this).disableSelection();
    $(this).draggable({
      containment: "document",
      opacity: 0.7,
      revert: true,
      scroll: false,
      stack: ".contactContainer, .chatArea",
      start: function(event, ui) {
        if (!editMode) {
          $("#manageBox").show("fast");
        }
      },
      stop: function(event, ui) {
        $("#manageBox").hide("fast");
        $(this).css("zIndex", "auto");
      }
    });
  });
  
  $(".chatArea").live("mouseover", function(event) {
    $(this).draggable({
      containment: "document",
      opacity: 0.7,
      revert: false,
      scroll: false,
      stack: ".chatArea, .contactContainer",
      handle: $(".chatTitle")
    });
  });
  
  $(".chatCloseButton").live("click", function(event) {
    var contactChat = $(this).parent().parent();
    var contactElement = $("#" + contactChat.attr("id").replace("-chat", ""));
    var contactContainer = contactElement.parent();
    contactContainer.toggleClass("contactContainerSelected");
    contactElement.toggleClass("contactElementSelected");
    contactChat.hide("fast");
  });

  $('.chatWrite').live("keydown", function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      if (!sended && $.trim($(this).val()).length) {
        var dst = $(this).parent().attr("id").replace("-chat", "");
        var msg = $(this).val();
        sended = true;
        send(dst, msg, $(this).parent().children(".chatText"));
        $(this).val("");
      }
    }
  }).live("keyup", function(e) {
    sended = false;
  });

  $("#editButton").droppable({
    accept: ".contactContainer",
    drop: function(event, ui) {
      var contactElement = ui.draggable.children(".contactElement");
      editMode = true;
      contactElement.removeClass("contactElementSelected");
      editContact = ui.draggable.removeAttr("style").removeClass("contactContainerSelected");
      ui.draggable.remove();
      $("#" + contactElement.attr("id") + '-chat').remove();
      $("#contactName").val(contactElement.text());
      $("#contactPhone").val(contactElement.attr("id"));
      $("#manageBox").hide("fast");
      $("#quickSendBox").hide("fast");
      $("#addBox").show("fast");
    }
  });
  
  $("#trashButton").droppable({
    accept: ".contactContainer",
    drop: function(event, ui) {
      var contactElement = ui.draggable.children(".contactElement");
      var contactPhone = contactElement.attr('id');
      var contactName = contactElement.text();
      $("#" + contactElement.attr("id") + '-chat').remove();
      ui.draggable.remove();
      localStorage.removeItem(getStorageKey(contactName, contactPhone));
      $("#manageBox").hide("fast");
    }
  });

  $("#logoutButton").click(function(event) {
    event.preventDefault();
    localStorage.removeItem("wassapp-credentials");
    localStorage.removeItem("wassapp-token");
    window.location = "./";
  });
  
  var message = function(string) {
    return string.replace("<", "&lt;")
                 .replace(">", "&gt;")
                 .replace("[", "&#91;")
                 .replace("]", "&#93;")
                 .replace("(", "&#40;")
                 .replace(")", "&#41;")
                 .replace("{", "&#123;")
                 .replace("}", "&#125;")
                 .replace("%", "&#37;")
                 .replace("=", "&#61;");
  }
  
  var getStorageKey = function(contactName, contactPhone) {
    var contactKey = contactName + ":" + contactPhone;
    for (var i = 0; i < localStorage.length; i++){
      if (localStorage.key(i).indexOf("wassapp-contact") > -1 && GibberishAES.dec(localStorage.getItem(localStorage.key(i)), document.domain) === contactKey) {
        return localStorage.key(i);
      }
    }
  }
  
  var send = function(dst, msg, thisChat) {
    $.ajax({
      type: 'POST',
      url: "utils/send.php",
      data: {"data": name + ":" + sender + ":" + pass + ":" + dst + ":" + msg},
      success: function(data) {
        if (thisChat != "quickSend") {
          thisChat.append("<p class='chatLineYouText'>" + message(msg) + "</p><span class='chatLineYouTime'>" + ((new Date).getHours()<10?"0":"")+(new Date).getHours() + ":" + ((new Date).getMinutes()<10?"0":"")+(new Date).getMinutes() + "</span>");
          thisChat.scrollTo(Math.pow(100,10));
        } else {
          $("#quickSendBox").children(".done").slideDown(500).text(done0).delay(1600).slideUp(500);
        }
        console.debug(data);
      }
    });
  }
  
  var contactExist = function(phone) {
    var verify = false;
    var request = $.ajax({
      type: "POST",
      dataType: "xml",
      async: false,
      url: "utils/iq.php",
	  data: {"data": phone},
      success: function(data) {
        $(data).find("dict").first().each(function(){
          if ($(this).find("string").eq(2).text() === phone) verify = true;
        });
      }
    })/*.done(function() {return;})*/;
    return verify;
  }
});