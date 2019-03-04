"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.WebsiteSchema = new Schema({
    date: {
        type: Date,
    },
    place: {
        type: String,
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
        default: Date.now
    }
});
//# sourceMappingURL=crmModel.js.map