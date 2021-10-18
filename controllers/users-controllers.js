const {Users} = require('../models');

const usersController = {

    getAllUsers(req, res) {
        Users.find({})
            .populate({
                path: 'thoughts',
                select: '-__V'
            })
            
            .populate({
                path: 'friends',
                select: '-__V'
            })

            .select('-__V')

            .then((dbUsersData) => res.json(dbUsersData))

            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getUserById({params}, res) {
        Users.findOne({_id: params.id})
            .populate({
                path: 'thoughts',
                select: '-__V'
            })
            
            .populate({
                path: 'friends',
                select: '-__V'
            })
        
            .then((dbUsersData) => {
                if(!dbUsersData) {
                    res.status(404).json({message: 'There is no user associated with this ID.'});
                    return;
                }

                res.json(dbUsersData);
            })

            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    createUser({body}, res) {
        Users.create(body)
            .then(dbUsersData => res.json(dbUsersData))

            .catch((err) => res.json(err));
    },

    updateUser({params, body}, res) {
        Users.findOneAndUpdate(
            {
                _id: params.id
            }, 
            
                body, 
            
            {
                new: true, runValidators: true
            }
        )
            
            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({message: 'There is no user associated with this ID.'});
                    return;
                }

                res.json(dbUsersData);
            })

            .catch(err => res.json(err));
    },

    deleteUser({params}, res) {
        Users.findOneAndDelete({_id: params.id})
            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({messasge: 'There is no user associated with this ID.'});
                    return;
                }

                res.json(dbUsersData);
            })

            .catch(err => res.status(400).json(err));
    },

    addFriend({params, body}, res) {
        Users.findOneAndUpdate(
            {
                _id: params.id
            }, 
            
            {
                $push: {friends: params.friendId}
            }, 
            
            {
                new: true
            }
        )

            .populate(
                {
                    path: 'friends', 
                    select: '-__V'
                }
             )

            .select('-__V')

            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({message: 'There is no user associated with this ID.'});
                    return;
                }

                res.json(dbUsersData);
            })

            .catch(err => res.status(400).json(err))
    },

    deleteFriend({params}, res) {
        Users.findOneAndUpdate(
            {
                _id: params.Id
            }, 
            
            {
                $pull: {friends: params.friendId}
            }, 
            
            {
                new: true
            }
        )

            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({message: 'There is no user associated with this ID.'});
                    return;
                }

                res.json(dbUsersData);
            })

            .catch(err => res.status(400).json(err))
    }
};

module.exports = usersController;