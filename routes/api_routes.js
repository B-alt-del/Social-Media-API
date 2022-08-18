const api_router = require('express').Router();

const User = require('../models/User');
const Thought = require('../models/Thought')

// Get all users
api_router.get('/users', async (req, res) => {
    const users = await User.find().populate('thoughts');
    res.send(users);
})

//Get user by id
api_router.get('/user', async (req, res) => {
    const user_id = req.query.user_id;
    const user = await User.findOne({_id: user_id}).populate('thoughts'); //add populate friend data
    res.send(user);
})

// Create a user
api_router.post('/user', async (req, res) => {
    const user = await User.create(req.body);
    res.send(user);
  });

// Update a user
api_router.put('/user', async (req, res) => {
    const user_id = req.query.user_id;
    const user = await User.findOne({_id: user_id})

    //add updated information 

    user.save();
    res.send(user);
})

// Delete a user
api_router.delete('/user', async (req, res) => {
    const user = await User.findOne({_id: req.query.user_id});
    // delete the user
    user.remove();
    //maybe?
    //BONUS: remove associated thoughts when deleted
})

// Get all thoughts
api_router.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find();
    res.send(thoughts);
})

// Get a thought by thought ID
api_router.get('/thought', async (req, res) => {
    const thought_id = req.query.thought_id;
    const user_id = req.query.user_id;
    const user = await User.findOne({
      _id: user_id
    });
  
    res.send(user.thoughts.id(thought_id));
  });
  
// Create a thought
api_router.post('/thought', async (req,res) => {
    const {user_id, name} = req.body;

    const user = await User.findOne({_id: user_id});
    const thought = await Thought.create({ name: req.body.name})

    user.thoughts.push(thought);
    user.save();

    res.send(user);
  })

// Update a thought
api_router.put('/thought', async (req, res) => {
    const {thought_id} = req.body;

    const thought = await Thought.findOne({_id: thought_id});

    //add updated thought information

    thought.save();
    res.send(thought);
})

// Delete thought:  also removing it from  from a user
api_router.delete('/thought', async (req, res) => {
    const user = await User.findOne({_id: req.query.user_id});
    const thought = await Thought.findOne({_id: req.query.thought_id})
    user.thoughts.id(req.query.thought_id).remove();
    user.save();
    thought.remove();
  
    res.send(user);
  });

// Add friend to user's friend list
api_router.post('/users/:userId/friends/:friendId', async (req, res) => {
    const user = await User.findOne({_id: req.params.userId}).populate('friends');
    const friend = await User.findOne({_id: req.params.friendId});
    user.friends.push(friend);
    user.save();

    res.send(user)
  })
  
// Remove a friend from user's friend list
api_router.delete('/users/:userId/friends/:friendId', async (req, res) => {
    const user = await User.findOne({_id: req.params.userId}).populate('friends');
    user.friends.id(req.params.friendId).remove();
    user.save();
    res.send(user);
  })

// Create reaction 
// Not sure if this works
api_router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
    const thought = await Thought.findOneAndUpdate(
        {
            _id: req.params.thoughtId
        },
        {
            $push: {
                reactions: req.body
            }
        },
        {
            new: true
        })
        .populate('reactions');
        
        res.send(thought);
    })

// api_router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
//     const thought = await Thought.findOne(
//         {_id: req.params.thoughtId}).populate('reactions');
//     const reaction = 
//         {
//             reactionBody: req.body.reactionBody,
//             username: thought.username,
//             createdAt: Date()
//         };
    
//     thought.reactions.push(reaction)
//     thought.save();

//     res.send(thought);
// })

// Delete a reaction
// Not sure about this
api_router.delete('/thoughts/:thoughtId/reactions', async (req, res) => {
    const thought = await Thought.findOneAndUpdate(
        {
            _id: req.params.thoughtId
        },
        {
            $pull:
            {
                reactions: 
                {
                    reactionId: req.params.reactionId
                }
            }
        },
        {
            new:true
        }).populate('reactions');
    res.send(thought)
})

  module.exports = api_router;
