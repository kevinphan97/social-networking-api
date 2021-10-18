const {Thoughts, Users} = require('../models');

const thoughtsController = {

    getAllThoughts(req, res) {
        Thoughts.find({})
            .populate({
                path: 'reactions',
                select: '-__V'
            })
            
            .populate({
                path: 'thoughts',
                select: '-__V'
            })

            .select('-__V')

            .then((dbThoughtsData) => res.json(dbThoughtsData))

            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getThoughtsById({params}, res) {
        Thoughts.findOne({_id: params.id})
            .then((dbThoughtsData) => {
                if(!dbThoughtsData) {
                    res.status(404).json({message: 'There is no thought associated with this ID.'});
                    return;
                }

                res.json(dbThoughtsData);
            })

            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    createThoughts({body}, res) {
        Thoughts.create(body)
            .then((thoughtsData) => {
                return Users.findOneAndUpdate (
                    {
                        _id: body.userId
                    },

                    {
                        $push: {thoughts: thoughtsData._id}
                    },

                    {
                        new: true
                    }
                );
            })

            .then((dbUsersData) => {
                if(!dbUsersData) {
                    res.status(404).json({message: 'There is no user associated with this ID.'});
                    return;
                }

                res.json(dbUsersData);
            })

            .catch((err) => res.json(err));
    },

    updateThoughts({params, body}, res) {
        Thoughts.findOneAndUpdate(
            {
                _id: params.id
            }, 
            
                body, 
            
            {
                new: true, runValidators: true
            }
        )
            .populate({
                path: 'reactions', 
                select: '-__V'
            })

            .select('-__V')

            .then(dbThoughtsData => {
                if(!dbThoughtsData) {
                    res.status(404).json({message: 'There is no thought associated with this ID.'});
                    return;
                }

                res.json(dbThoughtsData);
            })

            .catch(err => res.json(err));
    },

    deleteThoughts({params}, res) {
        Thoughts.findOneAndDelete({_id: params.id})
            .then(dbThoughtsData => {
                if(!dbThoughtsData) {
                    res.status(404).json({messasge: 'There is no thought associated with this ID.'});
                    return;
                }

                res.json(dbThoughtsData);
            })

            .catch(err => res.status(400).json(err));
    },

    addReaction({params, body}, res) {
        Thoughts.findOneAndUpdate(
            {
                _id: params.thoughtId
            }, 
            
            {
                $push: {reactions: body}
            }, 
            
            {
                new: true, runValidators: true
            }
        )
            .populate({path: 'reactions', select: '-__V'})

            .select('-__V')

            .then(dbThoughtsData => {
                if(!dbThoughtsData) {
                    res.status(404).json({message: 'There is no thought associated with this ID.'});
                    return;
                }

                res.json(dbThoughtsData);
            })

            .catch(err => res.status(400).json(err))
    },

    deleteReaction({params}, res) {
        Thoughts.findOneAndUpdate(
            {
                _id: params.thoughtsId
            }, 
            
            {
                $pull: {reactions: {reactionId: params.reactionId}}
            }, 
            
            {
                new: true
            }
        )
            .then(dbThoughtsData => {
                if(!dbThoughtsData) {
                    res.status(404).json({message: 'There is no thought associated with this ID.'});
                    return;
                }

                res.json(dbThoughtsData);
            })

            .catch(err => res.status(400).json(err))
    }
};

module.exports = thoughtsController;