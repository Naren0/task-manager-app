const mongoose = require('mongoose');


const connectionString = process.env.MONGODB_URL || "mongodb+srv://gorantla04:6z169XmLjTyk2mnM@cluster0.ycbdxdg.mongodb.net?retryWrites=true&w=majority&appName=Cluster0";

async function connectToDatabase() {
 await mongoose.connect(connectionString, {
    autoIndex: true,
    dbName: process.env.DB_NAME || 'task-manager-api',
})







// const task = new Task({
//     description: 'Test',
//     completed: false
// });

// await task.save().then(() => {
//     console.log(task);
// }).catch((error) => { 
//     console.log('Error:', error);
// });


//await mongoose.disconnect();
}

connectToDatabase().catch((error) => {
    console.error('Error connecting to the database:', error);
});