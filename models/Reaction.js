const {Schema, model, SchemaTypes} = require('mongoose');
const moment = require('moment');

const reactionSchema = new Schema({
    reactionId: {
        type: SchemaTypes.ObjectId, 
        default: () => new SchemaTypes.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: val => moment(val).format('MMM DD, YYYY [at] hh:mm:a')
    }
}, {
    toJSON: {
        getters: true
    },
    id: false
});

module.exports = reactionSchema;