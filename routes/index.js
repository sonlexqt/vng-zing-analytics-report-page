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

router.get('/', function(req, res, next) {
    if (req.session && req.session.userInfo){
        res.render('index');
    }
    else {
        res.redirect('/login');
    }
});

router.get('/register', function(req, res, next) {
    res.render('register');
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
        var queryString = "select id as userId, username, password, psalt, role, rsalt, status, registeredAt from user where username=?";
        mySqlConnection.query(queryString,
            [req.body.username],
            function(err, rows, fields) {
                if (err) throw err;
                if (rows && rows.length){
                    req.session.userInfo = rows[0];
                    if (req.session.userInfo.username == "quanvd"){
                        req.session.userInfo.role = "admin";
                    } else {
                        req.session.userInfo.role = "user";
                    }
                    res.redirect('/');
                }
                else {
                    res.send([]);
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
