const {Schema, Types, model} = require('mongoose');
const moment = require('moment');

const ThoughtsSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 200
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD YYYY, h:mm a')
        },

        username: {
            type: String,
            required: true
        },

        reactions: [ReactionsSchema]
    },

    {
        toJSON: {
            virtuals: true,
            getters: true
        },

        id: false
    }
);

const ReactionsSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },

        reactionBody: {
            type: String,
            required: true,
            maxlength: 200
        },

        username: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD YYYY, h:mm a')
        }
    },

    {
        toJSON: {
            getters: true
        }
    }
);

ThoughtsSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thoughts = model('Thoughts', ThoughtsSchema);

module.exports = Thoughts;