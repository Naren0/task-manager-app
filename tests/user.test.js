const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user')

const userOne = {
    name: 'Naren',
    email: 'naren.wmdev@gmail.com',
    password: 'Test1234!'
}
beforeEach( async () => {
    await User.deleteMany();
    await new User(userOne).save();

})


test('Should sign up a new user', async () => {
    await request(app).post('/users').send({
        name: 'Narendra',
        email: 'gorantla04@gmail.com',
        password: 'MyPass777!'
    }).expect(201)
})

test ('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'WrongPassword123!'
    }).expect(400)
})