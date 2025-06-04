const express = require('express');
require('./db/mongoose'); 
const UserRouter = require('./routers/user'); // Import the user router
const TaskRouter = require('./routers/task'); // Import the task router
const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     if(req.method == 'GET'){
//         res.status(400).send('GET Reqeusts are disabled')
//     } else {
//       next ()
//     }
// // })
// app.use((req, res, next ) => {
//         res.status(503).send('Site under maintenance, Please try after sometime ')
// })



app.use(express.json());
app.use(UserRouter); // Use the user router
app.use(TaskRouter); // Use the task router



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

