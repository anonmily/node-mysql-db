MySQL Database Wrapper
====================
![Simply Is Dependency badge](https://david-dm.org/anonmily/node-mysql-db.svg)

An expressive type testing utility library.

## Installation - Node
    npm install --save mysql-db

---

## Usage

### Environmental Variables

Setup
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
## Examples

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

	pages.setCreateDefaults({
		created: "UTC_TIMESTAMP()",
		modified: "UTC_TIMESTAMP()"
	});
	pages.setUpdateDefaults({
		modified: "UTC_TIMESTAMP()"
	});

	module.exports = pages;

## Use the new model to get data
	pages.get({},function(err,result){
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
	});

## Delete an entry
	pages.delete({
		id: 3
	});

## Insert/create an entry
	pages.create({
		id: 25,
		title: 'hello world',
		content: 'it is a wonderful day!'
	});

---
## Basics

---
## TODO
* switch to promises

---
## Changelog
| Version | Notes                                                                                                                                                                            |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _0.0.0_   | Intiial version with callbacks |
