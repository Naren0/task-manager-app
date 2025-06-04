const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {

    const user = new User(req.body);
    try{
        await user.save()
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});

    }catch (error) {
        console.log(error);
        res.status(400).send(error);
    }  
})

router.post('/users/login', async function(req, res) {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        
        if(!user){
            return res.status(400).send({ error: 'Invalid login credentials' });
        }
        res.send({user, token});

    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
});

router.get('/users/me', auth, async (req, res) => {
        res.send(req.user)    
});

router.get('/users/:id', auth, async (req, res) => {

    const _id = req.params.id;
    try {
        if (!_id) {
            return res.status(400).send({ error: 'ID is required' });
        }   
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        } 
        res.send(user);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
     });

     router.patch('/users/:id', auth, async (req, res) => {
         const _id = req.params.id;
         const allowedUpdates = ['name', 'email', 'password', 'age'];
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
                const user = await User.findById(_id);
                if (!user) {
                    return res.status(404).send();
                }
                updates.forEach((update) => user[update] = req.body[update]);
                await user.save();
             //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
             if (!user) {
                 return res.status(404).send();
             }
             res.send(user);
     
         } catch (error) {
             res.status(500).send(error);
         }
     });

     router.delete('/users/:id', auth, async (req, res) => {
         const _id = req.params.id;
         try {
             if (!_id) {
                 return res.status(400).send({ error: 'ID is required' });
             }   
             if (!mongoose.Types.ObjectId.isValid(_id)) {
                 return res.status(400).send({ error: 'Invalid ID format' });
             }
             const user = await User.findByIdAndDelete(_id);
             if (!user) {
                 return res.status(404).send();
             }
             res.send(user);
     
         } catch (error) {
             res.status(500).send(error);
         }
     });

     router.post('/users/logout', auth, async (req, res) =>{
        try{
            req.user.tokens = req.user.tokens.filter((token) => {
                    return token.token !== req.token
            })

            await req.user.save()
            res.send(req.user)

        } catch (e){
                res.status(500).send(error)
        }
     })

     router.post('/users/logoutAll', auth, async(req, res) => {
        try{
                req.user.tokens = []
                await req.user.save()
                res.send()
        } catch (e) {
                res.status(500).send()
        }
     })

module.exports = router;