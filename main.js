// Dependencies
var database = require('./support/database');
var crud_model = require('./support/crud');
var query_builder = require('./support/querybuilder');

// Set variables
database.query = query_builder;
database.crud = crud_model;
database.crud.get = database.crud.select;
database.crud.edit = database.crud.update;

module.exports = database;
