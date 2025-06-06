const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth')
const multer = require('multer')
const {sendWelcomeEmail,sendCancellationEmail} = require('../emails/account');
const sharp = require('sharp');

const upload = multer ({
    
    limits: {
        fileSize: 1000000 // 1MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image (jpg, jpeg, or png)'));
        }
        cb(undefined, true);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250,
    }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.post('/users', async (req, res) => {

    const user = new User(req.body);
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name);
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

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/me/avatar', async (req, res) => {
    const _id = req.user._id;
    try {
        if (!_id) {
            return res.status(400).send({ error: 'ID is required' });
        }   
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ error: 'Invalid ID format' });
        }

        const user = await User.findById(_id);
        if (!user || !user.avatar) {
            throw new Error('User not found or avatar does not exist');
        } 
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});

router.get('/users/me', auth, async (req, res) => {
        res.send(req.user)    
});

// router.get('/users/:id', auth, async (req, res) => {

//     const _id = req.params.id;
//     try {
//         if (!_id) {
//             return res.status(400).send({ error: 'ID is required' });
//         }   
//         if (!mongoose.Types.ObjectId.isValid(_id)) {
//             return res.status(400).send({ error: 'Invalid ID format' });
//         }

//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         } 
//         res.send(user);

//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
//      });

     router.patch('/users/me', auth, async (req, res) => {
         
         const allowedUpdates = ['name', 'email', 'password', 'age'];
         const updates = Object.keys(req.body);
         const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
         if (!isValidOperation) {
             return res.status(400).send({ error: 'Invalid updates!' });
         }
         try {
             
                updates.forEach((update) => req.user[update] = req.body[update]);
                await req.user.save();
             //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
             
             res.send(req.user);
     
         } catch (error) {
             res.status(500).send(error);
         }
     });

     router.delete('/users/me', auth, async (req, res) => {
         try {
             await req.user.deleteOne();
             sendCancellationEmail(req.user.email, req.user.name);
             res.send(req.user);
     
         } catch (error) {
            console.log(error)
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