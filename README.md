MySQL Database Wrapper
====================
![MYSQL-DB Dependency badge](https://david-dm.org/anonmily/node-mysql-db.svg)

MySQL database modeling with built in CRUD. Just create your models, then get up and running.


## Installation - Node
    npm install --save mysql-db

---

## Environmental Variables

Configuration
* NODE_ENV - will use test environmental variables if NODE_ENV=test
* SHOW_DEBUG - if true, will show log messages

* DB_HOST
* DB_USER
* DB_PASSWORD
* DB_DATABASE

If NODE_ENV is "test", then the following environmental variables will be used:

* DB_TEST_HOST
* DB_TEST_USER
* DB_TEST_PASSWORD
* DB_TEST_DATABASE

---
## Usage

To use this package to connect to your database you must first:

1. Setup the environmental variables to connect to your database
2. Create a new model for every CRUD table/view (and set up any defaults for new rows and for updates)
3. Use CRUD on your model as you please!

### Create a new CRUD model
	var Database = require('mysql-db');

	var pages = new Database.crud({
		schema: {
			select: [
					'id',
					'slug',
					'title',
					'category',
					'content',
					'created',
					'modified',
					'tags'
			],
			from: 'pages'
		}
	});

	// default values that will be added to every create/new row inserted
	pages.setCreateDefaults({
		created: "UTC_TIMESTAMP()",
		modified: "UTC_TIMESTAMP()"
	});

	// default values that will be added to every row update
	pages.setUpdateDefaults({
		modified: "UTC_TIMESTAMP()"
	});

	module.exports = pages;

## Use the new model to get data
	pages.get({},function(err,result){
		// Do stuff
		console.error(err);
		console.log(result);
	});

## Edit/update fields in the database
	pages.update({
		edit: {
			title: 'hi'
		},
		criteria: {
			id: 1
		}
	},function(err,result){
		// get response
	});

_Note_: In this example, the *modified* field is automatically set to UTC_TIMESTAMP() since we previously defined the default when creating the pages model (by using pages.setUpdateDefaults)

## Delete an entry
	pages.delete({
		id: 3
	}, function(err,result){
		// get response
	});

## Insert/create an entry
	pages.create({
		id: 25,
		title: 'hello world',
		content: 'it is a wonderful day!'
	},function(err,result){
		// get response
	});

_Note_: In this example, the created and modified are automatically set since we previously set them with pages.setCreateDefaults when defining the model

---
## TODO
* switch to promises
* add tests

---
## Changelog
| Version | Notes                                                                                                                                                                            |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _0.0.0_   | Intiial version with callbacks |
