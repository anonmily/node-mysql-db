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