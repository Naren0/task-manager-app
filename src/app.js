const express = require('express');
require('./db/mongoose'); 
const UserRouter = require('./routers/user'); // Import the user router
const TaskRouter = require('./routers/task'); // Import the task router
const app = express();




app.use(express.json());
app.use(UserRouter); // Use the user router
app.use(TaskRouter); // Use the task router

module.exports = app;