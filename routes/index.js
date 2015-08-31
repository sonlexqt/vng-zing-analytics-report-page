var express = require('express');
var router = express.Router();
var mySqlConnection = require('../mysql-connection');

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

function genEmbedCode(appId) {
    var res = ("<!-- ZA -->" +
    "<script type='text/javascript'>" +
    "var _paq = _paq || [];" +
    "_paq.push(['trackPageView']);" +
    "_paq.push(['enableLinkTracking']);" +
    "(function() {" +
    "var u='http://118.102.6.118:4527/requestreceiver';" +
    "_paq.push(['setTrackerUrl', u]);" +
    "_paq.push(['setSiteId', {0}]);" +
    "var d=document;" +
    "var g=d.createElement('script');" +
    "var s=d.getElementsByTagName('script')[0];" +
    "g.type='text/javascript';" +
    "g.async=true; g.defer=true;" +
    "g.src='http://118.102.6.120:3333/za.js';" +
    "s.parentNode.insertBefore(g,s);" +
    "})();" +
    "</script>" +
    "<noscript>" +
    "<p>" +
    "<img src='http://118.102.6.118:4527/requestreceiver?idsite={1}' style='border:0;' alt='' />" +
    "</p>" +
    "</noscript>" +
    "<!-- End ZA Code -->").format(appId, appId);
    return res;
}

router.get('/', function(req, res, next) {
    if (req.session && req.session.userInfo){
        res.render('index');
    }
    else {
        res.redirect('/login');
    }
});

router.get('/profile', function(req, res, next) {
    if (req.session && req.session.userInfo){
        res.send(req.session.userInfo);
    } else {
        res.render("error");
    }
});

router.get('/apps', function(req, res, next) {
    if (req.session && req.session.userInfo){
        if (req.session.userInfo.role === "admin"){
            mySqlConnection.query("SELECT app_id, owner, name, url, timeout, date_created as createdAt, status FROM app",
                function(err, rows, fields) {
                    if (err) throw err;
                    if (rows && rows.length){
                        for (var i = 0; i < rows.length; i++){
                            rows[i].embedCode = genEmbedCode(rows[i]["app_id"]);
                        }
                        res.send(rows);
                    }
                    else {
                        res.send("No query result.");
                    }
                }
            );
        }
        else {
            mySqlConnection.query("SELECT app_id, name, url, timeout, date_created as createdAt, status FROM app WHERE owner=?",
                [req.session.userInfo.username],
                function(err, rows, fields) {
                    if (err) throw err;
                    if (rows && rows.length){
                        res.send(rows);
                    }
                    else {
                        res.send("No query result.");
                    }
                }
            );
        }

    } else {
        res.render("error");
    }
});

router.get('/users', function(req, res, next) {
    if (req.session && req.session.userInfo && req.session.userInfo.role && req.session.userInfo.role == "admin"){
        mySqlConnection.query("SELECT id, username, password, date_registered as registeredAt, role, status, pass_salt, role_salt FROM user",
            function(err, rows, fields) {
                if (err) throw err;
                if (rows && rows.length){
                    res.send(rows);
                }
                else {
                    res.send("No query result.");
                }
            }
        );
    } else {
        res.render("error");
    }
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/logout', function(req, res, netxt){
    req.session = null;
    res.render("login");
});

router.post('/login', function(req, res, next){
    if (req.body && req.body.username && req.body.password){
        mySqlConnection.query("SELECT id, username, password, date_registered as registeredAt, role, status, pass_salt, role_salt FROM user WHERE username = ?",
            [req.body.username],
            function(err, rows, fields) {
                if (err) throw err;
                if (rows && rows.length){
                    req.session.userInfo = rows[0];
                    req.session.userInfo.role = "admin";
                    res.redirect('/');
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

function exitHandler(options, err) {
    mySqlConnection.end();
    if (options.cleanup){
        console.log('clean');
    }
    if (err){
        console.log(err.stack);
    }
    if (options.exit){
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup: true}));

module.exports = router;
