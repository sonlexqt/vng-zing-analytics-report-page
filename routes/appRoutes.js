var express = require('express');
var router = express.Router();
var mySqlConnection = require('../mysql-connection');
var moment = require('moment');

router.get('/overview', function(req, res, next) {
    if (req.query && req.query["app_id"] && req.query.from && req.query.to){
        var query = 'SELECT date_tracking, sessions, pageviews, unique_pageviews, new_visitors, return_visitors, bounces, entrances, exits, total_session_duration FROM app_overview WHERE app_id=? AND date_tracking BETWEEN ? and ?';
        var appId = req.query["app_id"];
        // convert to mysql timestamp
        var dateFrom = moment(Number(req.query.from)).format("YYYY-MM-DD HH:mm:ss");
        var dateTo = moment(Number(req.query.to)).format("YYYY-MM-DD HH:mm:ss");
        mySqlConnection.query(query, [appId, dateFrom, dateTo],
            function(err, rows, fields) {
                if (err) {
                    console.log("ERROR:");
                    console.log(err);
                    throw err;
                }
                if (rows && rows.length){
                    var result = [];
                    for (var i=0; i < rows.length; i++){
                        var thisRow = rows[i];
                        var object = {
                            appId: thisRow.appId,
                            date: new Date(thisRow["date_tracking"]).getTime(),
                            sessions: thisRow.sessions,
                            users: thisRow["new_visitors"],
                            returnVisitors: thisRow["return_visitors"],
                            pageviews: thisRow.pageviews,
                            bounces: thisRow.bounces,
                            entrances: thisRow.entrances,
                            sessionDuration: thisRow["total_session_duration"],
                            pagesPerSession: parseFloat(thisRow.pageviews) / thisRow.sessions,
                            avgSessionDuration: parseFloat(thisRow["total_session_duration"]) / thisRow.sessions,
                            timeOnPage: parseFloat(thisRow["total_session_duration"]) / thisRow["unique_pageviews"],
                            bounceRate: parseFloat(thisRow.bounces * 100) / thisRow.entrances,
                            exitRate: parseFloat(thisRow.exits * 100) / thisRow.pageviews,
                            percentNewVists: parseFloat(thisRow["new_visitors"] * 100) / thisRow.sessions
                        };
                        result.push(object);
                    }
                    res.send(result);
                }
                else {
                    res.send("No query result.");
                }
            }
        );
    } else {
        res.render('error');
    }
});

