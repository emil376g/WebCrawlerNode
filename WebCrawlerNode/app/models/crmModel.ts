"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.WebsiteSchema = new Schema({
    date: {
        type: String
    },
    place: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    datastructur: {
        type: String
    },
    crawlClass: {
        type: String
    },
    created_date: {
        type: Date,
        "default": Date.now
    }
});
export default exports