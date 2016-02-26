var color = require('colors');
var is = require('simply-is');

var env = process.env,
	SHOW_DEBUG = env.SHOW_DEBUG,
	SHOW_ERRORS = env.SHOW_ERRORS;
	
var log = {
	info: function(m){
		m = is.defined(m) ? m : "";
		if(SHOW_DEBUG){ console.log( m.grey ); }
	},
	warning: function(m){
		m = is.defined(m) ? m : "";
		if(SHOW_DEBUG){ console.log( m.yellow ); }
	},
	success: function(m){
		m = is.defined(m) ? m : "";
		if(SHOW_DEBUG){ console.log( m.green ); }
	},
	error: function(m){
		m = is.defined(m) ? m : "";
		if(SHOW_DEBUG){ console.log( m.red ); }
	}
};

module.exports = log;