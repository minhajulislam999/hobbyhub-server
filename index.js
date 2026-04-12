const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ud3uec.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    
    const db = client.db('hobbyhub');
    const groupsCollection = db.collection('groups');

        // Create a new group
        app.post('/groups', async(req, res) => {
            const group = req.body;
            const result = await groupsCollection.insertOne(group);
            res.send(result);
        })
   

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);


 // Test route
    app.get('/', (req, res) => {
      res.send('HobbyHub Server is running!');
    });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});