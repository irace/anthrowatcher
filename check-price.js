var request = require('request')
  , cheerio = require('cheerio')
  , async   = require('async')
  , fs      = require('fs');

function check_price(callback) {
  fs.readFile('items.json', function (err, file) {
    if (err) {
      console.log(err);
      return;
    }

    var items = JSON.parse(file);

    async.map(items['items'], check_item_selector_value, function (err, results) {
      if (err) {
        console.log(err);
        return;
      }

      async.filter(results, item_has_new_price, function (results) {
        async.map(results, new_price_message_for_item, function (err, messages) {
          if (err) {
            console.log(err);
            return;
          }

          var subject = 'Price change detected!'
            , body    = messages.join('\n');

          file_if_exists_or_environment('config.json', function (config) {
            send_email(subject, body, config.FROM_EMAIL, config.FROM_NAME, config.TO_EMAIL, 
              config.MANDRILL_APIKEY, callback);
          });
        });
      });
    });
  });
}

function new_price_message_for_item(item, callback) {
  callback(null, 'Item has new price ' + item.new_value + ': ' + item.url);
}

function item_has_new_price(item, callback) {
  callback(item.hasOwnProperty('new_value'));
}

function check_item_selector_value(item, callback) {
  request(item.url, function (err, response, body) {
    if (err) {
      callback(err, item);
      return;
    }

    var $ = cheerio.load(body);

    var value = $(item.selector).first().text().trim();
    
    if (value !== item.value) {
      item['new_value'] = value;
    }

    callback(null, item);
  }); 
}

function file_if_exists_or_environment(file_name, callback) {
  fs.exists(file_name, function(exists) {
    if (exists) {
      fs.readFile(file_name, function (err, file) {
        callback(JSON.parse(file));
      });
    }
    else {
      callback(process.env);
    }
  });
}

function send_email(subject, body, from_email, from_name, to_email, api_key, callback) {
  var mandrill_client = new require('mandrill-api/mandrill').Mandrill(api_key);

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

check_price(function() {
  process.exit();
});
