MySQL Database Wrapper
====================
![Simply Is Dependency badge](https://david-dm.org/anonmily/node-mysql-db.svg)

An expressive type testing utility library.

## Installation - Node
    npm install --save mysql-db

---

## Usage

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
