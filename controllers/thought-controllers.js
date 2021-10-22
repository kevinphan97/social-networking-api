const { Users, Thoughts } = require('../models');

const thoughtsController = {
    getAllThoughts(req, res) {
        Thoughts.find()
          .select('-__v')
          
          .then((dbThoughtsData) => res.json(dbThoughtsData))
          
          .catch(error => { 
            console.log(error); 
            res.status(400).json(error); 
          });
    },

    getThoughtsById({params}, res) {
        Thoughts.findOne({_id: params.id})
          .select('-__v')
          
          .then(dbThoughtsData => {
            if (!dbThoughtsData) {
              return res.status(404).json({message: 'There is no thought associated with this ID.'})
            }
            res.json(dbThoughtsData);
          })
          
          .catch(error => { 
            console.log(error); 
            res.status(400).json(error); });
    },
  
    createThoughts(req, res) {
        let thoughtsLocal;
        
        Thoughts.create(
          {
            thoughtText: req.body.thoughtText,
            username: req.body.username,
            userId: req.body.userId
          }
        )
        
        .then(thoughts => {
          thoughtsLocal = thoughts;
          
          return Users.findOneAndUpdate
          (
            {
              _id: req.body.userId
            },
            
            { 
              $push: { thoughts: thoughts._id } 
            },
            
            {
              new: true,
            }
          )
          
          .populate(
            {
              path: 'thoughts',
              select: '-__v'
            }
          )
          
          .select('-__v')
        })
        
        .then(users => {
          if (!users) {
            res.status(404).json({message: 'There is no user associated with this ID'});
          }
          res.json(users); 
        })

        .catch(error => { 
          console.log(error); 
          res.status(400).json(error); 
        });
    },
  
    deleteThoughts({params}, res) {
        Thoughts.findOneAndDelete({_id: req.params.id})
          .then(thoughts => {
            if (!thoughts) {
              return res.status(404).json({message: 'There is no thought associated with this ID'});
            }
            
            return Users.findOneAndUpdate
            (
              { 
                _id: req.params.userId
              },

              { 
                $pull: {thoughts: req.params.id} 
              },

              { 
                new: true
              }
            );
          })
          
          .then(usersInfo => {
            if (!usersInfo) {
              res.status(404).json({message: 'There is no user asssociated with this ID'});
            }
            res.json(usersInfo);
          })
          
          .catch(error => { 
            console.log(error); 
            res.status(400).json(error); 
          });
    },
  
    updateThoughts: async (req, res) => {
        try {
          const thoughtInfo = await Thoughts.findOneAndUpdate
          (
            { 
              _id: req.params.id 
            },

            req.body,

            { 
              new: true
            }
          );

          if (!thoughtInfo) {
            res.status(404).json({message: 'There is no thought associated with this ID'})
          }
          res.json(thoughtInfo);

        } catch (error) {
          console.log(error);
          res.status(400).json(error);
        }
    },
  
    addReaction(req, res) {
        Thoughts.findOneAndUpdate
        (
          { 
            _id: req.params.id 
          },

          { 
            $push: { reactions: req.body } 
          },

          { 
            new: true 
          }
        )
        
        .then(dbThoughtsData => {
          if (!dbThoughtsData) {
            return res.status(404).json({message: 'There is no thought associated with this ID'});
          }
          res.json(dbThoughtsData);
        })
        
        .catch(error => { 
          console.log(error); 
          res.json(400).json(error); 
        });
    },
  
    deleteReaction(req, res) {
        Thoughts.findOneAndUpdate
        (
          { 
            _id: req.params.id 
          },

          { 
            $pull: {reactions: {reactionId: req.params.reactionId}} 
          },

          {
            new: true 
          }
        )

        .then(dbThoughstData => {
          if (!dbThoughtsData) {
            return res.status(404).json({message: 'There is no thought associated with this ID'})
          }
          res.json(dbThoughtsData);
        })
        
        .catch(error => { 
          console.log(error); 
          res.status(500).json(error); });
    },
 
    updateReaction: async (req, res) => {
        try {
          const deletedReaction = await Thoughts.findOneAndUpdate
          (
            { 
              _id: req.params.id 
            },
            
            { 
              $pull: {reactions: {reactionId: req.params.reactionId}}
            },
            
            { 
              new: true 
            } 
          );

          if (!deletedReaction) {
            res.status(404).json({message: 'There is no thought associated with this ID'});
          }
          
          const newReaction = await Thought.findOneAndUpdate
          (
            { 
              _id: req.params.id 
            },

            {
              $push: {reactions: req.body}
            },

            { 
              new: true 
            }
          );
          res.json(newReaction);

        } catch (error) {
          console.log(error); res.status(400).json(error);
        }
    }
};

module.exports = thoughtsController;