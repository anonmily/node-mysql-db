var mysql_wrapper = require('./main');

var pages = new mysql_wrapper.crud({
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
pages.get({},function(err,result){
	console.error(err);
	console.log(result);
});
/*
pages.update({
	edit: {
		title: 'hi'
	},
	criteria: {
		id: 1
	}
});
*/
/*
pages.delete({
	id: 3
});
*/
/*
pages.create({
	id: 25,
	title: 'hello world',
	content: 'it is a wonderful day!'
});
*/