router.get('/page', function(req, res, next) {
    if (req.query && req.query["app_id"] && req.query.from && req.query.to && req.query.by){
        if (req.query.by == "date"){
            var query = 'select date_tracking, sum(pageviews), sum(unique_pageviews), sum(bounces), sum(entrances), sum(exits), sum(total_time_on_page) from page_overview where app_id=? and date_tracking between ? and ? group by date_tracking';
            var appId = req.query["app_id"];
            // convert to mysql timestamp
            var dateFrom = moment(Number(req.query.from)).format("YYYY-MM-DD HH:mm:ss");
            var dateTo = moment(Number(req.query.to)).format("YYYY-MM-DD HH:mm:ss");
            mySqlConnection.query(query, [appId, dateFrom, dateTo],
                function(err, rows, fields) {
                    if (err) {
                        console.log("ERROR:");
                        console.log(err);
                        throw err;
                    }
                    if (rows && rows.length){
                        var result = [];
                        var tempRows = rows;
                        var length = tempRows.length;
                        var duplicatedDatesTrackingArray = [];
                        var uniqueDatesArray = [];
                        for (var i = 0; i < length; i++){
                            if (duplicatedDatesTrackingArray.indexOf(tempRows[i]["date_tracking"]) < 0){
                                var object = {};
                                var thisDate = moment(new Date(tempRows[i]["date_tracking"])).format("YYYY-MM-DD");
                                object["date_tracking"] = tempRows[i]["date_tracking"];
                                object["sum(pageviews)"] = 0;
                                object["sum(unique_pageviews)"] = 0;
                                object["sum(bounces)"] = 0;
                                object["sum(entrances)"] = 0;
                                object["sum(exits)"] = 0;
                                object["sum(total_time_on_page)"] = 0;
                                for (var j = 0; j < length; j++){
                                    var thatDate = moment(new Date(tempRows[j]["date_tracking"])).format("YYYY-MM-DD");
                                    if (thisDate == thatDate && duplicatedDatesTrackingArray.indexOf(tempRows[j]["date_tracking"]) < 0){
                                        object["sum(pageviews)"] += tempRows[j]["sum(pageviews)"];
                                        object["sum(unique_pageviews)"] += tempRows[j]["sum(unique_pageviews)"];
                                        object["sum(bounces)"] += tempRows[j]["sum(bounces)"];
                                        object["sum(entrances)"] += tempRows[j]["sum(entrances)"];
                                        object["sum(exits)"] += tempRows[j]["sum(exits)"];
                                        object["sum(total_time_on_page)"] += tempRows[j]["sum(total_time_on_page)"];
                                        duplicatedDatesTrackingArray.push(tempRows[j]["date_tracking"]);
                                    }
                                }
                                duplicatedDatesTrackingArray.push(tempRows[i]["date_tracking"]);
                                uniqueDatesArray.push(object);
                            }
                        }

                        for (i = 0; i < uniqueDatesArray.length; i++){
                            var thisRow = uniqueDatesArray[i];
                            var object = {
                                appId: Number(req.query["app_id"]),
                                date: new Date(thisRow["date_tracking"]).getTime(),
                                pageviews: thisRow["sum(pageviews)"],
                                uniquePageviews: thisRow["sum(unique_pageviews)"],
                                bounces: thisRow["sum(bounces)"],
                                entrances: thisRow["sum(entrances)"],
                                exits: thisRow["sum(exits)"],
                                timeOnPage: thisRow["sum(total_time_on_page)"],
                                avgTimeOnPage: parseFloat(thisRow["sum(total_time_on_page)"]) / (thisRow["sum(pageviews)"] - thisRow["sum(exits)"]),
                                bounceRate: parseFloat(thisRow["sum(bounces)"] * 100) / thisRow["sum(entrances)"],
                                percentExit: parseFloat(thisRow["sum(exits)"] * 100) / thisRow["sum(pageviews)"]
                            };
                            result.push(object);
                        }
                        res.send(result);
                    }
                    else {
                        res.send("No query result.");
                    }
                }
            );
        }
        else if (req.query.by == "path"){
            var query = 'select path, sum(pageviews), sum(unique_pageviews), sum(bounces), sum(entrances), sum(exits), sum(total_time_on_page) from page_overview where app_id=? and date_tracking between ? and ? group by path';
            var appId = req.query["app_id"];
            // convert to mysql timestamp
            var dateFrom = moment(Number(req.query.from)).format("YYYY-MM-DD HH:mm:ss");
            var dateTo = moment(Number(req.query.to)).format("YYYY-MM-DD HH:mm:ss");
            mySqlConnection.query(query, [appId, dateFrom, dateTo],
                function(err, rows, fields) {
                    if (err) {
                        console.log("ERROR:");
                        console.log(err);
                        throw err;
                    }
                    if (rows && rows.length){
                        var result = [];
                        for (var i=0; i < rows.length; i++){
                            var thisRow = rows[i];
                            var object = {
                                appId: thisRow.appId,
                                page: thisRow.path,
                                pageviews: thisRow["sum(pageviews)"],
                                uniquePageviews: thisRow["sum(unique_pageviews)"],
                                bounces: thisRow["sum(bounces)"],
                                entrances: thisRow["sum(entrances)"],
                                exits: thisRow["sum(exits)"],
                                timeOnPage: thisRow["sum(total_time_on_page)"],
                                avgTimeOnPage: parseFloat(thisRow["sum(total_time_on_page)"]) / (thisRow["sum(pageviews)"] - thisRow["sum(exits)"]),
                                bounceRate: parseFloat(thisRow["sum(bounces)"] * 100) / thisRow["sum(entrances)"],
                                percentExit: parseFloat(thisRow["sum(exits)"] * 100) / thisRow["sum(pageviews)"]
                            };
                            result.push(object);
                        }
                        res.send(result);
                    }
                    else {
                        res.send("No query result.");
                    }
                }
            );
        }
        else {
            res.render('error');
        }
    } else {
        res.render('error');
    }
});

router.get('/language', function(req, res, next) {
    if (req.query && req.query["app_id"] && req.query.from && req.query.to){
        var query = 'SELECT language, sum(sessions) FROM language WHERE app_id=? AND date_tracking BETWEEN ? AND ? GROUP BY language';
        var appId = req.query["app_id"];
        // convert to mysql timestamp
        var dateFrom = moment(Number(req.query.from)).format("YYYY-MM-DD HH:mm:ss");
        var dateTo = moment(Number(req.query.to)).format("YYYY-MM-DD HH:mm:ss");
        mySqlConnection.query(query, [appId, dateFrom, dateTo],
            function(err, rows, fields) {
                if (err) {
                    console.log("ERROR:");
                    console.log(err);
                    throw err;
                }
                if (rows && rows.length){
                    var result = [];
                    for (var i=0; i < rows.length; i++){
                        var thisRow = rows[i];
                        var object = {
                            appId: appId,
                            sessions: thisRow["sum(sessions)"],
                            language: thisRow.language
                        };
                        result.push(object);
                    }
                    res.send(result);
                }
                else {
                    res.send("No query result.");
                }
            }
        );
    } else {
        res.render('error');
    }
});

