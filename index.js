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
        app.post('/groups', async (req, res) => {
            const group = req.body;
            const result = await groupsCollection.insertOne(group);
            res.send(result);
        })

        // Get All Groups or User Specific Groups
        app.get('/groups', async (req, res) => {
            const email = req.query.email;

            let query = {};
            if (email) {
                query = { creatorEmail: email };
            }

            const result = await groupsCollection.find(query).toArray();
            res.send(result);
        });

        // Get Single Group
        app.get('/groups/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await groupsCollection.findOne(query);
            res.send(result);
        });


        // Delete Group
app.delete('/groups/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await groupsCollection.deleteOne(query);
  res.send(result);
});

// Update Group

app.put('/groups/:id', async (req, res) => {
    const id = req.params.id;
    const updatedGroup = req.body;
    const filter = {_id: new ObjectId(id) };
    const updateDoc = {
        $set:{
            groupName: updatedGroup.groupName,
            category: updatedGroup.category,
            description: updatedGroup.description,
            meetingLocation: updatedGroup.meetingLocation,
            maxMembers: updatedGroup.maxMembers,
            startDate: updatedGroup.startDate,
            imgUrl: updatedGroup.imgUrl
        }
    }
    const result = await groupsCollection.updateOne(filter, updateDoc)
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