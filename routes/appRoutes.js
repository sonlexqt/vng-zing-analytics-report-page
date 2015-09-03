var express = require('express');
var router = express.Router();
var mySqlConnection = require('../mysql-connection');
var moment = require('moment');

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

router.get('/list', function(req, res, next) {
    if (req.session && req.session.userInfo){
        if (req.session.userInfo.role === "admin"){
            mySqlConnection.query("select id, name, url, timeout, status, registeredAt from app",
                function(err, rows, fields) {
                    if (err) throw err;
                    if (rows && rows.length){
                        for (var i = 0; i < rows.length; i++){
                            rows[i].embedCode = genEmbedCode(rows[i]["id"]);
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
            mySqlConnection.query("select id, name, url, timeout, status, registeredAt from app, user_app where id=app_id and user_id=?",
                [req.session.userInfo.id],
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

module.exports = router;