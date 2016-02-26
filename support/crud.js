/*
 * Expects a config object with the following keys:
 * - schema
 * - defaults
 *
 */

// Dependencies
	var _ = require('lodash');
	var is = require('simply-is');
	var database = require('./database');

var CRUD_Model = function(config){

	// Configuration
	var schema = config.schema,
		defaults = config.defaults;

	// Set Variables
	this.schema = schema;

	if(defaults){
		this.defaults = defaults;
	}else{
		this.defaults = {
			create: {},
			read: {},
			update: {
				edit: {},
				criteria: {}
			},
			delete: {}
		};
	}
	
	// Set Methods
	this.create = function(obj,callback){
		obj = _.merge(obj, this.defaults.insert);
		database.insert({
			fields: obj,
			table: this.schema.from,
			database: this.schema.database
		}, callback);
	};
	this.new = this.create;

	this.read = function(filters, callback){
		var query = _.clone(this.schema);
		filters = _.merge(filters, this.defaults.read);

		query.criteria = is.empty(filters) ? {} : filters;
		database.select(query,callback);
	};
	this.get = this.read;

	this.update = function(obj,callback){
		obj.edit = _.merge(obj.edit, this.defaults.update.edit);
		obj.criteria = _.merge(obj.criteria, this.defaults.update.criteria);
		var that = this;
		database.edit({
			fields: obj.edit,
			table: that.schema.from,
			database: that.schema.database,
			criteria: obj.criteria
		}, function(err,status){
			if(!err && status){
				that.read(obj.criteria,1,function(err,result){
					callback(err,{
						success: true,
						status: status,
						result: result[0]
					});
				});
			}else{
				callback(err,{
					success: false,
					message: 'update failed'
				});
			}
		});
	};
	this.edit = this.update;

	this.delete = function(obj,callback){
		obj = _.merge(obj, this.defaults.delete);
		database.delete({
			table: this.schema.from,
			database: this.schema.database,
			criteria: obj
		},callback);
	};

	this.setCreateDefaults = function(obj){
		this.defaults.insert = obj;
	};
	this.setReadDefaults = function(obj){
		this.defaults.read = obj;
	};
	this.setUpdateDefaults= function(obj){
		this.defaults.update = obj;
	};
	this.setDeleteDefaults = function(obj){
		this.defaults.delete = obj;
	};

};

module.exports = CRUD_Model;