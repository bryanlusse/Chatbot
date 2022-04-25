$(function (){
    console.log(_json)
    _json = _json.replaceAll("I&#39;m", "I'm");
    _json = _json.replaceAll("You&#39;re", "You're");
    _json = _json.replaceAll("you&#39;re", "You're");
    _json = _json.replaceAll("She&#39;s", "She's");
    _json = _json.replaceAll("she&#39;s", "she's");
    _json = _json.replaceAll("He&#39;s", "He's");
    _json = _json.replaceAll("he&#39;s", "he's");
    _json = _json.replaceAll("We&#39;re", "We're");
    _json = _json.replaceAll("we&#39;re", "we're");
    _json = _json.replaceAll("They&#39;re", "They're");
    _json = _json.replaceAll("they&#39;re", "they're");

    _json = _json.replaceAll("I&#39;ll", "I'll");
    _json = _json.replaceAll("You&#39;ll", "You'll");
    _json = _json.replaceAll("you&#39;ll", "You'll");
    _json = _json.replaceAll("She&#39;ll", "She'll");
    _json = _json.replaceAll("she&#39;ll", "she'll");
    _json = _json.replaceAll("He&#39;ll", "He'll");
    _json = _json.replaceAll("he&#39;ll", "he'll");
    _json = _json.replaceAll("We&#39;ll", "We'll");
    _json = _json.replaceAll("we&#39;ll", "we'll");
    _json = _json.replaceAll("They&#39;ll", "They'll");
    _json = _json.replaceAll("they&#39;ll", "they'll");


    _json = _json.replaceAll("&#39;", '"');
    _json = _json.replaceAll("&#34;", '"');
    console.log(_json)
    try {
        _json = JSON.parse(_json)
    } catch (err) {
        var tag = document.createElement("h1");
        tag.style.position = "absolute"
        tag.style.zIndex = "12"
        tag.style.width = "80%"
        var text = document.createTextNode(String(err) + "\n, please reload the page.");
        tag.appendChild(text);
        var element = document.getElementById("viewport");
        element.appendChild(tag);
    }

    
	init();
	function init () {
		renderData();
	};	

    // Send POST data
    // POST
    async function postData() {
        await fetch('/', {

            // Declare what type of data we're sending
            headers: {
            'Content-Type': 'application/json'
            },

            // Specify the method
            method: 'POST',

            // A JSON payload
            body: JSON.stringify(_json)
        }).then(function (response) { // At this point, Flask has printed our JSON
            return response.json();
        }).then(function (json) {
            _json = json;
            console.log('POST response: ');

            console.log(json);
        });
        newMsgRender(_json['chats'].slice(-1)[0])
    }
	
	// RENDER METHODS
	function renderData () {
		var userID = 'You';
		var parentString = '<div class="chatbox" id="'+userID+'">'+
             '<div class="top-bar">'+
             '<div class="clock">'+
             '<p class="p1" id="time">7:21</p>'+
             '</div>'+
             '<div class="wifi">'+
             '<i class="fa fa-wifi"></i>'+
             '</div>'+
             '</div>'+
			 '<div class="chats">'+
			 '<ul></ul>'+
			 '</div>'+
			 '<div class="sendBox">'+
             '<input style="font-size:12;" type="text" name="sendToBot" placeholder="Enter next message '+'...">' +
             '</div>';	
		$('#viewport').append(parentString);
        for (message in _json.chats){
            chat = _json.chats[message]
            var _cl;
            (chat.from === userID) ? _cl = 'you' : _cl = 'him';
            var dataString = '<li>'+
                '<div class="msg ' + _cl +'">'+
                '<span class="partner">'+ chat.from +'</span>'+
                chat.msg +
                '<span class="time">' + getDateTime(chat.time) + '</span>'+
                '</div></li>';
            if (chat.from == 'James' && chat.time == _json.chats.slice(-1)[0].time){
                demo(userID = userID, dataString = dataString)
            }
            else {
                $('#viewport #'+ userID +' .chats>ul').append(dataString);	
            }
        }	
	};
	
    async function demo(userID, dataString) {
        pendingRender('James');
        await new Promise(r => setTimeout(r, 5000));
        $('#viewport .chats ul>li.pending').remove();
        $('#viewport #'+ userID +' .chats>ul').append(dataString);	
    }

	function newMsgRender (data) {
		$('#viewport .chats ul>li.pending').remove();
		var userID = 'You';
		var checkID = userID.replace(/ /g,"_");
		var _cl = '';
		(data.from === userID) ? _cl = 'you' : _cl= 'him';					
		$('#viewport .chatbox#'+ checkID +' .chats ul')
			.append('<li><div class="msg '+_cl+'">'+
					  '<span class="partner">'+ data.from +'</span>'+
					  data.msg +
					  '<span class="time">' + getDateTime(data.time) + '</span>'+
					  '</div>'+
					  '</li>');	
	}

    function pendingRender (typingUser) {
		var pending = '<li class="pending">'+
			 '<div class="msg load">'+
			 '<div class="dot"></div>'+
			 '<div class="dot"></div>'+
			 '<div class="dot"></div>'+
			 '</div>'+
			 '</li>';
		_json.users.forEach( function (user) {
			user = user.replace(/ /g,"_");
			if(user !== typingUser) {
				if(!($('#'+ user +' .chats ul>li').hasClass('pending')))
					$('#'+ user +' .chats ul').append(pending);
			}
		});		
	}
	
	// HELPER FUNCTION
	function getDateTime(t) {
		var month 	= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];	
		var d 		= new Date(+t);
        var month2 	= (month[d.getMonth()]);
        var day 	= d.getDate().toString();
        var hour 	= d.getHours().toString();
        var min 	= d.getMinutes().toString();
		(day.length < 2) ? day = '0' + day : '';
		(hour.length < 2) ? hour = '0' + hour : '';
		(min.length < 2) ? min = '0' + min : '';
        console.log(d)
		var res = ''+month2+' '+day+' '+hour+ ':' + min;
		return res;
	}
	
	// KEYPRESS EVENTS HANDLER
	$('#viewport .sendBox>input').keypress(function( e ) {	
		var _id = $(this).closest('.chatbox').attr('id');
		if(e.which == 13) {
			var msgFrom;
			_json.users.forEach(function (user) {
				if(user.replace(/ /g,"_") === _id)
					msgFrom = user;
			});
			var msg = $('#'+_id+' .sendBox>input').val();
			msg = msg.replace(/\"/g,'\\"');
			var t = $.now();
			$('#'+_id+' .sendBox>input').val('');
			if(msg.replace(/\s/g, '') !== ''){
				var temp = {
					from: msgFrom,
					msg: msg,
					time: t.toString(),
					action: ''
				}
				_json.chats.push(temp);
				console.log(_json);
				newMsgRender(temp);
                pendingRender('James');
                postData();
			} else {
				$('#viewport .chats ul>li.pending').remove();
			}

		}
	});	
    
    // NEW CONVERSATION EVENT HANDLER
    document.getElementById("button").addEventListener("click", resetConv);

    // RESET CONVERSATION
    function resetConv(){
        _json = {
            users: ["James", "You"],
            chats: [{
                from: 'James',
                msg: 'Hi, what do you want to chat about?',
                time: '1533263925814',
                action: ''
            }]
        }
        const msgs = Array.from(document.getElementsByClassName('msg'));
        msgs.forEach(msg => {
            msg.remove();
        });
        boxes = Array.from(document.getElementsByClassName('chatbox'));
        boxes.forEach(box => {
            box.textContent = '';
            box.remove();
        });
        renderData();
        console.log("restarted")
        $('#viewport .sendBox>input').keypress(function( e ) {	
            var _id = $(this).closest('.chatbox').attr('id');
            if(e.which == 13) {
                var msgFrom;
                _json.users.forEach(function (user) {
                    if(user.replace(/ /g,"_") === _id)
                        msgFrom = user;
                });
                var msg = $('#'+_id+' .sendBox>input').val();
                msg = msg.replace(/\"/g,'\\"');
                var t = $.now();
                $('#'+_id+' .sendBox>input').val('');
                if(msg.replace(/\s/g, '') !== ''){
                    var temp = {
                        from: msgFrom,
                        msg: msg,
                        time: t.toString(),
                        action: ''
                    }
                    _json.chats.push(temp);
                    console.log(_json);
                    newMsgRender(temp);
                    pendingRender('James');
                    postData();
                } else {
                    $('#viewport .chats ul>li.pending').remove();
                }
            }
        });	
    }

	
	// EVENT HANDLER
	$('#viewport .sendBox>input').focusout(function() {
		$('#viewport .chats ul>li.pending').remove();
	});

});

 // INIT CHATBOX 
let mockChat = {
    instances: Object,
    init(args) {
      /*
       * DEFAULT PARAMETERS
       */
      let params = {
        id: args.id ? args.id : "mockChat",
      };
  
      /*
       * CREATE MARKUP
       */
  
      let mockChatContainer = document.querySelector("#" + params.id);
      mockChatContainer.innerHTML = `
                  <div class="device">
                      <div class="screen" >
                          <div class="app">
                          </div>
                      </div>
                  </div>
              `;
      mockChatContainer.classList.add("mockchat");
      /*
       * TEMPLATES
       */
  
    },
  };
  

  function getCurrentTime(){
    var current = new Date();
    var time = current.getHours().toString()+':'+current.getMinutes().toString();
    document.getElementById('time').innerHTML = time
    
  }
  setInterval(getCurrentTime, 10000);
