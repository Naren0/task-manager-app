const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/user')
const mongoose = require('mongoose')

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Naren',
    email: 'naren.wmdev@gmail.com',
    password: 'Test1234!',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET_KEY)
    }]
}
beforeEach( async () => {
    await User.deleteMany();
    await new User(userOne).save();

})


test('Should sign up a new user', async () => {
   const response =  await request(app).post('/users').send({
        name: 'Narendra',
        email: 'gorantla04@gmail.com',
        password: 'MyPass777!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Narendra',
            email: 'gorantla04@gmail.com'
        },
        token: user.tokens[0].token

    })

    expect(user.password).not.toBe('MyPass777!')
})

test ('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id);

    console.log(user.tokens[1].token)

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'WrongPassword123!'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthorized user', async () => {
     await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})