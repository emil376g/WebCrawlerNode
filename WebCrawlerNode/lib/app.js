"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var crmRoutes_1 = require("./routes/crmRoutes");
var mongoose = require("mongoose");
require("reflect-metadata");
// Create a new express application instance
var App = /** @class */ (function () {
    function App() {
        this.routePrv = new crmRoutes_1.Routes();
        this.mongoUrl = 'mongodb://localhost/OperaData';
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    App.prototype.mongoSetup = function () {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    };
    App.prototype.config = function () {
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            next();
        });
        this.app.use(bodyParser.urlencoded({ extended: false }));
    };
    return App;
}());
exports["default"] = new App().app;
