const express = require('express');
const Task = require('../models/task');
const mongoose = require('mongoose');
const router = new express.Router();
const auth = require ('../middleware/auth')


router.post('/tasks', auth, async(req, res) => {
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
    
});


//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt, Asc or desc
router.get('/tasks', auth, async (req, res) => {
            const match = {}
            const sort = {}

            if (req.query.completed){
                match.completed =  req.query.completed === 'true'
            }
            if(req.query.sortBy) {
                const parts = req.query.sortBy.split(':');
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            }
    try {
        //const tasks = await Task.find({owner: req.user._id});
        await req.user.populate({
            path: 'tasks',
            match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }})
        res.send(req.user.tasks);

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}   );

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        if (!_id) {
        return res.status(400).send({ error: 'ID is required' });
    }  
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }
         const task = await Task.findOne({_id, owner: req.user._id})
        //const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }   
        res.send(task);

    } catch (error) {
        console.log(error)
         res.status(500).send(error);
    }
});




router.patch('/tasks/:id', auth,async (req, res) => {
    if(!req.body){
        return res.status(400).send({ error: 'Request body is required' });
    }
    const _id = req.params.id;
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        if (!_id) {
        return res.status(400).send({ error: 'ID is required' });
             }  
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }
        const task = await Task.findOne({_id, owner: req.user._id})
        //const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});




router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        if (!_id) {
            return res.status(400).send({ error: 'ID is required' });
        }   
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});
        if (!task) {
            return res.status(404).send();
        }
        
        res.send(task);

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
