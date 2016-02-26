module.exports= function(db,config){
	var CRUD = require('./crud');
	var pages = new CRUD(db, {
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
	}, false, config);

	pages.setCreateDefaults({
		created: "UTC_TIMESTAMP()",
		modified: "UTC_TIMESTAMP()"
	});
	pages.setUpdateDefaults({
		modified: "UTC_TIMESTAMP()"
	});

	pages.new = pages.create;
	pages.get = pages.read;
	pages.edit = pages.update;

	return pages;
};
