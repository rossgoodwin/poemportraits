(function(){


var badWords;

$.getJSON("js/badwords.json", function(data){
	badWords = data;
	// console.log(badWords);
});


function addForm() {
	$("#inner-container").html(
        '<h2>Welcome</h2>'
      + '<p id="help-text">To generate your <span class="poem-text">POEM</span><strong>PORTRAIT</strong>,<br>please donate a word.</p>'
      // + '<form action="#">'
      + '<div class="mdl-textfield mdl-js-textfield">'
      + '<input class="mdl-textfield__input" type="text" id="word-input" />'
      + '<label class="mdl-textfield__label" for="word-input">Your word...</label>'
	  + '<button id="submit-btn" class="mdl-button mdl-js-button"><i class="material-icons">arrow_forward</i></button></div>'
	  // + '</form>'
	);

	componentHandler.upgradeElements($('#inner-container'));


	$('#submit-btn').click(function(){
		var userInput = $('#word-input').val().trim();
		console.log(userInput);
		if (badWords.includes(userInput.toLowerCase())) {
			$('#help-text').text('Word not accepted, please try again.');
		}
		else if (userInput) {
			$.post('http://54.149.122.114:5000/sms', { 'word': userInput });

			$('#inner-container').html(
				'<h3>Preparing to capture <span class="poem-text">POEM</span><strong>PORTRAIT</strong></h3>'
			  + '<ol>'
			  + '<li>Look up at the screen.</li>'
			  + '<li>Adjust your seat height.</li>'
			  + '<li>Pose for photo.</li>'
			  + '</ol>'

			);
		}
	});

	// $('#word-input').focus();
}

function emailScreen(imgUrl) {
	$('#inner-container').html(
		'<h4><span class="poem-text">POEM</span><strong>PORTRAIT</strong> printing</h4>'
      + '<p>Please enter your email address to receive a digital version. This information will not be stored.</p>'
	  + '<div id="email-div" class="mdl-textfield mdl-js-textfield">'
      + '<input class="mdl-textfield__input" type="text" id="email-input" />'
      + '<label class="mdl-textfield__label" for="email-input">Your email...</label>'
      + '<button id="email-submit-btn" class="mdl-button mdl-js-button"><i class="material-icons">arrow_forward</i></button></div>'
	  + '<br><button id="email-cancel-btn" class="mdl-button mdl-js-button small-btn">SKIP</button>'
	);

	componentHandler.upgradeElements($('#inner-container'));

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
		'<h3>Thank you<br>for taking part.</h3>'
	  + '<p>Your <span class="poem-text">POEM</span><strong>PORTRAIT</strong> will be ready for you to collect as you leave.</p>'
	);
}





addForm();



var socket = io('http://54.149.122.114:5000/img_url');
// var nsp = io.of('/img_url');

socket.on('img_url', function(data){
	console.log(data);
	imgUrl = data['url']
	$('#inner-container').html(
		'<h3><span class="poem-text">POEM</span><strong>PORTRAIT</strong> captured.</h3>'
	  + '<div class="image-preview"><img src="'+imgUrl+'"></div>'
	  + '<button id="btn-continue" class="mdl-button mdl-js-button">Continue <i class="material-icons">arrow_forward</i></button>'
	  + '<p class="small-text">By continuing, you allow this image to be used by the Serpentine Galleries and appear as part of the artwork.</p>'
	  + '<button id="btn-cancel" class="mdl-button mdl-js-button small-btn">Cancel</button>'
	);

	componentHandler.upgradeElements($('#inner-container'));

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




})();
