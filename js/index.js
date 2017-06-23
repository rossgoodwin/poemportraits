$(function(){


var badWords;

$.getJSON("js/badwords.json", function(data){
	badWords = data;
	// console.log(badWords);
});


function addForm() {
	$("#inner-container").html(
        '<h2>Welcome.</h2>'
      + '<p id="help-text">To generate your POEMPORTRAIT, please contribute a word.</p>'
      + '<div class="mdl-textfield mdl-js-textfield">'
      + '<input class="mdl-textfield__input" type="text" id="word-input">'
      + '<label class="mdl-textfield__label" for="word-input">Your word...</label>'
      + '</div><br>'
	  + '<button id="submit-btn" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">SUBMIT</button>'
	);

	$('#submit-btn').click(function(){
		var userInput = $('#word-input').val().trim();
		console.log(userInput);
		if (badWords.includes(userInput.toLowerCase())) {
			$('#help-text').text('Word not accepted, please try again.');
		}
		else if (userInput) {
			$.post('http://54.149.122.114:5000/sms', { 'word': userInput });

			$('#inner-container').html(
				'<h3>Preparing to capture POEMPORTRAIT.</h3>'
			  + '<ol>'
			  + '<li>Look up at the screen.</li>'
			  + '<li>Adjust your seat height.</li>'
			  + '<li>Pose for photo.</li>'
			  + '</ol>'

			);
		}
	});

	$('#word-input').focus();
}

function emailScreen(imgUrl) {
	$('#inner-container').html(
		'<p>Please enter your email address to receive a digital version. This information will not be stored.</p>'
	  + '<div class="mdl-textfield mdl-js-textfield">'
      + '<input class="mdl-textfield__input" type="email" id="email-input">'
      + '<label class="mdl-textfield__label" for="email-input">Your email...</label>'
      + '</div><br>'
      + '<button id="email-submit-btn" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">SUBMIT</button>'
	  + '<button id="email-cancel-btn" class="mdl-button mdl-js-button mdl-js-ripple-effect">CANCEL</button>'
	);

	$('#email-submit-btn').click(function(){
		userEmail = $('#email-input').val();

		if (userEmail) {
			$.post('http://54.149.122.114:5000/email', {
				'url': imgUrl,
				'email': userEmail	
			});

			// THANK YOU!

			thankYou();
			setTimeout(addForm, 5000);
		}

	});


	$('#email-cancel-btn').click(function(){
	 // THANK YOU!!

	 	thankYou();
	 	setTimeout(addForm, 5000);
	});
}


function thankYou() {
	$('#inner-container').html(
		'<p>Thank you for taking part.</p>'
	  + '<p>Your POEMPOTRAIT will be ready for you to collect as you leave.</p>'
	);
}





addForm();



var socket = io('http://54.149.122.114:5000/img_url');
// var nsp = io.of('/img_url');

socket.on('img_url', function(data){
	console.log(data);
	imgUrl = data['url']
	$('#inner-container').html(
		'<h3>POEMPORTRAIT captured.</h3>'
	  + '<div class="image-preview"><img src="'+imgUrl+'"></div>'
	  + '<p>By continuing, you allow this image to appear as part of the artwork. It will not be used for any other purpose.</p>'
	  + '<button id="btn-continue" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">CONTINUE</button>'
	  + '<button id="btn-cancel" class="mdl-button mdl-js-button mdl-js-ripple-effect">CANCEL</button>'
	);

	$('#btn-cancel').click(function(){
		$.post('http://54.149.122.114:5000/confirm', {
				'confirmed': 0,
				'url': imgUrl
			});
		addForm();
	});

	$('#btn-continue').click(function(){

		$.post('http://54.149.122.114:5000/confirm', {
				'confirmed': 1,
				'url': imgUrl
			});

		emailScreen(imgUrl);
	})
});

});
