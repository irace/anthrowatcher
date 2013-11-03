function checkPrice(callback) {
	var request = require('request')
	  , cheerio = require('cheerio');

	var url = 'http://www.anthropologie.com/anthro/product/clothes-dress-lbd/29584430.jsp';

	request(url, function (error, response, body) {
		var $ = cheerio.load(body);

		var price = $('[itemprop=price]').first().text().trim();

		fileIfExistsOrEnvironment('config.json', function(config) {
			sendEmail('Price is: ' + price, url, config.FROM_EMAIL, config.FROM_NAME,
				config.TO_EMAIL, config.MANDRILL_API_KEY, callback);
		});
	});	
}

function fileIfExistsOrEnvironment(file_name, callback) {
	var fs = require('fs');

	fs.exists(file_name, function(exists) {
	  if (exists) {
	  	fs.readFile(file_name, function(err, file) {
	  		callback(JSON.parse(file));
	  	});
	  }
	  else {
	  	callback(process.env);
	  }
	});
}

function sendEmail(subject, body, from_email, from_name, to_email, api_key, callback) {
	var mandrill = require('mandrill-api/mandrill')
	  , mandrill_client = new mandrill.Mandrill(api_key);

	console.log('Will send email with subject: ' + subject);

	mandrill_client.messages.send({
	  message: {
	    subject: subject,
	    text: body,
	    from_email: from_email,
	    from_name: from_name,
	    to: [{ email: to_email }]
	  } 
	}, function(result) {
	  console.log(result);
	  callback();

	}, function(e) {
	  console.log('A Mandrill error occurred: ' + e.name + ', ' + e.message);
	  callback();
	});
}	

checkPrice(function() {
	process.exit();
});
