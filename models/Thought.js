const {Schema, model, SchemaTypes} = require('mongoose');
const moment = require('moment');
const reactionSchema = require('./Reaction')

const thoughtSchema = new Schema(
    {
    thoughtText: {
      type: String,
      required: [true, 'Thought must contain words'],
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: val => moment(val).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
      type: String,
      required: [true, 'Username is required']
    },
    reactions: [reactionSchema]
}, {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
});
  
thoughtSchema.virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    }
);
  
  const Thought = model('Thought', thoughtSchema);
  
  module.exports = Thought;