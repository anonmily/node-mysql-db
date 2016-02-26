Log Easily
====================
![Log Easily Dependency badge](https://david-dm.org/anonmily/log-easily.svg)

A small and simple colored logging tool.

[GITHUB:	https://github.com/anonmily/log-easily](https://github.com/anonmily/log-easily)

[NPM:		https://www.npmjs.com/package/log-easily](https://www.npmjs.com/package/log-easily)

## Installation - Node
To install as a Node package, simply install via npm:

    npm install log-easily

Then, you can require and start using the package as you wish:

	var log = require('log-easily');
	log.info('this is an informational message');	// grey
	log.warning('I'm warning you');			// yellow
	log.success('This was a success');		// green
	log.error('Something went horribly wrong');	// red

## Usage

Logging depends on two environmental variables, SHOW_DEBUG and SHOW_ERRORS

| Version | Notes                                                                                                                                                                            |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Info   | Informational, grey. Visible when SHOW_DEBUG=true |
| Warning  | Warning, yellow. Visible when SHOW_DEBUG=true  |
| Success | Success, green. Visible when SHOW_DEBUG=true	|npm
| Error  | Error, red. Visible when SHOW_DEBUG=true and SHOW_ERRORS=true  |
