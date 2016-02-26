// Dependencies
var _			=	require('lodash'),
	db 			= 	require('./db-pool'),
	qutil 		=	require('./querybuilder')(db),
	is 			= require('simply-is'),
    log 		= require('log-easily');

// Set variables
var env 		= process.env;
var DATABASE 	= env['DB_DATABASE'];
if( env['NODE_ENV'] === 'test'){
	DATABASE = env['DB_TEST_DATABASE'];
}
log.info('Chosen Database: ' + DATABASE);

// Export
module.exports = {
	select: function(queryobj,callback){

		var q = _.clone(queryobj);

		// overrides
		if(q.override){
			var overridden = qutil.set.override(q.override, q.criteria, q.select);
			q.select = overridden.select;
			q.criteria = overridden.criteria;
		}

		// determine the presence/absence of a limit on entries returned
		var limit = "";
		if(q.criteria && q.criteria.limit && q.criteria.limit !== 0){ 
			limit = qutil.set.limit(q.criteria.limit); 
			delete q.criteria.limit;
		}else if(q.limit && q.limit !== 0){
			limit = qutil.set.limit(q.limit);
		}

		// Parts of the query
		var select 	= qutil.set.select(q.select),
			from	= "FROM " + q.from + " ",
			where	= qutil.set.where(q.criteria),
			join	= qutil.set.join(q.join),
			//orderby = q.orderby.join(','),
			groupby = qutil.set.groupby(q.groupby),
			database = q.database ? q.database : DATABASE;

		query = select + from + join + where + groupby + limit;
		qutil.run(database, query, callback);
		
	},
	update: function(queryobj,callback){

		// Variables
		var values = [];
		var fields = queryobj.fields;
		var database = queryobj.database ? queryobj.database : DATABASE;

		// for all fields/values, create the update values
		_.forIn(fields,function(value,column){
			// for functions (e.g. UTC_DATETIME()) don't put quotes
			if(String(value).indexOf('()') >= 0){
				values.push(qutil.escapeId(column) + "=" + value);
			}else{
				values.push(qutil.escapeId(column) + '=\"' + qutil.escapeValue(value)+'\"');
			}
		});
		var query = "UPDATE " + queryobj.table + " SET ";
		query += values.join(',') + " ";
		if(queryobj.criteria){
			query += qutil.set.where(queryobj.criteria);
		}
		qutil.run(database, query, callback);
	},
	insert: function(queryobj,callback){
		var database = queryobj.database ? queryobj.database : DATABASE;
		var values = [];
		var fields = queryobj.fields;

		_.forIn(fields, function(value,column){
			// for functions (e.g. UTC_DATETIME()) don't put quotes
			if(String(value).indexOf('()') >= 0){
				values.push(qutil.escapeId(column) + "=" + value);
			}else{
				values.push(qutil.escapeId(column) + '=\"' + qutil.escapeValue(value)+'\"');
			}
		});

		var query = "INSERT INTO " + queryobj.table + " SET ";
		query += values.join(',');
		qutil.run(database, query, callback);
	},
	delete: function(queryobj,callback){
		var database = queryobj.database ? queryobj.database : DATABASE;
		var query = "DELETE FROM " + queryobj.table + " ";
		query += qutil.set.where(queryobj.criteria);
		qutil.run(database, query, callback);
	},
	truncate: function(queryobj, callback){
		var database = queryobj.database ? queryobj.database : DATABASE;
		qutil.run(database, "TRUNCATE " + queryobj.table, callback);
	},
	get: this.select,
	edit: this.update,
	new: this.insert
};
