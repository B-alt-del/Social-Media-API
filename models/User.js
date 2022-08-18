const {Schema, model, SchemaTypes} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username required'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email address required'],
        validate: {
            validator: function (email) {
                return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email);
            },
            message: props => `${props.value} is not a valid email address!`
        },
    },
    thoughts: [{
        type: SchemaTypes.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: SchemaTypes.ObjectId,
        ref: 'User'
    }]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

userSchema.virtual('friendCount')
    .get(function () {
        return this.friends.length;
    }
);

userSchema.virtual('thoughtCount')
    .get(function () {
        return this.thoughts.length;
    }
);

const User = model('User', userSchema);

module.exports = User;