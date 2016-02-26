var mysql   =   require('mysql');
var env     =   process.env;

var environment = env['NODE_ENV'],
    location = env.LOCATION;

var connectobj = {
    connectionLimit: 100,
    host: env['DB_HOST'],
    user: env['DB_USER'],
    password: env['DB_PASSWORD'],
    database: env['DB_DATABASE'],
    debug: false
};
if( env.DB_SOCKET ){
    connectobj.socketPath = env.DB_SOCKET;
}
if(environment === 'test'){
    connectobj = {
        connectionLimit: 100,
        host: env['DB_TEST_HOST'],
        user: env['DB_TEST_USER'],
        password: env['DB_TEST_PASSWORD'],
        database: env['DB_TEST_DATABASE'],
        debug: false
    };
    if( env.DB_SOCKET ){
        connectobj.socketPath = DB_SOCKET;
    }
    var pool = mysql.createPool(connectobj);
}
if(environment === 'development'){
    var pool = mysql.createPool(connectobj);
}
if(environment === 'production'){
    var pool = mysql.createPool(connectobj);
}


module.exports = pool;
