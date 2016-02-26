module.exports = function(db, config){
	var database = require('./database')(db, config);
	database.get = database.select;
	database.edit = database.update;
	database.query = require('./querybuilder')(db);
	return database;
};
