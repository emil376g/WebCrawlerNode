import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const WebsiteSchema = new Schema({
    date: {
        type: String,
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
})