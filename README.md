# panshopticon

> Morals reformed—health preserved—industry invigorated—instruction diffused—public burthens lightened—Economy seated, as it were, upon a rock—the gordian knot of the poor-law not cut, but untied—all by a simple idea in Architecture!

A Node.js script that checks retail website prices and sends email (using [Mandrill](https://mandrillapp.com)) if any changes are detected. Intended to be run by a scheduler (e.g. [Heroku's](https://addons.heroku.com/scheduler)).

Configure [`items.json`](https://github.com/irace/panshopticon/blob/master/items.json) with an array of objects containing:

* A URL 
* A selector used to identify the price elements on the page
* An initial price

This script also requires a `config.json` file with the following properties:

* `FROM_NAME`
* `TO_EMAIL`
* `MANDRILL_APIKEY`

This should hardly be considered "production-ready."

## License
Available for use under the MIT license: [http://bryan.mit-license.org](http://bryan.mit-license.org)
