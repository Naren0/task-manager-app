const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');



const uri = "mongodb+srv://gorantla04:6z169XmLjTyk2mnM@cluster0.ycbdxdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try{
    await client.connect();
    const db = client.db("task-manager-api");
 

  } finally{
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     const db = client.db("task-manager");
//     const collection = await db.collection("users").insertOne({
//         name: "Gorantla",
//         age: 34,
//     }, (error, result) => {
//         if (error) {
//             console.error("Error inserting document:", error);
//         } else {
//             console.log("Document inserted successfully:", result);
//         }
//     });
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
//} 
//run().catch(console.dir);