router.get('/location', function(req, res, next) {
    if (req.query && req.query["app_id"] && req.query.from && req.query.to){
        var query = 'select location, sum(sessions) from location where app_id=? and date_tracking between ? and ? group by location';
        var appId = req.query["app_id"];
        // convert to mysql timestamp
        var dateFrom = moment(Number(req.query.from)).format("YYYY-MM-DD HH:mm:ss");
        var dateTo = moment(Number(req.query.to)).format("YYYY-MM-DD HH:mm:ss");
        mySqlConnection.query(query, [appId, dateFrom, dateTo],
            function(err, rows, fields) {
                if (err) {
                    console.log("ERROR:");
                    console.log(err);
                    throw err;
                }
                if (rows && rows.length){
                    var result = [];
                    for (var i=0; i < rows.length; i++){
                        var thisRow = rows[i];
                        var object = {
                            appId: appId,
                            sessions: thisRow["sum(sessions)"],
                            city: thisRow.location
                        };
                        result.push(object);
                    }
                    res.send(result);
                }
                else {
                    res.send("No query result.");
                }
            }
        );
    } else {
        res.render('error');
    }
});

router.get('/device', function(req, res, next) {
    if (req.query && req.query["app_id"] && req.query.from && req.query.to){
        var query = 'select device_type, sum(sessions) from device where app_id=? and date_tracking between ? and ? group by device_type';
        var appId = req.query["app_id"];
        // convert to mysql timestamp
        var dateFrom = moment(Number(req.query.from)).format("YYYY-MM-DD HH:mm:ss");
        var dateTo = moment(Number(req.query.to)).format("YYYY-MM-DD HH:mm:ss");
        mySqlConnection.query(query, [appId, dateFrom, dateTo],
            function(err, rows, fields) {
                if (err) {
                    console.log("ERROR:");
                    console.log(err);
                    throw err;
                }
                if (rows && rows.length){
                    var result = [];
                    for (var i=0; i < rows.length; i++){
                        var thisRow = rows[i];
                        var object = {
                            appId: appId,
                            sessions: thisRow["sum(sessions)"],
                            deviceName: thisRow["device_type"]
                        };
                        result.push(object);
                    }
                    res.send(result);
                }
                else {
                    res.send("No query result.");
                }
            }
        );
    } else {
        res.render('error');
    }
});


router.get('/browser', function(req, res, next) {
    if (req.query && req.query["app_id"] && req.query.from && req.query.to){
        var query = 'SELECT browser_type, sum(sessions) FROM browser WHERE app_id=? AND date_tracking BETWEEN ? AND ? GROUP BY browser_type';
        var appId = req.query["app_id"];
        // convert to mysql timestamp
        var dateFrom = moment(Number(req.query.from)).format("YYYY-MM-DD HH:mm:ss");
        var dateTo = moment(Number(req.query.to)).format("YYYY-MM-DD HH:mm:ss");
        mySqlConnection.query(query, [appId, dateFrom, dateTo],
            function(err, rows, fields) {
                if (err) {
                    console.log("ERROR:");
                    console.log(err);
                    throw err;
                }
                if (rows && rows.length){
                    var result = [];
                    for (var i=0; i < rows.length; i++){
                        var thisRow = rows[i];
                        var object = {
                            appId: appId,
                            sessions: thisRow["sum(sessions)"],
                            browserName: thisRow["browser_type"]
                        };
                        result.push(object);
                    }
                    res.send(result);
                }
                else {
                    res.send("No query result.");
                }
            }
        );
    } else {
        res.render('error');
    }
});

router.get('/os', function(req, res, next) {
    if (req.query && req.query["app_id"] && req.query.from && req.query.to){
        var query = 'SELECT os_type, sum(sessions) FROM os WHERE app_id=? AND date_tracking BETWEEN ? AND ? GROUP BY os_type';
        var appId = req.query["app_id"];
        // convert to mysql timestamp
        var dateFrom = moment(Number(req.query.from)).format("YYYY-MM-DD HH:mm:ss");
        var dateTo = moment(Number(req.query.to)).format("YYYY-MM-DD HH:mm:ss");
        mySqlConnection.query(query, [appId, dateFrom, dateTo],
            function(err, rows, fields) {
                if (err) {
                    console.log("ERROR:");
                    console.log(err);
                    throw err;
                }
                if (rows && rows.length){
                    var result = [];
                    for (var i=0; i < rows.length; i++){
                        var thisRow = rows[i];
                        var object = {
                            appId: appId,
                            sessions: thisRow["sum(sessions)"],
                            osName: thisRow["os_type"]
                        };
                        result.push(object);
                    }
                    res.send(result);
                }
                else {
                    res.send("No query result.");
                }
            }
        );
    } else {
        res.render('error');
    }
});

module.exports = router;