var request = require('request')
  , cheerio = require('cheerio');

request('http://www.anthropologie.com/anthro/product/clothes-dress-lbd/29584430.jsp', function (error, response, body) {
	var $ = cheerio.load(body);

	var price = $('[itemprop=price]').first().text().trim();

	console.log('Price is: ' + price);

	if (price !== '$248.00') {
		// TODO: Alert
	}
});
