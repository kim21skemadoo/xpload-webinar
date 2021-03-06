jQuery(function($) {
	/**
		**
		* Page Loader
		**
	**/
	$(document).ready(function(){
	    setTimeout(function () {
	        $('.loader').fadeOut('slow');
	    }, 2500);
	});
	/**
		* Pusher Declaration
	**/
	var pusherWebinar = new Pusher('a6e881af5162a58d2816', {
		cluster: 'us2'
	});

	/**
		** 
		* Display Notification To Everyone		
		**
	**/
	var notificationchannel = pusherWebinar.subscribe('notificationChannel');
	notificationchannel.bind('notificationEvent', function(data) {		
		
		var html = '';
		data.forEach(function(data) {
			var fontsize = $('#fontSizeSelect').val();
			var notif_id = data.xpload_notif_id;
    		var userId = data.xpload_notif_uid;
        	var userName = data.xpload_notif_name;	
        	var userMsg = data.xpload_notif_messages;	        	        	
        	var datetime = data.xpload_notif_datetime;
        	var currentDate = data.xpload_notif_date;
        	var audioSrc = data.xpload_notif_audiosrc;
        	var notifColor = data.xpload_notif_color;

        	toastr.success(userName + ': ' +userMsg);
        	PlayNotificationSound(audioSrc)
        	
        	html = "<li class='actual_msg' id='notif_msg_"+notif_id+"' style='text-align:left;float:left;background: #ffffff;width:90%;"+notifColor+"font-size:"+fontsize+"px;'><section><strong style='text-transform:capitalize;font-weight:900;font-size:.8vw;'>"+userName+"</strong><span class='date'>"+datetime+"</span><i class='fa fa-trash deleteNotif' id='"+notif_id+"' style='margin-left: .2vw;'></i><p style='display:block;margin-top:1%;margin-bottom:1%;font-weight:400;font-size:"+fontsize+"px;' id='userMsg'>"+userMsg+"</p></section></li>";
    	});

    	$("#xprowebinarNotificationMsgBox").append(html);
		$("#xprowebinarNotification").val('');
		$("#xprowebinarNotificationMsgBox").animate({scrollTop: $("#xprowebinarNotificationMsgBox").get(0).scrollHeight},900);
    });

	/**
		* Notification Mute/Unmute
	**/
	var notifSoundIcon = $('.notifSound');
	notifSoundIcon.on('click', function() {
	  var id = $(this).attr('id');
	  if(id == 'notif-volume-up'){
	    $('#notif-volume-up').addClass("xploadhide");
	    $('#notif-volume-up').removeClass("xploadshow");
	    $('#notif-volume-mute').removeClass("xploadhide");
	    $('#notif-volume-mute').addClass("xploadshow");
	    var element = document.getElementById('PlayNotificationSound');
	  	element.muted = true;
	  }else if(id == 'notif-volume-mute'){
	    $('#notif-volume-up').addClass("xploadshow");
	    $('#notif-volume-up').removeClass("xploadhide");
	    $('#notif-volume-mute').removeClass("xploadshow");
	    $('#notif-volume-mute').addClass("xploadhide");
	    var element = document.getElementById('PlayNotificationSound');
	  	element.muted = false;          
	  }
	}); 

	/**
		**
		* CHAT
		* Minimize/Maximize Chat Box
		**
	**/
	/** Calling Pusher Chat to subscriber **/
	pusherChat();

	$(".emojionearea-editor").addClass("style-4");
	var $chatbox = $('.chat-container'),
        $chatboxTitle = $('.chatbox__title__tray'),
        $videoContainer = $('.xploadvideo-container'),
        $chatbox2 = $('#chatbox');

    /** Mute/Unmute Chat Sound **/
    var chatSoundIcon = $('.chatSound');
	chatSoundIcon.on('click', function() {
        var chatid = $(this).attr('id');
        if(chatid == 'chat-volume-up'){
        	$('#chat-volume-up').addClass("xploadhide");
        	$('#chat-volume-up').removeClass("xploadshow");
        	$('#chat-volume-mute').removeClass("xploadhide");
        	$('#chat-volume-mute').addClass("xploadshow");
        	var element = document.getElementById('PlayChatSound');
    		element.muted = true;
        }else if(chatid == 'chat-volume-mute'){
        	$('#chat-volume-up').addClass("xploadshow");
        	$('#chat-volume-up').removeClass("xploadhide");
        	$('#chat-volume-mute').removeClass("xploadshow");
        	$('#chat-volume-mute').addClass("xploadhide");
        	var element = document.getElementById('PlayChatSound');
    		element.muted = false;        	
        }
    });

    /** 
    	** 
    	* Admin sends message to chatbox
    	**
    **/
    $(".msg_box").emojioneArea({
        pickerPosition: "top",
        tonesStyle: "radio"
    });
    setTimeout(addEventListeners,3000);

    function addEventListeners(){
        $('.msg_box').on('keydown', function (e) {
        	let textContentWithHTMLTags = document.querySelector('.msg_box .emojionearea-editor').innerHTML; 
			let textContent = document.querySelector('.msg_box .emojionearea-editor').innerText;		

			var chatUserID = $("#chatUserID").val();
	    	var chatUserName = $("#chatUserName").val();
	    	var chatMsgBox = $("#chatMsgBox").val();
	    	var currentdate = new Date();
	    	var datetime = (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getDate() + "/"
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();
	        var date = currentdate.getFullYear() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getDate();
			$(this).tooltip("hide");

	        if (e.which == 13) {
	        	e.preventDefault();
	        	if( $('.notificationInput-container').length ){
					chatColor = $('.sp-preview-inner').css("backgroundColor");
				}else{
					chatColor = '#ffffff';
				}

				data={
            		chatUserID:chatUserID,
            		chatUserName:chatUserName,            		
			        chatMsgBox:textContentWithHTMLTags, textContent,
			        chatDateTime:datetime,
			        chatDate:date,
			        chatColor:chatColor
		        };

				if( !$(".msg_box .emojionearea-editor").html() ) {
			        $(this).css("border","2px solid red");
					$(this).tooltip("show");

			    }else{
			    	$( "#chatMsgBox" ).empty();
		        	$( ".msg_box .emojionearea-editor" ).empty();
		       		add_chat(data.chatUserID, data.chatUserName, data.chatMsgBox, data.chatDateTime, data.chatDate, data.chatColor );
			    }           	
		        
            }
        });
    }

    function add_chat(chatUserID, chatUserName, chatMsgBox, chatDateTime, chatDate, chatColor){

        jQuery.ajax({            
            type: "POST",
            url: pluginsURL.pluginsURL + '/xpload-webinar/php/submitChat.php',
            data: ({ userId: chatUserID, userName: chatUserName, userMsg: chatMsgBox, datetime: chatDateTime, date:chatDate, chatColor:chatColor }),
            dataType: 'json',
    		cache: false,
	        success: function(response) {
	        	var html = '';
            	var newmessage = 0;
	        	response.forEach(function(data) {
	        		var fontsize = $('#fontSizeSelect').val();
	        		var chat_id = data.xpload_chat_id;
	        		var userId = data.xpload_chat_uid;
		        	var userName = data.xpload_chat_name;	
		        	var userMsg = data.xpload_chat_messages;	        	        	
		        	var datetime = data.xpload_chat_datetime;
		        	var currentDate = data.xpload_chat_date;
		        	var chatColor = data.xpload_chat_color
		        	newmessage = 1;
		        	html += "<li class='actual_msg' id='chat_msg_"+chat_id+"' style='text-align:right;float:right;word-wrap: break-word;width:85%;background-color:"+chatColor+";><section><i class='fa fa-trash deleteChat' id='"+chat_id+"' style='margin-right: .2vw;'></i><span class='date' style='display:inline-block !important;'>"+datetime+"</span><strong style='text-transform:capitalize;font-weight:900;font-size:.8vw;'>"+userName+"</strong><p style='text-align: left;margin-top:1%;margin-bottom:1%;font-size:"+fontsize+"px;'>"+userMsg+"</p></section></li>";		        	
	        	});
				$("#chatbox").append(html);
				$("#chatbox").animate({scrollTop: $("#chatbox").get(0).scrollHeight},900);
	        },
	        error: function(response) {
	            console.log(response);
	        }
        });
    }

    function pusherChat(){
    	var chatUserID = $("#chatUserID").val();
    	var pusher = new Pusher('a6e881af5162a58d2816', {
	      cluster: 'us2'
	    });
		var channel = pusher.subscribe('my-chat');
		channel.bind('chat-event', function(data) {
			PlayChatSound();			
			var html = '';
			data.forEach(function(data) {
        		var userId = data.xpload_chat_uid;

        		if(userId != chatUserID){
        			var fontsize = $('#fontSizeSelect').val();
        			var chat_id = data.xpload_chat_id;
		        	var userName = data.xpload_chat_name;	
		        	var userMsg = data.xpload_chat_messages;	        	        	
		        	var datetime = data.xpload_chat_datetime;
		        	var currentDate = data.xpload_chat_date;
		        	var chatColor = data.xpload_chat_color
		        	toastr.warning(userName + ': ' +userMsg);
		        	html += "<li class='actual_msg' id='chat_msg_"+chat_id+"' style='text-align:left;float:left;background-color:"+chatColor+";'><section><strong style='text-transform:capitalize;font-weight:900;font-size:.8vw;'>"+userName+"</strong> <span class='date' style='display:inline-block !important;'>"+datetime+"</span><i class='fa fa-trash deleteChat' id='"+chat_id+"' style='margin-left: .2vw;'></i><p style='margin-top:1%;margin-bottom:1%;font-size:"+fontsize+"px;'>"+userMsg+"</p></section></li>";
	        	}
        	});

			$("#chatbox").append(html);
			$("#chatMsgBox").val('');
			$("#chatbox").animate({scrollTop: $("#chatbox").get(0).scrollHeight},900);
	    });
    }
    /** END SEND CHAT **/

	/**
		**
		* Chat Search
		**
	**/
	$("#chat-search").click(function(){
		$("#chatSearch").modal();
	});

	$("#searchChatItem").keyup(function () {
	        delay(function () {
	            var keyword = $("#searchChatItem").val();
	            var currentdate = new Date();
				var date = currentdate.getFullYear() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getDate();
				var fontsize = $('#fontSizeSelect').val();
	            $.ajax({
	                type: "POST",
		            url: pluginsURL.pluginsURL + '/xpload-webinar/php/searchChat.php',
		            data: ({ keyword:keyword, date:date }),
		            dataType: 'json',
		    		cache: false,
	                success: function(response) {
	                	if ( response.length == 0 ) {
                			$('#searchChatList').empty();                		
                			html += "<li>No data</li>";
				        	$("#searchChatList").append(html);	                		
					    }else{ 
                			$('#searchChatList').empty();
		                    var html = '';
							response.forEach(function(data) {
								var chat_id = data.xpload_chat_id; 
					    		var userId = data.xpload_chat_uid;
					        	var userName = data.xpload_chat_name;	
					        	var userMsg = data.xpload_chat_messages;	        	        	
					        	var datetime = data.xpload_chat_datetime;
					        	var currentDate = data.xpload_chat_date;
					        	var notifColor = data.xpload_chat_color;
					        	
					        	html += "<li class='actual_msg' id="+chat_id+" style='text-align:left;float:left;background: #ffffff;width:90%;"+notifColor+"font-size:"+fontsize+"px;'><span class='date' style='display:block!important;'>"+datetime+"</span><i class='fa fa-trash deleteChat' id="+chat_id+" aria-hidden='true'></i> <section><strong style='text-transform:capitalize;font-weight:900;font-size:.8vw;'>"+userName+"</strong><p style='display:block;margin-top:1%;margin-bottom:1%;font-weight:500;' id='userMsg'>"+userMsg+"</p></section></li>";
					    	});

					    	$("#searchChatList").append(html);
				    	}
	                }
	            });
	        }, 500);
	    }
	);
	/** END CHAT SEARCH **/
	/**
		**
		* Fetch All Chat
		**
	**/
	fetchChat();
	function fetchChat(){
		var chatUserID = $("#chatUserID").val();
		var currentdate = new Date();
		var date = currentdate.getFullYear() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getDate();
		var fontsize = $('#fontSizeSelect').val();

		jQuery.ajax({            
            type: "POST",
            url: pluginsURL.pluginsURL + '/xpload-webinar/php/getAllChat.php',
            data: ({ date:date }),
            dataType: 'json',
    		cache: false,
	        success: function(response) {
	        	var html = '';
            	// var newmessage = 0;
	        	response.forEach(function(data) {
	        		var chat_id = data.xpload_chat_id;    		
	        		var userId = data.xpload_chat_uid;
		        	var userName = data.xpload_chat_name;	
		        	var userMsg = data.xpload_chat_messages;	        	        	
		        	var datetime = data.xpload_chat_datetime;
		        	var currentDate = data.xpload_chat_date;
		        	var chatColor = data.xpload_chat_color
		        	// newmessage = 1;

	        		if(userId != chatUserID){
	        			html += "<li class='actual_msg' id='chat_msg_"+chat_id+"' style='text-align:left;float:left;background-color:"+chatColor+";font-size:"+fontsize+"px;'><section><strong style='text-transform:capitalize;font-weight:900;font-size:.8vw;'>"+userName+"</strong> <span class='date' style='display:inline-block !important;'>"+datetime+"</span><i class='fa fa-trash deleteChat' id='"+chat_id+"' style='margin-left: .2vw;'></i><p style='margin-top:1%;margin-bottom:1%;'>"+userMsg+"</p></section></li>";
	        		}else{
	        			html += "<li class='actual_msg' id='chat_msg_"+chat_id+"' style='text-align:right;float:right;word-wrap: break-word;width:85%;background-color:"+chatColor+";font-size:"+fontsize+"px;'><section><i class='fa fa-trash deleteChat' id='"+chat_id+"' style='margin-right: .2vw;'></i><span class='date' style='display:inline-block !important;'>"+datetime+"</span><strong style='text-transform:capitalize;font-weight:900;font-size:.8vw;'>"+userName+"</strong><p style='margin-top:1%;margin-bottom:1%;text-align: left;'>"+userMsg+"</p></section></li>";
	        				        			
	        		}
	        	});
	        	$("#chatbox").append(html);	
				$("#chatbox").animate({scrollTop: $("#chatbox").get(0).scrollHeight},900);	
				
	        },
	        error: function(response) {
	            console.log(response);
	        }
        });
	}
	/** END FETCH CHAT **/
	/**
		**
		* DELETE CHAT
		**
	**/	
	$("#chat-container").on('click', '.actual_msg .deleteChat', function() {        
        var chat_id = this.id;

        $.confirm({
		    title: 'Delete chat message!',
		    content: 'Are you sure you want to delete this message?',
		    buttons: {
		        confirm: function () {
		            jQuery.ajax({            
			            type: "POST",
			            url: pluginsURL.pluginsURL + '/xpload-webinar/php/deleteChat.php',
			            data: ({ chat_id:chat_id }),
			            dataType: 'json',
			    		cache: false,
				        success: function(response) {
				        	$.confirm({
							    title: 'Congratulations!',
							    content: 'Message has been deleted succesfully!',
							});
				        },
				        error: function(response) {
				            $.alert({
							    title: 'Alert!',
							    content: 'Failed to delete message! Please try again!',
							});
				        }
			 		});
		        },
		        cancel: function () {
		            // $.alert('Canceled!');
		        }
		    }
		});
        
 	}); 	

 	var pusher9 = new Pusher('a6e881af5162a58d2816', {
      cluster: 'us2'
    });
	var channel9 = pusher9.subscribe('delete-chat');
	channel9.bind('delete-chatevent', function(data) {		
		var chatid = "#chat_msg_" + data;
		$(chatid).fadeOut(300, function(){ $(this).remove();});
    });
    /** END DELETE CHAT **/

    /**
		**
		* DELETE NOTIFICATION
		**
	**/	
	
	$("#notification-container").on('click', '.actual_msg .deleteNotif', function() {        
        var notif_id = this.id;

        $.confirm({
		    title: 'Delete Trade Announcement message!',
		    content: 'Are you sure you want to delete this message?',
		    buttons: {
		        confirm: function () {
		            jQuery.ajax({            
			            type: "POST",
			            url: pluginsURL.pluginsURL + '/xpload-webinar/php/deleteNotif.php',
			            data: ({ notif_id:notif_id }),
			            dataType: 'json',
			    		cache: false,
				        success: function(response) {
				        	$.confirm({
							    title: 'Congratulations!',
							    content: 'Message has been deleted succesfully!',
							});
				        },
				        error: function(response) {
				            $.alert({
							    title: 'Alert!',
							    content: 'Failed to delete message! Please try again!',
							});
				        }
			 		});
		        },
		        cancel: function () {
		            // $.alert('Canceled!');
		        }
		    }
		});
        
 	}); 	

 	var pusher9 = new Pusher('a6e881af5162a58d2816', {
      cluster: 'us2'
    });
	var channel10 = pusher9.subscribe('delete-notif');
	channel10.bind('delete-notifevent', function(data) {		
		var chatid = "#notif_msg_" + data;
		$(chatid).fadeOut(300, function(){ $(this).remove();});
    });

    /**
    	**
    	* Chat and Notification Sound
		**
	**/
	function PlayNotificationSound(audioSrc) {
        var audio = $("#PlayNotificationSound");      
    	$("#PlayNotificationSoundFile").attr("src", audioSrc);
    	audio[0].pause();
	    audio[0].load();
	    audio[0].play();
    }
    function PlayChatSound() {
        var chatSound = document.getElementById("PlayChatSound");
        chatSound.currentTime = 0;
        chatSound.play();
    }

    /** 
    	**
    	* Change Font Size
    	**
    **/
	$('#fontSizeSelect').on('change', function() {		
		var fontsize = this.value+"px";
		$(".chat-container .chatbox p").css("font-size", fontsize);
		$(".notification-container .notificationBox #userMsg").css("font-size", fontsize);

		userMsg
	});

	/**
		**
		* Preset Select
		**
	**/
	$('#presets').on('change', function() {		
		var preset = this.value;
		if(preset == "1"){
			alert("test");
		}else if(preset == "2"){
			alert("test");
		}else if(preset == "3"){
			alert("test");
		}
	});	

	/**
		**
		* Fetch All Notification For Today
		**
	**/
	fetchNotif();
	function fetchNotif(){
		var currentdate = new Date();
		var date = currentdate.getFullYear() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getDate();
		var fontsize = $( "#fontSizeSelect" ).val();

		jQuery.ajax({            
            type: "POST",
            url: pluginsURL.pluginsURL + '/xpload-webinar/php/getAllNotif.php',
            data: ({ date:date }),
            dataType: 'json',
    		cache: false,
	        success: function(response) {
	        	var html = '';
				response.forEach(function(data) {
					var notif_id = data.xpload_notif_id;
		    		var userId = data.xpload_notif_uid;
		        	var userName = data.xpload_notif_name;	
		        	var userMsg = data.xpload_notif_messages;	        	        	
		        	var datetime = data.xpload_notif_datetime;
		        	var currentDate = data.xpload_notif_date;
		        	var audioSrc = data.xpload_notif_audiosrc;
		        	var notifColor = data.xpload_notif_color;
		        	
		        	html += "<li class='actual_msg' id='notif_msg_"+notif_id+"' style='text-align:left;float:left;background: #ffffff;width:90%;"+notifColor+"font-size:"+fontsize+"px;'><section><strong style='text-transform:capitalize;font-weight:900;font-size:.8vw;'>"+userName+"</strong><span class='date'>"+datetime+"</span><i class='fa fa-trash deleteNotif' id='"+notif_id+"' style='margin-left: .2vw;'></i><p style='display:block;margin-top:1%;margin-bottom:1%;font-weight:400;' id='userMsg'>"+userMsg+"</p></section></li>";
		    	});

		    	$("#xprowebinarNotificationMsgBox").append(html);
				$("#xprowebinarNotificationMsgBox").animate({scrollTop: $("#xprowebinarNotificationMsgBox").get(0).scrollHeight},900);
				
	        },
	        error: function(response) {
	            console.log(response);
	        }
        });
	}


	/**
		**
		* Search Notification
		**
	**/
	$("#notif-search").click(function(){
		$("#notifSearch").modal();
	});

	var delay = (function() {
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
	})();

	$("#searchNotifItem").keyup(function () {
	        delay(function () {
	            var keyword = $("#searchNotifItem").val();
	            var currentdate = new Date();
				var date = currentdate.getFullYear() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getDate();
				var fontsize = $('#fontSizeSelect').val();

	            var URL = encodeURI("search.php?q=" + keyword);
	            $.ajax({
	                type: "POST",
		            url: pluginsURL.pluginsURL + '/xpload-webinar/php/searchNotif.php',
		            data: ({ keyword:keyword, date:date }),
		            dataType: 'json',
		    		cache: false,
	                success: function(response) {
	                	if ( response.length == 0 ) {
                			$('#searchNotifList').empty();                		
                			html += "<li>No data</li>";
				        	$("#searchNotifList").append(html);	                		
					    }else{ 
                			$('#searchNotifList').empty();
		                    var html = '';
							response.forEach(function(data) {
					    		var userId = data.xpload_notif_uid;
					        	var userName = data.xpload_notif_name;	
					        	var userMsg = data.xpload_notif_messages;	        	        	
					        	var datetime = data.xpload_notif_datetime;
					        	var currentDate = data.xpload_notif_date;
					        	var audioSrc = data.xpload_notif_audiosrc;
					        	var notifColor = data.xpload_notif_color;
					        	
					        	html += "<li class='actual_msg' style='text-align:left;float:left;background: #ffffff;width:90%;"+notifColor+";font-size:"+fontsize+"px;'><section><strong style='text-transform:capitalize;font-weight:900;font-size:.8vw;'>"+userName+"</strong><span class='date' style='display:block!important;'>"+datetime+"</span><p style='display:block;margin-top:1%;margin-bottom:1%;font-weight:500;' id='userMsg'>"+userMsg+"</p></section></li>";
					    	});

					    	$("#searchNotifList").append(html);
				    	}
	                }
	            });
	        }, 500);
	    }
	);

	// Declaration of elements
	var videoContainer = document.getElementById("videoContainer");
	var notificationcontainer = document.getElementById("notification-container");
	var chatcontainer = document.getElementById("chat-container");
	var avatar1 = document.getElementById("avatar1");
	var avatar2 = document.getElementById("avatar2");
	var avatar3 = document.getElementById("avatar3");
	/**
		**
		* Moving of containers
		**
	**/
	$( "#videoContainer" ).draggable({ 
		handle: "#header-image",
		containment: "document",
		start: function( event, ui ) {
			if(event.target.id == "videoContainer"){
				zindexFunction(this.id);
			}
		},
		stop: function( event, ui ) {
		    dragConvertToVw(event.target.id, event.target.offsetTop, event.target.offsetLeft, event.target);
		}
	});
	// Notification Container
	$( "#notification-container" ).draggable({ 
		handle: "h5",
		containment: "document",
		start: function( event, ui ) {
			if(event.target.id == "notification-container"){
				zindexFunction(this.id);
			}
		},
		stop: function( event, ui ) {
			dragConvertToVw(event.target.id, event.target.offsetTop, event.target.offsetLeft, event.target);
		}
	});
	// Chat Contianer
	$( "#chat-container" ).draggable({ 
		handle: "h5",
		containment: "document",
		start: function( event, ui ) {
			if(event.target.id == "chat-container"){
				zindexFunction(this.id);
			}
		},
		stop: function( event, ui ) {
			dragConvertToVw(event.target.id, event.target.offsetTop, event.target.offsetLeft, event.target);
		}
	});
	// Avatar 1
	$( "#avatar1" ).draggable({ 
		handle: "h3",
		containment: "document",
		start: function( event, ui ) {
			if(event.target.id == "avatar1"){
				zindexFunction(this.id);
			}
		},
		stop: function( event, ui ) {
			dragConvertToVw(event.target.id, event.target.offsetTop, event.target.offsetLeft, event.target);
		}
	});
	// Avatar 2
	$( "#avatar2" ).draggable({ 
		handle: "h3",
		containment: "document",
		start: function( event, ui ) {
			if(event.target.id == "avatar2"){
				zindexFunction(this.id);
			}
		},
		stop: function( event, ui ) {
			dragConvertToVw(event.target.id, event.target.offsetTop, event.target.offsetLeft, event.target);
		}
	});
	// Avatar 3
	$( "#avatar3" ).draggable({ 
		handle: "h3",
		containment: "document",
		start: function( event, ui ) {
			if(event.target.id == "avatar3"){
				zindexFunction(this.id);
			}
		},
		stop: function( event, ui ) {
			dragConvertToVw(event.target.id, event.target.offsetTop, event.target.offsetLeft, event.target);
		}
	});
	// Convert px to vw unit
	function dragConvertToVw(id, top, left, target){

        if(window.innerWidth <= 991){
        	var style = document.getElementById(id).style.cssText;
	        saveElementPosition(target, style);
        }else{
        	var top = top / window.innerWidth * 100;
	        var left = left / window.innerWidth * 100;

	        document.getElementById(id).style.top = top + "vw";
	        document.getElementById(id).style.left = left + "vw";	        
	        if(id == "avatar2" || id == "avatar3"){
	        	document.getElementById(id).style.position = "absolute";
	        	var width = document.getElementById(id).style.width;
	        	var height = document.getElementById(id).style.height
	        	if( width == '' || height == ''){
	        		document.getElementById(id).style.width = "inherit";
	        		document.getElementById(id).style.height = "inherit";
	        	}
	        }
	        var style = document.getElementById(id).style.cssText;
	        saveElementPosition(target, style);
        }

	}
	/**
		**
		* Resizing of containers
		**
	**/
	/** Change made recent **/
	$( "#videoContainer" ).resizable({
		handles: "n, e, s, w, ne, se, sw, nw",
		minHeight: 150,
		minWidth: 150,
		resize: function( e, $el, opt ) {
			if(event.target.id == "videoContainer"){
				zindexFunction(this.id);
			}
			if(window.innerWidth <= 1920 && window.innerWidth >= 1681){
				$('#avatarcontainerow').css('position', 'absolute').css('width', '100%').css('top', '28.11vw').css('margin-left', '-.3vw');
			}else if(window.innerWidth <= 1680 && window.innerWidth >= 1601){	
				$('#avatarcontainerow').css('position', 'absolute').css('width', '100%').css('top', '28.11vw').css('margin-left', '-.3vw');
			}else if(window.innerWidth <= 1600 && window.innerWidth >= 1441){
				$('#avatarcontainerow').css('position', 'absolute').css('width', '100%').css('top', '28.11vw').css('margin-left', '-.3vw');
			}else if(window.innerWidth <= 1440 && window.innerWidth >= 1367){
				$('#avatarcontainerow').css('position', 'absolute').css('width', '100%').css('top', '28.11vw').css('margin-left', '-.3vw');
			}else if(window.innerWidth <= 1366 && window.innerWidth >= 1330){
				$('#avatarcontainerow').css('position', 'absolute').css('width', '100%').css('top', '28.3vw').css('margin-left', '-.3vw');
			}else if(window.innerWidth <= 1329 && window.innerWidth >= 1281){
				$('#avatarcontainerow').css('position', 'absolute').css('width', '100%').css('top', '28.4vw').css('margin-left', '-.3vw');
			}else if(window.innerWidth <= 1280 && window.innerWidth >= 1181){
				$('#avatarcontainerow').css('position', 'absolute').css('width', '100%').css('top', '28.4vw').css('margin-left', '-.3vw');
			}else if(window.innerWidth <= 1180 && window.innerWidth >= 992){
				$('#avatarcontainerow').css('position', 'absolute').css('width', '100%').css('top', '28.4vw').css('margin-left', '-.3vw');
			}else if(window.innerWidth <= 991){
				$('#avatarcontainerow').css('position', 'absolute').css('top', '55vw').css('margin-right', '0');
				var style = document.getElementById(e.target.id).style.cssText;
			}
		},
	    stop: function (e, $el, opt) {
	        if(window.innerWidth <= 991){
	        	document.getElementById(e.target.id).style.width = e.target.offsetHeight;
		        document.getElementById(e.target.id).style.height = e.target.clientHeight;
	        	var style = document.getElementById(e.target.id).style.cssText;
		        saveElementPosition(e.target, style);
	        }else{
	        	var vw = e.target.clientWidth / window.innerWidth * 100;
		        var vh = e.target.clientHeight / window.innerWidth * 100;
		        document.getElementById(e.target.id).style.width = vw + "vw";
		        document.getElementById(e.target.id).style.height = vh + "vw";
		        var style = document.getElementById(e.target.id).style.cssText;
		        saveElementPosition(e.target, style);
	        }
	    }
	});
	$( "#notification-container" ).resizable({
		handles: "n, e, s, w, ne, se, sw, nw",
		minWidth: 150,
		resize: function( e, $el, opt ) {
			if(event.target.id == "notification-container"){
				zindexFunction(this.id);
			}
		},
	    stop: function (e, $el, opt) {
	    	$('#notification-container').css('position', 'absolute');
	    	if(e.target.id == "notification-container"){
				zindexFunction(this.id);
			}	        
	        if(window.innerWidth <= 991){
	    		convertToVW( e.target.id, e.target.offsetWidth, e.target.offsetHeight, e.target );
	    	}else{
	    		convertToVW( e.target.id, e.target.clientWidth, e.target.clientHeight, e.target );
	    	}
	    }
	});
	$( "#chat-container" ).resizable({
		handles: "n, e, s, w, ne, se, sw, nw",
		minWidth: 150,
		resize: function( e, $el, opt ) {
			if(event.target.id == "chat-container"){
				zindexFunction(this.id);
			}
		},
	    stop: function (e, $el, opt) {
	    	if(e.target.id == "chat-container"){
				zindexFunction(this.id);
			}       
	        if(window.innerWidth <= 991){
	    		convertToVW( e.target.id, e.target.offsetWidth, e.target.offsetHeight, e.target );
	    	}else{
	    		convertToVW( e.target.id, e.target.clientWidth, e.target.clientHeight, e.target );
	    	}
	    }
	});
	$( "#avatar1" ).resizable({
		handles: "n, e, s, w, ne, se, sw, nw",
		minHeight: 30,
		minWidth: 150,
		resize: function( e, $el, opt ) {
			if(event.target.id == "avatar1"){
				zindexFunction(this.id);
			}
		},
	    stop: function (e, $el, opt) {
	    	if(e.target.id == "avatar1"){
				zindexFunction(this.id);
			}       
	        if(window.innerWidth <= 991){
	    		convertToVW( e.target.id, e.target.offsetWidth, e.target.offsetHeight, e.target );
	    	}else{
	    		convertToVW( e.target.id, e.target.clientWidth, e.target.clientHeight, e.target );
	    	}
	    }
	});
	$( "#avatar2" ).resizable({
		handles: "n, e, s, w, ne, se, sw, nw",
		minHeight: 30,
		minWidth: 150,
		resize: function( e, $el, opt ) {
			if(event.target.id == "avatar2"){
				zindexFunction(this.id);
			}
		},
	    stop: function (e, $el, opt) {
	    	if(e.target.id == "avatar2"){
				zindexFunction(this.id);
			}            
	        if(window.innerWidth <= 991){
	    		convertToVW( e.target.id, e.target.offsetWidth, e.target.offsetHeight, e.target );
	    	}else{
	    		convertToVW( e.target.id, e.target.clientWidth, e.target.clientHeight, e.target );
	    	}
	    }
	});
	$( "#avatar3" ).resizable({
		handles: "n, e, s, w, ne, se, sw, nw",
		minHeight: 30,
		minWidth: 150,
		resize: function( e, $el, opt ) {
			if(event.target.id == "avatar3"){
				zindexFunction(this.id);
			}
		},
	    stop: function (e, $el, opt) {
	    	if(e.target.id == "avatar3"){
				zindexFunction(this.id);
			}   
	    	if(window.innerWidth <= 991){
	    		convertToVW( e.target.id, e.target.offsetWidth, e.target.offsetHeight, e.target );
	    	}else{
	    		convertToVW( e.target.id, e.target.clientWidth, e.target.clientHeight, e.target );
	    	}
	        
	    }
	});
	// convert px to vw
	function convertToVW( id, width, height, target ){
        if(window.innerWidth <= 991){
        	var vw = width / window.innerWidth * 100;
	        var vh = height / window.innerWidth * 100;
	        document.getElementById(id).style.width = vw + "vw";
	        document.getElementById(id).style.height = vh + "vw";
	        var style = document.getElementById(id).style.cssText;
	        saveElementPosition(target, style);
        }else{
        	var vw = width / window.innerWidth * 100;
	        var vh = height / window.innerWidth * 100;
	        document.getElementById(id).style.width = vw + "vw";
	        document.getElementById(id).style.height = vh + "vw";
	        var style = document.getElementById(id).style.cssText;
	        saveElementPosition(target, style);
        }
	}

	function reportWindowSize() {
		// console.log(window.innerWidth);
		// if(window.innerWidth >= 993){
		// 	document.getElementById("xploadvideo-container").style.marginTop = "0%";
		// }
		// if(window.innerWidth <= 992){			
		// 	document.getElementById("xploadvideo-container").style.marginTop = "15%";
		// }
	}
	window.onresize = reportWindowSize;
	// Reset Layout View
	$( "#resetView" ).click(function() {
	  	$.confirm({
		    title: 'Reset View!',
		    content: 'Do you want to reset the view of all the elements?',
		    buttons: {
		        confirm: function () {
		        	var style1 = "width:100%;height:auto;";
					var style2 = "";

		            document.getElementById("videoContainer").style.cssText = style1;
		            document.getElementById("notification-container").style.cssText = style2;
		            document.getElementById("chat-container").style.cssText = style2;
		            document.getElementById("avatar1").style.cssText = style2;
		            document.getElementById("avatar2").style.cssText = style2;
		            document.getElementById("avatar3").style.cssText = style2;

		            document.getElementById("videocontainerrow").style.cssText = style2;
		            document.getElementById("avatarcontainerow").style.cssText = style2;
		            document.getElementById("videoContainer2").style.cssText = style2;		            

		            if(window.innerWidth == 1920){
						$('#avatarcontainerow').css('top', '30.85vw').css("margin-left", '-15px');
					}else if(window.innerWidth == 1680){				
						$('#avatarcontainerow').css('top', '30.85vw').css("margin-left", '-15px');
					}else if(window.innerWidth == 1600){
						$('#avatarcontainerow').css('top', '30.85vw').css("margin-left", '-15px');
					}else if(window.innerWidth == 1440){
						$('#avatarcontainerow').css('top', '30.85vw').css("margin-left", '-15px');
					}else if(window.innerWidth == 1366){
						$('#avatarcontainerow').css('top', '30.85vw').css("margin-left", '-15px');
					}else if(window.innerWidth == 1329){
						$('#avatarcontainerow').css('top', '30.85vw').css("margin-left", '-15px');
					}else if(window.innerWidth == 1280){
						$('#avatarcontainerow').css('top', '30.85vw').css("margin-left", '-15px');
					}else if(window.innerWidth == 1180){
						$('#avatarcontainerow').css('top', '30.85vw').css("margin-left", '-15px');
					}

		            document.getElementById("xprowebinarPublisherCamera").style.cssText = style2;

		            var videoContainer = document.getElementById("videoContainer");
		            var notificationcontainer = document.getElementById("notification-container");
					var chatcontainer = document.getElementById("chat-container");
					var avatar1 = document.getElementById("avatar1");
					var avatar2 = document.getElementById("avatar2");
					var avatar3 = document.getElementById("avatar3");

					saveElementPosition(videoContainer, style1);
					saveElementPosition(notificationcontainer, style2);
					saveElementPosition(chatcontainer, style2);
					saveElementPosition(avatar1, style2);
					saveElementPosition(avatar2, style2);
					saveElementPosition(avatar3, style2);					

					var avatar_1 = document.getElementById("avatar_1");
		            var avatar_2 = document.getElementById("avatar_2");
					var avatar_3 = document.getElementById("avatar_3");
					var videoContainer2 = document.getElementById("videoContainer2");
					var messagenotif = document.getElementById("message-notif");
					var messagechat = document.getElementById("message-chat");

					avatar_1.style.display = "block";
					avatar_2.style.display = "block";
					avatar_3.style.display = "block";
					videoContainer2.style.display = "block";
					messagenotif.style.display = "block";
					messagechat.style.display = "block";

					saveElementPosition(avatar_1, style2);
					saveElementPosition(avatar_2, style2);
					saveElementPosition(avatar_3, style2);
					saveElementPosition(videoContainer2, style2);
					saveElementPosition(messagenotif, style2);
					saveElementPosition(messagechat, style2);
		        },
		        cancel: function () {
		            // $.alert('Canceled!');
		        }
		    }
		});
	});

	// Z-index for all elements
	$( "#avatar1" ).click(function() {
		if(this.id == "avatar1"){
			zindexFunction(this.id);
		}
	});
	$( "#avatar2" ).click(function() {
		if(this.id == "avatar2"){
			zindexFunction(this.id);
		}
	});
	$( "#avatar3" ).click(function() {
		if(this.id == "avatar3"){
			zindexFunction(this.id);
		}
	});
	$( "#videoContainer" ).click(function() {
		if(this.id == "videoContainer"){
			zindexFunction(this.id);
		}
	});
	$( "#notification-container" ).click(function() {
		if(this.id == "notification-container"){
			zindexFunction(this.id);
		}
	});
	$( "#chat-container" ).click(function() {
		if(this.id == "chat-container"){
			zindexFunction(this.id);
		}
	});
	$( "#sound_font_select" ).click(function() {
		if(this.id == "sound_font_select"){
			zindexFunction(this.id);
		}
	});


	// All elements array
	var zAllElements = ['avatar1', 'avatar2', 'avatar3', 'videoContainer', 'notification-container', 'chat-container']; 
	function zindexFunction(id){
		// Number of elements in the array		
		var noOfElements = zAllElements.length;
		//New array to contain elemts ID info
		var zIndexArray = new Array;
		//Temp container for ID array build
		var elidc;
		//loop to store all the elements info
		for (var i = 0; i < noOfElements; i++) {
			elidc = document.getElementById(zAllElements[i]).style.zIndex;			
			zIndexArray.push(elidc);			
		}
		var highestZ;
		//find the highest element
		highestZ = Math.max(...zIndexArray);
		//set the element to be the topmost 
		var t = document.getElementById(id).style.zIndex = highestZ + 1;

		var style = document.getElementById(id).style.cssText;
	    saveElementPosition(id, style);
	}


	// SHow Hide Elements
	function GetThisHidden(id){
		$("#"+id).hide("slide", { direction: "left" }, 1500,function(){
			var element = document.getElementById(id);
			var style = element.style.cssText;
			saveElementPosition(element, style);
		});	    
	}
	function GetThisDisplayed(id){
		$("#"+id).show("slide", { direction: "left" }, 1500).css("display", "block");
		var element = document.getElementById(id);  
        var style = element.style.cssText;
        saveElementPosition(element, style);
	    
	}

	// Show Hide Elements
	$( "#avatarToggle1" ).click(function() {  
	    if($( '#avatar1' ).is(":visible")){
	    	GetThisHidden("avatar1")
	    }else{
	    	GetThisDisplayed("avatar1");
	    }
	});
	$( "#avatarToggle2" ).click(function() {     
	    if($( '#avatar2' ).is(":visible")){    	
	    	GetThisHidden("avatar2");
	    }else{
	    	GetThisDisplayed("avatar2");
	    }
	});
	$( "#avatarToggle3" ).click(function() {     
	    if($( '#avatar3' ).is(":visible")){    	
	    	GetThisHidden("avatar3");
	    }else{
	    	GetThisDisplayed("avatar3");
	    }
	});

	$( "#tradeAnnouncementToggle" ).click(function() {
	    if($( '#message-notif' ).is(":visible")){    	
	    	GetThisHidden("message-notif");
	    	$( '#message-notif' ).css("width","100%");
	    }else{
	    	GetThisDisplayed("message-notif");
	    	$( '#message-notif' ).css("width","auto");
	    } 
	});	
	$( "#ChatToggle" ).click(function() {     
	    if($( '#message-chat:visible' ).is(":visible")){    	
	    	GetThisHidden("message-chat");
	    }else{
	    	GetThisDisplayed("message-chat");
	    }
	});
	$( "#screenShareToggle" ).click(function() {     
	    if($( '#videoContainer:visible' ).is(":visible")){
	        $('#videoContainer').hide("slide", { direction: "left" }, 1000);	    
	    	$('#videoContainer2').css("height", "592.117px");
	    	var videoContainer = document.getElementById("videoContainer");
	        var style = document.getElementById("videoContainer").style.cssText;
	        saveElementPosition(videoContainer, style);  
	    }else{
	        $('#videoContainer').show("slide", { direction: "left" }, 1000);
	        $('#videoContainer2').css("height", "auto");
	        var videoContainer = document.getElementById("videoContainer");
	        var style = document.getElementById("videoContainer").style.cssText;
	        saveElementPosition(videoContainer, style);
	    }
	});

	$( "#chartToggle" ).click(function() {     
	    if($( '#chart1:visible' ).is(":visible")){
	        $('#chart1').hide("slide", { direction: "left" }, 1000);
	        document.getElementById("xploadwebinar-container").style.top = "50%";
	        var chart1 = document.getElementById("chart1").style.cssText;

	        saveElementPosition(chart1, style1); 
	    }else{
	        $('#chart1').show("slide", { direction: "left" }, 1000);
	        var chart1 = document.getElementById("chart1").style.cssText;
	         document.getElementById("xploadwebinar-container").style.top = "85%";
	        saveElementPosition(chart1, style1);       
	    }
	});

	$( "#statisticsToggle" ).click(function() {     
	    if($( '#chart2:visible' ).is(":visible")){
	        $('#chart2').hide("slide", { direction: "left" }, 1000);
	        document.getElementById("xploadwebinar-container").style.top = "50%";
	        var chart1 = document.getElementById("chart1").style.cssText;

	        saveElementPosition(chart1, style1); 
	    }else{
	        $('#chart2').show("slide", { direction: "left" }, 1000);
	        var chart1 = document.getElementById("chart2").style.cssText;
	         document.getElementById("xploadwebinar-container").style.top = "85%";
	        saveElementPosition(chart2, style1);       
	    }
	});

	

	// Save element size and position to database
	function saveElementPosition(element, style){
		var userId = $("#chatUserID").val();
		var userName = $("#chatUserName").val();
		jQuery.ajax({            
			type: "POST",
			url: pluginsURL.pluginsURL + '/xpload-webinar/php/elementPosition.php',
			data: ({ userId:userId, userName:userName, elementId:element.id, style:style }),
			cache: false,
			success: function(response) {
				// console.log("SUCCESS RESPONSE " + response);
			},
			error: function(response) {
				// console.log("ERROR RESPONSE " + response);
			}
		});
	}
	
});