 module.exports = function(db) {
    var async = require('async'),
        _ = require('lodash'),
        log = require('log-easily'),
        is = require('simply-is');

    function escape(value) {
        value = db.escape(value);
        if (value[0] === "'") {
            value = value.substring(1, value.length - 1);
        }
        return value;
    }

    return { 
        run: function(database, query, callback) {
            log.info('--------');
            log.info(database);
            log.info('--------');
            log.info(query);
            try {
                db.getConnection(function(err, conn) {
                    if (err) {
                        log.error("Problem getting connection!");
                        log.error(err);

                        log.info(conn);
                        log.error('database: ' + database);
                        log.error('query:\n' + query);
                    }
                    async.waterfall([
                        function(callback) {
                            try {
                                conn.changeUser({
                                    database: database
                                }, function(err) {
                                    if (err) {
                                        log.error('Change User:' + err);
                                    }
                                    callback(err);
                                });
                            } catch (e) {
                                log.error('Database error.\n' + e);
                                log.error(conn);
                            }

                        },
                        function(callback) {
                            try {
                                conn.query(query, function(err, rows) {
                                    if (err) {
                                        log.error('Query: ' + err);
                                    }
                                    callback(err, rows);
                                });
                            } catch (e) {
                                log.error('Database error. Query failed:' + query);
                                log.error(e);
                            }
                        }
                    ], function(err, results) {

                        conn.release();
                        if (err) {
                            log.error('-----ERROR------\nDatabase Query error:\n', err);
                            callback(err, {
                                status: false,
                                message: 'query failed'
                            });
                        } else {
                            if( is.function(callback) ){
                               callback(err, results); 
                            }
                        }
                    });
                });
            } catch (e) {
                log.error(e);
            }
        },
        set: {
            select: function(selectarr) {
                var select = "SELECT ";
                if (selectarr.constructor == Array) {
                    selectarr = selectarr.map(function(curr, index, arr) {
                        if (curr.indexOf('(') >= 0) {
                            return curr;
                        }
                        if (curr.indexOf(' AS ') >= 0) {
                            var split = curr.split(' AS ');
                            return db.escapeId(split[0]) + ' AS ' + split[1];
                        }
                        return db.escapeId(curr);
                    });
                    select += selectarr.join(',');
                } else {
                    select += selectarr;
                }
                select += " ";
                return select;
            },
            join: function(joinarr) {
                var join = "";
                if (!is.empty(joinarr)) {
                    joinarr.forEach(function(curr, index, arr) {
                        join += curr.type + " " + curr.table + " ON " + curr.on + " ";
                    });
                }
                return join;
            },
            where: function(whereobj) {
                var where = "WHERE ";

                if (is.empty(whereobj)) {
                    return "";
                }

                i = 0;
                _.forIn(whereobj, function(criteria_value, criteria) {
                    // id: 1,2,3 --> ID=1 OR ID=2 OR ID=3

                    if (is.object(criteria_value)) {
                        if (i !== 0) {
                            where += criteria_value.type + " ";
                        }
                        if ("range" in criteria_value) {
                            where += "(" + db.escapeId(criteria_value.field) + " BETWEEN " + escape(criteria_value.range[0]) + " AND " + escape(criteria_value.range[1]) + ") ";
                        } else if ("or" in criteria_value) {
                            where += " (";
                            criteria_value.or.forEach(function(val, index, arr) {
                                if (index !== 0) {
                                    where += "OR ";
                                }
                                where += criteria_value.or + " ";
                            });
                            where += ") ";
                        }
                    } else {
                        if (i !== 0) {
                            where += "AND ";
                        }
                        if (String(criteria_value).indexOf(',') >= 0) {
                            or = criteria_value.split(',');
                            or.forEach(function(val, index, arr) {
                                if (index !== 0) {
                                    where += "OR ";
                                }
                                val = escape(val);
                                where += "(" + db.escapeId(criteria) + "=\"" + val + "\"" + ") ";
                            });
                        } else {
                            if (is.number(criteria_value)) {
                                where += "(" + db.escapeId(criteria) + "=" + criteria_value + ") ";
                            } else {
                                criteria_value = escape(criteria_value);
                                where += "(" + db.escapeId(criteria) + "=\"" + criteria_value + "\"" + ") ";
                            }
                        }
                    }

                    i = i + 1;
                });

                return where;
            },
            limit: function(limit) {
                if (is.empty(limit)) {
                    return "";
                }
                return "LIMIT " + String(limit) + " ";
            },
            orderby: function(orderby) {
                if (is.empty(orderby)) {
                    return "";
                }
                return "ORDER BY "
            },
            groupby: function(grouparr) {
                var group = "GROUP BY ";
                if (is.empty(grouparr)) {
                    return "";
                }

                group = group + grouparr.join(',') + " ";
                return group;
            },

            override: function(overrides, criteria, select) {
                overrides.forEach(function(val, index, arr) {
                    var column = val.col in criteria ? val.col : val.col.toLowerCase();
                    if (criteria && criteria[column]) {
                        criteria[val.table + '.' + val.col] = criteria[column];
                        delete criteria[column];
                    }
                    if (select && select.indexOf(val.col) >= 0) {
                        select.splice(select.indexOf(val.col), 1);
                        select.push(val.table + '.' + val.col);
                    }
                });
                return {
                    select: select,
                    criteria: criteria
                };
            }
        },

        clean_col_name: function(colname) {
            var newname = colname;
            if (newname.indexOf(' AS ') >= 0) {
                newname = newname.split(' AS ')[1];
            }
            if (newname.indexOf('.') >= 0) {
                newname = newname.split('.')[1];
            }
            newname = newname.replace('`', '');
            return newname;
        },

        escapeValue: escape,
        escapeId: function(id) {
            return db.escapeId(id);
        },
        between: function(type, field, min, max) {
            return {
                type: type,
                field: field,
                range: [min, max]
            };
        }

    };
};
