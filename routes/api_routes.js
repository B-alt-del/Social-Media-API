const api_router = require('express').Router();
const User = require('../models/User');
const Thought = require('../models/Thought');

// Get all users
api_router.get('/users', async (req, res) => {
    const users = await User.find().populate('thoughts');
    res.send(users);
})

//Get user by id
api_router.get('/user', async (req, res) => {
    const user_id = req.query.user_id;
    const user = await User.findOne({_id: user_id}).populate('thoughts');
    res.send(user);
})

// Create a user
api_router.post('/user', async (req, res) => {
    const user = await User.create(req.body);
    user.save()
    console.log(user)
    res.send(user);
  });

// Update a user
api_router.put('/user', async (req, res) => {
    const user_id = req.query.user_id;
    const user = await User.findOne({_id: user_id})

    user.username = req.body.updated_username;

    user.save();
    res.send(user);
})

// Delete a user
api_router.delete('/user', async (req, res) => {

    User.findOneAndDelete({ _id: req.query.user_id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated apps deleted!' }))
})

// Get all thoughts
api_router.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find();
    res.send(thoughts);
})

// Get a thought by thought ID
api_router.get('/thought', async (req, res) => {
    const thought = await Thought.findOne({_id: req.query.thought_id})
    res.send(thought)
  });
  
// Create a thought
api_router.post('/thought', async (req,res) => {
    const user_id = req.query.user_id;

    const user = await User.findOne({_id: user_id}).populate('thoughts');
    const thought = await Thought.create(
        { 
            username: user.username,
            thoughtText: req.body.thoughtText,
        })
    user.thoughts.push(thought);
    user.save();
    thought.save();

    res.send(user);
  })

// Update a thought
api_router.put('/thought', async (req, res) => {
    const {thought_id, thoughtText} = req.body;
    const thought = await Thought.findOne({_id: thought_id});

    thought.thoughtText = thoughtText

    thought.save();
    res.send(thought);
})

// Delete thought:  also removing it from  from a user
api_router.delete('/thought', async (req, res) => {
    const thought = await Thought.findOne({_id: req.body.thought_id})
    const user = await User.findOne({username: thought.username});
    user.thoughts.pull(req.body.thought_id);
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
    user.friends.pull(req.params.friendId);
    user.save();
    res.send(user);
  })

// // Create reaction 
api_router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
    const user = await Thought.findOne({_id: req.params.thoughtId});
    const thought = await Thought.findOneAndUpdate({
        _id: req.params.thoughtId
    }, {
        $push: {
            reactions: {
                username: user.username,
                reactionBody: req.body.reactionBody,
            }
        }
    }, {
        new: true,
        runValidators: true
    })
    thought.save()

    res.send(thought)
})

// Delete a reaction
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
                    reactionId: req.body.reactionId
                }
            }
        },
        {
            new:true
        }).populate('reactions');
    res.send(thought)
})

  module.exports = api_router;
